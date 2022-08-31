function AsyncWrapper(func) {
    return function (req, res, next) {
      func().catch((e) => next(e));
    };
  }