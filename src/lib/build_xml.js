// Generate a dict.xml file given an array of word objects.

'use strict';

var Promise = require('bluebird');
var xmlbuilder = require('xmlbuilder');
var languagesCode = require('./languages_code.json');

module.exports = function buildXML(words, options) {
  console.log('Building XML');

  return new Promise(function(resolve, reject) {
    var description = languagesCode[options.locale.substring(0, 2)];
    var wordlistTag = xmlbuilder.create('wordlist');
    wordlistTag.att('locale', options.locale);

    if (description !== undefined) {
      wordlistTag.att('description', description);
    }

    wordlistTag.att('date', Date.now());
    wordlistTag.att('version', options.version);
    wordlistTag.com('Generated by https://github.com/gmarty/wordlist-generator');

    words.forEach(function(word) {
      var wordTag = wordlistTag.ele('w');
      wordTag.att('f', word.f);
      wordTag.att('flags', '');
      wordTag.text(word.w);
    });

    var xml = wordlistTag.end({pretty: true});

    resolve(xml);
  });
};