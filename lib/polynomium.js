/* ****************************************************************************
** 
** polynomium.js
** https://github.com/lapets/polynomium
**
** Library for symbolically representing and working with polynomials.
**
*/

(function (polynomium) {

  function zip(xs, ys) {
    var zs = [];
    for (var i = 0; i < xs.length && i < ys.length; i++)
      zs.push([xs[i], ys[i]]);
    return zs;
  }

  function obj(xys) {
    var o = {};
    for (var i = 0; i < xys.length; i++)
      o[xys[i][0]] = xys[i][1];
    return o;
  }

  function unzip(xys) {
    var xs = [], ys = [];
    for (var i = 0; i < xys.length; i++) {
      xs.push(xys[i][0]);
      ys.push(xys[i][1]);
    }
    return [xs, ys];
  }

  function get(obj, key, val) {
    return (key in obj) ? obj[key] : val;
  }

  function entries(obj) {
    var entries = [];
	for (var key in obj)
	  entries.push([key, obj[key]]);
	return entries;
  }
  
  function num(s) {
    return parseInt(s);
  }

  function add(o1, o2) {
    var ks = [];
    for (var k in o1)
      ks.push(k);
    for (var k in o2)
      if (!(k in o1))
        ks.push(k);
    var o = {};
    for (var i = 0; i < ks.length; i++)
      o[ks[i]] = get(o1, ks[i], 0) + get(o2, ks[i], 0);
    return o;
  }

  function flt(obj, f) {
    var out = {};
    for (var key in obj)
      if (f(obj[key]))
        out[key] = obj[key];
    return out;
  }
  
  function emp(obj) {
    for (var key in obj)
      if(obj.hasOwnProperty(key))
        return false;
    return JSON.stringify(obj) === JSON.stringify({});
  }

  polynomium.create = function(f, terms) {
    f.polynomium = true;
    f.terms = terms;
    f.toString = function () { return polynomium.toString(f); };
    f.add = function (g) { return polynomium.add(f, g); };
    f.mul = function (g) { return polynomium.mul(f, g); };
    return f;
  }

  polynomium.variable = function (v) {
    if (typeof v === 'string' && /^(([a-zA-Z])([a-zA-Z0-9]*))$/.test(v)) {
      var f = function (bindings) { return 0; };
      var terms = {"#": {"1": 0}};
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
      return polynomium.create(f, {"#": {"1": c}});
    } else {
      return null; // Error.
    }
  };
  polynomium.c = polynomium.constant;

  polynomium.toString = function (p) {
    var indexed = [];
    for (var base in p.terms) {
      var ts = p.terms[base];
      var vs = base.split(",");
      for (var exps in p.terms[base]) {
        var es = exps.split(',').map(num);
        var term = [];
        var index = 0;
        for (var i = 0; i < es.length; i++) {
          term.push(vs[i] + ((es[i] == 1) ? "" : ("^"+es[i])));
          index += es[i];
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

  polynomium.mul = function (p, q) {
    var terms = [];
    if (p.polynomium == true && q.polynomium == true) {
      var f = function () { return 0; };
      var terms = {};
      for (var p_base in p.terms) {
        for (var p_exps in p.terms[p_base]) {
          var p_coeff = p.terms[p_base][p_exps];
          var p_v_to_e = obj(zip(p_base.split(","), p_exps.split(",").map(num)));
          for (var q_base in q.terms) {
            for (var q_exps in q.terms[q_base]) {
              var q_coeff = q.terms[q_base][q_exps];
              var q_v_to_e = obj(zip(q_base.split(","), q_exps.split(",").map(num)));
              var ves = entries(add(p_v_to_e, q_v_to_e)).sort();

              // Fix constant case exponent to always be 1.
              for (var i = 0; i < ves.length; i++)
                if (ves[i][0] == "#")
                  ves[i][1] = 1;

              var vs_es = unzip(ves);
              var base = vs_es[0].join(","), exps = vs_es[1].join(",");
              if (base in terms) {
                if (exps in terms[base]) {
                  terms[base][exps] += p_coeff * q_coeff;
                } else {
                  terms[base][exps] = p_coeff * q_coeff;
                }
              } else {
                terms[base] = {};
                terms[base][exps] = p_coeff * q_coeff;
              }
            } // for exponent lists in q
          } // for bases in q
        } // for exponent lists in p
      } // for bases in p
      
      // Filter out terms with zero coefficients.
      for (var base in terms)
        terms[base] = flt(terms[base], function (v) { return Math.abs(v) > 0; });
      terms = flt(terms, function (v) { return !emp(v); });

      return polynomium.create(f, terms);
    } else {
      return null; // Error.
    }
  };

}) (typeof exports !== 'undefined' ? exports : (this.polynomium = {}));
