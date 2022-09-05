const Campground = require('../models/campground');
module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = async (req, res, next) => {
  console.log('hello')
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  req.files.map(f =>{f.filename,f.})
  const { campground } = req.body;
  campground.author = req.user._id;
  if (!campground) {
    return next(new ExpressError('400', 'Cannot Create a new campground'));
  }
  console.log(campground);
  const result = await Campground.create(campground).catch(next);
  if (!result) {
    return next(new MongoError(400, 'Cannot Create the new campground'));
  }
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
  console.log(campground);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  const currentUser = req.user;
  console.log(currentUser);
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
