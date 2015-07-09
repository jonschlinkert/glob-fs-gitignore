'use strict';

var lazy = require('lazy-cache')(require);
var lookup = lazy('look-up');
var ignore = lazy('parse-gitignore');
var mm = lazy('micromatch');
var cwd = process.cwd();

function parseGitignore(opts) {
  opts = opts || {};
  var filepath = lookup()('.gitignore', {cwd: cwd});
  var patterns = ignore()(filepath);

  var isMatch = function (filepath) {
    return mm().any(patterns, filepath, opts);
  };

  return function gitignore(file) {
    if (opts.gitignore === false) {
      return file;
    }

    if (isMatch(file.path)) {
      file.exclude = true;
    }
    return file;
  };
}

/**
 * Expose `parseGitignore`
 */

module.exports = parseGitignore;
