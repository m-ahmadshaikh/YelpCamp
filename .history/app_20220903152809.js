const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const MongoError = require('./utils/MongoError');
const Joi = require('joi');
const AsyncWrapper = require('./utils/AsyncWrapper');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('Connected Mongodb');
}
app.use(flash());
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')));

app.use(express.static(path.join(__dirname, 'public/')));

const configOptions = {
  secret: 'Notagoodsecret',
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(session(configOptions));
//passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
app.use('/campgrounds', campgroundRoutes);

app.use('/campgrounds/:id/reviews', reviewRoutes);

//Campground routes

app.get('/fakeuser',async(req,res)=>{
  const user = new User({email:'fake@gmail.com',username:'fake'});
  User.register(user,'monkey')

})

app.all('*', (res, req, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong', name, stack } = err;
  console.log(name);
  if (name == 'ValidationError') {
    console.log(err);
    return res.send(`${err} `);
  } else if (name == 'CastError') {
    err.message = 'Product doesnot exists';
    return res.status(status).render('error', { status, message, name, stack });
  }
  res.status(status).render('error', { status, message, name, stack });
});

app.listen(3000, () => {
  console.log('Listening at 3000');
});
