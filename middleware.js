const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');

const Review = require('./models/review');
module.exports.isLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    await req.session.save();
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
};

module.exports.validateReview = function (req, res, next) {
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

module.exports.validateCampground = function (req, res, next) {
  const { error } = campgroundSchema.validate(req.body);
  if (!error) {
    next();
  }
  if (error) {
    const msg = error.details.map((s) => s.message).join(',');
    next(new ExpressError(400, msg));
  }
};

module.exports.IsAuthor = async function (req, res, next) {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You cannot edit this!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.IsReviewAuthor = async function (req, res, next) {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You cannot delete this!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
