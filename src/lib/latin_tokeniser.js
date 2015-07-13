// Tokenise a corpus written in latin script and return an array of tokens.

'use strict';

var Promise = require('bluebird');

var CHARSETS = {
  cy: /^[a-zâêîôûŵŷäëïöüẅÿáéíóúẃýàèìòùẁỳ']+$/i,
  la: /^[a-zāēīōūăĕĭŏŭäëïöü]+$/i,
  default: /^[a-z0-9\u00AA-\u1EF9']+$/i
};

module.exports = function latinTokenise(corpus, languageCode) {
  console.log('Tokenising corpus');

  if (!CHARSETS[languageCode]) {
    console.error('No charset defined for language %s. ' +
      'Please specify one in src/lib/latin_tokeniser.js. ' +
      'Defaulting to latin charset.', languageCode);
  }

  return new Promise(function(resolve, reject) {
    corpus = corpus
      // Remove non alphabetical characters (but keep single quotes).
      .replace(/[^a-z0-9\u00AA-\u1EF9']+/gi, ' ')
      .trim()
      .split(/\s+/g)
      .map(function(token) {
        return cleanToken(token);
      })
      // Filter out 1 letter words.
      .filter(function(token) {
        return token.length > 1;
      })
      // Remove tokens containing foreign characters.
      .filter(function(token) {
        return isWithinCharsetRange(token, languageCode);
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

/**
 * Return true if a token only contains characters allowed in a certain
 * language.
 *
 * @param {string} token
 * @param {string} languageCode
 * @returns {boolean}
 */
function isWithinCharsetRange(token, languageCode) {
  if (CHARSETS[languageCode]) {
    return CHARSETS[languageCode].test(token);
  }

  return CHARSETS.default.test(token);
}
