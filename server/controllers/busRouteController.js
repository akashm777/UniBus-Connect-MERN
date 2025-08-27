import BusRoute from "../models/BusRoute.js";

// GET /api/routes?location=Main%20Gate
// Returns an array of route documents (sorted by most recent date)
export const getRouteByLocation = async (req, res) => {
  const raw = (req.query.location || "").toString().trim();
  if (!raw) return res.status(400).json({ message: "location is required" });

  // Escape special regex characters in user input to ensure literal matching (handles (), ., +, etc.)
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const safe = escapeRegExp(raw);

  // Case-insensitive exact match on stops.location (literal)
  const routes = await BusRoute.find({ "stops.location": new RegExp(`^${safe}$`, "i") })
    .sort({ date: -1, routeNo: 1 })
    .limit(50)
    .lean();

  if (!routes.length)
    return res.status(404).json({ message: "No route found for location" });

  // Return raw docs that match the current schema: { routeNo, date, stops:[{time,location}], createdAt }
  res.json(routes);
};

// GET /api/routes/locations?startsWith=ma
// Returns array of unique location strings (optionally filtered by prefix)
export const suggestLocations = async (req, res) => {
  const startsWith = (req.query.startsWith || "").toLowerCase().trim();

  const pipeline = [
    { $unwind: "$stops" },
    {
      $project: {
        name: "$stops.location",
        norm: { $toLower: { $trim: { input: "$stops.location" } } },
      },
    },
    { $group: { _id: "$norm", display: { $first: "$name" } } },
    ...(startsWith ? [{ $match: { _id: { $regex: `^${startsWith}` } } }] : []),
    { $sort: { display: 1 } },
    { $limit: 50 },
  ];

  const results = await BusRoute.aggregate(pipeline);

  const unique = [...new Set(results.map(r => r.display))].sort((a,b) => a.localeCompare(b));
  res.json(unique);
};