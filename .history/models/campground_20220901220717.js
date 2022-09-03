const mongoose = require('mongoose');
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

campgroundSchema.pre('save', function(res,req,next) {
  const err = new Error('something went wrong');
  // If you call `next()` with an argument, that argument is assumed to be
  // an error.
  next(err);
});

module.exports = mongoose.model('Campground', campgroundSchema);
