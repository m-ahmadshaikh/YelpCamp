const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
require('mongoose-type-url');

const imageSchema = new Schema({
  filename: String,
  url: String,
});

imageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});
const campgroundSchema = new Schema(
  {
    title: { type: String, required: "title can't be empty" },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
    },
    location: String,
    images: [imageSchema],
    description: String,
    geometry: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  },
  { typeKey: '$type' }
);

campgroundSchema.post('findOneAndDelete', async function (campground) {
  if (campground) {
    await Review.remove({ _id: { $in: campground.reviews } });
  }
});

module.exports = mongoose.model('Campground', campgroundSchema);
