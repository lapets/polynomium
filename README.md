# polynomium
Library for symbolically representing and working with polynomials.

[![npm version](https://badge.fury.io/js/polynomium.svg)](https://badge.fury.io/js/polynomium)

## Package Installation and Usage

The package is available on npm:

```shell
npm install polynomium
```

The library can be imported in the usual ways:

```javascript
var polynomium = require('polynomium');
```

## Examples

The library supports the creation of objects that represent polynomials of zero or more variables:

```javascript
var x = polynomium.v('x');
var y = polynomium.v('y');
var a = polynomium.c(2);
var b = polynomium.c(3);
var c = polynomium.c(5);
var p = (y.mul(x.add(b)));
var q = (y.mul(x.add(b))).mul(a);
var r = (y.mul(x.add(b))).mul((y.mul(x.add(b))));
```

Given the polynomials above, it is possible to display them in a human-readable way:

```javascript
> x.toString()
'x'
> b.toString()
'3'
> (y.add(x.add(b))).toString()
'y + x + 3'
> p.toString()
'x*y + 3y'
> q.toString()
'2x*y + 6y'
> r.toString()
'x^2*y^2 + 6x*y^2 + 9y^2'
```

By default, the terms in the outer sum are in order of descending significance (where a term's significance is the sum of its exponents across its factors). The individual variables within factors are in ascending alphabetical order.

It is also possible to evaluate a polynomial by supplying an object that binds explicit values to each variable:

```javascript
> r.evaluate({"x":2, "y":5})
625
> r({"x":2, "y":5})
625
```

## Testing

Unit tests are included in `test/test.js`. They can be run using [Mocha](https://mochajs.org/):

```javascript
npm test
```
