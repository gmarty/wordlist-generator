// Normaliser and filterer for Welsh.

'use strict';

module.exports = {
  tokenise: function(corpus) {
    return corpus
      .trim()
      .split(/([^a-z0-9\u00AA-\u1EF9'])+/gi);
  },

  /**
   * Remove single quotes at the beginning or the end of a token.
   * e.g. '\'Mewn' => 'Mewn'
   * e.g. '\'Seren\'' => 'Seren'
   *
   * @param {string} token A dirty token
   * @return {string} A clean token
   */
  normalise: function(token) {
    return token
      .replace(/'+/g, '\'')
      .replace(/^'+|'+$/g, '')
      .trim();
  },

  filter: function(token) {
    return token.length > 1 &&
      /^[a-zâêîôûŵŷäëïöüẅÿáéíóúẃýàèìòùẁỳ']+$/i.test(token);
  }
};
