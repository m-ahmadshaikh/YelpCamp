const User = require('../models/user');

const passport = require('passport');

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

module.exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);

    req.flash('success', 'Welcome to Yelp Camp!');
  } catch (e) {
    req.flash('error', e.message);
    f;
    return res.redirect('/register');
  }
  passport.authenticate('local')(req, res, function () {
    res.redirect('/campgrounds');
  });
};
