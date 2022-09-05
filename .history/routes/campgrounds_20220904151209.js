const express = require('express');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const MongoError = require('../utils/MongoError');
const AsyncWrapper = require('../utils/AsyncWrapper');
const { isLoggedIn, validateCampground, IsAuthor } = require('../middleware');
const review = require('../models/review');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const storage = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage: storage });

router.route('/').get(AsyncWrapper(campgrounds.index));

router
  .route('/new')
  .get(isLoggedIn, AsyncWrapper(campgrounds.renderNewForm))
  .post(
    upload.array('images', 12),
    validateCampground,
    AsyncWrapper(campgrounds.createCampground)
  );

router.route('/:id').get(AsyncWrapper(campgrounds.showCampground));

router
  .route('/:id/update')
  .get(isLoggedIn, IsAuthor, AsyncWrapper(campgrounds.renderEditForm))
  .patch(
    upload.array('images', 12),
    validateCampground,
    AsyncWrapper(campgrounds.editCampground)
  );

router.delete(
  '/:id/delete',
  IsAuthor,
  AsyncWrapper(campgrounds.deleteCampground)
);

module.exports = router;
