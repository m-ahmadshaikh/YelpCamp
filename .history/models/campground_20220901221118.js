const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
require('mongoose-type-url');

const campgroundSchema = new Schema({
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
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

campgroundSchema.post('findOneAndDelete', async function (campground) {
  Review.
  console.log(campground);
});

module.exports = mongoose.model('Campground', campgroundSchema);
