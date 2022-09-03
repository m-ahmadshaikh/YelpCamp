const Joi = require('joi')
module.exports = const campgroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().min(0).required(),
      image: Joi.string().required(),
      description: Joi.string().required(),
    }).required(),
  });