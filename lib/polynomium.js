/* ****************************************************************************
** 
** polynomium.js
** https://github.com/lapets/polynomium
**
** Library for symbolically representing and working with polynomials.
**
*/

(function (polynomium) {

  polynomium.create = function(f, terms) {
    f.polynomium = true;
    f.terms = terms;
    f.toString = function () { return polynomium.toString(f); };
    f.add = function (other) { return polynomium.add(f, other); };
    return f;
  }

  polynomium.variable = function (v) {
    if (typeof v === 'string' && /^(([a-zA-Z])([a-zA-Z0-9]*))$/.test(v)) {
      var f = function (bindings) { return 0; };
      var terms = {"": {"1": 0}};
      terms[v] = {"1": 1};    
      return polynomium.create(f, terms);
    } else {
      return null; // Error.
    }
  };
  polynomium.v = polynomium.variable;

  polynomium.constant = function (c) {
    if (typeof c === 'number') {
      var f = function () { return c; };
      return polynomium.create(f, {"": {"1": c}});
    } else {
      return null; // Error.
    }
  };
  polynomium.c = polynomium.constant;

  polynomium.toString = function (p) {
    var indexed = [];
    for (var base in p.terms) {
      var ts = p.terms[base];
      if (base == "") {
        if (ts["1"] != 0) {
          indexed.push([0, ts["1"]]);
        }
      } else {
        var vs = base.split(",");
        for (var exps in p.terms[base]) {
          var es = exps.split(',');
          var term = [];
          var index = 0;
          for (var i = 0; i < es.length; i++) {
            term.push(vs[i] + ((es[i] == 1) ? "" : ("^"+es[i])));
            index += es[i];
          }
          var a = p.terms[base][exps];
          indexed.push([index, (a ? "" : a) + term]);
        }
      }
    }
    indexed.sort(function(i, j) { return j[0] - i[0]; });
    var terms = indexed.map(function(i_t) { return i_t[1]; });
    return terms.join(" + ");
  };

  polynomium.add = function (p, q) {
    var terms = [];
    if (p.polynomium == true && q.polynomium == true) {
      var f = function () { return 0; };
      var terms = {};
      terms[""] = {"1": p.terms[""]["1"] + q.terms[""]["1"]};
      for (var p_base in p.terms) {
        for (var p_exps in p.terms[p_base]) {
          terms[p_base] = {};
          terms[p_base][p_exps] = p.terms[p_base][p_exps];
        }
      }
      for (var q_base in q.terms) {
        for (var q_exps in q.terms[q_base]) {
          if (!(q_base in terms)) {
            terms[q_base] = {};
            terms[q_base][q_exps] = 0;
          }
          terms[q_base][q_exps] += q.terms[q_base][q_exps];
        }
      }
      return polynomium.create(f, terms);
    } else {
      return null; // Error.
    }
  };

}) (typeof exports !== 'undefined' ? exports : (this.polynomium = {}));
