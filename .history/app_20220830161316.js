const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('Connected Mongodb');
}
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.listen(3000, () => {
  console.log('Listening at 3000');
});

app.get('/campground', async (req, res) => {
  const campgrounds = await Campground.find({});

  res.render('home', { campgrounds });
});

app.get('/campground/new', async (req, res) => {
  res.render('new');
});

app.get('/campground/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  res.render('campground', { campground });
});

app.patch('/campground/:id/update', (req, res) => {
  const { id } = req.params;
  res.send(id);
});

app.post('/campground/new',async (req, res) => {
  const { title, price, description, location } = req.body;
  Campground.create({ title, price, description, location });

  res.send(title);
});
