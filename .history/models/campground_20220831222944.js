const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-url');

const CampgroundSchema = new Schema({
  title: { type: String, required: true },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
  },
  image: Url,
  description: String,
  location: String,
});

module.exports = mongoose.model('Campground', CampgroundSchema);
