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
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas');
const campgroundRoutes = require('./routes/campgrounds');

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
app.use(c)

const validateReview = function (req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (!error) {
    next();
  }
  console.log(req.body);
  if (error) {
    const msg = error.details.map((s) => s.message).join(',');
    next(new ExpressError(400, msg));
  }
};

//Review Routes
app.delete('/campgrounds/:id/reviews/:reviewId', async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.updateOne({ _id: id }, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
});
app.post(
  '/campgrounds/:id/reviews',
  validateReview,
  AsyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { review } = req.body;
    const campground = await Campground.findById(id);
    const reviewObject = new Review(review);
    campground.reviews.push(reviewObject);
    await reviewObject.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
  })
);

//Campground routes

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
