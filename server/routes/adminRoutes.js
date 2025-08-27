import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { uploadPdf, listUploads, getLocations, getRoutesByLocation } from "../controllers/adminController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`)
});

const fileFilter = (req, file, cb) => {
  const isPdf =
    file.mimetype === "application/pdf" ||
    path.extname(file.originalname).toLowerCase() === ".pdf";

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
