# Wordlist Generator

> Generate words list XML files suitable for IME dictionaries.

The goal is to generate dictionary files used in Firefox OS keyboard for rare
languages using Wikipedia as a corpus.

The XML format is taken from the one used in [Android source code](https://android.googlesource.com/platform/packages/inputmethods/LatinIME/+/master/dictionaries/).

## Install

Clone or fork this repo, then do:

```bash
$ npm install
```

## Usage

```bash
$ node bin/generate xx
```

Where `xx` is the language code of the target language. See [languages_code.json](https://raw.githubusercontent.com/gmarty/wordlist-generator/master/src/lib/languages_code.json)
for a list of all available languages.

You can change the temporary directory in `config/settings.json`.

## Todo

* Pluggable corpus other than Wikipedia
* Use [natural](https://github.com/NaturalNode/natural) for all NLP needs
* Unit tests

## Note

This project was only tested on Welsh (cy) and Latin (la) on a Linux machine.
