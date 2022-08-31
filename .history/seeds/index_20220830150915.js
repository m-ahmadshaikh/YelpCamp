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
  for (let i = 0; i <= 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const c = new Campground(cities[random1000]);
c.save()
  }
};

seedDB();
