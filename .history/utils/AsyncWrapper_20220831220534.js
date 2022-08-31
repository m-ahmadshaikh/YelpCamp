function AsyncWrapper(func) {
  return  (req, res, next) {
    func().catch(next);
  };
}

module.exports = AsyncWrapper;
