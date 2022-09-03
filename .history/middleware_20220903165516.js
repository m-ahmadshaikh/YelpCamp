const isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.orignalUrl;
    req.flash('error', 'you must be signed in');
    return res.redirect('/login');
  }
  next();
};

module.exports = isLoggedIn;
