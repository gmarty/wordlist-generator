// Tokenise a corpus and return an array of cleaned tokens.

'use strict';

var Promise = require('bluebird');

var defaultLanguageFunctions = {
  tokenise: function(corpus) {
    return corpus
      .trim()
      .split(/([^a-z0-9\u00AA-\u1EF9'])+/i);
  },

  normalise: function(token) {
    return token;
  },

  filter: function(token) {
    return token.length > 1 &&
      /^[a-z0-9\u00AA-\u1EF9']+$/i.test(token);
  }
};

module.exports = function latinTokenise(corpus, languageCode) {
  console.log('Tokenising corpus');

  try {
    var languageFunctions = require('./tokenisers/' + languageCode + '.js');
  } catch (e) {
    console.error('No charset defined for language %s. ' +
      'Please add one in src/lib/tokenisers/. ' +
      'Defaulting to latin charset.', languageCode);

    languageFunctions = defaultLanguageFunctions;
  }

  return new Promise(function(resolve, reject) {
    var tokens = languageFunctions.tokenise(corpus)
      .map(languageFunctions.normalise)
      .filter(languageFunctions.filter);

    resolve(tokens);
  });
};
