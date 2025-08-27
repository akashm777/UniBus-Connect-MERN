import express from "express";
import { getRouteByLocation, suggestLocations } from "../controllers/busRouteController.js";

const router = express.Router();

router.get("/", getRouteByLocation);             // ?location=Main%20Gate
router.get("/locations", suggestLocations);      // ?startsWith=ma

export default router;
