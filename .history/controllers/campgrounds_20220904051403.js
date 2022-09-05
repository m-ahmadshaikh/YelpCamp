const Campground = require('../models/campground');
module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};


module.exports.renderNewForm = async (req, res, next) => {
    res.render('campgrounds/new');
  }

module.exports.showCampground = async (req, res, next) => {
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

  module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
      req.flash('error', 'You cannot edit this!');
      return res.redirect(`/campgrounds/${id}`);
    }

    res.render('campgrounds/update', { campground });
  };

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id)
      .then((d) => {
        console.log(d);
      })
      .catch((err) => {
        next(err);
      });

    req.flash('error', 'Campground was Removed!');
    res.redirect('/campgrounds');
  }

  module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;
    const { campground } = req.body;

    await Campground.findByIdAndUpdate(id, campground)
      .then((d) => {
        console.log(d);
      })
      .catch((err) => {
        next(err);
      });

    req.flash('success', 'Successfully Updated Campground!');
    res.redirect(`/campgrounds/${id}`);
  }

  