// Tokenise a corpus written in latin script and return an array of tokens.

'use strict';

var Promise = require('bluebird');

module.exports = function latinTokenise(corpus) {
  console.log('Tokenising corpus');

  return new Promise(function(resolve, reject) {
    corpus = corpus
      // Remove non alphabetical characters (but keep single quotes).
      .replace(/[^a-z0-9\u00C0-\u017F']+/gi, ' ')
      .trim()
      .split(/\s+/g)
      .map(function(token) {
        return cleanToken(token);
      })
      // Remove tokens containing numbers.
      .filter(function(token) {
        return !/[0-9]/.test(token);
      })
      // Filter out 1 letter words.
      .filter(function(token) {
        return token.length > 1;
      });

    resolve(corpus);
  });
};

/**
 * Remove single quotes at the beginning or the end of a token.
 * e.g. '\'Mewn' => 'Mewn'
 * e.g. '\'Seren\'' => 'Seren'
 *
 * @param {string} token A dirty token
 * @return {string} A clean token
 */
function cleanToken(token) {
  return token
    .replace(/'+/g, '\'')
    .replace(/^'+|'+$/g, '')
    .trim();
}
