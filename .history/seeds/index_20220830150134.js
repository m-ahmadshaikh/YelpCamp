const mongoose = require('mongoose');
const Campground = require('./');
const cities = require()
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('Connected Mongodb');
}

const seedDB = async () => {
  await Campground.deleteMany({});
  Campground.insertMany([cit], function(err) {

});
};
