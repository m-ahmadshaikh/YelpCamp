const isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    console.log(req.session.returnTo);
    console.log(req.orignalUrl);
    req.session.returnTo = req.session.returnTo || req.originalUrl;
    req.flash('error', 'you must be signed in');
    return res.redirect('/login');
  }
  next();
};

module.exports = isLoggedIn;
