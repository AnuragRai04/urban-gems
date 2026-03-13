const express = require("express");
const router = express.Router();
// Pointing to the new places controller we will make soon
const places = require("../controllers/places");
const catchAsync = require("../utils/catchAsync");
// Updated the validation middleware name
const { isLoggedIn, isAuthor, validatePlace } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// Pointing to the new Place model we just made
const Place = require("../models/place");

router.route("/").get(catchAsync(places.index)).post(
  isLoggedIn,
  upload.array("image"),
  validatePlace, // Updated
  catchAsync(places.createPlace), // Updated
);

router.get("/new", isLoggedIn, places.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(places.showPlace)) // Updated
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validatePlace, // Updated
    catchAsync(places.updatePlace), // Updated
  )
  .delete(isLoggedIn, isAuthor, catchAsync(places.deletePlace)); // Updated

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(places.renderEditForm),
);

module.exports = router;
