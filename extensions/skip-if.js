const debug = require('debug')('qa-tools:extensions');

module.exports = function skipIf (fn) {
  before(async function () {
    if (await fn.call(this)) {
      debug('Skipping due to `%s`.', fn);
      this._runnable.parent.pending = true;
    }
  });
};
