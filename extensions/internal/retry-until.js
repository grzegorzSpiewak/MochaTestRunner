const sleep = require('./sleep');

module.exports = async function retryUntil (fn, times) {
  if (times === 0) {
    return false;
  }

  if (await fn()) {
    return true;
  }

  await sleep(1000);
  return retryUntil(fn, times - 1);
};
