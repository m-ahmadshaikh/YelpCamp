const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
require('dotenv').config()
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.use('/', userRoutes);

app.use('/campgrounds', campgroundRoutes);

app.use('/campgrounds/:id/reviews', reviewRoutes);

//Campground routes

app.get('/fakeuser', async (req, res) => {
  const user = new User({ email: 'fake@gmail.com', username: 'fake' });
  const newUser = await User.register(user, 'monkey');
  res.send(newUser);
});

app.all('*', (res, req, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
  let { status = 500, message = 'Something went wrong', name, stack } = err;
  console.log(name);
  if (name == 'ValidationError') {
    console.log(err);
    return res.send(`${err} `);
  } else if (name == 'CastError') {
    message = 'Product doesnot exists';
    return res.status(status).render('error', { status, message, name, stack });
  } else if (name == 'MongoServerError') {
    message = 'Username is taken!';
    return res.status(status).render('error', { status, message, name, stack });
  }
  res.status(status).render('error', { status, message, name, stack });
});

app.listen(3000, () => {
  console.log('Listening at 3000');
});
