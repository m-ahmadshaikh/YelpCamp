const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = Schema({
  title: String,
  price: Number,
  image: String,
  description: String,
  location: String,
});

module.exports = mongoose.model('Campground', CampgroundSchema);
