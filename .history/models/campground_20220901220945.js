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

campgroundSchema.pre('findOneAndDelete', async function (data) {
  console.log('post');
});

module.exports = mongoose.model('Campground', campgroundSchema);
