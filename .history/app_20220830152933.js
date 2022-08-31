const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Campground = require('./models/campground');
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('Connected Mongodb');
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(3000, () => {
  console.log('Listening at 3000');
});

app.get('/', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campground');
});

app.get('/makecampground', async (req, res) => {
  const camp = Campground({
    title: 'My Backyard',
    description: 'Cheap Description ',
  });
  await camp.save();
  res.send(camp);
});
