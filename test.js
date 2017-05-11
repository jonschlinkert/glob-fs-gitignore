'use strict';

require('mocha');
var fs = require('fs');
var assert = require('assert');
var glob = require('glob-fs');
var mkdirp = require('mkdirp');
var gitignore = require('./');

function has(files, fp) {
  return files.indexOf(fp) !== -1;
}

describe('gitignore', function(done) {
  var tempfiles = ['.foo', '.bar', '.baz'];
  before(function() {
    tempfiles.forEach(function(fp) {
      fs.writeFileSync(fp, 'temp');
    });
  });

  after(function() {
    tempfiles.forEach(function(fp) {
      fs.unlinkSync(fp);
    });
  });

  it('should ignore files specified in `.gitignore` automatically:', function(done) {
    glob()
      .use(gitignore())
      .readdir('*', function(err, files) {
        assert.equal(has(files, '.DS_Store'), false);
        done();
      });
  });

  it('should not use `.gitignore` when `gitignore: false` is passed:', function(done) {
    glob({ gitignore: false, dot: true })
      .use(gitignore())
      .readdir('*', function(err, files) {
        assert.equal(has(files, '.foo'), true);
        assert.equal(has(files, '.bar'), true);
        assert.equal(has(files, '.baz'), true);
        done();
      });
  });
});
