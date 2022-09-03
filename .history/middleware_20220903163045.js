const isLoggedIn = (res, req, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'you must be signed in');
    return res.redirect('/login');
  }
  next();
};
