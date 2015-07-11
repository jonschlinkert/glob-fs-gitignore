'use strict';

var lazy = require('lazy-cache')(require);
var isDotfile = require('is-dotfile');
var isDotdir = require('is-dotdir');
var lookup = lazy('look-up');
var ignore = lazy('parse-gitignore');
var mm = lazy('micromatch');
var cwd = process.cwd();

function parseGitignore(opts, app) {
  opts = opts || {};

  if (typeof app !== 'undefined') {
    opts = app.setDefaults(app.pattern.options, opts);
  }

  var gitignoreFile = lookup()('.gitignore', {cwd: cwd});
  var ignorePatterns = ignore()(gitignoreFile);

  var isMatch = function (fp) {
    return mm().any(ignorePatterns, fp, opts);
  };

  return function gitignore(file) {
    this.handler.emit('gitignore', file);

    if (typeof this === 'undefined') {
      opts = this.setDefaults(this.pattern.options, opts);
    }

    if (opts.dot || opts.dotfiles || opts.dotdirs) {
      if (isDotfile(file.relative) || isDotdir(file.relative)) {
        return file;
      }
    }

    if (opts.gitignore === false) {
      return file;
    }

    if (isMatch(file.relative)) {
      file.isIgnored = true;
      file.exclude = true;
    }
    return file;
  };
}

/**
 * Expose `parseGitignore`
 */

module.exports = parseGitignore;
