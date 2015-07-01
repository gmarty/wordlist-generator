// Tokenise a corpus written in latin script and return an array of tokens.

'use strict';

var Promise = require('bluebird');

module.exports = function latinTokenise(corpus) {
  console.log('Tokenising corpus');

  return new Promise(function(resolve, reject) {
    corpus = corpus
      // Remove non alphabetical characters (but keep single quotes).
      .replace(/[^a-z0-9\u00C0-\u017F']+/gi, ' ')
      // Remove numeric only entries.
      .replace(/\b[0-9]+\b/g, ' ')
      .trim()
      .split(/\s+/g)
      .map(function(token) {
        return cleanToken(token);
      });

    resolve(corpus);
  });
};

/**
 * Remove single quotes around or at the beginning of a token.
 * e.g. '\'Mewn' => 'Mewn'
 * e.g. '\'Seren\'' => 'Seren'
 *
 * @param {string} token A dirty token
 * @return {string} A clean token
 */
function cleanToken(token) {
  return token
    .replace(/^'(.+)'$/g, '$1')
    .replace(/^'+|'+$/g, '$1')
    .trim();
}
