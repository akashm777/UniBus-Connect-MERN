import axios from "axios";
import BusRoute from "../models/BusRoute.js";
import imagekit from "../config/imagekit.js";
import { parseBusPdf, saveParsedRoutesToDb, extractLocations } from "../utils/pdfParser.js";

const RECENT_UPLOADS = [];

export const uploadPdf = async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ message: "PDF file is required" });

  try {
    // Upload PDF to ImageKit
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname
    });

    const pdfUrl = uploadResponse.url;

    // Fetch PDF from ImageKit
    const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    // Parse PDF
    const routes = await parseBusPdf(buffer, file.originalname);

    // Save routes in DB
    const result = await saveParsedRoutesToDb(BusRoute, routes);

    // Extract unique locations
    const locations = extractLocations(routes);

    // Update in-memory uploads
    RECENT_UPLOADS.unshift({
      id: Date.now().toString(),
      fileName: file.originalname,
      size: buffer.length,
      uploadedAt: new Date().toISOString(),
      routesParsed: routes.length,
      by: req.user?.email || "admin",
    });
    if (RECENT_UPLOADS.length > 20) RECENT_UPLOADS.length = 20;

    res.json({
      message: "Uploaded and parsed successfully",
      totalRoutes: routes.length,
      locationsExtracted: locations.length,
      mongoResult: result
    });
  } catch (err) {
    console.error("Error uploading/parsing PDF:", err);
    res.status(400).json({ message: "Failed to upload or parse PDF", error: err.message });
  }
};

export const listUploads = async (req, res) => {
  try {
    res.json(RECENT_UPLOADS);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
};

export const getLocations = async (req, res) => {
  try {
    const routes = await BusRoute.find({}, { stops: 1 });
    const allStops = [];
    routes.forEach(r => r.stops.forEach(s => allStops.push(s.location)));

    const unique = [...new Set(allStops)].sort();
    res.json(unique.map(name => ({ label: name, value: name })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch locations" });
  }
};

export const getRoutesByLocation = async (req, res) => {
  try {
    const { location } = req.params;

    const routes = await BusRoute.find({
      "stops.location": new RegExp(`^${location}$`, "i")
    }).sort({ routeNo: 1 });

    if (!routes.length) return res.status(404).json({ message: "No routes found for this location" });

    res.json(routes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch routes by location" });
  }
};
