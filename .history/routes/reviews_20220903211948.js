const express = require('express');
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const MongoError = require('../utils/MongoError');
const AsyncWrapper = require('../utils/AsyncWrapper');
const { reviewSchema } = require('../schemas');
const router = express.Router({ mergeParams: true });

const { isLoggedIn, validateReview, IsAuthor } = require('../middleware');

//Review Routes
router.delete('/:reviewId', async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.updateOne({ _id: id }, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash('error', 'Review was Removed!');
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

    req.flash('success', 'Review was Added!');
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
