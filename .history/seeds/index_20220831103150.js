const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelper');
main().catch((err) => console.log(err));
let db;
async function main() {
  db = await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('Connected Mongodb');
}

const sample = () => {
  const descriptor =
    descriptors[Math.floor(Math.random() * descriptors.length)];
  const place = places[Math.floor(Math.random() * places.length)];
  return `${descriptor} ${place}`;
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i <= 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const c = new Campground({
      title: sample(),
      image: https://images.unsplash.com/photo-1479722842840-c0a823bd0cd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY2MTkyMzgxNA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080
      location: `${cities[random1000].city}, ${cities[random1000].state} `,
    });
    await c.save();
  }
};

seedDB().then(() => mongoose.connection.close());
