/**
 * Unit tests of the `php_minifier` module.
 * @module test/php_minifier_test
 */
'use strict';

// Module dependencies.
const assert = require('assert');
const File = require('vinyl');
const path = require('path');
const PHPMinifier = require('../lib/php_minifier');
const stream = require('stream');

/**
 * Tests the features of the `PHPMinifier` class.
 */
class PHPMinifierTest {

  /**
   * Runs the unit tests.
   */
  run() {
    let self = this;
    describe('PHPMinifier', function() {
      this.timeout(10000);
      describe('constructor()', self.testConstructor);
      describe('_transform()', self.testTransform);
    });
  }

  /**
   * Tests the constructor.
   */
  testConstructor() {
    it('should properly handle the options', () =>
      assert.equal(new PHPMinifier({binary: 'FooBar'})._options.binary, 'FooBar')
    );
  }

  /**
   * Tests the `_transform` method.
   */
  testTransform() {
    let file = new File({path: path.join(__dirname, 'sample.php')});

    it('should remove the inline comments', done => {
      new PHPMinifier()._transform(file, 'utf8', (err, file) => {
        if(err) throw err;
        assert(file.contents.toString().indexOf("<?= 'Hello World!' ?>") > 0);
        done();
      });
    });

    it('should remove the multi-line comments', done => {
      new PHPMinifier()._transform(file, 'utf8', (err, file) => {
        if(err) throw err;
        assert(file.contents.toString().indexOf('namespace dummy; class Dummy') > 0);
        done();
      });
    });

    it('should remove the single-line comments', done => {
      new PHPMinifier()._transform(file, 'utf8', (err, file) => {
        if(err) throw err;
        assert(file.contents.toString().indexOf('$className = get_class($this); return $className;') > 0);
        done();
      });
    });

    it('should remove the whitespace', done => {
      new PHPMinifier()._transform(file, 'utf8', (err, file) => {
        if(err) throw err;
        assert(file.contents.toString().indexOf('__construct() { }') > 0);
        done();
      });
    });
  }
}

// Run all tests.
new PHPMinifierTest().run();
