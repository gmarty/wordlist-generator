'use strict';

var optimist = require('optimist');
var path = require('path');
var fs = require('fs');

var getCorpusFromWikipedia = require('./lib/get_corpus_wikipedia');
var latinTokenise = require('./lib/latin_tokeniser');
var buildXML = require('./lib/build_xml');

var cli = optimist(process.argv.slice(2));
cli.usage('Generate a wordlist given a language code.\n' +
  'Usage: $0 languagecode');
var languageCode = cli.argv._[0].toLowerCase();

// No param? Show help message then.
if (!languageCode) {
  cli.showHelp();
  process.exit(0);
}

getCorpusFromWikipedia(languageCode)
  .then(function(corpus) {
    return latinTokenise(corpus);
  })
  .then(function(tokens) {
    console.log('Calculating words frequencies');

    var words = Object.create(null); // constructor is a latin word!

    // Groups words by their lowercase version and calculate frequency.
    tokens.forEach(function(token) {
      var key = token.toLowerCase();

      if (words[key] === undefined) {
        words[key] = {
          c: [token], // The list of all words with the same key.
          f: 1
        };
        return;
      }

      words[key].c.push(token);
      words[key].f++;
    });

    words = Object.keys(words)
      .map(function(value) {
        return words[value];
      })
      // Filter out words appearing only once.
      .filter(function(word) {
        return word.f > 1;
      })
      // Filter out 1 letter words.
      .filter(function(word) {
        return word.c[0].length > 1;
      })
      // Find the best case for the word.
      // If at least one candidate starts with a lower case, then the lower case
      // version of the word is retained. Otherwise, the first candidate is kept.
      .map(function(word) {
        var hasLowerCase = word.c.some(function(candidate) {
          var firstLetter = candidate.substring(0, 1);
          return firstLetter === firstLetter.toLowerCase();
        });

        return {
          w: hasLowerCase ? word.c[0].toLowerCase() : word.c[0],
          f: word.f
        };
      })
      // Sort the words: high frequencies first.
      .sort(function(word1, word2) {
        return word2.f - word1.f;
      });

    return buildXML(words, {
      locale: languageCode,
      version: 1
    });
  })
  .then(function(xmlContent) {
    var fileName = languageCode + '_wordlist.xml';
    fs.writeFile(path.join('./dict/', fileName), xmlContent, {encoding: 'utf-8'}, function(err) {
      if (err) {
        throw(err);
      }

      console.log('File %s succesfully saved', fileName);
    })
  })
  .catch(function(err) {
    console.error('Something went wrong:', err);
  });