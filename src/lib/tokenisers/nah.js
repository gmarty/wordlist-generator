// Normaliser and filterer for Nahuatl.

'use strict';

module.exports = {
  tokenise: function(corpus) {
    return corpus
      .trim()
      .split(/([^a-z0-9\u00AA-\u1EF9'])+/i);
  },

  normalise: function(token) {
    return token;
  },

  filter: function(token) {
    // For tokens of 2 characters, only keep those accentuated (harder to type).
    if (token.length === 2 && !(/[āēīō]/i.test(token))) {
      return false;
    }

    // Remove token of 1 characters and those with extraneous characters.
    if (token.length > 1 && /^[a-zāēīō]+$/i.test(token)) {
      return true;
    }

    return false;
  }
};
