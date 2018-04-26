var assert = require('assert');
var expect = require('chai').expect;
var polynomium = require('../lib/polynomium');

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

  describe('#toObject()', function () { 
    it('toObject', function() {
      assert.deepEqual(polynomium.c(0).toObject(), {polynomium:true, terms:{'#':{'1':0}}});
      assert.deepEqual(x.toObject(), {polynomium:true, terms:{'#':{'1':0}, x:{'1':1}}});
      assert.deepEqual(x.toObject(), polynomium.create(x.toObject()).toObject());
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
      expect(() => polynomium.add(y, true)).to.throw(Error, 'Only a polynomium object, number, or valid variable can be an argument');
      expect(() => y.add(false)).to.throw(Error, 'Only a polynomium object, number, or valid variable can be an argument');
    });
  });

  describe('#mul()', function () { 
    it('mul', function() {
      assert.equal((y.mul(x.add(b))).toString(), 'x*y + 3y');
      assert.equal(((y.mul(x.add(b))).mul(a)).toString(), '2x*y + 6y');
      assert.equal(((y.mul(x.add(b))).mul((y.mul(x.add(b))))).toString(), 'x^2*y^2 + 6x*y^2 + 9y^2');
      assert.equal(((y.mul(x.add(3))).mul((y.mul(x.add(3))))).toString(), 'x^2*y^2 + 6x*y^2 + 9y^2');
      expect(() => (x.mul('123y')).toString()).to.throw(Error, 'Variable name must be an alphanumeric string that begins with a letter');
      expect(() => polynomium.mul(y, true)).to.throw(Error, 'Only a polynomium object, number, or valid variable can be an argument');
      expect(() => y.mul(false)).to.throw(Error, 'Only a polynomium object, number, or valid variable can be an argument');
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

  describe('term-exponents', function() {
    it('should combine equivalent terms correctly', function() {
      let two = polynomium.c(2);
      let x = polynomium.v("x");
      let p = x.add(two.mul(x));
      assert.equal(p.toString(), '3x');

      let a = polynomium.v("a");
      let b = polynomium.v("b");
      let ab = a.mul(b);
      let ab2 = ab.mul(polynomium.c(2));
      let t = ab.add(ab2);
      assert.equal(t.toString(), '3a*b');

      let three = polynomium.c(3);
      let six = three.mul(two);
      assert.equal(six.toString(), '6');

      let a6 = six.mul(a);
      assert.equal(a6.toString(), '6a');

      let a7 = a6.add(a);
      assert.equal(a7.toString(), '7a');

      let asqu7 = a7.mul(a);
      assert.equal(asqu7.toString(), '7a^2');

      let asqu7pb = asqu7.add(b);
      assert.equal(asqu7pb.toString(), '7a^2 + b');

      let t2 = asqu7pb.mul(b);
      assert.equal(t2.toString(), '7a^2*b + b^2');
    });
  });
});
