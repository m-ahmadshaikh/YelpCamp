const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = Schema({
  title: String,
  price: String,
  img:String,
  description: String,
  location: String,
});

module.exports = mongoose.model('Campground', CampgroundSchema);
