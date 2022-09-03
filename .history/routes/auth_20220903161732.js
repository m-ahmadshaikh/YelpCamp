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
  function (req, res) {
    const { user } = await User.authenticate()('user', 'password');
    res.redirect('/campgrounds');
  }
);

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
