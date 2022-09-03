const express = require('express');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const MongoError = require('../utils/MongoError');
const AsyncWrapper = require('../utils/AsyncWrapper');
const { campgroundSchema } = require('../schemas');
const isLoggedIn = require('../middleware');
const review = require('../models/review');
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

const IsAuthor = async function (req,res,next){
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You cannot edit this!');
    return res.redirect(`/campgrounds/${id}`);
  }
}

router.get(
  '/',
  AsyncWrapper(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

router.get(
  '/new',
  isLoggedIn,
  AsyncWrapper(async (req, res, next) => {
    res.render('campgrounds/new');
  })
);

router.get(
  '/:id',
  AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
      .populate('reviews')
      .populate('author');
    console.log(campground);
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    const currentUser = req.user;
    console.log(currentUser);
    res.render('campgrounds/show', { campground, currentUser });
  })
);

router.get(
  '/:id/update',
  isLoggedIn,
  AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
      req.flash('error', 'You cannot edit this!');
      return res.redirect(`/campgrounds/${id}`);
    }

    res.render('campgrounds/update', { campground });
  })
);

router.delete(
  '/:id/delete',
  AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground.author.equals(req.user._id)) {
      req.flash('error', 'You cannot edit this!');
      return res.redirect(`/campgrounds/${id}`);
    }
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
  validateCampground,
  AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { campground } = req.body;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground.author.equals(req.user._id)) {
      req.flash('error', 'You cannot edit this!');
      return res.redirect(`/campgrounds/${id}`);
    }

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
