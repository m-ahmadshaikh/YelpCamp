const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('Connected Mongodb');
}

const seedDB = async () => {
    Campground.d
  await Campground.deleteMany({});
  Campground.insertMany([cit], function (err) {});
};
