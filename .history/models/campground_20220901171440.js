const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-url');

const CampgroundSchema = new Schema({
  title: { type: String, required: "title can't be empty" },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
  },
  image: {
    type: mongoose.SchemaTypes.Url,
  },
  description: String,
  location: String,
  review 
});

module.exports = mongoose.model('Campground', CampgroundSchema);
