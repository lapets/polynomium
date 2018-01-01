var assert = require('assert');
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
      assert.equal(x.toString(), 'x');
      assert.equal(a.toString(), '2');
    });
  });

  describe('#variable()', function () { 
    it('variable', function() {
      assert.equal(x.toString(), 'x');
      assert.equal(y.toString(), 'y');
    });
  });

  describe('#constant()', function () {
    it('constant', function() {
      assert.equal(polynomium.c(123).toString(), '123');
      assert.equal(polynomium.c(1.23).toString(), '1.23');
    });
  });

  describe('#add()', function () { 
    it('add', function() {
      assert.equal((b.add(b)).toString(), '6');
      assert.equal((x.add(b)).toString(), 'x + 3');
      assert.equal((x.add(y)).toString(), 'x + y');
      assert.equal((x.add(a)).toString(), 'x + 2');
      assert.equal((y.add(x.add(b))).toString(), 'y + x + 3');
    });
  });

  describe('#mul()', function () { 
    it('mul', function() {
      assert.equal((y.mul(x.add(b))).toString(), 'x*y + 3y');
      assert.equal(((y.mul(x.add(b))).mul(a)).toString(), '2x*y + 6y');
      assert.equal(((y.mul(x.add(b))).mul((y.mul(x.add(b))))).toString(), 'x^2*y^2 + 6x*y^2 + 9y^2');
    });
  });
  
  describe('#evaluate()', function () { 
    it('evaluate', function() {
      assert.equal(polynomium.c(123).evaluate({}), 123);
      assert.equal(polynomium.v('x').evaluate({"x":2}), 2);
      assert.equal(r.evaluate({"x":2, "y":5}), 625);
      assert.equal(r({"x":2, "y":5}), 625);
    });
  });
});
