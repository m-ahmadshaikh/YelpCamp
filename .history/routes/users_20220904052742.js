const express = require('express');
const router = express.Router();
const User = require('../models/user');
const AsyncWrapper = require('../utils/AsyncWrapper');
const passport = require('passport');


router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', users.renderRegister);
let redirectUrl;
router.post(
  '/login',
  (req, res, next) => {
    redirectUrl = req.session.returnTo || '/campgrounds';
    next();
  },
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.flash('success', 'welcome back!');
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
