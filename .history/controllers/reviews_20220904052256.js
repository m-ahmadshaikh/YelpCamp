
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createNewReview = async (req, res, next) => {
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
  }