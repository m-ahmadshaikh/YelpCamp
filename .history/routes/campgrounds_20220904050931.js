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

router.get(
  '/new',
  isLoggedIn,
  AsyncWrapper(campgrounds.renderNewForm)
);

router.get(
  '/:id',
  AsyncWrapper(campgrounds.showCampground)
);

router.get(
  '/:id/update',
  isLoggedIn,
  IsAuthor,
  AsyncWrapper(campgrounds.updateCampground)
);

router.delete(
  '/:id/delete',
  IsAuthor,
  AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id)
      .then((d) => {
        console.log(d);
      })
      .catch((err) => {
        next(err);
      });

    req.flash('error', 'Campground was Removed!');
    res.redirect('/campgrounds');
  })
);

router.patch(
  '/:id/update',
  isLoggedIn,
  validateCampground,
  IsAuthor,
  AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { campground } = req.body;

    await Campground.findByIdAndUpdate(id, campground)
      .then((d) => {
        console.log(d);
      })
      .catch((err) => {
        next(err);
      });

    req.flash('success', 'Successfully Updated Campground!');
    res.redirect(`/campgrounds/${id}`);
  })
);

router.post(
  '/new',
  validateCampground,
  AsyncWrapper(async (req, res, next) => {
    const { campground } = req.body;
    campground.author = req.user._id;
    if (!campground) {
      return next(new ExpressError('400', 'Cannot Create a new campground'));
    }
    console.log(campground);
    const result = await Campground.create(campground).catch(next);
    if (!result) {
      return next(new MongoError(400, 'Cannot Create the new campground'));
    }
    req.flash('success', 'New Campground is created!');
    const { id } = result;
    res.redirect(`/campgrounds/${id}`);
  })
);
module.exports = router;
