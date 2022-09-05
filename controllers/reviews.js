const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res, next) => {
  const { id } = req.params;
  const { review } = req.body;
  review.author = req.user._id;
  const campground = await Campground.findById(id);
  const reviewObject = new Review(review);
  campground.reviews.push(reviewObject);
  await reviewObject.save();
  await campground.save();

  req.flash('success', 'Review was Added!');
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.updateOne({ _id: id }, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash('error', 'Review was Removed!');
  res.redirect(`/campgrounds/${id}`);
};
