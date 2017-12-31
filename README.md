# polynomium
Library for symbolically representing and working with polynomials.

[![npm version](https://badge.fury.io/js/polynomium.svg)](https://badge.fury.io/js/polynomium)

## Package Installation and Usage

```shell
npm install polynomium
```

```javascript
var x = polynomium.v('x');
var y = polynomium.v('y');
var b = polynomium.c(123);
var z = y.add(x.add(b));

console.log(x.toString());
console.log(y.toString());
console.log(b.toString());
console.log((b.add(b)).toString());
console.log((x.add(b)).toString());
console.log(z.toString());
```
