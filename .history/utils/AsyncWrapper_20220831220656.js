function AsyncWrapper(func) {
  return function (req, res, next) {
    func(req,res,next).catch(next);
  };
}

module.exports = AsyncWrapper;
