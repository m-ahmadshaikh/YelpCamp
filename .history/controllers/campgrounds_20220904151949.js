const Campground = require('../models/campground');
module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = async (req, res, next) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  const { campground } = req.body;
  campground.images = req.files.map((f) => ({
    filename: f.filename,
    url: f.path,
  }));
  campground.author = req.user._id;
  if (!campground) {
    return next(new ExpressError('400', 'Cannot Create a new campground'));
  }
  const result = await Campground.create(campground).catch(next);
  if (!result) {
    return next(new MongoError(400, 'Cannot Create the new campground'));
  }
  console.log(campground);
  req.flash('success', 'New Campground is created!');
  const { id } = result;
  res.redirect(`/campgrounds/${id}`);
};

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
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  const currentUser = req.user;
  res.render('campgrounds/show', { campground, currentUser });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You cannot edit this!');
    return res.redirect(`/campgrounds/${id}`);
  }

  res.render('campgrounds/update', { campground });
};

module.exports.editCampground = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  const { campground, deleteImages } = req.body;
  // deleteImages: [ 'FromPicSum ', 'FromSplash ' ]

  const images = req.files.map((f) => ({
    filename: f.filename,
    url: f.path,
  }));

  const foundCampground = await Campground.findByIdAndUpdate(id, campground);
  await foundCampground.images.push(...images);
  await foundCampground.updateOne({
    $pull: { images: { filename: { $in: req.body.deleteImages } } },
  });
  await foundCampground.save();

  req.flash('success', 'Successfully Updated Campground!');
  res.redirect(`/campgrounds/${id}`);
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
};
