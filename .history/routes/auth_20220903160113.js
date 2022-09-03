const express = require('express');
const router = express.Router();
const User = require('../models/user');
const AsyncWrapper = require('../utils/AsyncWrapper');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post(
  '/register',
  async (req, res) => {
    try{
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    await user.setPassword(password);
    const newUser = await user.save();}catch(e){
      next(e,);
    }
    if (newUser) {
      req.flash('success','Welcome to Yelp Camp!');
      res.redirect('/campgrounds');
    }
  }
);

module.exports = router;
