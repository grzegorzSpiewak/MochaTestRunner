/**
 * Returns a Promise that will automatically resolve after `milliseconds`.
 *
 * @param  {Number} milliseconds  Duration in milliseconds
 * @return {Promise}              Promise indicating sleep is complete.
 */
module.exports = function sleep (milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
