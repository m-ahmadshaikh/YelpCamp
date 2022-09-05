const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().min(0).required(),
    // images: Joi.object({}).required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
  imagew
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number(),
  }).required(),
});
