const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = Schema({
  body: String,
  rating: Number,
  author:{
    type:Schema.Types.o
  }
});

module.exports = mongoose.model('Review', reviewSchema);
