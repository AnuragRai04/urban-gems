const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const PlaceSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    entryFee: Number, // Replaced 'price'
    category: {
      type: String,
      enum: ["Food", "Study", "Views", "Cafes", "Chill spots"],
      required: true,
    },
    bestTime: String, // e.g., '6:30 PM' or 'Late Night'
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts,
);

// Updated the popup link to point to /places instead of /campgrounds
PlaceSchema.virtual("properties.popUpMarkup").get(function () {
  return `
    <strong>
        <a href="/places/${this._id}">${this.title}</a>
    </strong>
    <p>${this.description.substring(0, 20)}...</p>
    `;
});

PlaceSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

// Changed the model name from Campground to Place
module.exports = mongoose.model("Place", PlaceSchema);
