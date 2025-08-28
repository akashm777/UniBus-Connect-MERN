import express from "express";
import multer from "multer";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { uploadPdf, listUploads, getLocations, getRoutesByLocation } from "../controllers/adminController.js";

const router = express.Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/upload", protect, adminOnly, upload.single("file"), uploadPdf);
router.get("/uploads", protect, adminOnly, listUploads);
router.get("/locations", getLocations);
router.get("/routes/location/:location", getRoutesByLocation);

export default router;
