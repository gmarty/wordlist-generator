// Download a Wikipedia database dump in a given language.

'use strict';

var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var Promise = require('bluebird');

var config = require('../../config/settings.json');

module.exports = function getCorpusFromWikipedia(languageCode) {
  console.log('Downloading corpus');

  var fileName = languageCode + 'wiki-latest-pages-articles.xml.bz2';
  var corpusUrl = 'http://dumps.wikimedia.org/' + languageCode + 'wiki/' +
    'latest/' + fileName;
  var extractedFolder = path.join(config.tmpDir, 'extracted-' + Date.now());
  var extractedUrl = path.join(config.tmpDir, 'corpus.xml');

  return execPromise('wget -P ' + config.tmpDir + ' ' + corpusUrl)
    .then(function() {
      console.log('Extracting corpus');

      // ./WikiExtractor.py -q -o extracted cywiki-latest-pages-articles.xml.bz2
      return execPromise('./bin/WikiExtractor.py -q -o ' + extractedFolder + ' ' + path.join(config.tmpDir, fileName));
    })
    .then(function() {
      // cat extracted/*/* > all.txt
      return execPromise('cat ' + path.join(extractedFolder, '*/*') + ' > ' + extractedUrl);
    })
    .then(function() {
      return new Promise(function(resolve, reject) {
        fs.readFile(extractedUrl, {encoding: 'utf-8'}, function(err, data) {
          if (err) {
            return reject(err);
          }

          data = cleanXML(data);
          resolve(data);
        })
      });
    });
};

function execPromise(cmd) {
  return new Promise(function(resolve, reject) {
    exec(cmd, function(err, stdout, stderr) {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}

/**
 * Remove all XML tags.
 *
 * @param {string} xml
 * @returns {string}
 */
function cleanXML(xml) {
  return xml.replace(/<\/?([^>]*)>/g, '');
}
