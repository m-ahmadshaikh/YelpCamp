const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: { type: String, required: true },
  price: {
    type: Number,
    min: [0, 'Too few eggs'],
    max: 12
  },
  image: String,
  description: String,
  location: String,
});

module.exports = mongoose.model('Campground', CampgroundSchema);
