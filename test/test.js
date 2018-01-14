var assert = require('assert');
var expect = require('chai').expect;
var polynomium = require('../src/polynomium');

describe('polynomium', function() {
  var x = polynomium.v('x');
  var y = polynomium.v('y');
  var a = polynomium.c(2);
  var b = polynomium.c(3);
  var c = polynomium.c(5);
  var r = (y.mul(x.add(b))).mul((y.mul(x.add(b))));

  describe('#toString()', function () { 
    it('toString', function() {
      assert.equal(polynomium.c(0).toString(), '0');
      assert.equal(x.toString(), 'x');
      assert.equal(a.toString(), '2');
    });
  });

  describe('#variable()', function () { 
    it('variable', function() {
      assert.equal(x.toString(), 'x');
      assert.equal(y.toString(), 'y');
      expect(() => polynomium.v(123)).to.throw(Error, 'Variable name must be an alphanumeric string that begins with a letter');
      expect(() => polynomium.v('#')).to.throw(Error, 'Variable name must be an alphanumeric string that begins with a letter');
      expect(() => polynomium.v('123xyz')).to.throw(Error, 'Variable name must be an alphanumeric string that begins with a letter');
    });
  });

  describe('#constant()', function () {
    it('constant', function() {
      assert.equal(polynomium.c(123).toString(), '123');
      assert.equal(polynomium.c(1.23).toString(), '1.23');
      expect(() => polynomium.c('abc')).to.throw(Error, 'Constant must be of a numeric type');
      expect(() => polynomium.c('123')).to.throw(Error, 'Constant must be of a numeric type');
    });
  });

  describe('#add()', function () { 
    it('add', function() {
      assert.equal((b.add(b)).toString(), '6');
      assert.equal((b.add(3)).toString(), '6');
      assert.equal((x.add(b)).toString(), 'x + 3');
      assert.equal((x.add(3)).toString(), 'x + 3');
      assert.equal((x.add(y)).toString(), 'x + y');
      assert.equal((x.add('y')).toString(), 'x + y');
      assert.equal(((x.mul(polynomium.c(-1))).add(y)).toString(), '-x + y');
      assert.equal(((x.mul(polynomium.c(-2))).add(y)).toString(), '-2x + y');
      assert.equal((x.add(y.mul(polynomium.c(-1)))).toString(), 'x - y');
      assert.equal((x.add(y.mul(polynomium.c(-2)))).toString(), 'x - 2y');
      assert.equal((x.add(y.mul(-2))).toString(), 'x - 2y');
      assert.equal((x.add(a)).toString(), 'x + 2');
      assert.equal((y.add(x.add(b))).toString(), 'y + x + 3');
      expect(() => (x.add('123y')).toString()).to.throw(Error, 'Variable name must be an alphanumeric string that begins with a letter');
      expect(() => polynomium.add(y, true)).to.throw(Error, 'Only a polynomium object, number, or valid variable can be added');
      expect(() => y.add(false)).to.throw(Error, 'Only a polynomium object, number, or valid variable can be added');
    });
  });

  describe('#mul()', function () { 
    it('mul', function() {
      assert.equal((y.mul(x.add(b))).toString(), 'x*y + 3y');
      assert.equal(((y.mul(x.add(b))).mul(a)).toString(), '2x*y + 6y');
      assert.equal(((y.mul(x.add(b))).mul((y.mul(x.add(b))))).toString(), 'x^2*y^2 + 6x*y^2 + 9y^2');
      assert.equal(((y.mul(x.add(3))).mul((y.mul(x.add(3))))).toString(), 'x^2*y^2 + 6x*y^2 + 9y^2');
      expect(() => (x.mul('123y')).toString()).to.throw(Error, 'Variable name must be an alphanumeric string that begins with a letter');
      expect(() => polynomium.mul(y, true)).to.throw(Error, 'Only a polynomium object, number, or valid variable can be multiplied');
      expect(() => y.mul(false)).to.throw(Error, 'Only a polynomium object, number, or valid variable can be multiplied');
    });
  });
  
  describe('#evaluate()', function () { 
    it('evaluate', function() {
      assert.equal(polynomium.c(123).evaluate({}), 123);
      assert.equal(polynomium.v('x').evaluate({"x":2}), 2);
      assert.equal(r.evaluate({"x":2, "y":5}), 625);
      assert.equal(r({"x":2, "y":5}), 625);
      expect(() => r({"x":2})).to.throw(Error, "Variable 'y' has no bound value in supplied bindings");
    });
  });
});
