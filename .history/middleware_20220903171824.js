const isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.locals.return = req.originalUrl;
    req.flash('error', 'you must be signed in');
    return res.redirect('/login');
  }
  next();
};

module.exports = isLoggedIn;
