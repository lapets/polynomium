var polynomium = require('../lib/polynomium');

var x = polynomium.v('x');
var y = polynomium.v('y');
var a = polynomium.c(2);
var b = polynomium.c(3);
var c = polynomium.c(5);
var p = (y.mul(x.add(b)));
var q = (y.mul(x.add(b))).mul(a);
var r = (y.mul(x.add(b))).mul((y.mul(x.add(b))));

console.log(p.toString());
console.log(x.toString());
console.log(y.toString());
console.log(b.toString());
console.log((b.add(b)).toString());
console.log((x.add(b)).toString());
console.log((y.add(x.add(b))).toString());
console.log(p.toString());
console.log(a.toString());
console.log(q.toString());
console.log(r.toString());
