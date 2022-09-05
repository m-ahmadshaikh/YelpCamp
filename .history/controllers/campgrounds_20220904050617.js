const Campground = require('../models/campground');
module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};


module.exports.newCampground = async (req, res, next) => {
    res.render('campgrounds/new');
  }