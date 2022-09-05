const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');
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
function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
  // .toFixed() returns string, so ' * 1' is a trick to convert to number
}
const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i <= 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const c = new Campground({
      title: sample(),
      images: [
        {
          filename: 'FromPicSum',
          url: `https://picsum.photos/400/300?random=${i}`,
        },
        {
          filename: 'FromSplash',
          url: `https://source.unsplash.com/random/400x300?camping,sig=${i}`,
        },
      ],
      geometry: {
        type: 'Point',
        coordinates = [getRandomInRange(-180, 180, 3)]
      }
      location: `${cities[random1000].city}, ${cities[random1000].state} `,
      description: 'lorem',
      author: mongoose.Types.ObjectId('63133fa21cfedceac154e769'),
      price: Math.floor(Math.random() * 20) + 10,
    });
    await c.save();
  }
};

seedDB().then(() => mongoose.connection.close());
