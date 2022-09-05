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
  users.redirect,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  users.login
);

router.get('/logout', users.logout);

module.exports = router;
