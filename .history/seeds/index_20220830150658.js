const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('Connected Mongodb');
}

const seedDB = async () => {
  await Campground.deleteMany({});
  //  await  Campground.insertMany([cities], function (err) {});
  const c = new Campground({ });
  await Campground
};

seedDB();
