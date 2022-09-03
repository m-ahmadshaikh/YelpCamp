const express = require('express');
const router = express.Router();
const User = require('../models/user');
const AsyncWrapper = require('../utils/AsyncWrapper');
const passport = require('passport');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);

    req.flash('success', 'Welcome to Yelp Camp!');
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/register');
  }
  res.redirect('/campgrounds');
});

router.get('/login', function (req, res) {
  res.render('users/login', { user: req.user });
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  function (req, res) {
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
  }
);

router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'Logged Out!');
  res.redirect('/campgrounds');
});

module.exports = router;
