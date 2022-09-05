const Campground = require('../models/campground');
module.exports.showCampground = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};
