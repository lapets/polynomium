/* ****************************************************************************
** 
** polynomium.js
** https://github.com/lapets/polynomium
**
** Library for symbolically representing and working with polynomials.
**
*/

(function (polynomium) {

  // Because parseInt expects two arguments,
  // we need a wrapper for use with .map().
  function num(s) {
    return parseInt(s);
  }

  function zip(xs, ys) {
    var zs = [];
    for (var i = 0; i < xs.length && i < ys.length; i++)
      zs.push([xs[i], ys[i]]);
    return zs;
  }

  function unzip(xys) {
    var xs = [], ys = [];
    for (var i = 0; i < xys.length; i++) {
      xs.push(xys[i][0]);
      ys.push(xys[i][1]);
    }
    return [xs, ys];
  }

  function obj(xys) {
    var o = {};
    for (var i = 0; i < xys.length; i++)
      o[xys[i][0]] = xys[i][1];
    return o;
  }

  function emp(obj) {
    for (var key in obj)
      if(obj.hasOwnProperty(key))
        return false;
    return JSON.stringify(obj) === JSON.stringify({});
  }

  function get_default(obj, key, val) {
    return (key in obj) ? obj[key] : val;
  }
  
  function add_default(obj, path, val, add) {
    if (path.length == 1) {
      if (!(path[0] in obj))
        obj[path[0]] = val;
      obj[path[0]] += add;
    } else {
      if (!(path[0] in obj))
        obj[path[0]] = {};
      add_default(obj[path[0]], path.slice(1), val, add);
    }
  }

  // In case Object.entries() is not available.
  function entries(obj) {
    var entries = [];
	for (var key in obj)
	  entries.push([key, obj[key]]);
	return entries;
  }

  // Filter function for objects.
  function flt(obj, f) {
    var out = {};
    for (var key in obj)
      if (f(obj[key]))
        out[key] = obj[key];
    return out;
  }

  // Key-wise addition of two objects.
  function add(o1, o2) {
    var ks = [];
    for (var k in o1)
      ks.push(k);
    for (var k in o2)
      if (!(k in o1))
        ks.push(k);
    var o = {};
    for (var i = 0; i < ks.length; i++)
      o[ks[i]] = get_default(o1, ks[i], 0) + get_default(o2, ks[i], 0);
    return o;
  }

  polynomium.create = function(terms) {
    var f = function (bindings) { return f.evaluate(bindings); };
    f.polynomium = true;
    f.terms = terms;
    f.toString = function () { return polynomium.toString(f); };
    f.add = function (g) { return polynomium.add(f, g); };
    f.mul = function (g) { return polynomium.mul(f, g); };
    f.evaluate = function (bindings) { return polynomium.evaluate(f, bindings); };
    return f;
  }

  polynomium.variable = function (v) {
    if (typeof v === 'string' && /^(([a-zA-Z])([a-zA-Z0-9]*))$/.test(v)) {
      var terms = {"#": {"1": 0}};
      terms[v] = {"1": 1};    
      return polynomium.create(terms);
    } else {
      return null; // Error.
    }
  };
  polynomium.v = polynomium.variable;

  polynomium.constant = function (c) {
    if (typeof c === 'number') {
      return polynomium.create({"#": {"1": c}});
    } else {
      return null; // Error.
    }
  };
  polynomium.c = polynomium.constant;

  polynomium.toString = function (p) {
    var indexed = [];
    for (var base in p.terms) {
      var vs = base.split(",");
      for (var exps in p.terms[base]) {
        var es = exps.split(',').map(num);
        var term = [];
        var index = 0; // Term significance (i.e., sum of exponents).
        for (var i = 0; i < es.length; i++) {
          term.push(vs[i] + ((es[i] == 1) ? "" : ("^"+es[i])));
          index += (vs[i] != "#") ? es[i] : 0; // For sorting by significance.
        }
        var a = p.terms[base][exps], hasVars = !(term.length == 1 && term[0] == "#");
        if (Math.abs(a) > 0) {
          term = term.filter(function (v) { return v != "#"; });
          indexed.push([index, ((a == 1 && hasVars) ? "" : a) + term.join("*")]);
        }
      }
    }
    indexed = indexed.sort(function(i, j) { return j[0] - i[0]; });
    return indexed.map(function(i_t) { return i_t[1]; }).join(" + ");
  };

  polynomium.add = function (p, q) {
    var terms = [];
    if (p.polynomium == true && q.polynomium == true) {
      var f = function () { return 0; };
      var terms = {};
      for (var p_base in p.terms)
        for (var p_exps in p.terms[p_base])
          add_default(terms, [p_base, p_exps], 0, p.terms[p_base][p_exps]);
      for (var q_base in q.terms)
        for (var q_exps in q.terms[q_base])
          add_default(terms, [q_base, q_exps], 0, q.terms[q_base][q_exps]);
      return polynomium.create(terms);
    } else {
      return null; // Error.
    }
  };

  polynomium.mul = function (p, q) {
    var terms = [];
    if (p.polynomium == true && q.polynomium == true) {
      var f = function () { return 0; };
      var terms = {};
      for (var p_base in p.terms) {
        for (var p_exps in p.terms[p_base]) {
          var p_v_to_e = obj(zip(p_base.split(","), p_exps.split(",").map(num)));
          for (var q_base in q.terms) {
            for (var q_exps in q.terms[q_base]) {
              var q_v_to_e = obj(zip(q_base.split(","), q_exps.split(",").map(num)));
              var ves = entries(add(p_v_to_e, q_v_to_e)).sort();
              // Fix constant case exponent to always be 1.
              var vs_es = unzip(ves.map(function(ve) { return ve[0]=="#" ? ["#",1] : ve; }));
              var base = vs_es[0].join(","), exps = vs_es[1].join(",");
              add_default(terms, [base, exps], 0, p.terms[p_base][p_exps] * q.terms[q_base][q_exps]);
            } // for exponent lists in q
          } // for bases in q
        } // for exponent lists in p
      } // for bases in p

      // Filter out terms with zero coefficients.
      for (var base in terms)
        terms[base] = flt(terms[base], function (v) { return Math.abs(v) > 0; });
      terms = flt(terms, function (v) { return !emp(v); });

      return polynomium.create(terms);
    } else {
      return null; // Error.
    }
  };

  polynomium.evaluate = function (p, bindings) {
    bindings["#"] = 1; // Account for placeholder non-variable.
    var sum = 0;
    for (var base in p.terms) {
      var vs = base.split(",");
      for (var exps in p.terms[base]) {
        var es = exps.split(",").map(num);
        var product = 1;
        for (var i = 0; i < vs.length; i++)
          product *= Math.pow(bindings[vs[i]], es[i]);
        sum += p.terms[base][exps] * product;
      }
    }
    return sum;
  };

}) (typeof exports !== 'undefined' ? exports : (this.polynomium = {}));
