function AsyncWrapper(func) {
  return function (req, res, next) {
    func().catch(next);
  };
}

module.exports = AsyncWrapper;
