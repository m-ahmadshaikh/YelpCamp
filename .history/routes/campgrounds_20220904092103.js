const express = require('express');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const MongoError = require('../utils/MongoError');
const AsyncWrapper = require('../utils/AsyncWrapper');
const { isLoggedIn, validateCampground, IsAuthor } = require('../middleware');
const review = require('../models/review');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');

router.route('/').get(AsyncWrapper(campgrounds.index));

router.route('/:id').get(AsyncWrapper(campgrounds.showCampground));

router
  .route('/new')
  .get(isLoggedIn, AsyncWrapper(campgrounds.renderNewForm))
  .post(validateCampground, AsyncWrapper(campgrounds.createCampground));


  router.route('')
router.get(
  '/:id/update',
  isLoggedIn,
  IsAuthor,
  AsyncWrapper(campgrounds.renderEditForm)
);

router.patch(
  '/:id/update',
  isLoggedIn,
  validateCampground,
  IsAuthor,
  AsyncWrapper(campgrounds.editCampground)
);

router.delete(
  '/:id/delete',
  IsAuthor,
  AsyncWrapper(campgrounds.deleteCampground)
);

module.exports = router;
