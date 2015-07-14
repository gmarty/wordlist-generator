// Normaliser and filterer for Welsh.

'use strict';

var QUE_WORDS = require('./data/que-words.json');

module.exports = {
  tokenise: function(corpus) {
    return corpus
      .trim()
      .split(/([^a-z0-9\u00AA-\u1EF9'])+/gi);
  },

  /**
   * On words ending with -que, we remove this prefix unless in the whitelist.
   *
   * @param {string} token
   * @returns {string}
   */
  normalise: function(token) {
    if (QUE_WORDS.indexOf(token) > -1) {
      return token;
    }

    return token
      .replace(/que$/, '');
  },

  filter: function(token) {
    // Wikipedia only rarely uses diacritics: āēīōūăĕĭŏŭäëïöü
    return token.length > 1 &&
      /^[a-z]+$/i.test(token);
  }
};
