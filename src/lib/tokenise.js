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

  var languageFunctions = Object.create(defaultLanguageFunctions);

  try {
    var testLanguageFunctions = require('./tokenisers/' + languageCode + '.js');

    if (typeof testLanguageFunctions.tokenise === 'function') {
      languageFunctions.tokenise = testLanguageFunctions.tokenise;
    }
    if (typeof testLanguageFunctions.normalise === 'function') {
      languageFunctions.normalise = testLanguageFunctions.normalise;
    }
    if (typeof testLanguageFunctions.filter === 'function') {
      languageFunctions.filter = testLanguageFunctions.filter;
    }
  } catch (e) {
    console.error('No language functions defined for language %s. ' +
      'Please add one in src/lib/tokenisers/.', languageCode);
  }

  return new Promise(function(resolve, reject) {
    var tokens = languageFunctions.tokenise(corpus)
      .map(languageFunctions.normalise)
      .filter(languageFunctions.filter);

    resolve(tokens);
  });
};
