const Campground = require('../models/campground');
module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};


module.exports.renderNewForm = async (req, res, next) => {
    res.render('campgrounds/new');
  }

module.exports.createCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          model: 'User',
        },
      })
      .populate('author');
    console.log(campground);
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    const currentUser = req.user;
    console.log(currentUser);
    res.render('campgrounds/show', { campground, currentUser });
  }