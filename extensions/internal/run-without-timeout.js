// eslint-disable-next-line spaced-comment
module.exports = async function runWithoutTimeout (fn, runner) {
  const originalTimeout = runner.timeout();
  runner.timeout(0);

  const result = await fn();

  runner.timeout(originalTimeout);
  return result;
};
