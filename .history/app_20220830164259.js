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

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});

  res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', async (req, res) => {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  res.render('campgrounds/campground', { campground });
});

app.get('/campgrounds/:id/update', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  res.render('campgrounds/update', { campground });
});

app.delete('/campgrounds/:id/delete', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);

  res.redirect('/campground');
});

app.patch('/campgrounds/:id/update', async (req, res) => {
  const { id } = req.params;
  const { title, price, description, location } = req.body;
  await Campground.findByIdAndUpdate(id, {
    title,
    price,
    description,
    location,
  })
    .then((d) => {
      console.log(d);
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect('/campground/');
});

app.post('/campground/new', async (req, res) => {
  const { title, price, description, location } = req.body;
  await Campground.create({ title, price, description, location })
    .then((d) => {
      console.log(d);
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect('/campground/');
});
