const express = require('express');
const app = express();
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const MongoError = require('../utils/MongoError');
const AsyncWrapper = require('../utils/AsyncWrapper');
const { campgroundSchema } = require('../schemas');
const router = express.Router();
const validateCampground = function (req, res, next) {
  const { error } = campgroundSchema.validate(req.body);
  if (!error) {
    next();
  }
  if (error) {
    const msg = error.details.map((s) => s.message).join(',');
    next(new ExpressError(400, msg));
  }
};

router.get(
  '/',
  AsyncWrapper(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

router.get(
  '/campgrounds/new',
  AsyncWrapper(async (req, res, next) => {
    res.render('campgrounds/new');
  })
);

router.get(
  '/campgrounds/:id',
  AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');

    res.render('campgrounds/show', { campground });
  })
);

router.get(
  '/campgrounds/:id/update',
  AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render('campgrounds/update', { campground });
  })
);

router.delete(
  '/campgrounds/:id/delete',
  AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id)
      .then((d) => {
        console.log(d);
      })
      .catch((err) => {
        next(err);
      });
    res.redirect('/campgrounds');
  })
);

router.patch(
  '/campgrounds/:id/update',
  validateCampground,
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
    res.redirect(`/campgrounds/${id}`);
  })
);

router.post(
  '/campgrounds/new',
  validateCampground,
  AsyncWrapper(async (req, res, next) => {
    const { campground } = req.body;
    if (!campground) {
      return next(new ExpressError('400', 'Cannot Create a new campground'));
    }
    console.log(campground);
    const result = await Campground.create(campground).catch(next);
    if (!result) {
      return next(new MongoError(400, 'Cannot Create the new campground'));
    }
    const { id } = result;
    res.redirect(`/campgrounds/${id}`);
  })
);
