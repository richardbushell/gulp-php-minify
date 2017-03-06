'use strict';

import {expect} from 'chai';
import path from 'path';
import File from 'vinyl';
import {Minifier} from '../src/index';

/**
 * @test {Minifier}
 */
describe('Minifier', function() {
  this.timeout(60000);

  /**
   * @test {Minifier#constructor}
   */
  describe('#constructor()', () => {
    it('should initialize the existing properties', () => {
      expect(new Minifier({binary: './FooBar.exe'}).binary).to.equal('FooBar.exe');
      expect(new Minifier({silent: true}).silent).to.be.true;
    });

    it('should not create new properties', () => {
      expect(new Minifier({foo: 'bar'})).to.not.contain.keys('foo');
    });
  });

  /**
   * @test {Minifier#listening}
   */
  describe('#listening', () => {
    it('should return whether the server is listening', async () => {
      let minifier = new Minifier();
      expect(minifier.listening).to.be.false;
      await minifier.listen();
      expect(minifier.listening).to.be.true;
      await minifier.close();
      expect(minifier.listening).to.be.false;
    });
  });

  /**
   * @test {Minifier#_transform}
   */
  describe('#_transform()', () => {
    let file = new File({path: path.join(__dirname, 'sample.php')});

    it('should remove the inline comments', async () => {
      let minifier = new Minifier({silent: true});
      let result = await minifier._transform(file, 'utf8');
      expect(result.contents.toString()).to.contain('<?= \'Hello World!\' ?>');
      return minifier.close();
    });

    it('should remove the multi-line comments', async () => {
      let minifier = new Minifier({silent: true});
      let result = await minifier._transform(file, 'utf8');
      expect(result.contents.toString()).to.contain('namespace dummy; class Dummy');
      return minifier.close();
    });

    it('should remove the single-line comments', async () => {
      let minifier = new Minifier({silent: true});
      let result = await minifier._transform(file, 'utf8');
      expect(result.contents.toString()).to.contain('$className = get_class($this); return $className;');
      return minifier.close();
    });

    it('should remove the whitespace', async () => {
      let minifier = new Minifier({silent: true});
      let result = await minifier._transform(file, 'utf8');
      expect(result.contents.toString()).to.contain('__construct() { }');
      return minifier.close();
    });
  });
});