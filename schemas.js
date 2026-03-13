const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

// Renamed from campgroundSchema to placeSchema
module.exports.placeSchema = Joi.object({
  // Changed key from campground to place
  place: Joi.object({
    title: Joi.string().required().escapeHTML(),
    entryFee: Joi.number().required().min(0), // Replaced price
    category: Joi.string()
      .valid("Food", "Study", "Views", "Cafes", "Chill spots")
      .required()
      .escapeHTML(), // Locked to your specific categories
    bestTime: Joi.string().required().escapeHTML(), // Added best time validation
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
