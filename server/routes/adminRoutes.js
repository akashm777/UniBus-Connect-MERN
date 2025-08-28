import express from "express";
import multer from "multer";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import {
  uploadPdf,
  listUploads,
  getLocations,
  getRoutesByLocation,
} from "../controllers/adminController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true);
    cb(new Error("Only PDF files are allowed"));
  },
});

// Routes
router.post("/upload", protect, adminOnly, upload.single("file"), uploadPdf);
router.get("/uploads", protect, adminOnly, listUploads);
router.get("/locations", getLocations);
router.get("/routes/location/:location", getRoutesByLocation);

export default router;
