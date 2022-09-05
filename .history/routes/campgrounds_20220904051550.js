const express = require('express');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const MongoError = require('../utils/MongoError');
const AsyncWrapper = require('../utils/AsyncWrapper');
const { isLoggedIn, validateCampground, IsAuthor } = require('../middleware');
const review = require('../models/review');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');

router.get('/', AsyncWrapper(campgrounds.index));

router.get('/new', isLoggedIn, AsyncWrapper(campgrounds.renderNewForm));

router.get('/:id', AsyncWrapper(campgrounds.showCampground));

router.get(
  '/:id/update',
  isLoggedIn,
  IsAuthor,
  AsyncWrapper(campgrounds.renderEditForm)
);

router.delete(
  '/:id/delete',
  IsAuthor,
  AsyncWrapper(campgrounds.deleteCampground)
);

router.patch(
  '/:id/update',
  isLoggedIn,
  validateCampground,
  IsAuthor,
  AsyncWrapper(campgrounds.editCampground)
);

module.exports = router;
