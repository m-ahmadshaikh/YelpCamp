const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = async (req, res, next) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  const { campground } = req.body;

  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  campground.images = req.files.map((f) => ({
    filename: f.filename,
    url: f.path,
  }));
  campground.author = req.user._id;
  if (!campground) {
    return next(new ExpressError('400', 'Cannot Create a new campground'));
  }
  const newCamp = new Campground(campground);
  newCamp.geometry = geoData.body.features[0].geometry;
  await newCamp.save();
  if (!newCamp) {
    return next(new MongoError(400, 'Cannot Create the new campground'));
  }
  console.log(newCamp);
  req.flash('success', 'New Campground is created!');
  const { id } = newCamp;
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
  if (deleteImages) {
    for (filename of deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await foundCampground.updateOne({
      $pull: { images: { filename: { $in: deleteImages } } },
    });
  }
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