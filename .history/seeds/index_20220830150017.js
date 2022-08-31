const mongoose = require('mongoose');
const Campground = require('./models/campground');
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('Connected Mongodb');
}

const seedDB = async()=>{
await Cam
}