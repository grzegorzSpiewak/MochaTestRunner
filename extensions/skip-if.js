module.exports = function skipIf (fn) {
  before(async function () {
    if (await fn.call(this)) {
      this._runnable.parent.pending = true;
    }
  });
};
