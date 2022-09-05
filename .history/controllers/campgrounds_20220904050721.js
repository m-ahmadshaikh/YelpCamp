const Campground = require('../models/campground');
module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};


module.exports.renderNewForm = async (req, res, next) => {
    res.render('campgrounds/new');
  }

module.exports.createCampground = 