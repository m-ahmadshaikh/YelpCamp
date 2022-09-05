const express = require('express');
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const MongoError = require('../utils/MongoError');
const AsyncWrapper = require('../utils/AsyncWrapper');
const { reviewSchema } = require('../schemas');
const router = express.Router({ mergeParams: true });
const 
const {
  isLoggedIn,
  validateReview,
  IsAuthor,
  IsReviewAuthor,
} = require('../middleware');

//Review Routes

router.post(
  '/',
  isLoggedIn,
  validateReview,
  AsyncWrapper()
);

router.delete(
  '/:reviewId',
  isLoggedIn,
  IsReviewAuthor,
  async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.updateOne({ _id: id }, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('error', 'Review was Removed!');
    res.redirect(`/campgrounds/${id}`);
  }
);

module.exports = router;
