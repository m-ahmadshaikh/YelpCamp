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
  passport.authenticate('local')(req, res, function () {
    res.redirect('/campgrounds');
  });
});
router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',(req,res,)=>{},
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
  });
});

module.exports = router;
