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
    validate: {
      validator: (value) =>
        validator.isURL(value, {
          protocols: ['http', 'https', 'ftp'],
          require_tld: true,
          require_protocol: true,
        }),
      message: 'Must be a Valid URL',
    },
  },
  description: String,
  location: String,
});

module.exports = mongoose.model('Campground', CampgroundSchema);
