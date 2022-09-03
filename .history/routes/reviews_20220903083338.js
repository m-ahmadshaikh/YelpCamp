const express = require('express');
const app = express();
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const MongoError = require('../utils/MongoError');
const AsyncWrapper = require('../utils/AsyncWrapper');
const { campgroundSchema } = require('../schemas');
const router = express.Router();


const validateReview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (!error) {
      next();
    }
    console.log(req.body);
    if (error) {
      const msg = error.details.map((s) => s.message).join(',');
      next(new ExpressError(400, msg));
    }
  };
  
  //Review Routes
  app.delete('/campgrounds/:id/reviews/:reviewId', async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.updateOne({ _id: id }, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  });
  app.post(
    '/campgrounds/:id/reviews',
    validateReview,
    AsyncWrapper(async (req, res, next) => {
      const { id } = req.params;
      const { review } = req.body;
      const campground = await Campground.findById(id);
      const reviewObject = new Review(review);
      campground.reviews.push(reviewObject);
      await reviewObject.save();
      await campground.save();
      res.redirect(`/campgrounds/${id}`);
    })
  );
  