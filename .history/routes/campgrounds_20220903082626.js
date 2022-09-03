const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const MongoError = require('./utils/MongoError');
const Joi = require('joi');
const AsyncWrapper = require('../utils/AsyncWrapper');
const Review = require('../models/review');
const { campgroundSchema } = require('../schemas');

app.get(
  '/campgrounds',
  AsyncWrapper(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

app.get(
  '/campgrounds/new',
  AsyncWrapper(async (req, res, next) => {
    res.render('campgrounds/new');
  })
);

app.get(
  '/campgrounds/:id',
  AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');

    res.render('campgrounds/show', { campground });
  })
);

app.get(
  '/campgrounds/:id/update',
  AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render('campgrounds/update', { campground });
  })
);

app.delete(
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

app.patch(
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

app.post(
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
