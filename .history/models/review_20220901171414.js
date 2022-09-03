const mongoose = require('mongoose');
const {Schema} = mongoose;


const reviewSchema = Schema({
    body:String,
    rating: Number,
})

module.exports = 