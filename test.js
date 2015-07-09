'use strict';

/* deps: mocha */
var fs = require('fs');
var assert = require('assert');
var glob = require('glob-fs');
var mkdirp = require('mkdirp');
var gitignore = require('./');

function has(files, fp) {
  return files.indexOf(fp) !== -1;
}

describe('gitignore', function (done) {
  it('should ignore files specified in `.gitignore` automatically:', function (done) {
    glob()
      .use(gitignore())
      .readdir('**/*', function (err, files) {
        assert.equal(has(files, '.DS_Store'), false);
        done();
      });
  });

  it('should not use `.gitignore` when `gitignore: false` is passed:', function (done) {
    glob({ gitignore: false, builtins: false })
      .use(gitignore())
      .readdir('**/*', function (err, files) {
        assert.equal(has(files, '.DS_Store'), true);
        done();
      });
  });
});
