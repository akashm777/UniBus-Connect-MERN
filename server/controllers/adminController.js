import fs from "fs";
import BusRoute from "../models/BusRoute.js";
import { parseBusPdf, saveParsedRoutesToDb, extractLocations } from "../utils/pdfParser.js";

// Simple in-memory array for recent uploads
const RECENT_UPLOADS = [];

/*
  Admin upload of a bus route PDF
  Parses all routes in the file
  Saves/upserts them in BusRoute collection
 */
export const uploadPdf = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "PDF file is required" });

  const filePath = req.file.path;

  try {
    const buffer = fs.readFileSync(filePath);
    const routes = await parseBusPdf(buffer, req.file.originalname || "");

    // Save all routes (upsert by routeNo + date)
    const result = await saveParsedRoutesToDb(BusRoute, routes);

    // Extract unique locations for dropdown (derived directly from routes)
    const locations = extractLocations(routes);

    // Push to in-memory uploads list (max 20)
    RECENT_UPLOADS.unshift({
      id: Date.now().toString(),
      fileName: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      routesParsed: routes.length,
      by: req.user?.email || "admin",
    });
    if (RECENT_UPLOADS.length > 20) RECENT_UPLOADS.length = 20;

    // Clean up uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.warn("Failed to delete uploaded file:", err.message);
    });

    res.json({
      message: "Uploaded and parsed successfully",
      totalRoutes: routes.length,
      locationsExtracted: locations.length,
      mongoResult: result
    });
  } catch (err) {
    console.error("Error parsing PDF:", err);

    // Clean up on error
    fs.unlink(filePath, (e) => {
      if (e) console.warn("Failed to delete uploaded file:", e.message);
    });

    res.status(400).json({ message: "Failed to parse PDF", error: err.message });
  }
};


// List recently uploaded routes (latest 20 by date)

export const listUploads = async (req, res) => {
  try {
    res.json(RECENT_UPLOADS);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
};

/*
  Get all unique locations for dropdown
  (scans stops from all routes in DB)
 */

export const getLocations = async (req, res) => {
  try {
    const routes = await BusRoute.find({}, { stops: 1 });
    const allStops = [];
    routes.forEach(r => r.stops.forEach(s => allStops.push(s.location)));

    // Deduplicate + sort
    const unique = [...new Set(allStops)].sort();
    res.json(unique.map(name => ({ label: name, value: name })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch locations" });
  }
};


// Get all routes serving a given location

export const getRoutesByLocation = async (req, res) => {
  try {
    const { location } = req.params;

    // Case-insensitive match on stop location
    const routes = await BusRoute.find({
      "stops.location": new RegExp(`^${location}$`, "i")
    }).sort({ routeNo: 1 });

    if (!routes.length) {
      return res.status(404).json({ message: "No routes found for this location" });
    }

    res.json(routes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch routes by location" });
  }
};
