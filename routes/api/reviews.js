// routes/api/reviews.js
const express = require("express");
const router = express.Router({ mergeParams: true }); // Essential for pulling :id from the parent router
const Place = require("../../models/place");
const Review = require("../../models/review");
const { authenticateJWT } = require("../../utils/jwt");

const requireApiLogin = (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  next();
};

const checkApiReviewAuthor = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return res.status(404).json({ error: "Review not found" });
  if (!review.author.equals(req.user.id))
    return res.status(403).json({ error: "Forbidden. You do not own this." });
  next();
};

router.post("/", authenticateJWT, requireApiLogin, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: "Place not found" });

    // Note: This expects the payload to have a { review: { body, rating } } wrapper
    // to match your validation schema / Next.js API client setup
    const review = new Review(req.body.review);
    review.author = req.user.id;
    place.reviews.push(review);

    await review.save();
    await place.save();

    res.status(201).json(review);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete(
  "/:reviewId",
  authenticateJWT,
  requireApiLogin,
  checkApiReviewAuthor,
  async (req, res) => {
    try {
      const { id, reviewId } = req.params;
      // Pull the review reference from the place array
      await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);

      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
);

module.exports = router;
