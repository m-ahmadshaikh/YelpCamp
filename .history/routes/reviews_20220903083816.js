const express = require('express');
const Review = require('../models');
const ExpressError = require('../utils/ExpressError');
const MongoError = require('../utils/MongoError');
const AsyncWrapper = require('../utils/AsyncWrapper');
const { reviewSchema } = require('../schemas');
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
router.delete('/:reviewId', async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.updateOne({ _id: id }, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
});
router.post(
  '/',
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

module.exports = router;
