const express = require('express');
const router = express.Router();
const User = require('../models/user');
const AsyncWrapper = require('../utils/AsyncWrapper');
const passport = require('passport');
const users = require('../controllers/users');

router
  .route('/login')
  .get('/login', (req, res) => {
    res.render('users/login');
  })
  .post(
    '/login',
    users.redirect,
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    users.login
  );
router.route('/register').get(users.renderRegister).post(users.renderRegister);

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
