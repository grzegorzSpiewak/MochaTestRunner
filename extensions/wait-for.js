const _ = require('lodash');
const { AssertionError } = require('assert');
const debug = require('debug')('qa-tools:extensions');
const runWithoutTimeout = require('./internal/run-without-timeout');
const retryUntil = require('./internal/retry-until');

/* eslint-disable no-param-reassign */
module.exports = function waitFor (title, fn, options) {
  if (typeof title === 'function') {
    options = fn;
    fn = title;
    title = null;
  }

  const duration = _.get(options, 'duration', 60);
  
  before(title, async function () {
    debug('Waiting for `%s`...', fn);
    const result = await runWithoutTimeout(() => retryUntil(() => fn.call(this), duration), this);
    if (!result) {
      throw new AssertionError({
        message: 'Condition was not true in time',
      });
    }
  });
};
