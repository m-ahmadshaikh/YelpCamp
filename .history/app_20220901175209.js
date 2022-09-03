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
const AsyncWrapper = require('./utils/AsyncWrapper');
const { campgroundSchema } = require('./schemas');

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('Connected Mongodb');
}
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')));
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const validateCampground = function (req, res, next) {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((s) => s.message).join(',');
    next(new ExpressError(400, msg));
  }
};

//Review Routes

app.post('/campgrounds/:id/reviews', (req, res, next) => {
  const { id } = req.params;
  const { body, rating } = req.body.review;
  cons
});

//Campground routes
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
    const campground = await Campground.findById(id);

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

app.all('*', (res, req, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong', name, stack } = err;
  console.log(name);
  if (name == 'ValidationError') {
    console.log(err);
    return res.send(`${err} `);
  } else if (name == 'CastError') {
    err.message = 'Product doesnot exists';
    return res.status(status).render('error', { status, message, name, stack });
  }
  res.status(status).render('error', { status, message, name, stack });
});

app.listen(3000, () => {
  console.log('Listening at 3000');
});
