import express from "express";
import multer from "multer";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { uploadPdf, listUploads, getLocations, getRoutesByLocation } from "../controllers/adminController.js";

const router = express.Router();

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isPdf =
    file.mimetype === "application/pdf" ||
    file.originalname.toLowerCase().endsWith(".pdf");

  if (isPdf) cb(null, true);
  else cb(new Error("Only PDF files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post("/upload", protect, adminOnly, upload.single("file"), uploadPdf);
router.get("/uploads", protect, adminOnly, listUploads);
router.get("/locations", getLocations);
router.get("/routes/location/:location", getRoutesByLocation);

export default router;
