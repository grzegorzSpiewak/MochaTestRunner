const mocha = require('mocha');

// Returns a title formatted with the a tag.
function tagTitle (title, ...tags) {
  const formattedTags = tags.map(tag => `tag:${tag}`);

  return `${title} [${String(formattedTags)}]`;
}

// This is a two-level monkey patch.
// First, we have to monkey patch our "interface", bdd, to provide access to
// the `tag` function via `describe.tag`. Because we're already in the same
// process as the parent Mocha context, we can access and patch the interface
// from the require cache.
const originalInterface = mocha.interfaces.bdd;
mocha.interfaces.bdd = function (suite) {
  originalInterface(suite);
  // Second, we have to load `tag` onto `describe`, now that it exists. We
  // need to use the same `pre-require` hook to add our patch before the
  // test file itself is loaded.
  suite.on('pre-require', (context) => {
    // eslint-disable-next-line no-param-reassign
    context.describe.tag = function (...tags) {
      return function (title, ...rest) {
        return describe(tagTitle(title, ...tags), ...rest);
      };
    };
  });
};

module.exports = tagTitle;
