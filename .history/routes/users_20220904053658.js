const express = require('express');
const router = express.Router();
const User = require('../models/user');
const AsyncWrapper = require('../utils/AsyncWrapper');
const passport = require('passport');
const users = require('../controllers/users');

router.get('/register', users.renderRegister);

router.post('/register', users.createUser);

router.get('/login', users.renderLogin);


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

router.get('/logout', users.logout);

module.exports = router;
