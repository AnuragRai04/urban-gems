const express = require("express");
const router = express.Router();
const Place = require("../../models/place");
const Review = require("../../models/review");
const { authenticateJWT } = require("../../utils/jwt");
const { placeSchema } = require("../../schemas.js");
const multer = require("multer");
const { storage } = require("../../cloudinary");
const upload = multer({ storage });

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

// API-Specific Validation (With Next.js FormData Reconstructor!)
// API-Specific Validation (With DYNAMIC Next.js FormData Reconstructor!)
const validatePlaceAPI = (req, res, next) => {
  // Dynamically un-nest ANY field that looks like "place[key]"
  if (!req.body.place) {
    req.body.place = {};
    for (const key in req.body) {
      if (key.startsWith("place[")) {
        // Extract the word inside the brackets (e.g., gets 'bestTime' from 'place[bestTime]')
        const match = key.match(/place\[(.*?)\]/);
        if (match) {
          req.body.place[match[1]] = req.body[key];
        }
      }
    }
  }

  const { error } = placeSchema.validate(req.body, { allowUnknown: true });
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return res.status(400).json({ error: msg });
  }
  next();
};

// ==========================================
// GET /api/places - Fetch all places
// ==========================================
router.get("/", async (req, res) => {
  try {
    // THE FIX: Populate the reviews so Next.js has the numbers to do the math!
    const places = await Place.find({}).populate("reviews");
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

// GET /api/places/:id - Fetch a single place
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate("author")
      .populate({
        path: "reviews",
        populate: { path: "author" },
      });

    if (!place) return res.status(404).json({ error: "Place not found" });
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch place" });
  }
});

// POST /api/places - Create a new place
router.post(
  "/",
  authenticateJWT,
  upload.array("image"),
  validatePlaceAPI,
  async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      const geoData = await maptilerClient.geocoding.forward(
        req.body.place.location,
        { limit: 1 },
      );
      const place = new Place(req.body.place);

      if (geoData && geoData.features && geoData.features.length > 0) {
        place.geometry = geoData.features[0].geometry;
      } else {
        place.geometry = { type: "Point", coordinates: [79.9339, 23.1815] };
      }

      place.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
      }));
      place.author = req.user._id || req.user.id || req.user.userId;

      await place.save();
      res.status(201).json(place);
    } catch (err) {
      res.status(500).json({ error: "Failed to create place" });
    }
  },
);

// PUT /api/places/:id - UPDATE A PLACE
router.put(
  "/:id",
  authenticateJWT,
  upload.array("image"),
  validatePlaceAPI,
  async (req, res) => {
    try {
      const place = await Place.findById(req.params.id);
      if (!place) return res.status(404).json({ error: "Place not found" });

      const userId = req.user._id || req.user.id || req.user.userId;
      if (place.author.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ error: "You do not have permission to do that." });
      }

      const updatedPlace = await Place.findByIdAndUpdate(
        req.params.id,
        { ...req.body.place },
        { new: true },
      );

      if (req.files && req.files.length > 0) {
        const imgs = req.files.map((f) => ({
          url: f.path,
          filename: f.filename,
        }));
        updatedPlace.images.push(...imgs);
        await updatedPlace.save();
      }

      res.json(updatedPlace);
    } catch (err) {
      res.status(500).json({ error: "Failed to update place" });
    }
  },
);

// DELETE /api/places/:id - DELETE A PLACE
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: "Place not found" });

    const userId = req.user._id || req.user.id || req.user.userId;
    if (place.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You do not have permission to do that." });
    }

    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: "Successfully deleted place" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete place" });
  }
});

// POST /api/places/:id/reviews - Create a review
router.post("/:id/reviews", authenticateJWT, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);

    review.author = req.user._id || req.user.id || req.user.userId;
    place.reviews.push(review);

    await review.save();
    await place.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to create review" });
  }
});

// DELETE /api/places/:id/reviews/:reviewId - DELETE A REVIEW
router.delete("/:id/reviews/:reviewId", authenticateJWT, async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Successfully deleted review" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;
