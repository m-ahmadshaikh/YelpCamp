const express = require('express');
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const MongoError = require('../utils/MongoError');
const AsyncWrapper = require('../utils/AsyncWrapper');
const { reviewSchema } = require('../schemas');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews');
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
  AsyncWrapper(reviews.createNewReview)
);

router.delete(
  '/:reviewId',
  isLoggedIn,
  IsReviewAuthor,
  reviews.deleteReview
);

module.exports = router;
