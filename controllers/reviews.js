const Place = require("../models/place"); // <-- Updated model import
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const place = await Place.findById(req.params.id); // <-- Changed to place
  const review = new Review(req.body.review);
  review.author = req.user._id;
  place.reviews.push(review);
  await review.save();
  await place.save();
  req.flash("success", "Created new review!");
  res.redirect(`/places/${place._id}`); // <-- Updated redirect URL
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // <-- Changed to Place
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/places/${id}`); // <-- Updated redirect URL
};
