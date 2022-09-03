const mongoose = require('mongoose');
const Campground = require('../models/campground');

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
      image: `https://source.unsplash.com/random/400x300?camping,sig=${i}`,
      location: `${cities[random1000].city}, ${cities[random1000].state} `,
      description: 'lorem',
      author: mongoose.Types.ObjectId('63133fa21cfedceac154e769'),
      price: Math.floor(Math.random() * 20) + 10,
    });
    await c.save();
  }
};

seedDB().then(() => mongoose.connection.close());
