const Place = require("../models/place"); // Updated model import
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  const places = await Place.find({}).populate("popupText");
  res.render("places/index", { places }); // Updated render path
};

module.exports.renderNewForm = (req, res) => {
  res.render("places/new"); // Updated render path
};

// Renamed to createPlace
module.exports.createPlace = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(
    req.body.place.location, // Look for req.body.place
    { limit: 1 },
  );

  if (!geoData.features?.length) {
    req.flash(
      "error",
      "Could not geocode that location. Please try again and enter a valid location.",
    );
    return res.redirect("/places/new"); // Updated redirect
  }

  const place = new Place(req.body.place); // Changed to place
  place.geometry = geoData.features[0].geometry;
  place.location = geoData.features[0].place_name;

  place.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  place.author = req.user._id;
  await place.save();
  console.log(place);
  req.flash("success", "Successfully added a new hidden gem!"); // Updated message
  res.redirect(`/places/${place._id}`); // Updated redirect
};

// Renamed to showPlace
module.exports.showPlace = async (req, res) => {
  const place = await Place.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!place) {
    req.flash("error", "Cannot find that spot!");
    return res.redirect("/places"); // Updated redirect
  }
  res.render("places/show", { place }); // Updated render path
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  if (!place) {
    req.flash("error", "Cannot find that spot!");
    return res.redirect("/places"); // Updated redirect
  }
  res.render("places/edit", { place }); // Updated render path
};

// Renamed to updatePlace
module.exports.updatePlace = async (req, res) => {
  const { id } = req.params;
  const geoData = await maptilerClient.geocoding.forward(
    req.body.place.location, // Look for req.body.place
    { limit: 1 },
  );

  if (!geoData.features?.length) {
    req.flash("error", "Could not geocode that location. Please try again.");
    return res.redirect(`/places/${id}/edit`); // Updated redirect
  }

  console.log(req.body);
  const place = await Place.findByIdAndUpdate(id, {
    ...req.body.place, // Look for req.body.place
  });
  place.geometry = geoData.features[0].geometry;
  place.location = geoData.features[0].place_name;

  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  place.images.push(...imgs);
  await place.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await place.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated the spot!"); // Updated message
  res.redirect(`/places/${place._id}`); // Updated redirect
};

// Renamed to deletePlace
module.exports.deletePlace = async (req, res) => {
  const { id } = req.params;
  await Place.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the spot"); // Updated message
  res.redirect("/places"); // Updated redirect
};
