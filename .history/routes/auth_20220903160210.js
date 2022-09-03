const express = require('express');
const router = express.Router();
const User = require('../models/user');
const AsyncWrapper = require('../utils/AsyncWrapper');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    await user.setPassword(password);
    const newUser = await user.save();

    req.flash('success', 'Welcome to Yelp Camp!');
    res.redirect('/campgrounds');
  } catch (e) {
    req.flash('error', 'Username already taken!');
    return res.redirect('/register');
  }
});

module.exports = router;
