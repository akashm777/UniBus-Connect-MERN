import BusRoute from "../models/BusRoute.js";
import imagekit from "../config/imagekit.js"; // uses env vars on server only
import { parseBusPdf, saveParsedRoutesToDb, extractLocations } from "../utils/pdfParser.js";

// Simple in-memory array for recent uploads
const RECENT_UPLOADS = [];

/*
  Admin upload of a bus route PDF (secure backend flow)
  1) Receives PDF via multer memory storage (req.file)
  2) Uploads file to ImageKit using PRIVATE KEY (server-side only)
  3) Parses PDF DIRECTLY from memory buffer (no extra network hop)
  4) Saves routes in DB
*/
export const uploadPdf = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "PDF file is required" });
  }

  try {
    // 1) Upload PDF to ImageKit (server-side, private key never exposed)
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname || "uploaded.pdf",
      // folder: "/bus-routes", // optional: uncomment to organize in a folder
    });

    const pdfUrl = uploadResponse?.url;

    // 2) Parse PDF directly from buffer (more reliable on serverless)
    const routes = await parseBusPdf(file.buffer, file.originalname || "uploaded.pdf");

    if (!Array.isArray(routes) || routes.length === 0) {
      return res.status(400).json({ message: "No routes found in PDF" });
    }

    // 3) Save routes (upsert by routeNo + date as your util implements)
    const mongoResult = await saveParsedRoutesToDb(BusRoute, routes);

    // 4) Extract unique locations (for dropdowns)
    const locations = extractLocations(routes);

    // Track recent uploads (max 20)
    RECENT_UPLOADS.unshift({
      id: Date.now().toString(),
      fileName: file.originalname || "uploaded.pdf",
      size: file.size,
      uploadedAt: new Date().toISOString(),
      routesParsed: routes.length,
      by: req.user?.email || "admin",
      pdfUrl, // handy for debugging/audits
    });
    if (RECENT_UPLOADS.length > 20) RECENT_UPLOADS.length = 20;

    return res.json({
      message: "Uploaded and parsed successfully",
      totalRoutes: routes.length,
      locationsExtracted: locations.length,
      mongoResult,
      pdfUrl,
    });
  } catch (err) {
    console.error("Error uploading/parsing PDF:", err);
    const msg =
      err?.message === "File too large"
        ? "PDF exceeds size limit"
        : err?.message || "Failed to upload or parse PDF";
    return res.status(400).json({ message: msg });
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
  Get all unique locations for dropdown (scans stops from all routes in DB)
*/
export const getLocations = async (req, res) => {
  try {
    const routes = await BusRoute.find({}, { stops: 1 });
    const allStops = [];
    routes.forEach((r) => r.stops.forEach((s) => allStops.push(s.location)));

    const unique = [...new Set(allStops)].sort();
    res.json(unique.map((name) => ({ label: name, value: name })));
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
      "stops.location": new RegExp(`^${location}$`, "i"),
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
