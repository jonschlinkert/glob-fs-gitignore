'use strict';

/* deps: mocha */
var assert = require('assert');
var glob = require('glob-fs');
var gitignore = require('./');

function has(files, fp) {
  return files.indexOf(fp) !== -1;
}

describe('gitignore', function () {
  it('should ignore files specified in `.gitignore` automatically:', function (done) {
    glob()
      .use(gitignore())
      .readdir('**/*', function (err, files) {
        assert.equal(has(files, 'LICENSE'), true);
        assert.equal(has(files, 'test.js'), true);
        assert.equal(has(files, '.DS_Store'), false);
        done();
      });
  });

  it('should not use `.gitignore` when `gitignore: false` is passed:', function (done) {
    glob({gitignore: false})
      .use(gitignore())
      .readdir('**/*', function (err, files) {
        assert.equal(has(files, 'LICENSE'), true);
        assert.equal(has(files, 'test.js'), true);
        assert.equal(has(files, '.DS_Store'), true);
        done();
      });
  });
});
