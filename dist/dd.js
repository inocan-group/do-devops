#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/tsup/assets/cjs_shims.js
var importMetaUrlShim;
var init_cjs_shims = __esm({
  "node_modules/tsup/assets/cjs_shims.js"() {
    importMetaUrlShim = typeof document === "undefined" ? new URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
  }
});

// node_modules/fs.realpath/old.js
var require_old = __commonJS({
  "node_modules/fs.realpath/old.js"(exports2) {
    init_cjs_shims();
    var pathModule = require("path");
    var isWindows = process.platform === "win32";
    var fs8 = require("fs");
    var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
    function rethrow() {
      var callback;
      if (DEBUG) {
        var backtrace = new Error();
        callback = debugCallback;
      } else
        callback = missingCallback;
      return callback;
      function debugCallback(err) {
        if (err) {
          backtrace.message = err.message;
          err = backtrace;
          missingCallback(err);
        }
      }
      function missingCallback(err) {
        if (err) {
          if (process.throwDeprecation)
            throw err;
          else if (!process.noDeprecation) {
            var msg = "fs: missing callback " + (err.stack || err.message);
            if (process.traceDeprecation)
              console.trace(msg);
            else
              console.error(msg);
          }
        }
      }
    }
    function maybeCallback(cb) {
      return typeof cb === "function" ? cb : rethrow();
    }
    var normalize = pathModule.normalize;
    if (isWindows) {
      nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
    } else {
      nextPartRe = /(.*?)(?:[\/]+|$)/g;
    }
    var nextPartRe;
    if (isWindows) {
      splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
    } else {
      splitRootRe = /^[\/]*/;
    }
    var splitRootRe;
    exports2.realpathSync = function realpathSync(p, cache2) {
      p = pathModule.resolve(p);
      if (cache2 && Object.prototype.hasOwnProperty.call(cache2, p)) {
        return cache2[p];
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs8.lstatSync(base);
          knownHard[base] = true;
        }
      }
      while (pos < p.length) {
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache2 && cache2[base] === base) {
          continue;
        }
        var resolvedLink;
        if (cache2 && Object.prototype.hasOwnProperty.call(cache2, base)) {
          resolvedLink = cache2[base];
        } else {
          var stat2 = fs8.lstatSync(base);
          if (!stat2.isSymbolicLink()) {
            knownHard[base] = true;
            if (cache2)
              cache2[base] = base;
            continue;
          }
          var linkTarget = null;
          if (!isWindows) {
            var id = stat2.dev.toString(32) + ":" + stat2.ino.toString(32);
            if (seenLinks.hasOwnProperty(id)) {
              linkTarget = seenLinks[id];
            }
          }
          if (linkTarget === null) {
            fs8.statSync(base);
            linkTarget = fs8.readlinkSync(base);
          }
          resolvedLink = pathModule.resolve(previous, linkTarget);
          if (cache2)
            cache2[base] = resolvedLink;
          if (!isWindows)
            seenLinks[id] = linkTarget;
        }
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
      if (cache2)
        cache2[original] = p;
      return p;
    };
    exports2.realpath = function realpath(p, cache2, cb) {
      if (typeof cb !== "function") {
        cb = maybeCallback(cache2);
        cache2 = null;
      }
      p = pathModule.resolve(p);
      if (cache2 && Object.prototype.hasOwnProperty.call(cache2, p)) {
        return process.nextTick(cb.bind(null, null, cache2[p]));
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs8.lstat(base, function(err) {
            if (err)
              return cb(err);
            knownHard[base] = true;
            LOOP();
          });
        } else {
          process.nextTick(LOOP);
        }
      }
      function LOOP() {
        if (pos >= p.length) {
          if (cache2)
            cache2[original] = p;
          return cb(null, p);
        }
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache2 && cache2[base] === base) {
          return process.nextTick(LOOP);
        }
        if (cache2 && Object.prototype.hasOwnProperty.call(cache2, base)) {
          return gotResolvedLink(cache2[base]);
        }
        return fs8.lstat(base, gotStat);
      }
      function gotStat(err, stat2) {
        if (err)
          return cb(err);
        if (!stat2.isSymbolicLink()) {
          knownHard[base] = true;
          if (cache2)
            cache2[base] = base;
          return process.nextTick(LOOP);
        }
        if (!isWindows) {
          var id = stat2.dev.toString(32) + ":" + stat2.ino.toString(32);
          if (seenLinks.hasOwnProperty(id)) {
            return gotTarget(null, seenLinks[id], base);
          }
        }
        fs8.stat(base, function(err2) {
          if (err2)
            return cb(err2);
          fs8.readlink(base, function(err3, target) {
            if (!isWindows)
              seenLinks[id] = target;
            gotTarget(err3, target);
          });
        });
      }
      function gotTarget(err, target, base2) {
        if (err)
          return cb(err);
        var resolvedLink = pathModule.resolve(previous, target);
        if (cache2)
          cache2[base2] = resolvedLink;
        gotResolvedLink(resolvedLink);
      }
      function gotResolvedLink(resolvedLink) {
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
    };
  }
});

// node_modules/fs.realpath/index.js
var require_fs = __commonJS({
  "node_modules/fs.realpath/index.js"(exports2, module2) {
    init_cjs_shims();
    module2.exports = realpath;
    realpath.realpath = realpath;
    realpath.sync = realpathSync;
    realpath.realpathSync = realpathSync;
    realpath.monkeypatch = monkeypatch;
    realpath.unmonkeypatch = unmonkeypatch;
    var fs8 = require("fs");
    var origRealpath = fs8.realpath;
    var origRealpathSync = fs8.realpathSync;
    var version = process.version;
    var ok = /^v[0-5]\./.test(version);
    var old = require_old();
    function newError(er) {
      return er && er.syscall === "realpath" && (er.code === "ELOOP" || er.code === "ENOMEM" || er.code === "ENAMETOOLONG");
    }
    function realpath(p, cache2, cb) {
      if (ok) {
        return origRealpath(p, cache2, cb);
      }
      if (typeof cache2 === "function") {
        cb = cache2;
        cache2 = null;
      }
      origRealpath(p, cache2, function(er, result) {
        if (newError(er)) {
          old.realpath(p, cache2, cb);
        } else {
          cb(er, result);
        }
      });
    }
    function realpathSync(p, cache2) {
      if (ok) {
        return origRealpathSync(p, cache2);
      }
      try {
        return origRealpathSync(p, cache2);
      } catch (er) {
        if (newError(er)) {
          return old.realpathSync(p, cache2);
        } else {
          throw er;
        }
      }
    }
    function monkeypatch() {
      fs8.realpath = realpath;
      fs8.realpathSync = realpathSync;
    }
    function unmonkeypatch() {
      fs8.realpath = origRealpath;
      fs8.realpathSync = origRealpathSync;
    }
  }
});

// node_modules/concat-map/index.js
var require_concat_map = __commonJS({
  "node_modules/concat-map/index.js"(exports2, module2) {
    init_cjs_shims();
    module2.exports = function(xs, fn) {
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x))
          res.push.apply(res, x);
        else
          res.push(x);
      }
      return res;
    };
    var isArray = Array.isArray || function(xs) {
      return Object.prototype.toString.call(xs) === "[object Array]";
    };
  }
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({
  "node_modules/balanced-match/index.js"(exports2, module2) {
    init_cjs_shims();
    "use strict";
    module2.exports = balanced;
    function balanced(a, b, str) {
      if (a instanceof RegExp)
        a = maybeMatch(a, str);
      if (b instanceof RegExp)
        b = maybeMatch(b, str);
      var r = range(a, b, str);
      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }
    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }
    balanced.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i = ai;
      if (ai >= 0 && bi > 0) {
        if (a === b) {
          return [ai, bi];
        }
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str.indexOf(b, i + 1);
          }
          i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
          result = [left, right];
        }
      }
      return result;
    }
  }
});

// node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({
  "node_modules/brace-expansion/index.js"(exports2, module2) {
    init_cjs_shims();
    var concatMap = require_concat_map();
    var balanced = require_balanced_match();
    module2.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str) {
      return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
    }
    function escapeBraces(str) {
      return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str) {
      return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str) {
      if (!str)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str);
      if (!m)
        return str.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str) {
      if (!str)
        return [];
      if (str.substr(0, 2) === "{}") {
        str = "\\{\\}" + str.substr(2);
      }
      return expand(escapeBraces(str), true).map(unescapeBraces);
    }
    function embrace(str) {
      return "{" + str + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }
    function expand(str, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str);
      if (!m || /\$$/.test(m.pre))
        return [str];
      var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
      var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
      var isSequence = isNumericSequence || isAlphaSequence;
      var isOptions = m.body.indexOf(",") >= 0;
      if (!isSequence && !isOptions) {
        if (m.post.match(/,.*\}/)) {
          str = m.pre + "{" + m.body + escClose + m.post;
          return expand(str);
        }
        return [str];
      }
      var n;
      if (isSequence) {
        n = m.body.split(/\.\./);
      } else {
        n = parseCommaParts(m.body);
        if (n.length === 1) {
          n = expand(n[0], false).map(embrace);
          if (n.length === 1) {
            var post = m.post.length ? expand(m.post, false) : [""];
            return post.map(function(p) {
              return m.pre + n[0] + p;
            });
          }
        }
      }
      var pre = m.pre;
      var post = m.post.length ? expand(m.post, false) : [""];
      var N;
      if (isSequence) {
        var x = numeric(n[0]);
        var y = numeric(n[1]);
        var width = Math.max(n[0].length, n[1].length);
        var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
        var test = lte;
        var reverse = y < x;
        if (reverse) {
          incr *= -1;
          test = gte;
        }
        var pad = n.some(isPadded);
        N = [];
        for (var i = x; test(i, y); i += incr) {
          var c;
          if (isAlphaSequence) {
            c = String.fromCharCode(i);
            if (c === "\\")
              c = "";
          } else {
            c = String(i);
            if (pad) {
              var need = width - c.length;
              if (need > 0) {
                var z = new Array(need + 1).join("0");
                if (i < 0)
                  c = "-" + z + c.slice(1);
                else
                  c = z + c;
              }
            }
          }
          N.push(c);
        }
      } else {
        N = concatMap(n, function(el) {
          return expand(el, false);
        });
      }
      for (var j = 0; j < N.length; j++) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + N[j] + post[k];
          if (!isTop || isSequence || expansion)
            expansions.push(expansion);
        }
      }
      return expansions;
    }
  }
});

// node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS({
  "node_modules/minimatch/minimatch.js"(exports2, module2) {
    init_cjs_shims();
    module2.exports = minimatch;
    minimatch.Minimatch = Minimatch;
    var path60 = { sep: "/" };
    try {
      path60 = require("path");
    } catch (er) {
    }
    var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
    var expand = require_brace_expansion();
    var plTypes = {
      "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
      "?": { open: "(?:", close: ")?" },
      "+": { open: "(?:", close: ")+" },
      "*": { open: "(?:", close: ")*" },
      "@": { open: "(?:", close: ")" }
    };
    var qmark = "[^/]";
    var star = qmark + "*?";
    var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
    var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
    var reSpecials = charSet("().*{}+?[]^$\\!");
    function charSet(s) {
      return s.split("").reduce(function(set2, c) {
        set2[c] = true;
        return set2;
      }, {});
    }
    var slashSplit = /\/+/;
    minimatch.filter = filter3;
    function filter3(pattern, options16) {
      options16 = options16 || {};
      return function(p, i, list) {
        return minimatch(p, pattern, options16);
      };
    }
    function ext(a, b) {
      a = a || {};
      b = b || {};
      var t = {};
      Object.keys(b).forEach(function(k) {
        t[k] = b[k];
      });
      Object.keys(a).forEach(function(k) {
        t[k] = a[k];
      });
      return t;
    }
    minimatch.defaults = function(def) {
      if (!def || !Object.keys(def).length)
        return minimatch;
      var orig = minimatch;
      var m = function minimatch2(p, pattern, options16) {
        return orig.minimatch(p, pattern, ext(def, options16));
      };
      m.Minimatch = function Minimatch2(pattern, options16) {
        return new orig.Minimatch(pattern, ext(def, options16));
      };
      return m;
    };
    Minimatch.defaults = function(def) {
      if (!def || !Object.keys(def).length)
        return Minimatch;
      return minimatch.defaults(def).Minimatch;
    };
    function minimatch(p, pattern, options16) {
      if (typeof pattern !== "string") {
        throw new TypeError("glob pattern string required");
      }
      if (!options16)
        options16 = {};
      if (!options16.nocomment && pattern.charAt(0) === "#") {
        return false;
      }
      if (pattern.trim() === "")
        return p === "";
      return new Minimatch(pattern, options16).match(p);
    }
    function Minimatch(pattern, options16) {
      if (!(this instanceof Minimatch)) {
        return new Minimatch(pattern, options16);
      }
      if (typeof pattern !== "string") {
        throw new TypeError("glob pattern string required");
      }
      if (!options16)
        options16 = {};
      pattern = pattern.trim();
      if (path60.sep !== "/") {
        pattern = pattern.split(path60.sep).join("/");
      }
      this.options = options16;
      this.set = [];
      this.pattern = pattern;
      this.regexp = null;
      this.negate = false;
      this.comment = false;
      this.empty = false;
      this.make();
    }
    Minimatch.prototype.debug = function() {
    };
    Minimatch.prototype.make = make;
    function make() {
      if (this._made)
        return;
      var pattern = this.pattern;
      var options16 = this.options;
      if (!options16.nocomment && pattern.charAt(0) === "#") {
        this.comment = true;
        return;
      }
      if (!pattern) {
        this.empty = true;
        return;
      }
      this.parseNegate();
      var set2 = this.globSet = this.braceExpand();
      if (options16.debug)
        this.debug = console.error;
      this.debug(this.pattern, set2);
      set2 = this.globParts = set2.map(function(s) {
        return s.split(slashSplit);
      });
      this.debug(this.pattern, set2);
      set2 = set2.map(function(s, si, set3) {
        return s.map(this.parse, this);
      }, this);
      this.debug(this.pattern, set2);
      set2 = set2.filter(function(s) {
        return s.indexOf(false) === -1;
      });
      this.debug(this.pattern, set2);
      this.set = set2;
    }
    Minimatch.prototype.parseNegate = parseNegate;
    function parseNegate() {
      var pattern = this.pattern;
      var negate = false;
      var options16 = this.options;
      var negateOffset = 0;
      if (options16.nonegate)
        return;
      for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === "!"; i++) {
        negate = !negate;
        negateOffset++;
      }
      if (negateOffset)
        this.pattern = pattern.substr(negateOffset);
      this.negate = negate;
    }
    minimatch.braceExpand = function(pattern, options16) {
      return braceExpand(pattern, options16);
    };
    Minimatch.prototype.braceExpand = braceExpand;
    function braceExpand(pattern, options16) {
      if (!options16) {
        if (this instanceof Minimatch) {
          options16 = this.options;
        } else {
          options16 = {};
        }
      }
      pattern = typeof pattern === "undefined" ? this.pattern : pattern;
      if (typeof pattern === "undefined") {
        throw new TypeError("undefined pattern");
      }
      if (options16.nobrace || !pattern.match(/\{.*\}/)) {
        return [pattern];
      }
      return expand(pattern);
    }
    Minimatch.prototype.parse = parse12;
    var SUBPARSE = {};
    function parse12(pattern, isSub) {
      if (pattern.length > 1024 * 64) {
        throw new TypeError("pattern is too long");
      }
      var options16 = this.options;
      if (!options16.noglobstar && pattern === "**")
        return GLOBSTAR;
      if (pattern === "")
        return "";
      var re = "";
      var hasMagic = !!options16.nocase;
      var escaping = false;
      var patternListStack = [];
      var negativeLists = [];
      var stateChar;
      var inClass = false;
      var reClassStart = -1;
      var classStart = -1;
      var patternStart = pattern.charAt(0) === "." ? "" : options16.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
      var self = this;
      function clearStateChar() {
        if (stateChar) {
          switch (stateChar) {
            case "*":
              re += star;
              hasMagic = true;
              break;
            case "?":
              re += qmark;
              hasMagic = true;
              break;
            default:
              re += "\\" + stateChar;
              break;
          }
          self.debug("clearStateChar %j %j", stateChar, re);
          stateChar = false;
        }
      }
      for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
        this.debug("%s	%s %s %j", pattern, i, re, c);
        if (escaping && reSpecials[c]) {
          re += "\\" + c;
          escaping = false;
          continue;
        }
        switch (c) {
          case "/":
            return false;
          case "\\":
            clearStateChar();
            escaping = true;
            continue;
          case "?":
          case "*":
          case "+":
          case "@":
          case "!":
            this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
            if (inClass) {
              this.debug("  in class");
              if (c === "!" && i === classStart + 1)
                c = "^";
              re += c;
              continue;
            }
            self.debug("call clearStateChar %j", stateChar);
            clearStateChar();
            stateChar = c;
            if (options16.noext)
              clearStateChar();
            continue;
          case "(":
            if (inClass) {
              re += "(";
              continue;
            }
            if (!stateChar) {
              re += "\\(";
              continue;
            }
            patternListStack.push({
              type: stateChar,
              start: i - 1,
              reStart: re.length,
              open: plTypes[stateChar].open,
              close: plTypes[stateChar].close
            });
            re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
            this.debug("plType %j %j", stateChar, re);
            stateChar = false;
            continue;
          case ")":
            if (inClass || !patternListStack.length) {
              re += "\\)";
              continue;
            }
            clearStateChar();
            hasMagic = true;
            var pl = patternListStack.pop();
            re += pl.close;
            if (pl.type === "!") {
              negativeLists.push(pl);
            }
            pl.reEnd = re.length;
            continue;
          case "|":
            if (inClass || !patternListStack.length || escaping) {
              re += "\\|";
              escaping = false;
              continue;
            }
            clearStateChar();
            re += "|";
            continue;
          case "[":
            clearStateChar();
            if (inClass) {
              re += "\\" + c;
              continue;
            }
            inClass = true;
            classStart = i;
            reClassStart = re.length;
            re += c;
            continue;
          case "]":
            if (i === classStart + 1 || !inClass) {
              re += "\\" + c;
              escaping = false;
              continue;
            }
            if (inClass) {
              var cs = pattern.substring(classStart + 1, i);
              try {
                RegExp("[" + cs + "]");
              } catch (er) {
                var sp = this.parse(cs, SUBPARSE);
                re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
                hasMagic = hasMagic || sp[1];
                inClass = false;
                continue;
              }
            }
            hasMagic = true;
            inClass = false;
            re += c;
            continue;
          default:
            clearStateChar();
            if (escaping) {
              escaping = false;
            } else if (reSpecials[c] && !(c === "^" && inClass)) {
              re += "\\";
            }
            re += c;
        }
      }
      if (inClass) {
        cs = pattern.substr(classStart + 1);
        sp = this.parse(cs, SUBPARSE);
        re = re.substr(0, reClassStart) + "\\[" + sp[0];
        hasMagic = hasMagic || sp[1];
      }
      for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
        var tail = re.slice(pl.reStart + pl.open.length);
        this.debug("setting tail", re, pl);
        tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
          if (!$2) {
            $2 = "\\";
          }
          return $1 + $1 + $2 + "|";
        });
        this.debug("tail=%j\n   %s", tail, tail, pl, re);
        var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
        hasMagic = true;
        re = re.slice(0, pl.reStart) + t + "\\(" + tail;
      }
      clearStateChar();
      if (escaping) {
        re += "\\\\";
      }
      var addPatternStart = false;
      switch (re.charAt(0)) {
        case ".":
        case "[":
        case "(":
          addPatternStart = true;
      }
      for (var n = negativeLists.length - 1; n > -1; n--) {
        var nl = negativeLists[n];
        var nlBefore = re.slice(0, nl.reStart);
        var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
        var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
        var nlAfter = re.slice(nl.reEnd);
        nlLast += nlAfter;
        var openParensBefore = nlBefore.split("(").length - 1;
        var cleanAfter = nlAfter;
        for (i = 0; i < openParensBefore; i++) {
          cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
        }
        nlAfter = cleanAfter;
        var dollar = "";
        if (nlAfter === "" && isSub !== SUBPARSE) {
          dollar = "$";
        }
        var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        re = newRe;
      }
      if (re !== "" && hasMagic) {
        re = "(?=.)" + re;
      }
      if (addPatternStart) {
        re = patternStart + re;
      }
      if (isSub === SUBPARSE) {
        return [re, hasMagic];
      }
      if (!hasMagic) {
        return globUnescape(pattern);
      }
      var flags = options16.nocase ? "i" : "";
      try {
        var regExp = new RegExp("^" + re + "$", flags);
      } catch (er) {
        return new RegExp("$.");
      }
      regExp._glob = pattern;
      regExp._src = re;
      return regExp;
    }
    minimatch.makeRe = function(pattern, options16) {
      return new Minimatch(pattern, options16 || {}).makeRe();
    };
    Minimatch.prototype.makeRe = makeRe;
    function makeRe() {
      if (this.regexp || this.regexp === false)
        return this.regexp;
      var set2 = this.set;
      if (!set2.length) {
        this.regexp = false;
        return this.regexp;
      }
      var options16 = this.options;
      var twoStar = options16.noglobstar ? star : options16.dot ? twoStarDot : twoStarNoDot;
      var flags = options16.nocase ? "i" : "";
      var re = set2.map(function(pattern) {
        return pattern.map(function(p) {
          return p === GLOBSTAR ? twoStar : typeof p === "string" ? regExpEscape(p) : p._src;
        }).join("\\/");
      }).join("|");
      re = "^(?:" + re + ")$";
      if (this.negate)
        re = "^(?!" + re + ").*$";
      try {
        this.regexp = new RegExp(re, flags);
      } catch (ex) {
        this.regexp = false;
      }
      return this.regexp;
    }
    minimatch.match = function(list, pattern, options16) {
      options16 = options16 || {};
      var mm = new Minimatch(pattern, options16);
      list = list.filter(function(f) {
        return mm.match(f);
      });
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list;
    };
    Minimatch.prototype.match = match;
    function match(f, partial) {
      this.debug("match", f, this.pattern);
      if (this.comment)
        return false;
      if (this.empty)
        return f === "";
      if (f === "/" && partial)
        return true;
      var options16 = this.options;
      if (path60.sep !== "/") {
        f = f.split(path60.sep).join("/");
      }
      f = f.split(slashSplit);
      this.debug(this.pattern, "split", f);
      var set2 = this.set;
      this.debug(this.pattern, "set", set2);
      var filename;
      var i;
      for (i = f.length - 1; i >= 0; i--) {
        filename = f[i];
        if (filename)
          break;
      }
      for (i = 0; i < set2.length; i++) {
        var pattern = set2[i];
        var file = f;
        if (options16.matchBase && pattern.length === 1) {
          file = [filename];
        }
        var hit = this.matchOne(file, pattern, partial);
        if (hit) {
          if (options16.flipNegate)
            return true;
          return !this.negate;
        }
      }
      if (options16.flipNegate)
        return false;
      return this.negate;
    }
    Minimatch.prototype.matchOne = function(file, pattern, partial) {
      var options16 = this.options;
      this.debug("matchOne", { "this": this, file, pattern });
      this.debug("matchOne", file.length, pattern.length);
      for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
        this.debug("matchOne loop");
        var p = pattern[pi];
        var f = file[fi];
        this.debug(pattern, p, f);
        if (p === false)
          return false;
        if (p === GLOBSTAR) {
          this.debug("GLOBSTAR", [pattern, p, f]);
          var fr = fi;
          var pr = pi + 1;
          if (pr === pl) {
            this.debug("** at the end");
            for (; fi < fl; fi++) {
              if (file[fi] === "." || file[fi] === ".." || !options16.dot && file[fi].charAt(0) === ".")
                return false;
            }
            return true;
          }
          while (fr < fl) {
            var swallowee = file[fr];
            this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
              this.debug("globstar found match!", fr, fl, swallowee);
              return true;
            } else {
              if (swallowee === "." || swallowee === ".." || !options16.dot && swallowee.charAt(0) === ".") {
                this.debug("dot detected!", file, fr, pattern, pr);
                break;
              }
              this.debug("globstar swallow a segment, and continue");
              fr++;
            }
          }
          if (partial) {
            this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
            if (fr === fl)
              return true;
          }
          return false;
        }
        var hit;
        if (typeof p === "string") {
          if (options16.nocase) {
            hit = f.toLowerCase() === p.toLowerCase();
          } else {
            hit = f === p;
          }
          this.debug("string match", p, f, hit);
        } else {
          hit = f.match(p);
          this.debug("pattern match", p, f, hit);
        }
        if (!hit)
          return false;
      }
      if (fi === fl && pi === pl) {
        return true;
      } else if (fi === fl) {
        return partial;
      } else if (pi === pl) {
        var emptyFileEnd = fi === fl - 1 && file[fi] === "";
        return emptyFileEnd;
      }
      throw new Error("wtf?");
    };
    function globUnescape(s) {
      return s.replace(/\\(.)/g, "$1");
    }
    function regExpEscape(s) {
      return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports2, module2) {
    init_cjs_shims();
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports2, module2) {
    init_cjs_shims();
    try {
      util = require("util");
      if (typeof util.inherits !== "function")
        throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/path-is-absolute/index.js
var require_path_is_absolute = __commonJS({
  "node_modules/path-is-absolute/index.js"(exports2, module2) {
    init_cjs_shims();
    "use strict";
    function posix(path60) {
      return path60.charAt(0) === "/";
    }
    function win32(path60) {
      var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
      var result = splitDeviceRe.exec(path60);
      var device = result[1] || "";
      var isUnc = Boolean(device && device.charAt(1) !== ":");
      return Boolean(result[2] || isUnc);
    }
    module2.exports = process.platform === "win32" ? win32 : posix;
    module2.exports.posix = posix;
    module2.exports.win32 = win32;
  }
});

// node_modules/glob/common.js
var require_common = __commonJS({
  "node_modules/glob/common.js"(exports2) {
    init_cjs_shims();
    exports2.setopts = setopts;
    exports2.ownProp = ownProp;
    exports2.makeAbs = makeAbs;
    exports2.finish = finish;
    exports2.mark = mark;
    exports2.isIgnored = isIgnored;
    exports2.childrenIgnored = childrenIgnored;
    function ownProp(obj, field) {
      return Object.prototype.hasOwnProperty.call(obj, field);
    }
    var fs8 = require("fs");
    var path60 = require("path");
    var minimatch = require_minimatch();
    var isAbsolute = require_path_is_absolute();
    var Minimatch = minimatch.Minimatch;
    function alphasort(a, b) {
      return a.localeCompare(b, "en");
    }
    function setupIgnores(self, options16) {
      self.ignore = options16.ignore || [];
      if (!Array.isArray(self.ignore))
        self.ignore = [self.ignore];
      if (self.ignore.length) {
        self.ignore = self.ignore.map(ignoreMap);
      }
    }
    function ignoreMap(pattern) {
      var gmatcher = null;
      if (pattern.slice(-3) === "/**") {
        var gpattern = pattern.replace(/(\/\*\*)+$/, "");
        gmatcher = new Minimatch(gpattern, { dot: true });
      }
      return {
        matcher: new Minimatch(pattern, { dot: true }),
        gmatcher
      };
    }
    function setopts(self, pattern, options16) {
      if (!options16)
        options16 = {};
      if (options16.matchBase && pattern.indexOf("/") === -1) {
        if (options16.noglobstar) {
          throw new Error("base matching requires globstar");
        }
        pattern = "**/" + pattern;
      }
      self.silent = !!options16.silent;
      self.pattern = pattern;
      self.strict = options16.strict !== false;
      self.realpath = !!options16.realpath;
      self.realpathCache = options16.realpathCache || Object.create(null);
      self.follow = !!options16.follow;
      self.dot = !!options16.dot;
      self.mark = !!options16.mark;
      self.nodir = !!options16.nodir;
      if (self.nodir)
        self.mark = true;
      self.sync = !!options16.sync;
      self.nounique = !!options16.nounique;
      self.nonull = !!options16.nonull;
      self.nosort = !!options16.nosort;
      self.nocase = !!options16.nocase;
      self.stat = !!options16.stat;
      self.noprocess = !!options16.noprocess;
      self.absolute = !!options16.absolute;
      self.fs = options16.fs || fs8;
      self.maxLength = options16.maxLength || Infinity;
      self.cache = options16.cache || Object.create(null);
      self.statCache = options16.statCache || Object.create(null);
      self.symlinks = options16.symlinks || Object.create(null);
      setupIgnores(self, options16);
      self.changedCwd = false;
      var cwd3 = process.cwd();
      if (!ownProp(options16, "cwd"))
        self.cwd = cwd3;
      else {
        self.cwd = path60.resolve(options16.cwd);
        self.changedCwd = self.cwd !== cwd3;
      }
      self.root = options16.root || path60.resolve(self.cwd, "/");
      self.root = path60.resolve(self.root);
      if (process.platform === "win32")
        self.root = self.root.replace(/\\/g, "/");
      self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
      if (process.platform === "win32")
        self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
      self.nomount = !!options16.nomount;
      options16.nonegate = true;
      options16.nocomment = true;
      self.minimatch = new Minimatch(pattern, options16);
      self.options = self.minimatch.options;
    }
    function finish(self) {
      var nou = self.nounique;
      var all = nou ? [] : Object.create(null);
      for (var i = 0, l = self.matches.length; i < l; i++) {
        var matches = self.matches[i];
        if (!matches || Object.keys(matches).length === 0) {
          if (self.nonull) {
            var literal = self.minimatch.globSet[i];
            if (nou)
              all.push(literal);
            else
              all[literal] = true;
          }
        } else {
          var m = Object.keys(matches);
          if (nou)
            all.push.apply(all, m);
          else
            m.forEach(function(m2) {
              all[m2] = true;
            });
        }
      }
      if (!nou)
        all = Object.keys(all);
      if (!self.nosort)
        all = all.sort(alphasort);
      if (self.mark) {
        for (var i = 0; i < all.length; i++) {
          all[i] = self._mark(all[i]);
        }
        if (self.nodir) {
          all = all.filter(function(e) {
            var notDir = !/\/$/.test(e);
            var c = self.cache[e] || self.cache[makeAbs(self, e)];
            if (notDir && c)
              notDir = c !== "DIR" && !Array.isArray(c);
            return notDir;
          });
        }
      }
      if (self.ignore.length)
        all = all.filter(function(m2) {
          return !isIgnored(self, m2);
        });
      self.found = all;
    }
    function mark(self, p) {
      var abs = makeAbs(self, p);
      var c = self.cache[abs];
      var m = p;
      if (c) {
        var isDir = c === "DIR" || Array.isArray(c);
        var slash = p.slice(-1) === "/";
        if (isDir && !slash)
          m += "/";
        else if (!isDir && slash)
          m = m.slice(0, -1);
        if (m !== p) {
          var mabs = makeAbs(self, m);
          self.statCache[mabs] = self.statCache[abs];
          self.cache[mabs] = self.cache[abs];
        }
      }
      return m;
    }
    function makeAbs(self, f) {
      var abs = f;
      if (f.charAt(0) === "/") {
        abs = path60.join(self.root, f);
      } else if (isAbsolute(f) || f === "") {
        abs = f;
      } else if (self.changedCwd) {
        abs = path60.resolve(self.cwd, f);
      } else {
        abs = path60.resolve(f);
      }
      if (process.platform === "win32")
        abs = abs.replace(/\\/g, "/");
      return abs;
    }
    function isIgnored(self, path61) {
      if (!self.ignore.length)
        return false;
      return self.ignore.some(function(item) {
        return item.matcher.match(path61) || !!(item.gmatcher && item.gmatcher.match(path61));
      });
    }
    function childrenIgnored(self, path61) {
      if (!self.ignore.length)
        return false;
      return self.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path61));
      });
    }
  }
});

// node_modules/glob/sync.js
var require_sync = __commonJS({
  "node_modules/glob/sync.js"(exports2, module2) {
    init_cjs_shims();
    module2.exports = globSync;
    globSync.GlobSync = GlobSync;
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var Glob = require_glob().Glob;
    var util = require("util");
    var path60 = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    function globSync(pattern, options16) {
      if (typeof options16 === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      return new GlobSync(pattern, options16).found;
    }
    function GlobSync(pattern, options16) {
      if (!pattern)
        throw new Error("must provide pattern");
      if (typeof options16 === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      if (!(this instanceof GlobSync))
        return new GlobSync(pattern, options16);
      setopts(this, pattern, options16);
      if (this.noprocess)
        return this;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false);
      }
      this._finish();
    }
    GlobSync.prototype._finish = function() {
      assert(this instanceof GlobSync);
      if (this.realpath) {
        var self = this;
        this.matches.forEach(function(matchset, index) {
          var set2 = self.matches[index] = Object.create(null);
          for (var p in matchset) {
            try {
              p = self._makeAbs(p);
              var real = rp.realpathSync(p, self.realpathCache);
              set2[real] = true;
            } catch (er) {
              if (er.syscall === "stat")
                set2[self._makeAbs(p)] = true;
              else
                throw er;
            }
          }
        });
      }
      common.finish(this);
    };
    GlobSync.prototype._process = function(pattern, index, inGlobStar) {
      assert(this instanceof GlobSync);
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return;
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
    };
    GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return;
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix.slice(-1) !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path60.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return;
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix)
          newPattern = [prefix, e];
        else
          newPattern = [e];
        this._process(newPattern.concat(remain), index, inGlobStar);
      }
    };
    GlobSync.prototype._emitMatch = function(index, e) {
      if (isIgnored(this, e))
        return;
      var abs = this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute) {
        e = abs;
      }
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      if (this.stat)
        this._stat(e);
    };
    GlobSync.prototype._readdirInGlobStar = function(abs) {
      if (this.follow)
        return this._readdir(abs, false);
      var entries;
      var lstat;
      var stat2;
      try {
        lstat = this.fs.lstatSync(abs);
      } catch (er) {
        if (er.code === "ENOENT") {
          return null;
        }
      }
      var isSym = lstat && lstat.isSymbolicLink();
      this.symlinks[abs] = isSym;
      if (!isSym && lstat && !lstat.isDirectory())
        this.cache[abs] = "FILE";
      else
        entries = this._readdir(abs, false);
      return entries;
    };
    GlobSync.prototype._readdir = function(abs, inGlobStar) {
      var entries;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return null;
        if (Array.isArray(c))
          return c;
      }
      try {
        return this._readdirEntries(abs, this.fs.readdirSync(abs));
      } catch (er) {
        this._readdirError(abs, er);
        return null;
      }
    };
    GlobSync.prototype._readdirEntries = function(abs, entries) {
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return entries;
    };
    GlobSync.prototype._readdirError = function(f, er) {
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            throw error;
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict)
            throw er;
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
    };
    GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false);
      var len = entries.length;
      var isSym = this.symlinks[abs];
      if (isSym && inGlobStar)
        return;
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true);
      }
    };
    GlobSync.prototype._processSimple = function(prefix, index) {
      var exists3 = this._stat(prefix);
      if (!this.matches[index])
        this.matches[index] = Object.create(null);
      if (!exists3)
        return;
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path60.join(this.root, prefix);
        } else {
          prefix = path60.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
    };
    GlobSync.prototype._stat = function(f) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return false;
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return c;
        if (needDir && c === "FILE")
          return false;
      }
      var exists3;
      var stat2 = this.statCache[abs];
      if (!stat2) {
        var lstat;
        try {
          lstat = this.fs.lstatSync(abs);
        } catch (er) {
          if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
            this.statCache[abs] = false;
            return false;
          }
        }
        if (lstat && lstat.isSymbolicLink()) {
          try {
            stat2 = this.fs.statSync(abs);
          } catch (er) {
            stat2 = lstat;
          }
        } else {
          stat2 = lstat;
        }
      }
      this.statCache[abs] = stat2;
      var c = true;
      if (stat2)
        c = stat2.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return false;
      return c;
    };
    GlobSync.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    GlobSync.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports2, module2) {
    init_cjs_shims();
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports2, module2) {
    init_cjs_shims();
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/inflight/inflight.js
var require_inflight = __commonJS({
  "node_modules/inflight/inflight.js"(exports2, module2) {
    init_cjs_shims();
    var wrappy = require_wrappy();
    var reqs = Object.create(null);
    var once = require_once();
    module2.exports = wrappy(inflight);
    function inflight(key, cb) {
      if (reqs[key]) {
        reqs[key].push(cb);
        return null;
      } else {
        reqs[key] = [cb];
        return makeres(key);
      }
    }
    function makeres(key) {
      return once(function RES() {
        var cbs = reqs[key];
        var len = cbs.length;
        var args = slice(arguments);
        try {
          for (var i = 0; i < len; i++) {
            cbs[i].apply(null, args);
          }
        } finally {
          if (cbs.length > len) {
            cbs.splice(0, len);
            process.nextTick(function() {
              RES.apply(null, args);
            });
          } else {
            delete reqs[key];
          }
        }
      });
    }
    function slice(args) {
      var length = args.length;
      var array = [];
      for (var i = 0; i < length; i++)
        array[i] = args[i];
      return array;
    }
  }
});

// node_modules/glob/glob.js
var require_glob = __commonJS({
  "node_modules/glob/glob.js"(exports2, module2) {
    init_cjs_shims();
    module2.exports = glob;
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var inherits = require_inherits();
    var EE = require("events").EventEmitter;
    var path60 = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var globSync = require_sync();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var inflight = require_inflight();
    var util = require("util");
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    var once = require_once();
    function glob(pattern, options16, cb) {
      if (typeof options16 === "function")
        cb = options16, options16 = {};
      if (!options16)
        options16 = {};
      if (options16.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return globSync(pattern, options16);
      }
      return new Glob(pattern, options16, cb);
    }
    glob.sync = globSync;
    var GlobSync = glob.GlobSync = globSync.GlobSync;
    glob.glob = glob;
    function extend(origin, add) {
      if (add === null || typeof add !== "object") {
        return origin;
      }
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    }
    glob.hasMagic = function(pattern, options_) {
      var options16 = extend({}, options_);
      options16.noprocess = true;
      var g = new Glob(pattern, options16);
      var set2 = g.minimatch.set;
      if (!pattern)
        return false;
      if (set2.length > 1)
        return true;
      for (var j = 0; j < set2[0].length; j++) {
        if (typeof set2[0][j] !== "string")
          return true;
      }
      return false;
    };
    glob.Glob = Glob;
    inherits(Glob, EE);
    function Glob(pattern, options16, cb) {
      if (typeof options16 === "function") {
        cb = options16;
        options16 = null;
      }
      if (options16 && options16.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return new GlobSync(pattern, options16);
      }
      if (!(this instanceof Glob))
        return new Glob(pattern, options16, cb);
      setopts(this, pattern, options16);
      this._didRealPath = false;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      if (typeof cb === "function") {
        cb = once(cb);
        this.on("error", cb);
        this.on("end", function(matches) {
          cb(null, matches);
        });
      }
      var self = this;
      this._processing = 0;
      this._emitQueue = [];
      this._processQueue = [];
      this.paused = false;
      if (this.noprocess)
        return this;
      if (n === 0)
        return done();
      var sync8 = true;
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false, done);
      }
      sync8 = false;
      function done() {
        --self._processing;
        if (self._processing <= 0) {
          if (sync8) {
            process.nextTick(function() {
              self._finish();
            });
          } else {
            self._finish();
          }
        }
      }
    }
    Glob.prototype._finish = function() {
      assert(this instanceof Glob);
      if (this.aborted)
        return;
      if (this.realpath && !this._didRealpath)
        return this._realpath();
      common.finish(this);
      this.emit("end", this.found);
    };
    Glob.prototype._realpath = function() {
      if (this._didRealpath)
        return;
      this._didRealpath = true;
      var n = this.matches.length;
      if (n === 0)
        return this._finish();
      var self = this;
      for (var i = 0; i < this.matches.length; i++)
        this._realpathSet(i, next);
      function next() {
        if (--n === 0)
          self._finish();
      }
    };
    Glob.prototype._realpathSet = function(index, cb) {
      var matchset = this.matches[index];
      if (!matchset)
        return cb();
      var found = Object.keys(matchset);
      var self = this;
      var n = found.length;
      if (n === 0)
        return cb();
      var set2 = this.matches[index] = Object.create(null);
      found.forEach(function(p, i) {
        p = self._makeAbs(p);
        rp.realpath(p, self.realpathCache, function(er, real) {
          if (!er)
            set2[real] = true;
          else if (er.syscall === "stat")
            set2[p] = true;
          else
            self.emit("error", er);
          if (--n === 0) {
            self.matches[index] = set2;
            cb();
          }
        });
      });
    };
    Glob.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    Glob.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
    Glob.prototype.abort = function() {
      this.aborted = true;
      this.emit("abort");
    };
    Glob.prototype.pause = function() {
      if (!this.paused) {
        this.paused = true;
        this.emit("pause");
      }
    };
    Glob.prototype.resume = function() {
      if (this.paused) {
        this.emit("resume");
        this.paused = false;
        if (this._emitQueue.length) {
          var eq = this._emitQueue.slice(0);
          this._emitQueue.length = 0;
          for (var i = 0; i < eq.length; i++) {
            var e = eq[i];
            this._emitMatch(e[0], e[1]);
          }
        }
        if (this._processQueue.length) {
          var pq = this._processQueue.slice(0);
          this._processQueue.length = 0;
          for (var i = 0; i < pq.length; i++) {
            var p = pq[i];
            this._processing--;
            this._process(p[0], p[1], p[2], p[3]);
          }
        }
      }
    };
    Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
      assert(this instanceof Glob);
      assert(typeof cb === "function");
      if (this.aborted)
        return;
      this._processing++;
      if (this.paused) {
        this._processQueue.push([pattern, index, inGlobStar, cb]);
        return;
      }
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index, cb);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return cb();
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
    };
    Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return cb();
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path60.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return cb();
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix) {
          if (prefix !== "/")
            e = prefix + "/" + e;
          else
            e = prefix + e;
        }
        this._process([e].concat(remain), index, inGlobStar, cb);
      }
      cb();
    };
    Glob.prototype._emitMatch = function(index, e) {
      if (this.aborted)
        return;
      if (isIgnored(this, e))
        return;
      if (this.paused) {
        this._emitQueue.push([index, e]);
        return;
      }
      var abs = isAbsolute(e) ? e : this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute)
        e = abs;
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      var st = this.statCache[abs];
      if (st)
        this.emit("stat", e, st);
      this.emit("match", e);
    };
    Glob.prototype._readdirInGlobStar = function(abs, cb) {
      if (this.aborted)
        return;
      if (this.follow)
        return this._readdir(abs, false, cb);
      var lstatkey = "lstat\0" + abs;
      var self = this;
      var lstatcb = inflight(lstatkey, lstatcb_);
      if (lstatcb)
        self.fs.lstat(abs, lstatcb);
      function lstatcb_(er, lstat) {
        if (er && er.code === "ENOENT")
          return cb();
        var isSym = lstat && lstat.isSymbolicLink();
        self.symlinks[abs] = isSym;
        if (!isSym && lstat && !lstat.isDirectory()) {
          self.cache[abs] = "FILE";
          cb();
        } else
          self._readdir(abs, false, cb);
      }
    };
    Glob.prototype._readdir = function(abs, inGlobStar, cb) {
      if (this.aborted)
        return;
      cb = inflight("readdir\0" + abs + "\0" + inGlobStar, cb);
      if (!cb)
        return;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs, cb);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return cb();
        if (Array.isArray(c))
          return cb(null, c);
      }
      var self = this;
      self.fs.readdir(abs, readdirCb(this, abs, cb));
    };
    function readdirCb(self, abs, cb) {
      return function(er, entries) {
        if (er)
          self._readdirError(abs, er, cb);
        else
          self._readdirEntries(abs, entries, cb);
      };
    }
    Glob.prototype._readdirEntries = function(abs, entries, cb) {
      if (this.aborted)
        return;
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return cb(null, entries);
    };
    Glob.prototype._readdirError = function(f, er, cb) {
      if (this.aborted)
        return;
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            this.emit("error", error);
            this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict) {
            this.emit("error", er);
            this.abort();
          }
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
      return cb();
    };
    Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false, cb);
      var isSym = this.symlinks[abs];
      var len = entries.length;
      if (isSym && inGlobStar)
        return cb();
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true, cb);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true, cb);
      }
      cb();
    };
    Glob.prototype._processSimple = function(prefix, index, cb) {
      var self = this;
      this._stat(prefix, function(er, exists3) {
        self._processSimple2(prefix, index, er, exists3, cb);
      });
    };
    Glob.prototype._processSimple2 = function(prefix, index, er, exists3, cb) {
      if (!this.matches[index])
        this.matches[index] = Object.create(null);
      if (!exists3)
        return cb();
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path60.join(this.root, prefix);
        } else {
          prefix = path60.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
      cb();
    };
    Glob.prototype._stat = function(f, cb) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return cb();
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return cb(null, c);
        if (needDir && c === "FILE")
          return cb();
      }
      var exists3;
      var stat2 = this.statCache[abs];
      if (stat2 !== void 0) {
        if (stat2 === false)
          return cb(null, stat2);
        else {
          var type = stat2.isDirectory() ? "DIR" : "FILE";
          if (needDir && type === "FILE")
            return cb();
          else
            return cb(null, type, stat2);
        }
      }
      var self = this;
      var statcb = inflight("stat\0" + abs, lstatcb_);
      if (statcb)
        self.fs.lstat(abs, statcb);
      function lstatcb_(er, lstat) {
        if (lstat && lstat.isSymbolicLink()) {
          return self.fs.stat(abs, function(er2, stat3) {
            if (er2)
              self._stat2(f, abs, null, lstat, cb);
            else
              self._stat2(f, abs, er2, stat3, cb);
          });
        } else {
          self._stat2(f, abs, er, lstat, cb);
        }
      }
    };
    Glob.prototype._stat2 = function(f, abs, er, stat2, cb) {
      if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
        this.statCache[abs] = false;
        return cb();
      }
      var needDir = f.slice(-1) === "/";
      this.statCache[abs] = stat2;
      if (abs.slice(-1) === "/" && stat2 && !stat2.isDirectory())
        return cb(null, false, stat2);
      var c = true;
      if (stat2)
        c = stat2.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return cb();
      return cb(null, c, stat2);
    };
  }
});

// node_modules/shelljs/src/common.js
var require_common2 = __commonJS({
  "node_modules/shelljs/src/common.js"(exports2) {
    init_cjs_shims();
    "use strict";
    var os2 = require("os");
    var fs8 = require("fs");
    var glob = require_glob();
    var shell = require_shell();
    var shellMethods = Object.create(shell);
    exports2.extend = Object.assign;
    var isElectron = Boolean(process.versions.electron);
    var DEFAULT_CONFIG = {
      fatal: false,
      globOptions: {},
      maxdepth: 255,
      noglob: false,
      silent: false,
      verbose: false,
      execPath: null,
      bufLength: 64 * 1024
    };
    var config = {
      reset: function() {
        Object.assign(this, DEFAULT_CONFIG);
        if (!isElectron) {
          this.execPath = process.execPath;
        }
      },
      resetForTesting: function() {
        this.reset();
        this.silent = true;
      }
    };
    config.reset();
    exports2.config = config;
    var state = {
      error: null,
      errorCode: 0,
      currentCmd: "shell.js"
    };
    exports2.state = state;
    delete process.env.OLDPWD;
    function isObject(a) {
      return typeof a === "object" && a !== null;
    }
    exports2.isObject = isObject;
    function log() {
      if (!config.silent) {
        console.error.apply(console, arguments);
      }
    }
    exports2.log = log;
    function convertErrorOutput(msg) {
      if (typeof msg !== "string") {
        throw new TypeError("input must be a string");
      }
      return msg.replace(/\\/g, "/");
    }
    exports2.convertErrorOutput = convertErrorOutput;
    function error(msg, _code, options16) {
      if (typeof msg !== "string")
        throw new Error("msg must be a string");
      var DEFAULT_OPTIONS = {
        continue: false,
        code: 1,
        prefix: state.currentCmd + ": ",
        silent: false
      };
      if (typeof _code === "number" && isObject(options16)) {
        options16.code = _code;
      } else if (isObject(_code)) {
        options16 = _code;
      } else if (typeof _code === "number") {
        options16 = { code: _code };
      } else if (typeof _code !== "number") {
        options16 = {};
      }
      options16 = Object.assign({}, DEFAULT_OPTIONS, options16);
      if (!state.errorCode)
        state.errorCode = options16.code;
      var logEntry = convertErrorOutput(options16.prefix + msg);
      state.error = state.error ? state.error + "\n" : "";
      state.error += logEntry;
      if (config.fatal)
        throw new Error(logEntry);
      if (msg.length > 0 && !options16.silent)
        log(logEntry);
      if (!options16.continue) {
        throw {
          msg: "earlyExit",
          retValue: new ShellString("", state.error, state.errorCode)
        };
      }
    }
    exports2.error = error;
    function ShellString(stdout, stderr, code) {
      var that;
      if (stdout instanceof Array) {
        that = stdout;
        that.stdout = stdout.join("\n");
        if (stdout.length > 0)
          that.stdout += "\n";
      } else {
        that = new String(stdout);
        that.stdout = stdout;
      }
      that.stderr = stderr;
      that.code = code;
      pipeMethods.forEach(function(cmd) {
        that[cmd] = shellMethods[cmd].bind(that);
      });
      return that;
    }
    exports2.ShellString = ShellString;
    function parseOptions(opt, map, errorOptions) {
      if (typeof opt !== "string" && !isObject(opt)) {
        throw new Error("options must be strings or key-value pairs");
      } else if (!isObject(map)) {
        throw new Error("parseOptions() internal error: map must be an object");
      } else if (errorOptions && !isObject(errorOptions)) {
        throw new Error("parseOptions() internal error: errorOptions must be object");
      }
      if (opt === "--") {
        return {};
      }
      var options16 = {};
      Object.keys(map).forEach(function(letter) {
        var optName = map[letter];
        if (optName[0] !== "!") {
          options16[optName] = false;
        }
      });
      if (opt === "")
        return options16;
      if (typeof opt === "string") {
        if (opt[0] !== "-") {
          throw new Error("Options string must start with a '-'");
        }
        var chars = opt.slice(1).split("");
        chars.forEach(function(c) {
          if (c in map) {
            var optionName = map[c];
            if (optionName[0] === "!") {
              options16[optionName.slice(1)] = false;
            } else {
              options16[optionName] = true;
            }
          } else {
            error("option not recognized: " + c, errorOptions || {});
          }
        });
      } else {
        Object.keys(opt).forEach(function(key) {
          var c = key[1];
          if (c in map) {
            var optionName = map[c];
            options16[optionName] = opt[key];
          } else {
            error("option not recognized: " + c, errorOptions || {});
          }
        });
      }
      return options16;
    }
    exports2.parseOptions = parseOptions;
    function expand(list) {
      if (!Array.isArray(list)) {
        throw new TypeError("must be an array");
      }
      var expanded = [];
      list.forEach(function(listEl) {
        if (typeof listEl !== "string") {
          expanded.push(listEl);
        } else {
          var ret;
          try {
            ret = glob.sync(listEl, config.globOptions);
            ret = ret.length > 0 ? ret : [listEl];
          } catch (e) {
            ret = [listEl];
          }
          expanded = expanded.concat(ret);
        }
      });
      return expanded;
    }
    exports2.expand = expand;
    var buffer = typeof Buffer.alloc === "function" ? function(len) {
      return Buffer.alloc(len || config.bufLength);
    } : function(len) {
      return new Buffer(len || config.bufLength);
    };
    exports2.buffer = buffer;
    function unlinkSync(file) {
      try {
        fs8.unlinkSync(file);
      } catch (e) {
        if (e.code === "EPERM") {
          fs8.chmodSync(file, "0666");
          fs8.unlinkSync(file);
        } else {
          throw e;
        }
      }
    }
    exports2.unlinkSync = unlinkSync;
    function statFollowLinks() {
      return fs8.statSync.apply(fs8, arguments);
    }
    exports2.statFollowLinks = statFollowLinks;
    function statNoFollowLinks() {
      return fs8.lstatSync.apply(fs8, arguments);
    }
    exports2.statNoFollowLinks = statNoFollowLinks;
    function randomFileName() {
      function randomHash(count) {
        if (count === 1) {
          return parseInt(16 * Math.random(), 10).toString(16);
        }
        var hash = "";
        for (var i = 0; i < count; i++) {
          hash += randomHash(1);
        }
        return hash;
      }
      return "shelljs_" + randomHash(20);
    }
    exports2.randomFileName = randomFileName;
    function wrap(cmd, fn, options16) {
      options16 = options16 || {};
      return function() {
        var retValue = null;
        state.currentCmd = cmd;
        state.error = null;
        state.errorCode = 0;
        try {
          var args = [].slice.call(arguments, 0);
          if (config.verbose) {
            console.error.apply(console, [cmd].concat(args));
          }
          state.pipedValue = this && typeof this.stdout === "string" ? this.stdout : "";
          if (options16.unix === false) {
            retValue = fn.apply(this, args);
          } else {
            if (isObject(args[0]) && args[0].constructor.name === "Object") {
            } else if (args.length === 0 || typeof args[0] !== "string" || args[0].length <= 1 || args[0][0] !== "-") {
              args.unshift("");
            }
            args = args.reduce(function(accum, cur) {
              if (Array.isArray(cur)) {
                return accum.concat(cur);
              }
              accum.push(cur);
              return accum;
            }, []);
            args = args.map(function(arg) {
              if (isObject(arg) && arg.constructor.name === "String") {
                return arg.toString();
              }
              return arg;
            });
            var homeDir = os2.homedir();
            args = args.map(function(arg) {
              if (typeof arg === "string" && arg.slice(0, 2) === "~/" || arg === "~") {
                return arg.replace(/^~/, homeDir);
              }
              return arg;
            });
            if (!config.noglob && options16.allowGlobbing === true) {
              args = args.slice(0, options16.globStart).concat(expand(args.slice(options16.globStart)));
            }
            try {
              if (isObject(options16.cmdOptions)) {
                args[0] = parseOptions(args[0], options16.cmdOptions);
              }
              retValue = fn.apply(this, args);
            } catch (e) {
              if (e.msg === "earlyExit") {
                retValue = e.retValue;
              } else {
                throw e;
              }
            }
          }
        } catch (e) {
          if (!state.error) {
            e.name = "ShellJSInternalError";
            throw e;
          }
          if (config.fatal)
            throw e;
        }
        if (options16.wrapOutput && (typeof retValue === "string" || Array.isArray(retValue))) {
          retValue = new ShellString(retValue, state.error, state.errorCode);
        }
        state.currentCmd = "shell.js";
        return retValue;
      };
    }
    exports2.wrap = wrap;
    function _readFromPipe() {
      return state.pipedValue;
    }
    exports2.readFromPipe = _readFromPipe;
    var DEFAULT_WRAP_OPTIONS = {
      allowGlobbing: true,
      canReceivePipe: false,
      cmdOptions: null,
      globStart: 1,
      pipeOnly: false,
      wrapOutput: true,
      unix: true
    };
    var pipeMethods = [];
    function _register(name, implementation, wrapOptions) {
      wrapOptions = wrapOptions || {};
      Object.keys(wrapOptions).forEach(function(option) {
        if (!DEFAULT_WRAP_OPTIONS.hasOwnProperty(option)) {
          throw new Error("Unknown option '" + option + "'");
        }
        if (typeof wrapOptions[option] !== typeof DEFAULT_WRAP_OPTIONS[option]) {
          throw new TypeError("Unsupported type '" + typeof wrapOptions[option] + "' for option '" + option + "'");
        }
      });
      wrapOptions = Object.assign({}, DEFAULT_WRAP_OPTIONS, wrapOptions);
      if (shell.hasOwnProperty(name)) {
        throw new Error("Command `" + name + "` already exists");
      }
      if (wrapOptions.pipeOnly) {
        wrapOptions.canReceivePipe = true;
        shellMethods[name] = wrap(name, implementation, wrapOptions);
      } else {
        shell[name] = wrap(name, implementation, wrapOptions);
      }
      if (wrapOptions.canReceivePipe) {
        pipeMethods.push(name);
      }
    }
    exports2.register = _register;
  }
});

// node_modules/shelljs/commands.js
var require_commands = __commonJS({
  "node_modules/shelljs/commands.js"(exports2, module2) {
    init_cjs_shims();
    module2.exports = [
      "cat",
      "cd",
      "chmod",
      "cp",
      "dirs",
      "echo",
      "exec",
      "find",
      "grep",
      "head",
      "ln",
      "ls",
      "mkdir",
      "mv",
      "pwd",
      "rm",
      "sed",
      "set",
      "sort",
      "tail",
      "tempdir",
      "test",
      "to",
      "toEnd",
      "touch",
      "uniq",
      "which"
    ];
  }
});

// node_modules/shelljs/src/error.js
var require_error = __commonJS({
  "node_modules/shelljs/src/error.js"(exports2, module2) {
    init_cjs_shims();
    var common = require_common2();
    function error() {
      return common.state.error;
    }
    module2.exports = error;
  }
});

// node_modules/shelljs/shell.js
var require_shell = __commonJS({
  "node_modules/shelljs/shell.js"(exports2) {
    init_cjs_shims();
    var common = require_common2();
    require_commands().forEach(function(command24) {
      require("./src/" + command24);
    });
    exports2.exit = process.exit;
    exports2.error = require_error();
    exports2.ShellString = common.ShellString;
    exports2.env = process.env;
    exports2.config = common.config;
  }
});

// src/dd.ts
init_cjs_shims();
var import_chalk111 = __toModule(require("chalk"));
var import_command_line_args2 = __toModule(require("command-line-args"));
var process6 = __toModule(require("process"));

// src/shared/core/index.ts
init_cjs_shims();

// src/shared/core/convertOptionsToArray.ts
init_cjs_shims();
function convertOptionsToArray(input) {
  return Object.keys(input).map((key) => {
    return __spreadValues({ name: key }, input[key]);
  });
}

// src/shared/core/help.ts
init_cjs_shims();
var import_chalk62 = __toModule(require("chalk"));
var import_command_line_usage = __toModule(require("command-line-usage"));

// src/shared/ui/index.ts
init_cjs_shims();

// src/shared/ui/consoleDimensions.ts
init_cjs_shims();
var import_async_shelljs = __toModule(require("async-shelljs"));
function consoleDimensions() {
  let [width, height] = (0, import_async_shelljs.exec)("echo $(tput cols),$(tput lines)", {
    silent: true
  }).split(",").map((i) => Number(i));
  width = process.stdout.columns || width;
  height = process.stdout.rows || height;
  return { height, width };
}

// src/shared/ui/durationSince.ts
init_cjs_shims();
var import_date_fns = __toModule(require("date-fns"));

// src/shared/ui/emoji.ts
init_cjs_shims();
var emoji;
(function(emoji2) {
  emoji2["rocket"] = "\u{1F680}";
  emoji2["poop"] = "\u{1F4A9}";
  emoji2["shocked"] = "\u{1F632}";
  emoji2["thumbsUp"] = "\u{1F44D}";
  emoji2["angry"] = "\u{1F621}";
  emoji2["robot"] = "\u{1F916}";
  emoji2["eyeball"] = "\u{1F441}";
  emoji2["eyeballs"] = "\u{1F440}";
  emoji2["party"] = "\u{1F389}";
  emoji2["checkmark"] = "\u{1F389}";
  emoji2["circleEmpty"] = "\u25CB";
  emoji2["circleFilled"] = "\u25CB";
  emoji2["run"] = "\u{1F3C3}";
  emoji2["warn"] = "\u26A0\uFE0F";
  emoji2["hazzard"] = "\u2622\uFE0F";
})(emoji || (emoji = {}));

// src/shared/ui/highlightFilepath.ts
init_cjs_shims();
var import_chalk = __toModule(require("chalk"));
function highlightFilepath(fp, color = ["dim", "blueBright"], highlight = ["bold", "blueBright"]) {
  if (!Array.isArray(color)) {
    color = [void 0, color];
  }
  if (!Array.isArray(highlight)) {
    highlight = [void 0, highlight];
  }
  const [modifier, foreground] = color;
  const [highModifier, highForeground] = highlight;
  const parts = fp.split(/[/\\]/);
  const file = parts.pop();
  const path60 = parts.join("/").replace(/^(\S)/, "./$1");
  const filePath = modifier ? import_chalk.default`{${modifier} {${foreground} ${path60 + "/"}}}` : import_chalk.default`{${foreground} ${path60 + "/"}}`;
  const fileName = highModifier ? import_chalk.default`{${highModifier} {${highForeground} ${file}}}` : import_chalk.default`{${highForeground} ${file}}`;
  return `${filePath}${fileName}`;
}

// src/shared/ui/inverted.ts
init_cjs_shims();
var import_chalk2 = __toModule(require("chalk"));
var inverted = import_chalk2.default.black.bgHex("A9A9A9");

// src/shared/ui/numberWithCommas.ts
init_cjs_shims();

// src/shared/ui/styles.ts
init_cjs_shims();
var import_chalk3 = __toModule(require("chalk"));
function formatNumber(num, decimalPlaces = 0) {
  const multiplier = Math.pow(10, decimalPlaces);
  const rounded = Math.round(num * multiplier) / multiplier;
  return rounded.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function green(...thingy) {
  const stringThingy = thingy.map((i) => typeof i === "number" ? formatNumber(i) : i).join("");
  return import_chalk3.default`{bold {green ${stringThingy}}}`;
}
function dim(thingy) {
  if (typeof thingy === "number") {
    thingy = formatNumber(thingy);
  }
  return import_chalk3.default`{dim ${thingy}}`;
}

// src/shared/ui/toTable.ts
init_cjs_shims();
var import_chalk4 = __toModule(require("chalk"));
var import_table = __toModule(require("table"));

// src/errors/index.ts
init_cjs_shims();

// src/errors/DevopsError.ts
init_cjs_shims();
var import_common_types = __toModule(require("common-types"));
var DevopsError = class extends Error {
  constructor(message, classification = "do-devops/unknown") {
    super(message);
    this.kind = "DevopsError";
    const parts = classification.split("/");
    const [type, subType] = parts.length === 1 ? ["devops", parts[0]] : parts;
    this.name = `${type}/${subType}`;
    this.code = subType;
    this.classification = (0, import_common_types.isTypeSubtype)(classification) ? classification : `do-devops/${classification.replace(/\//g, "")}`;
  }
};

// src/shared/ui/toTable.ts
function isAdvancedColumn(col) {
  return col !== null && typeof col === "object";
}
function isColumnTuple(col) {
  return Array.isArray(col);
}
function headerCol(name) {
  return import_chalk4.default.bold.blue(name);
}
function toTable(data, ...columns) {
  const ui = consoleDimensions();
  const hiddenColumns = [];
  const headerRow = [];
  const colConfig = [];
  for (const col of columns) {
    if (isAdvancedColumn(col)) {
      if (col.minWidth === void 0 || col.minWidth < ui.width) {
        headerRow.push(headerCol(col.name || col.col));
        if (col.format) {
          colConfig.push(col.format);
        }
      } else {
        hiddenColumns.push(col.name || col.col);
      }
    } else {
      headerRow.push(headerCol(Array.isArray(col) ? col[0] : col));
      colConfig.push({});
    }
  }
  const rows = data.map((rowData) => {
    const row = [];
    for (const col of columns) {
      if (isColumnTuple(col)) {
        const [prop, fn] = col;
        row.push(fn(rowData[prop]));
      } else if (isAdvancedColumn(col)) {
        if (col.minWidth === void 0 || col.minWidth < ui.width) {
          row.push(col.formula ? col.formula(rowData[col.col]) : rowData[col.col]);
        }
      } else {
        row.push(rowData[col]);
      }
    }
    return row;
  });
  const hiddenColMessage = hiddenColumns.length > 0 ? import_chalk4.default`\n\n{gray - {bold Note:} some columns hidden due to available width [{dim ${ui.width}}]: {italic ${hiddenColumns.join(", ")}}}` : "";
  const tableData = [headerRow, ...rows];
  try {
    return (0, import_table.table)(tableData, { columns: colConfig }) + hiddenColMessage;
  } catch (error) {
    const errMessage = error.message === "Table must have a consistent number of cells." ? `     - table row lengths are: 
${tableData.map((i) => i.length)}` : `- ${emoji.poop} problems building table: ${error.message}`;
    throw new DevopsError(errMessage, "ui/invalid-table-data");
  }
}

// src/shared/ui/truncate.ts
init_cjs_shims();

// src/shared/ui/wordWrap.ts
init_cjs_shims();
var import_smartwrap = __toModule(require("smartwrap"));
function wordWrap(text, options16 = {}) {
  text = options16.removeExistingCR ? text.replace(/\n/g, "") : text;
  return (0, import_smartwrap.default)(text, { width: options16.wrapDistance || 80 });
}

// src/shared/core/util/index.ts
init_cjs_shims();

// src/shared/core/util/commandAnnouncement.ts
init_cjs_shims();
var import_chalk60 = __toModule(require("chalk"));

// src/shared/core/util/doDevopsVersion.ts
init_cjs_shims();
var import_chalk59 = __toModule(require("chalk"));

// src/shared/file/index.ts
init_cjs_shims();

// src/shared/file/createTsFile.ts
init_cjs_shims();
function createTsFile() {
  const enums = [];
  const enumTemplate = (c) => `
  /** 
   * ${c.description}
   */
  export enum ${c.name} {
    ${c.elements.map((e) => `${e.comment ? `/** ${e.comment} */
  ` : ""}${e.el} = "${e.el}"`).join(",\n  ")}
  }
  `;
  const types = [];
  const typeTemplate = (config) => `
  export type ${config.name} = ${config.value};
  `;
  const configurator = {
    addStringEnum(e) {
      enums.push(e);
      return configurator;
    },
    addType(name, value) {
      types.push({ name, value });
      return configurator;
    },
    generate() {
      let content = "";
      for (const e of enums) {
        content += enumTemplate(e);
      }
      for (const t of types) {
        content += typeTemplate(t);
      }
      return content;
    }
  };
  return configurator;
}

// src/shared/file/getDataFiles.ts
init_cjs_shims();
var import_globby = __toModule(require("globby"));
var import_path = __toModule(require("path"));
var import_process = __toModule(require("process"));
function strip(opts) {
  return (results) => {
    if (opts.filterBy) {
      results = results.filter((i) => i.includes(opts.filterBy));
    }
    if (opts.stripFileExtension) {
      results = results.map((i) => i.replace(/(.*)\.\w*$/, "$1"));
    }
    const prefix = import_process.default.cwd() + "/test/data/";
    return results.map((i) => i.replace(prefix, ""));
  };
}
async function getDataFiles(opts = {}) {
  const glob = import_path.default.join(import_process.default.cwd(), "test/data", opts.fileType ? `**/*.${opts.fileType}` : "**/*");
  const results = await (0, import_globby.default)(glob);
  return strip(opts)(results);
}

// src/shared/file/getMonoRepoPackages.ts
init_cjs_shims();
var import_globby9 = __toModule(require("globby"));
var import_path37 = __toModule(require("path"));

// src/shared/npm/index.ts
init_cjs_shims();

// src/shared/npm/timingFromNpmInfo.ts
init_cjs_shims();
var import_native_dash = __toModule(require("native-dash"));

// src/shared/npm/crud/index.ts
init_cjs_shims();

// src/shared/npm/crud/installDevDep.ts
init_cjs_shims();
var import_chalk47 = __toModule(require("chalk"));
var import_shelljs2 = __toModule(require_shell());

// src/shared/observations/index.ts
init_cjs_shims();

// src/shared/observations/determineAccountId.ts
init_cjs_shims();
var import_common_types2 = __toModule(require("common-types"));

// src/shared/aws/index.ts
init_cjs_shims();

// src/shared/aws/addAwsProfile.ts
init_cjs_shims();
var import_path2 = __toModule(require("path"));
var import_fs = __toModule(require("fs"));

// src/shared/aws/askForAwsProfile.ts
init_cjs_shims();
var import_inquirer3 = __toModule(require("inquirer"));

// src/shared/interactive/index.ts
init_cjs_shims();

// src/shared/interactive/askForDataFile.ts
init_cjs_shims();
var import_inquirer = __toModule(require("inquirer"));
async function askForDataFile(listOfFiles) {
  const files = listOfFiles ? listOfFiles : await getDataFiles();
  const question = {
    type: "list",
    name: "file",
    message: "What data file would you like?",
    default: files[0],
    choices: files
  };
  const answer = await import_inquirer.default.prompt(question);
  return answer.file;
}

// src/shared/interactive/general/index.ts
init_cjs_shims();

// src/shared/interactive/general/ask.ts
init_cjs_shims();
var import_inquirer2 = __toModule(require("inquirer"));
async function ask(question) {
  return import_inquirer2.default.prompt([question]);
}

// src/shared/interactive/general/askCheckboxQuestion.ts
init_cjs_shims();
async function askCheckboxQuestion(question, choices, options16 = {}) {
  const q = __spreadValues({
    type: "checkbox",
    name: "checkedValues",
    message: question,
    choices,
    default: options16.default
  }, options16.when ? { when: options16.when } : { when: () => true });
  const answer = await ask(q);
  return answer.checkedValues;
}

// src/shared/interactive/general/askConfirmQuestion.ts
init_cjs_shims();
var askConfirmQuestion = async (question, defaultAnswer = true) => {
  const q = {
    type: "confirm",
    name: "yesOrNo",
    message: wordWrap(question),
    default: defaultAnswer
  };
  const answer = await ask(q);
  return answer.yesOrNo;
};

// src/shared/interactive/general/askForNestedDirectory.ts
init_cjs_shims();
var import_chalk5 = __toModule(require("chalk"));
var import_path3 = __toModule(require("path"));
async function askForNestedDirectory(ask2, options16 = {}) {
  let operatingDir = options16.startDir ? options16.startDir : repoDirectory();
  const dirs = [];
  let choice = "";
  const filter3 = options16.filter || (() => true);
  const COMPLETED = "COMPLETED";
  while (choice !== COMPLETED) {
    const subDirs = dirs.length === 0 && options16.initialChoices ? options16.initialChoices : dirs.length === 0 && options16.leadChoices ? [...new Set([...options16.leadChoices, ...getSubdirectories(operatingDir).filter(filter3)])] : getSubdirectories(operatingDir).filter(filter3);
    if (subDirs.length === 0) {
      choice === COMPLETED;
      break;
    } else {
      choice = dirs.length === 0 ? await askListQuestion(ask2, [...subDirs, COMPLETED]) : await askListQuestion(import_chalk5.default`Thanks. The selected path so far is: {blue ${dirs.join("/")}}\nNow choose either a subdirectory or "COMPLETED" to finish the selection.`, [COMPLETED, ...subDirs]);
      if (choice !== COMPLETED) {
        dirs.push(choice);
        operatingDir = (0, import_path3.join)(operatingDir, `${choice}/`);
        const created = await ensureDirectory(operatingDir);
        if (created) {
          console.log(import_chalk5.default`{dim - the {bold ${choice}} directory {italic didn't exist} so we've created it for you.}`);
          choice = COMPLETED;
        }
      }
    }
  }
  const relativeDirectory = (0, import_path3.relative)(repoDirectory(), operatingDir);
  console.log(import_chalk5.default`{bold {yellow ${options16.name || "Selected Directory"}:} ${relativeDirectory}}`);
  return relativeDirectory;
}

// src/shared/interactive/general/askInputQuestion.ts
init_cjs_shims();
async function askInputQuestion(question, options16 = {}) {
  const q = __spreadValues({
    type: "input",
    name: "inputValue",
    message: question,
    default: options16.default
  }, options16.when ? { when: options16.when } : { when: () => true });
  const answer = await ask(q);
  if (answer.inputValue === "" && options16.acceptEmptyResponse === false) {
    console.log("This question requires a non-empty response!");
    return askInputQuestion(question, options16);
  }
  return answer.inputValue;
}

// src/shared/interactive/general/askListQuestion.ts
init_cjs_shims();
async function askListQuestion(question, choices, options16 = {}) {
  const q = __spreadValues({
    type: "list",
    name: "listValue",
    message: question,
    choices,
    default: options16.default
  }, options16.when ? { when: options16.when } : { when: () => true });
  const answer = await ask(q);
  return answer.listValue;
}

// src/shared/interactive/general/checkboxQuestion.ts
init_cjs_shims();
function checkboxQuestion(q) {
  return __spreadProps(__spreadValues({}, q), {
    type: "checkbox"
  });
}

// src/shared/interactive/general/confirmQuestion.ts
init_cjs_shims();

// src/shared/interactive/general/inputQuestion.ts
init_cjs_shims();

// src/shared/interactive/general/listQuestion.ts
init_cjs_shims();

// src/shared/interactive/specific/index.ts
init_cjs_shims();

// src/shared/interactive/specific/askAboutFileOverride.ts
init_cjs_shims();
var import_chalk6 = __toModule(require("chalk"));
var import_shelljs = __toModule(require_shell());

// src/shared/config/index.ts
init_cjs_shims();

// src/shared/config/getIntegratedConfig.ts
init_cjs_shims();
var import_deepmerge = __toModule(require("deepmerge"));
var import_native_dash2 = __toModule(require("native-dash"));
function getIntegratedConfig() {
  const userConfig = getUserConfig();
  const projectConfig = getProjectConfig();
  if (!userConfig.userConfig && !projectConfig.projectConfig) {
    return { kind: "integrated", ready: false, userConfig: false, projectConfig: false };
  }
  const u = (0, import_native_dash2.omit)(userConfig, "kind");
  const p = (0, import_native_dash2.omit)(projectConfig, "kind");
  const merged = (0, import_deepmerge.default)((0, import_deepmerge.default)(u, p), {
    kind: "integrated",
    ready: userConfig.userConfig || projectConfig.projectConfig
  });
  return merged;
}

// src/shared/config/getProjectConfig.ts
init_cjs_shims();
var import_destr = __toModule(require("destr"));

// src/shared/config/constants.ts
init_cjs_shims();
var CONFIG_FILE = ".do-devops.json";
var DEFAULT_PROJECT_CONFIG = {
  kind: "project",
  projectConfig: true,
  general: {},
  aws: {}
};

// src/shared/config/getProjectConfig.ts
function getProjectConfig() {
  return (0, import_destr.default)(readFile(currentDirectory(CONFIG_FILE))) || {
    projectConfig: false,
    kind: "project"
  };
}

// src/shared/config/getUserConfig.ts
init_cjs_shims();
var import_destr2 = __toModule(require("destr"));
function getUserConfig() {
  return (0, import_destr2.default)(readFile(homeDirectory(CONFIG_FILE))) || {
    userConfig: false,
    kind: "user"
  };
}

// src/shared/config/saveProjectConfig.ts
init_cjs_shims();
var import_deepmerge2 = __toModule(require("deepmerge"));
var import_fs2 = __toModule(require("fs"));
var import_native_dash3 = __toModule(require("native-dash"));
function configMerge(current, updated) {
  return __spreadProps(__spreadValues({}, (0, import_deepmerge2.default)(current, updated)), {
    kind: "project",
    projectConfig: true
  });
}
function configSet(current, dotPath, payload) {
  const config = __spreadProps(__spreadValues({}, current), {
    kind: "project",
    projectConfig: true
  });
  (0, import_native_dash3.set)(current, dotPath, payload);
  return config;
}
async function saveProjectConfig(first2, second) {
  const log = logger();
  let current = getProjectConfig();
  if (!current.projectConfig) {
    current = DEFAULT_PROJECT_CONFIG;
  }
  const newConfig = typeof first2 === "string" ? configSet(current, first2, second) : configMerge(current, first2);
  log.whisper(newConfig);
  (0, import_fs2.writeFileSync)(currentDirectory(CONFIG_FILE), JSON.stringify(newConfig, null, 2), {
    encoding: "utf-8"
  });
  return newConfig;
}

// src/shared/config/saveUserConfig.ts
init_cjs_shims();
var import_deepmerge3 = __toModule(require("deepmerge"));
var import_fs3 = __toModule(require("fs"));
async function saveUserConfig(updated) {
  let current = getUserConfig();
  if (!current.userConfig) {
    current = { kind: "user", userConfig: true, general: {}, aws: {} };
  }
  const newConfig = __spreadProps(__spreadValues({}, (0, import_deepmerge3.default)(current, updated)), { kind: "user", userConfig: true });
  (0, import_fs3.writeFileSync)(homeDirectory(CONFIG_FILE), JSON.stringify(newConfig, null, 2), {
    encoding: "utf-8"
  });
}

// src/shared/interactive/specific/askAboutFileOverride.ts
var answers = [
  { name: "SKIP this file being from being copied", value: "skip" },
  { name: "COPY the template file over repo's version", value: "copy" },
  { name: "SHOW both files in editor", value: "show" },
  { name: "Show DIFFERENCES between files in editor", value: "diff" }
];
async function askAboutFileOverwrite(source, target, opts = new Set()) {
  var _a;
  const parts = getFileComponents(source, libraryDirectory("templates"));
  const filename = import_chalk6.default`{dim ${parts.filepath}}{bold /${parts.filename}}`;
  const log = logger(opts);
  log.shout(import_chalk6.default`The file {blue ${filename}} already exists.\n`);
  let action;
  while (action !== "copy" && action !== "skip") {
    action = await askListQuestion("What do you want to do?", answers);
    if (action === "show") {
      let editorCommand = (_a = getUserConfig().general) == null ? void 0 : _a.editorCommand;
      if (!editorCommand) {
        editorCommand = await askUserAboutEditorCommand();
        if (editorCommand) {
          log.info(import_chalk6.default`- the editor command "${editorCommand}" has been saved to your user configuration.`);
          log.info(import_chalk6.default`{gray - the user config file is located at {blue ~/.do-devops.json}}`);
        }
      }
      if (editorCommand) {
        const open = (0, import_shelljs.exec)(`${editorCommand} ${source} ${target} &`);
        if (open.code === 0) {
          log.info(import_chalk6.default`- check your editor for the two versions of the file`);
        } else {
          log.info(import_chalk6.default`- ${emoji.poop} there was a problem openning the files in your editor`);
        }
      }
    }
    if (action === "diff") {
      diffFiles(source, target);
    }
  }
  return action === "copy" ? true : false;
}

// src/shared/interactive/specific/askForDependency.ts
init_cjs_shims();
var import_chalk7 = __toModule(require("chalk"));
var LOOKUP = (p) => [
  p.hasDependencies ? { value: "dependencies", name: `Dependencies [${p.dependencies.length}]` } : false,
  p.hasPeerDependencies ? {
    value: "peerDependencies",
    name: `Peer Dependencies [${p.peerDependencies.length}]`
  } : false,
  p.hasOptionalDependencies ? {
    value: "optionalDependencies",
    name: `Optional Dependencies [${p.optionalDependencies.length}]`
  } : false,
  p.hasDevDependencies ? {
    value: "devDependencies",
    name: `Development Dependencies [${p.devDependencies.length}]`
  } : false,
  { value: false, name: "QUIT" }
].filter((i) => i);
async function askForDependency(_observations) {
  const deps = dependencies();
  const choices = LOOKUP(deps);
  if (Object.keys(choices).length === 1) {
    console.log(`- this repo has no dependencies!`);
    return false;
  }
  const kind = await askListQuestion(import_chalk7.default`Which {italic type} of dependency`, choices);
  if (!kind) {
    return false;
  }
  const depChoices = deps[kind];
  const answer = await askListQuestion(import_chalk7.default`- Choose the {italic specific} dependency to run "ls" on`, depChoices.map((i) => ({ value: i.name, name: import_chalk7.default`${i.name} {dim - ${i.version}}` })));
  return answer;
}

// src/shared/interactive/specific/askForUnitTestFramework.ts
init_cjs_shims();
var import_chalk8 = __toModule(require("chalk"));
var import_native_dash4 = __toModule(require("native-dash"));

// src/constants.ts
init_cjs_shims();
var IMAGE_CACHE = ".image-metadata.json";
var TEST_FRAMEWORKS = [
  "mocha",
  "jest",
  "uvu",
  "ava",
  "jasmine",
  "qunit"
];
var FNS_TYPES_FILE = "src/@types/aws-functions.ts";

// src/shared/interactive/specific/askForUnitTestFramework.ts
async function askForUnitTestFramework(opts = {}) {
  var _a, _b;
  const log = logger(opts);
  log.shout(import_chalk8.default`- we have not been able to determine which {italic unit testing} framework you're using.`);
  const framework = opts.unitTestFramework ? opts.unitTestFramework : await askListQuestion("Choose the unit test runner you'd like to use", TEST_FRAMEWORKS, { default: "jest" });
  const wallaby = framework === "uvu" ? false : await askConfirmQuestion("Would you like us to add a WallabyJS config file so you can use it as a test runner in this repo?");
  const defaultDir = dirExists("./tests") ? "tests" : dirExists("./test") ? "test" : "tests";
  const directory = await askListQuestion("Which directory will you put your tests in?", ["test", "tests", "src"], { default: defaultDir });
  const user = getUserConfig();
  const defaultPostfix = ((_a = user.test) == null ? void 0 : _a.testFilePostfix) ? (_b = user.test) == null ? void 0 : _b.testFilePostfix : ["-spec", "-test"];
  const postfix = await askCheckboxQuestion("Test files are typically distinguished by having a 'postfix' part of their name to distinguish them from other files in the same directory; choose as many as you like", ["-spec", "-test", ".spec", ".test"], { when: () => framework !== "uvu", default: defaultPostfix });
  if (!(0, import_native_dash4.equal)(postfix, defaultPostfix)) {
    const saveToProfile = await askConfirmQuestion("Would you like to save this postfix as your default?");
    if (saveToProfile) {
      saveUserConfig({ test: { testFilePostfix: postfix } });
    }
  }
  return {
    unitTestFramework: framework,
    useWallaby: wallaby,
    testDirectory: directory,
    testFilePostfix: postfix || []
  };
}

// src/shared/interactive/specific/askUserAboutEditorCommand.ts
init_cjs_shims();
async function askUserAboutEditorCommand() {
  let editor = await askListQuestion("What editor command should we use to open files?", [
    { name: "vs-code (using 'code' to open)", value: "code", short: "vs-code" },
    { name: "vim", value: "vim" },
    { name: "Sublime Text (using 'subl' to open)", value: "subl", short: "sublime" },
    { name: "other", value: "other" }
  ]);
  if (editor === "other") {
    editor = await askInputQuestion("what is the command for this editor?");
  }
  if (editor) {
    saveUserConfig({ general: { editorCommand: editor } });
  }
  return editor;
}

// src/shared/interactive/specific/resolvePackageManagerConflict.ts
init_cjs_shims();
var import_chalk9 = __toModule(require("chalk"));
async function resolvePackageManagerConflict(observations) {
  const pkgManager = await askListQuestion("Which package manager do you expect to use in this repo?", ["npm", "pnpm", "yarn"], {
    default: observations.has("pnpm") ? "pnpm" : observations.has("yarn") ? "yarn" : "npm"
  });
  await saveProjectConfig({ general: { pkgManager } });
  const removed = await removeOtherLockFiles(pkgManager);
  if (removed.length > 0) {
    console.log(import_chalk9.default`- removed ${removed.length} redundant lock file${removed.length > 1 ? "s" : ""}: {italic {dim ${removed.join(", ")}}}`);
  }
}

// src/shared/interactive/specific/configuration/index.ts
init_cjs_shims();

// src/shared/interactive/specific/configuration/askForAutoindexConfig.ts
init_cjs_shims();
var import_chalk10 = __toModule(require("chalk"));
async function askForAutoindexConfig(opts, o) {
  var _a, _b;
  const log = logger(opts);
  const projectConfig = getProjectConfig();
  const hasProjectConfig = projectConfig.autoindex !== void 0;
  if (o.has("monorepo")) {
    log.info(import_chalk10.default`- ${emoji.eyeballs} this project is a monorepo; you should configure 'packages' in your monorepo separately.`);
    const continueOn = await askConfirmQuestion("You can still configure the root of the monorepo if there are index files, {italic not} in the individual packages. Otherwise there is no point. Shall we continue?");
    if (!continueOn) {
      process.exit();
    }
  }
  log.info(import_chalk10.default`- configuring this project for {bold {yellow do-devops}}'s {blue autoindex} command\n`);
  if (hasProjectConfig) {
    log.info(import_chalk10.default`- ${emoji.eyeballs} has existing project configuration to work from`);
  }
  let indexGlobs = ["**/index.ts", "**/index.js", "**/index.mjs", "!**/*.d.ts", "!**/node_modules"];
  const confirmIndexGlob = await askConfirmQuestion(import_chalk10.default`By default, the files which are identified as possible "autoindex" files are: {dim ${JSON.stringify(indexGlobs)}}. This is typically fine, shall we proceed with this or do you want to modify this?`);
  if (!confirmIndexGlob) {
    console.log(import_chalk10.default`- input patterns in a CSV format that can be parsed.`);
    console.log(import_chalk10.default`  for example {dim [ "**foobar.ts" ] }.`);
    console.log(import_chalk10.default`- Note: you should NOT include the exclusion pattern for {blue node_modules} as this will always be included`);
    indexGlobs = [
      ...JSON.parse(await askInputQuestion(import_chalk10.default`pattern:`)),
      "!**/node_modules"
    ];
  }
  let whitelistGlobs = ((_a = projectConfig == null ? void 0 : projectConfig.autoindex) == null ? void 0 : _a.whitelistGlobs) || void 0;
  let blacklistGlobs = ((_b = projectConfig == null ? void 0 : projectConfig.autoindex) == null ? void 0 : _b.blacklistGlobs) || [];
  const confirmWhitelist = whitelistGlobs === void 0 ? await askConfirmQuestion(import_chalk10.default`- you {italic can} specify a particular whitelist -- or set of whitelists -- to identify files to be included in index files but typically you should leave as the default which is to include all JS and TS files. Continue without setting explicit whitelist?`) : await askConfirmQuestion(import_chalk10.default`- you have whitelists currently in your configuration; can we keep these {italic as is}?`);
  if (!confirmWhitelist) {
    console.log(import_chalk10.default`- whitelists should be in a CSV format that can be parsed.`);
    console.log(import_chalk10.default`  for example {dim [ "**foobar.ts" ] }.`);
    whitelistGlobs = JSON.parse(await askInputQuestion(import_chalk10.default`pattern:`));
  }
  const confirmBlacklist = blacklistGlobs ? !await askConfirmQuestion(`- currently you have no files "blacklisted". Do you want to add any?`, false) : await askConfirmQuestion(`- you have blacklists in your configuration; can we keep these {italic as is}?`);
  if (!confirmBlacklist) {
    console.log(import_chalk10.default`- blacklists should be in a CSV format that can be parsed.`);
    console.log(import_chalk10.default`  for example {dim [ "**foobar.ts" ] }.`);
    blacklistGlobs = JSON.parse(await askInputQuestion(import_chalk10.default`pattern:`));
  }
  const sfc = o.has("vue") ? true : false;
  await saveProjectConfig({
    autoindex: {
      indexGlobs,
      whitelistGlobs,
      blacklistGlobs,
      sfc
    }
  });
  log.info(import_chalk10.default`- ${emoji.party} configuration for {blue autoindex} has been saved to project`);
}

// src/shared/interactive/specific/images/index.ts
init_cjs_shims();

// src/shared/interactive/specific/images/askAddImageRule.ts
init_cjs_shims();
var import_chalk12 = __toModule(require("chalk"));

// src/shared/core/logger.ts
init_cjs_shims();
var options;
function logger(opts) {
  if (opts) {
    options = opts;
  } else if (!opts && !options) {
    console.warn(`Trying to use logger without having first set global options. Outside of testing, this should be avoided by ensuring all CLI commands set the options up front.`);
    options = { verbose: true, quiet: false };
  }
  return {
    info(...args) {
      if (!options.quiet) {
        console.log(...args);
      }
    },
    shout(...args) {
      console.log(...args);
    },
    whisper(...args) {
      if (options.verbose) {
        console.log(...args);
      }
    }
  };
}

// src/shared/data/index.ts
init_cjs_shims();

// src/shared/data/csvParser.ts
init_cjs_shims();
function booleanChecker(v) {
  return v === "true" ? true : v === "false" ? false : v;
}
function numericChecker(v) {
  return Number.isNaN(Number(v)) ? v : Number(v);
}
function arrayChecker(v) {
  return typeof v === "string" && v.startsWith("[") && v.endsWith("]") ? v.replace(/(\[])/g, "").trim().split("|").map((i) => booleanChecker(numericChecker(i))) : v;
}
function prepArrayValues(input) {
  const re = /\[([^\]]*)]/g;
  const matches = [...input.matchAll(re)].map((i) => i[0]);
  for (const match of matches) {
    input = input.replace(match, match.replace(/,\s*/g, "|"));
  }
  return input;
}
function csvParser(input, options16 = {}) {
  const props = __spreadValues({
    nameProp: "name",
    valueProp: "value"
  }, options16);
  input = prepArrayValues(input);
  return input.split(/,\s*/).map((i) => {
    let [name, value] = i.split("::");
    name = name.trim();
    if (!value) {
      value = input.includes("::") ? "" : name;
    }
    value = arrayChecker(booleanChecker(numericChecker(value)));
    return { [props.nameProp]: name, [props.valueProp]: value };
  });
}

// src/shared/interactive/specific/images/askImageConfiguration.ts
init_cjs_shims();
var import_chalk11 = __toModule(require("chalk"));
async function askImageConfiguration(o, api) {
  const log = logger();
  log.info(import_chalk11.default`Welcome back, your {bold {yellow image}} configuration summary is:\n`);
  log.info(import_chalk11.default`{bold {yellow Rules:}}`);
  if (!o.has("image-cache")) {
    log.info(`- ${emoji.eyeballs} there is no image cache yet so no summary info is available.`);
  } else {
    await api.summarize();
    log.info();
  }
  const actions = ["Add Rule", "Remove Rule", "Change Rule", "Manage Defaults", "Quit"];
  const action = await askListQuestion(`What configuration operation are you interested in?`, actions);
  const actionMap = {
    "Add Rule": askAddImageRule,
    "Remove Rule": askRemoveImageRule,
    "Change Rule": askChangeImageRule,
    "Manage Defaults": askImageDefaults,
    Quit: async () => {
      log.info("exiting ...");
      process.exit();
    }
  };
  await actionMap[action](o, api);
}

// src/shared/interactive/specific/images/askAddImageRule.ts
var filter = (v) => !v.startsWith(".") && v !== "node_modules";
async function askAddImageRule(o, api) {
  const log = logger();
  const config = getProjectConfig().image;
  const rule = {};
  rule.name = await askInputQuestion(`What will the new rule be called:`);
  rule.source = await askForNestedDirectory(wordWrap(import_chalk12.default`What is the root directory for {bold {blue source images}}?`), { name: "Source Directory", filter, leadChoices: [config.sourceDir] });
  rule.destination = await askForNestedDirectory(import_chalk12.default`What is the root directory for {bold {blue destination/optimized images}}?`, { name: "Destination Directory", filter, leadChoices: [config.destinationDir] });
  rule.glob = await askInputQuestion(wordWrap(import_chalk12.default`What is the {italic glob pattern} used to identify the images: `));
  const sizeOptions = [
    "high-quality [ 1024, 1280, 1536, 2048, 2560 ]",
    "full-width [ 640, 768, 1024, 1280, 1536 ]",
    "half-width [ 320, 384, 512, 640, 768 ]",
    "quarter-width [ 160, 192, 256, 320, 384 ]",
    "icon [ 128, 192, 256, 512 ]",
    "custom"
  ];
  const sizeName = await askListQuestion(wordWrap(`What are the sizes you want to convert to?`), sizeOptions, { default: "full-width [ 640, 768, 1024, 1280, 1536 ]" });
  if (sizeName !== "custom") {
    rule.widths = JSON.parse(sizeName.replace(/.*\[/, "["));
  } else {
    const customName = await askInputQuestion(`Add your own values as CSV (e.g., "64,128,256"):`);
    rule.widths = csvParser(customName);
  }
  rule.preBlur = await askConfirmQuestion(`Should images have a small blurred image produced for pre-loading?`);
  rule.metaDetail = await askListQuestion(`What level of detail will this rule need for metadata?`, ["basic", "categorical", "tags"]);
  rule.sidecarDetail = await askListQuestion(wordWrap(`Choose whether you want a sidecar meta file:`), ["none", "per-image", "per-rule"], { default: "none" });
  await saveProjectConfig("image.rules", [...config.rules, rule]);
  log.info(`- your new rule named "${rule.name}", has been added to project configuration`);
  log.info();
  return askImageConfiguration(o, api);
}

// src/shared/interactive/specific/images/askChangeImageRule.ts
init_cjs_shims();
async function askChangeImageRule(o, api) {
  const log = logger();
  let rule = api.rules.length === 1 ? api.rules[0] : await askListQuestion(`Which rule do you want to change?`, api.rules.map((i) => i.name));
  if (typeof rule === "string") {
    rule = api.rules.find((i) => i.name === rule);
  }
  if (!rule) {
    log.shout("No rule was selected! Exiting");
    process.exit();
  }
  return askImageConfiguration(o, api);
}

// src/shared/interactive/specific/images/askConfigureImageOptimization.ts
init_cjs_shims();
var import_chalk18 = __toModule(require("chalk"));
var import_path6 = __toModule(require("path"));

// src/shared/images/index.ts
init_cjs_shims();

// src/shared/images/createMetaFor.ts
init_cjs_shims();

// src/shared/images/getImages.ts
init_cjs_shims();
var import_globby2 = __toModule(require("globby"));
function getImages(dir) {
  return (0, import_globby2.sync)([
    "**/*.gif",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.png",
    "**/*.avif",
    "**/*.webp",
    "**/*.tiff",
    "**/*.heif"
  ], { cwd: dir, onlyFiles: true, gitignore: true });
}

// src/shared/images/useExifTools.ts
init_cjs_shims();
var import_exiftool_vendored2 = __toModule(require("exiftool-vendored"));

// src/shared/images/useExifTool/conversion-tools.ts
init_cjs_shims();
var import_exiftool_vendored = __toModule(require("exiftool-vendored"));

// src/@type-guards/index.ts
init_cjs_shims();

// src/@type-guards/errors.ts
init_cjs_shims();
function isDevopsError(err) {
  return typeof err === "object" && err.kind === "DevopsError";
}
function isClassification(error, classification) {
  return isDevopsError(error) && error.classification === classification;
}

// src/@type-guards/image-guards.ts
init_cjs_shims();
function isExifDate(d) {
  return typeof d === "object" && Object.keys(d).includes("year") && !Object.keys(d).includes("second") && Object.keys(d).includes("zone");
}

// src/shared/images/useExifTool/conversion-tools.ts
function convertExifDateToExifDataString(d) {
  return isExifDate(d) ? import_exiftool_vendored.ExifDateTime.fromISO(d.toISOString()) : d;
}
function convertToExifDateTime(d) {
  if (!d) {
    return void 0;
  } else if (isExifDate(d)) {
    d = convertExifDateToExifDataString(d);
  } else if (typeof d === "string") {
    d = import_exiftool_vendored.ExifDateTime.fromISO(d);
  }
  return d;
}
function reduceFl35(input) {
  if (!input) {
    return input;
  }
  const re = /:(.*)\)/;
  const matched = input.match(re);
  return matched ? matched[1] : input;
}
function improveMetaResults(meta) {
  return __spreadValues({}, meta);
}

// src/shared/images/useExifTool/metaCategories.ts
init_cjs_shims();
function metaReducer(meta) {
  var _a, _b, _c, _d, _e, _f;
  const populated = Object.keys(meta).filter((i) => i);
  const make = [meta.DeviceManufacturer, meta.CameraID, meta.Make, meta.VendorID].filter((i) => i).pop();
  const model = [
    meta.Model,
    meta.ModelAndVersion,
    meta.CameraModel,
    meta.CameraModelID,
    meta.CameraType,
    meta.SonyModelID,
    meta.CanonModelID,
    meta.KodakModel,
    meta.RicohModel,
    meta.CameraModel,
    meta.CameraModelID,
    meta.DeviceModelDesc,
    meta.GEModel,
    meta.PentaxModelID,
    meta.MinoltaModelID,
    meta.SamsungModelID,
    meta.UniqueCameraModel
  ].filter((i) => i).pop();
  const color = [
    meta.ProfileDescription,
    meta.ICCProfileName,
    meta.DeviceModel,
    ((_a = meta.Look) == null ? void 0 : _a.name) ? String((_b = meta.Look) == null ? void 0 : _b.name) : void 0
  ].filter((i) => i).pop();
  const software = [meta.Software, meta.CameraSoftware].filter((i) => i).pop();
  const shutterSpeed = [
    meta.ShutterSpeed,
    meta.ShutterSpeedValue,
    meta.Shutter,
    meta.SpeedX,
    meta.SpeedY,
    meta.SpeedZ
  ].filter((i) => i).pop();
  const iso = [
    meta.ISO,
    meta.ISO2,
    meta.ISOSetting,
    meta.ISOSpeed,
    meta.ISOValue,
    meta.SonyISO,
    meta.BaseISO,
    meta.SvISOSetting,
    meta.BaseISO
  ].filter((i) => i).pop();
  const createDate = convertToExifDateTime([
    meta.DateAcquired,
    meta.DateTime,
    meta.DateTime1,
    meta.DateTimeCreated,
    meta.DateTimeDigitized,
    meta.DateTimeOriginal,
    meta.GPSDateTime,
    meta.SonyDateTime,
    meta.PanasonicDateTime,
    meta.RicohDate,
    meta.DateCreated,
    meta.Date
  ].filter((i) => i).pop());
  const modifyDate = convertToExifDateTime([meta.ModifyDate, meta.ModificationDate].filter((i) => i).pop());
  const height = [
    meta.ImageHeight,
    meta.RawImageHeight,
    meta.ExifImageHeight,
    meta.SonyImageHeight,
    meta.EpsonImageHeight,
    meta.SourceImageHeight,
    meta.CanonImageHeight,
    meta.KodakImageHeight,
    meta.RicohImageHeight,
    meta.OlympusImageHeight,
    meta.PanoramaFullHeight,
    meta.PanasonicImageHeight,
    meta.RawImageFullHeight
  ].filter((i) => i).pop();
  const width = [
    meta.ImageWidth,
    meta.ExifImageWidth,
    meta.RawImageWidth,
    meta.SonyImageWidth,
    meta.SourceImageWidth,
    meta.CanonImageWidth,
    meta.KodakImageWidth,
    meta.RicohImageWidth,
    meta.OlympusImageWidth,
    meta.PanasonicImageWidth,
    meta.PanoramaFullWidth,
    meta.RawImageFullWidth
  ].filter((i) => i).pop();
  const aperture = [meta.Aperture, meta.ApertureSetting].filter((i) => i).pop();
  const lens = [meta.LensID, meta.Lens, meta.LensInfo, meta.LensModel].filter((i) => i).pop();
  const lensMake = [meta.LensMake, meta.KodakMake].filter((i) => i).pop();
  const focalLength = [meta.FocalLength, [meta.FocalType, meta.FocalUnits].join("")].filter((i) => i).pop();
  const focalLength35 = (_c = [meta.FocalLengthIn35mmFormat, reduceFl35(meta.FocalLength35efl)].filter((i) => i).pop()) == null ? void 0 : _c.trim();
  const exposureProgram = [meta.ExposureProgram, meta.AEProgramMode].filter((i) => i).pop();
  const bracketing = meta.BracketProgram;
  const exposureMode = [meta.ExposureMode].filter((i) => i).pop();
  const exposureBias = [meta.Exposure, meta.ExposureCompensation, meta.ExposureBracketValue].filter((i) => i).pop();
  const meteringMode = [meta.MeterMode, meta.Metering].filter((i) => i).pop();
  const flash = [
    meta.Flash,
    meta.FlashAction,
    meta.FlashFunction,
    meta.FlashControl,
    meta.FlashFired
  ].filter((i) => i).pop();
  const flashCompensation = [meta.FlashCompensation, meta.FlashBias].filter((i) => i).pop();
  const brightness = [meta.Brightness, meta.BrightnessValue].filter((i) => i).pop();
  const scene = [
    meta.Scene,
    meta.SceneAssist,
    meta.SceneCaptureType,
    meta.SceneMode,
    meta.SceneModeUsed,
    `${String(meta.SceneDetect)} scene id`
  ].filter((i) => i).pop();
  const subjectDistance = meta.SubjectDistance;
  const sharpness = String([meta.Sharpness, meta.SharpnessFactor, meta.SharpnessSetting, meta.SharpnessRange].filter((i) => i).pop());
  const dpi = meta.XResolution && meta.YResolution ? [meta.XResolution, meta.YResolution] : void 0;
  const gps = {
    altitude: [meta.GPSAltitude ? String(meta.GPSAltitude) : void 0, meta.Altitude].filter((i) => i).pop(),
    coordinates: [[meta.GPSLatitude, meta.GPSLongitude], meta.GPSCoordinates].filter((i) => i).pop(),
    latitudeReference: (_d = meta.GPSLatitudeRef) == null ? void 0 : _d.toUpperCase(),
    longitudeReference: (_e = meta.GPSLongitudeRef) == null ? void 0 : _e.toUpperCase(),
    destination: meta.GPSDestLatitude && meta.GPSDestLongitude ? [meta.GPSDestLatitude, meta.GPSDestLongitude] : void 0
  };
  const title = [meta.Title, meta.XPTitle, meta["By-lineTitle"]].filter((i) => i).pop();
  const caption = [meta["Caption-Abstract"], meta.LocalCaption, meta.CanonFileDescription].filter((i) => i).pop();
  const copyright = [meta.Copyright, meta.CopyrightNotice].filter((i) => i).pop();
  const megapixels = meta.Megapixels;
  const rating = [meta.Rating, meta.RatingPercent].filter((i) => i).pop();
  const subject = [(_f = meta.Subject) == null ? void 0 : _f.pop(), meta.SubjectReference].filter((i) => i).pop();
  const location = {
    city: meta.City,
    state: meta.State,
    location: meta.LocationName,
    country: meta.country ? String(meta.country) : void 0,
    countryCode: meta.CountryCode
  };
  return {
    populated,
    make,
    model,
    color,
    shutterSpeed,
    iso,
    createDate,
    modifyDate,
    height,
    width,
    software,
    aperture,
    lens,
    lensMake,
    focalLength,
    focalLength35,
    exposureMode,
    exposureBias,
    flash,
    flashCompensation,
    brightness,
    scene,
    subject,
    subjectDistance,
    sharpness,
    dpi,
    gps,
    title,
    caption,
    copyright,
    megapixels,
    rating,
    exposureProgram,
    bracketing,
    location,
    meteringMode,
    errors: meta.errors || []
  };
}

// src/shared/images/useExifTools.ts
var cache = {};
async function removeOriginalFile(file) {
  const original = `${file}_original`;
  console.log("removing:", original);
  removeFile(original);
}
async function refreshCache(image, returnMeta, payload) {
  if (returnMeta) {
    if (cache[image]) {
      cache[image] = __spreadValues(__spreadValues({}, cache[image]), payload);
    } else {
      await useExifTools().getMetadata(image, true);
    }
  } else {
    cache[image] = __spreadValues(__spreadValues({}, cache[image]), payload);
  }
}
function useExifTools(options16 = {}) {
  const _o = __spreadValues({}, options16);
  const api = {
    version: async () => {
      return import_exiftool_vendored2.exiftool.version();
    },
    getMetadata: async (file, force = false) => {
      if (Object.keys(cache).includes(file) && !force) {
        return cache[file];
      }
      const meta = improveMetaResults(await import_exiftool_vendored2.exiftool.read(file));
      cache[file] = meta;
      return meta;
    },
    removeAllMeta: async (image, keepOriginalCopy = false) => {
      await import_exiftool_vendored2.exiftool.deleteAllTags(image).catch((error) => {
        if (error.message.includes("No success message")) {
          console.log(`- possible failure removing tags from "${image}" but this error message can often be ignored.`);
        } else {
          throw error;
        }
      });
      if (cache[image]) {
        cache[image] = {};
      }
      if (!keepOriginalCopy) {
        removeOriginalFile(image);
      }
    },
    addTag: async (file, tag, value, keepOriginalCopy = false) => {
      if (!cache[file]) {
        await useExifTools(_o).getMetadata(file);
      }
      if (cache[file][tag] !== void 0) {
        throw new DevopsError(`Attempt to add "${tag}" on the image {blue ${file}} failed as this property already exists; use setTag() instead if you want to be able to overwrite.`, "exif-tool/tag-exists");
      }
      await import_exiftool_vendored2.exiftool.write(file, { [tag]: value });
      cache[file] = __spreadProps(__spreadValues({}, cache[file]), { [tag]: value });
      if (!keepOriginalCopy) {
        removeOriginalFile(file);
      }
      return cache[file];
    },
    addContactInfo: async (file, contactInfo, returnMeta = false, keepOriginalCopy = false) => {
      return await api.setTags(file, { CreatorContactInfo: contactInfo }, returnMeta, keepOriginalCopy);
    },
    setTags: async (image, tags, returnMeta = false, keepOriginalCopy = false) => {
      await import_exiftool_vendored2.exiftool.write(image, tags);
      await refreshCache(image, returnMeta, tags);
      const results = returnMeta ? cache[image] : void 0;
      if (!keepOriginalCopy) {
        removeOriginalFile(image);
      }
      return results;
    },
    removeTags: async (image, tags, returnMeta = false, keepOriginalCopy = false) => {
      if (!Array.isArray(tags)) {
        tags = [tags];
      }
      const eraser = tags.reduce((acc, item) => {
        acc = __spreadProps(__spreadValues({}, acc), { [item]: void 0 });
        return acc;
      }, {});
      await import_exiftool_vendored2.exiftool.write(image, eraser);
      await refreshCache(image, returnMeta, eraser);
      const results = returnMeta ? cache[image] : void 0;
      if (!keepOriginalCopy) {
        removeOriginalFile(image);
      }
      return results;
    },
    addCopyright: async (image, message, returnMeta = false, keepOriginalCopy = false) => {
      const payload = {
        Copyright: message,
        CopyrightNotice: message
      };
      const result = await api.setTags(image, payload, returnMeta, keepOriginalCopy);
      await refreshCache(image, returnMeta, payload);
      return result;
    },
    setTitle: async (image, title, returnMeta = false, keepOriginalCopy = false) => {
      const payload = {
        Title: title,
        XPTitle: title
      };
      await import_exiftool_vendored2.exiftool.write(image, payload);
      await refreshCache(image, returnMeta, payload);
      if (!keepOriginalCopy) {
        removeOriginalFile(image);
      }
      return returnMeta ? cache[image] : void 0;
    },
    categorizedMetadata: async (file) => {
      if (!cache[file]) {
        await useExifTools(_o).getMetadata(file);
      }
      return metaReducer(cache[file]);
    },
    close: async () => {
      return import_exiftool_vendored2.exiftool.end();
    }
  };
  return api;
}

// src/shared/images/useImageApi.ts
init_cjs_shims();
var import_chalk17 = __toModule(require("chalk"));
var import_destr3 = __toModule(require("destr"));

// src/shared/images/useImageApi/convertStale.ts
init_cjs_shims();
var import_chalk15 = __toModule(require("chalk"));

// src/shared/images/useImageApi/checkCacheFreshness.ts
init_cjs_shims();
var import_chalk13 = __toModule(require("chalk"));
var import_globby3 = __toModule(require("globby"));
var import_path4 = __toModule(require("path"));
async function checkCacheFreshness(cache2, rule) {
  const log = logger();
  const baseDir = rule.source;
  const globPattern = rule.glob;
  const targetFiles = (await (0, import_globby3.default)(globPattern, {
    cwd: (0, import_path4.join)(repoDirectory(), baseDir),
    onlyFiles: true,
    stats: true,
    caseSensitiveMatch: false
  })).map((i) => ({ name: (0, import_path4.join)(baseDir, i.path), modified: i.stats.mtimeMs }));
  const missing = [];
  const outOfDate = [];
  for (const file of targetFiles) {
    const cacheRef = cache2.source[file.name];
    if (!Object.keys(cache2.source).includes(file.name)) {
      missing.push(file.name);
    } else if (cacheRef.modified < file.modified) {
      outOfDate.push(file.name);
    }
  }
  log.whisper(import_chalk13.default`{dim - there were {bold ${targetFiles.length}} source images discovered for the {blue ${rule.name}} rule. Of which ${missing.length} were {italic missing} from the cache and ${outOfDate.length} were in the cache but stale.}`);
  return { missing, outOfDate };
}

// src/shared/images/useImageApi/refreshCache.ts
init_cjs_shims();
var import_chalk14 = __toModule(require("chalk"));
var import_date_fns2 = __toModule(require("date-fns"));

// src/shared/images/useImageApi/buildTagsFromCache.ts
init_cjs_shims();
function buildTagsFromCache(tags, cache2, sourceFile) {
  return tags.reduce((acc, tag) => {
    const c = cache2.source[sourceFile];
    acc = __spreadProps(__spreadValues({}, acc), { [tag]: c.meta[tag] });
    return acc;
  }, {});
}

// src/shared/images/useImageApi/saveImageCache.ts
init_cjs_shims();
function saveImageCache(cache2) {
  write(IMAGE_CACHE, JSON.stringify(cache2), { allowOverwrite: true });
}

// src/shared/images/useImageApi/refreshCache.ts
async function refreshCache2(rule, tools, stale) {
  const log = logger();
  const sourceImages = [];
  const optimizedImages = [];
  const now = Date.now();
  for (const file of stale) {
    sourceImages.push(Promise.all([
      tools.sharp.getMetadata(file).then((m) => {
        var _a;
        return {
          file,
          created: ((_a = tools.cache.source[file]) == null ? void 0 : _a.created) || now,
          modified: now,
          isSourceImage: true,
          rule: rule.name,
          size: m.size,
          width: m.width,
          height: m.height,
          metaDetailLevel: "basic",
          sharpMeta: m
        };
      }),
      rule.metaDetail !== "basic" ? rule.metaDetail === "categorical" ? tools.exif.categorizedMetadata(file) : tools.exif.getMetadata(file) : Promise.resolve()
    ]));
    optimizedImages.push(tools.sharp.resizeToWebFormats(file, rule.destination, rule.widths));
  }
  const sis = await Promise.all(sourceImages);
  for (const si of sis) {
    const [cacheRef, exifMeta] = si;
    tools.cache.source[cacheRef.file] = __spreadProps(__spreadValues({}, cacheRef), {
      meta: exifMeta,
      metaDetailLevel: rule.metaDetail
    });
  }
  const optimized = (await Promise.all(optimizedImages)).flat().map((i) => __spreadProps(__spreadValues({}, i), {
    rule: rule.name,
    isSourceImage: false,
    metaDetailLevel: "basic",
    meta: {}
  }));
  for (const f of optimized) {
    tools.cache.converted[f.file] = f;
  }
  saveImageCache(tools.cache);
  log.info(`- ${emoji.thumbsUp} image cache saved to disk with updated source and converted images`);
  log.whisper(import_chalk14.default`{dim - using the "${rule.name}" rule, {bold ${optimized.length}} images have been resized using Sharp to fit "web formats"}`);
  if (rule.preBlur) {
    const waitBlurry = [];
    for (const file of stale) {
      waitBlurry.push(tools.sharp.blurredPreImage(file, rule.destination));
    }
    const blurred = await Promise.all(waitBlurry);
    log.whisper(import_chalk14.default`{dim - produced a blurred image preload for ${blurred.length} images associated to "${rule.name}" rule}`);
  }
  const metaMessages = [];
  if (!rule.preserveMeta) {
    metaMessages.push("all meta data from the original image will be preserved in the converted image", "note that colorspace profile was converted to sRGB in conversion process and this will not be reverted back");
  } else {
    metaMessages.push("all meta data from the original image was removed and a web friendly sRGB color profile was added to the converted image");
  }
  if (rule.copyright) {
    metaMessages.push("a copyright notice was associated to this rule and will be applied to converted images");
  }
  log.whisper(`- looking at metadata requirements for the optimized images; will apply the following policy:
    - ${metaMessages.join("\n    - ")}`);
  if (rule.preserveMeta && rule.preserveMeta.length > 0) {
    const metaTransfers = [];
    for (const file of optimized) {
      if (!file.from) {
        throw new DevopsError(`Attempt to bring metadata over to "${file.file}" file failed as the 'from' property in the cache was not populated!`, "image/not-ready");
      }
      const cacheEntry = tools.cache.source[file.from];
      if (!cacheEntry) {
        throw new DevopsError(`Failed to bring metadata over to "${file.file}" file because there was no cache entry for the source image: ${file.from}`);
      }
      metaTransfers.push(tools.exif.setTags(file.file, buildTagsFromCache(rule.preserveMeta, tools.cache, file.from)));
    }
    await Promise.all(metaTransfers);
    log.whisper(import_chalk14.default`- Metadata properties -- {italic ${rule.preserveMeta.join(", ")}} -- have been added to the web images where they were available in the source image`);
  }
  if (rule.copyright) {
    const cpPromises = [];
    for (const file of optimized) {
      cpPromises.push(tools.exif.addCopyright(file.file, rule.copyright));
    }
    await Promise.all(cpPromises);
    log.whisper(import_chalk14.default`- copyright notices have been applied to the {yellow {bold ${optimized.length}}} images which were created as a result of recent changes to source files`);
  }
  log.info(import_chalk14.default`- ${emoji.party} all images are now up-to-date based on recent source image changes [ {dim ${(0, import_date_fns2.format)(Date.now(), "h:mm:ss aaaa")}} ]`);
}

// src/shared/images/useImageApi/createTsSupportFile.ts
init_cjs_shims();
var TS_IMAGE_SUPPORT_FILE = `src/images/optimized-images.ts`;
function createTsSupportFile(rules, tools) {
  const lookups = {};
  for (const key of Object.keys(tools.cache.source)) {
    const si = tools.cache.source[key];
    const rule = rules.find((i) => i.name === si.rule);
    const parts = getFileComponents(si.file);
    lookups[parts.fileWithoutExt] = {
      name: parts.fileWithoutExt,
      widths: rule.widths,
      formats: ["jpg", "png", "webp"],
      path: parts.filepath,
      aspectRatio: si.width / si.height
    };
  }
  const file = `
  import type { IOptimizedImage } from "common-types";

  /** 
   * a key/value lookup of available optimized images where the _key_ is
   * the name of the image without 
   */
  export const OptimizedImageLookup: Record<string, IOptimizedImage> = ${JSON.stringify(lookups, null, 2)}  as const;
  
  export interface IOptimizedImages = keyof typeof OptimizedImageLookup;
  export enum OptimizedImage {

  };

  `;
  write(TS_IMAGE_SUPPORT_FILE, file);
}

// src/shared/images/useImageApi/convertStale.ts
async function convertStale(rules, tools, _options) {
  const log = logger();
  const config = getProjectConfig().image;
  for (const [i, rule] of rules.entries()) {
    log.info(import_chalk15.default`- checking rule {blue ${rule.name}} for stale source images [ {dim ${i + 1} {italic of} ${rules.length}} ]`);
    const { missing, outOfDate } = await checkCacheFreshness(tools.cache, rule);
    if (missing.length > 0) {
      log.whisper(import_chalk15.default`{dim - there are {bold ${missing.length}} images not currently in the cache: {dim ${missing.join(", ")}}}`);
    }
    if (outOfDate.length > 0) {
      log.whisper(import_chalk15.default`- there are ${outOfDate.length} images who are out of date: {dim ${missing.join(", ")}}`);
    }
    if (missing.length === 0 && outOfDate.length === 0) {
      log.info(import_chalk15.default`- ${emoji.party} all images in {blue ${rule.name}} are current; no work needed.`);
      log.info(import_chalk15.default`{dim - if you need to force image production use {blue dd optimize --force}}`);
    } else {
      await refreshCache2(rule, tools, [...missing, ...outOfDate]);
      const changes = [...missing, ...outOfDate];
      const resized = [];
      for (const img of changes) {
        resized.push(tools.sharp.resizeToWebFormats(img, rule.destination, rule.widths));
      }
      const resizedComplete = [...await Promise.all(resized)].flat();
      log.whisper(import_chalk15.default`{dim - the following images were {italic resized}:\n${wordWrap(resizedComplete.map((i2) => i2.file).join("	"), { wrapDistance: 120 })}}\n`);
    }
  }
  if (config == null ? void 0 : config.supportTS) {
    createTsSupportFile(rules, tools);
  }
}

// src/shared/images/useImageApi/watchForChange.ts
init_cjs_shims();
async function watchForChange(_rules, _tools, _options) {
}

// src/shared/images/useImageApi/summarize.ts
init_cjs_shims();
var import_chalk16 = __toModule(require("chalk"));
var import_date_fns3 = __toModule(require("date-fns"));
function summarize(rules, tools) {
  const log = logger();
  if (!tools.cache) {
    log.shout(import_chalk16.default`- ${emoji.eyeballs} there is no image cache; do you want to run {dd image convert} first?`);
  }
  if (!tools.cache.source) {
    console.log(wordWrap(import_chalk16.default`- ${emoji.eyeballs} there appears to be something wrong with your image cache as the cache file does exist but the "source" folder is missing. Please have a look but it is probably best that you re-build the cache with {blue dd image optimize --force}`));
    process.exit();
  }
  const sourceImages = Object.keys(tools.cache.source).reduce((acc, i) => {
    acc = [...acc, tools.cache.source[i]];
    return acc;
  }, []);
  const convertedImages = Object.keys(tools.cache.converted).reduce((acc, i) => {
    acc = [...acc, tools.cache.converted[i]];
    return acc;
  }, []);
  const lastUpdate = (0, import_date_fns3.formatDistance)(sourceImages.reduce((mostRecent, i) => i.modified > mostRecent ? i.modified : mostRecent, 0), Date.now(), { addSuffix: true });
  log.info(import_chalk16.default`{bold Summary of Image Configuration}`);
  log.info(import_chalk16.default`{bold ------------------------------}\n`);
  log.info(import_chalk16.default`- there are {yellow {bold ${sourceImages.length}}} source images in the cache`);
  log.info(import_chalk16.default`- the last detected change in these source images was ${lastUpdate}`);
  log.info(import_chalk16.default`{dim - the rules {italic plus} source images have produced {bold {yellow ${convertedImages.length}}} optimized images}`);
  log.info();
  log.info(import_chalk16.default`  Rule Overview:`);
  log.info(import_chalk16.default`  --------------`);
  for (const r of rules || []) {
    const sourceFromRule = sourceImages.filter((i) => (i == null ? void 0 : i.rule) === r.name);
    const convertedFromRule = convertedImages.filter((i) => (i == null ? void 0 : i.rule) === r.name);
    log.info(import_chalk16.default`    - ${r.name}: {dim source: {gray "}${r.source}{gray "}, destination: {gray "}${r.destination}{gray "}, glob: {gray "}${r.glob}{gray "}, source images: ${sourceFromRule.length}, optimized images: ${convertedFromRule.length}}`);
  }
}

// src/shared/images/useImageApi.ts
function useImageApi(rules, options16 = {}) {
  const log = logger();
  const exif = useExifTools();
  const sharp2 = useSharp();
  const cacheFileExists = fileExists(IMAGE_CACHE);
  log.whisper(cacheFileExists && options16.clearCache !== true ? import_chalk17.default`{dim - cache file found on disk, loading ...}` : options16.clearCache === true ? import_chalk17.default`{dim - starting with clean cache due to "clearCache" flag}` : import_chalk17.default`{dim - no cache file found on disk, will start with clean cache}`);
  const cache2 = cacheFileExists && options16.clearCache !== true ? (0, import_destr3.default)(readFile(IMAGE_CACHE)) : { source: {}, converted: {} };
  const tools = { exif, sharp: sharp2, cache: cache2 };
  const api = {
    rules,
    watch: async () => {
      await convertStale(rules, tools, options16);
      await watchForChange(rules, tools, options16);
    },
    convert: async () => {
      await convertStale(rules, tools, options16);
    },
    summarize: async () => {
      return summarize(rules, tools);
    },
    getMetaForImage: async (image, format6 = "tags") => {
      return format6 === "tags" ? exif.getMetadata(image) : exif.categorizedMetadata(image);
    },
    close: async () => {
      return exif.close();
    }
  };
  return api;
}

// src/shared/images/useSharp.ts
init_cjs_shims();
var import_native_dash5 = __toModule(require("native-dash"));
var import_path5 = __toModule(require("path"));
var import_sharp = __toModule(require("sharp"));
function outFilename(dir, name, width, format6) {
  return (0, import_path5.join)(dir, `${name}-${width}.${format6}`);
}
function useSharp(options16 = {}) {
  const o = __spreadValues({
    simd: true,
    jpg: {
      quality: 60,
      mozjpeg: true,
      progressive: true
    },
    avif: {
      quality: 30
    },
    webp: {
      quality: 40
    },
    heif: {
      quality: 60
    }
  }, options16);
  if (o.simd) {
    const result = import_sharp.default.simd();
    if (!result) {
      console.log(`- Sharp attempted to establish use of simd acceleration but hardware platform did not allow it.`);
    }
  }
  const api = {
    resizeImage: async (image, outDir, width, format6, options17 = {}) => {
      const name = getFileComponents(image).fileWithoutExt;
      const out = outFilename(outDir, name, width, format6);
      return (0, import_sharp.default)(image).toFormat(format6, options17).resize(width).toFile(out).then((info3) => {
        const now = Date.now();
        return {
          file: out,
          created: now,
          modified: now,
          size: info3.size,
          width: info3.width,
          height: info3.height,
          isSourceImage: false,
          from: image,
          metaDetailLevel: "basic",
          sharpMeta: info3,
          meta: void 0
        };
      }).catch((error) => {
        throw new Error(`Problem writing file ${out}! ${error.message}`);
      });
    },
    getMetadata: async (source) => {
      return (0, import_sharp.default)(source).metadata().then((meta) => {
        return (0, import_native_dash5.omit)(meta, "exif", "iptc", "icc", "xmp");
      });
    },
    resizeToWebFormats: async (source, outDir, width, options17 = {}) => {
      if (!Array.isArray(width)) {
        width = [width];
      }
      const promises = [];
      for (const w of width) {
        promises.push(api.resizeImage(source, outDir, w, "jpg", __spreadValues(__spreadValues({}, o.jpg), options17)), api.resizeImage(source, outDir, w, "avif", __spreadValues(__spreadValues({}, o.avif), options17)), api.resizeImage(source, outDir, w, "webp", __spreadValues(__spreadValues({}, o.webp), options17)));
      }
      return Promise.all(promises);
    },
    blurredPreImage: async (image, outDir, size = 32) => {
      const s = getFileComponents(image);
      const baseName = `${s.fileWithoutExt}-blurred.jpg`;
      const blurFilename = (0, import_path5.join)(outDir, baseName);
      await (0, import_sharp.default)(image).toFormat("jpg", { mozjpeg: true, progressive: true }).blur(true).resize({ width: size }).toFile(blurFilename);
      return baseName;
    }
  };
  return api;
}

// src/shared/interactive/specific/images/askConfigureImageOptimization.ts
var filter2 = (v) => !v.startsWith(".") && v !== "node_modules";
async function askConfigureImageOptimization(_o) {
  const log = logger();
  const images = getImages(currentDirectory());
  const imageDirs = new Set();
  for (const i of images) {
    imageDirs.add(import_path6.default.dirname(i));
  }
  log.shout(wordWrap(import_chalk18.default`Welcome weary traveler! It appears you've not configured {bold {blue images}} for this repo before. Let's get that out of the way now.\n`));
  const sourceDir = await askForNestedDirectory(wordWrap(import_chalk18.default`You are expected to choose a {blue source directory} to act as the {italic default} dir for all your rule's source images. Choose from the directories below ({italic dirs with image will be at top of list}):`), {
    name: "Source Directory",
    filter: filter2,
    leadChoices: [...imageDirs]
  });
  log.info();
  const destinationDir = await askForNestedDirectory(wordWrap(import_chalk18.default`Now choose a {italic default} {blue destination directory} for images; {bold rules} will still need choose this too but they'll default to whatever you choose.\n\n`) + wordWrap(import_chalk18.default`Note: the most common directory to target would be the {blue /public} directory as this is typically where build tools look for static assets like images.`) + import_chalk18.default`\n\nChoose from list:`, {
    name: "Destination Directory",
    filter: filter2,
    leadChoices: ["public"]
  });
  log.info();
  log.shout(wordWrap(import_chalk18.default`The {italic general} configuration of the image service is now complete but {italic rules} are a key component of having a complete setup. For this reason we will add one rule now and if you want to add more later simply run {blue dd image config} again and choose "add rule" from the options.\n\n`));
  const rule = {};
  rule.name = await askInputQuestion(`Each rule needs to have a "name" to identify it (you can change later without issue):`);
  rule.source = await askForNestedDirectory(wordWrap(import_chalk18.default`Each rule must state a root directory for their {bold {blue source}} images;\nit is already defaulted to the general setting you chose earlier but if this rule should start somewhere else feel free to change`), { name: "Rule Source Directory", filter: filter2, leadChoices: [sourceDir] });
  rule.destination = await askForNestedDirectory(import_chalk18.default`Similarly, a rule has a default {bold {blue destination}} directory`, { name: "Rule Destination Directory", filter: filter2, leadChoices: [destinationDir] });
  rule.glob = await askInputQuestion(wordWrap(import_chalk18.default`Finally, a rule must express a "glob pattern" for picking up the images it sees as source images (the glob pattern will be applied in the source directory you just chose). An example glob pattern to find all PNG images recurssively would be ${import_chalk18.default.bgWhite.blackBright("**/*.png")}: `));
  const sizeOptions = [
    "high-quality [ 1024, 1280, 1536, 2048, 2560 ]",
    "full-width [ 640, 768, 1024, 1280, 1536 ]",
    "half-width [ 320, 384, 512, 640, 768 ]",
    "quarter-width [ 160, 192, 256, 320, 384 ]",
    "icon [ 128, 192, 256, 512 ]",
    "custom"
  ];
  const sizeName = await askListQuestion(wordWrap(`When a source image is optimized it will be converted to JPG, AVIF, and WebP formats but it will also be done in different sizes. There are a number of default options listed below which largely trigger off of two variables:
`) + import_chalk18.default` 1. the responsive breakpoints we use for responsive design\n  2. the idea of what percentage the screen width the image will typically occupy\n\n` + wordWrap(import_chalk18.default`Note:\n  - some smaller displays {italic do} have much higher DPI so they can display high resolution;\n  - also due to {italic responsive design} sometimes smaller displays take up more width on a percentage basis\n\nChoose from the defaults or design your own:`), sizeOptions, { default: "full-width [ 640, 768, 1024, 1280, 1536 ]" });
  if (sizeName !== "custom") {
    rule.widths = JSON.parse(sizeName.replace(/.*\[/, "["));
  } else {
    const customName = await askInputQuestion(`Add your own values as CSV (e.g., "64,128,256"):`);
    rule.widths = csvParser(customName);
  }
  rule.preBlur = await askConfirmQuestion(`Should images in this rule also generate a small blurred image for pre-loading?`);
  rule.metaDetail = await askListQuestion(`What level of detail will this rule need for metadata?`, ["basic", "categorical", "tags"]);
  rule.sidecarDetail = await askListQuestion(wordWrap(`Sometimes it's helpful to have a "sidecar" file which has meta data as a JSON. This could be a JSON file per directory or one per file. If you don't need it though -- in most cases you won't -- then just choose "none":`), ["none", "per-image", "per-rule"], { default: "none" });
  const rules = [rule];
  saveProjectConfig({
    image: {
      sourceDir,
      destinationDir,
      rules,
      defaultWidths: [640, 768, 1024, 1280, 1536],
      formatOptions: {
        jpg: { mozjpeg: true, quality: 60 },
        avif: { quality: 30 },
        webp: { quality: 40 }
      },
      sidecar: "none"
    }
  });
  log.info(import_chalk18.default`\n\nFantastic, you have default properties configured {bold plus} your first rule defined!\n`);
  log.info(import_chalk18.default`- to convert images run {blue dd image optimize} and your rule will be executed.`);
  log.info(import_chalk18.default`- the {blue .do-devop.json} file in the root of the repo will host your configuration.`);
  log.info(import_chalk18.default`- you can always edit the config directly in the config file or if you prefer use the {blue dd image config} menu`);
  return { sourceDir, targetDir: destinationDir, rules };
}

// src/shared/interactive/specific/images/askImageDefaults.ts
init_cjs_shims();
var import_chalk19 = __toModule(require("chalk"));
async function askImageDefaults(o, api) {
  const log = logger();
  const config = getProjectConfig().image;
  log.info(import_chalk19.default`Current settings for image can be found in the -- {blue ${CONFIG_FILE}} {italic file} -- and are as follows:`);
  const options16 = [
    `sourceDir: ${config.sourceDir}`,
    `destinationDir: ${config.destinationDir}`,
    `defaultWidths: ${JSON.stringify(config.defaultWidths)}`,
    `formatOptions: ${JSON.stringify(config.formatOptions)}`,
    `sidecar: ${config.sidecar}`
  ];
  await askListQuestion(`Which of the following do you want to edit?`, options16);
  log.info();
  return askImageConfiguration(o, api);
}

// src/shared/interactive/specific/images/askRemoveImageRule.ts
init_cjs_shims();
async function askRemoveImageRule(o, api) {
  const log = logger();
  const config = getProjectConfig().image;
  const rule = await askListQuestion(`Which rule do you want to remove?`, api.rules.map((i) => i.name));
  await saveProjectConfig("image.rules", config.rules.filter((i) => i.name !== rule));
  log.info(`- ${rule} has been removed from configuration`);
  return askImageConfiguration(o, api);
}

// src/shared/aws/askForAwsProfile.ts
async function askForAwsProfile(opts) {
  opts = opts ? __spreadValues({ exitOnError: false }, opts) : { exitOnError: false };
  const profiles = await getAwsProfileDictionary();
  if (!profiles) {
    const cont = askConfirmQuestion(`Currently you don't have any AWS profiles (aka, profiles in ~/.aws/credentials).
Would you like to create one now?`);
    if (!cont) {
      console.log(`- no problem, try this command again when you're ready.
`);
      process.exit();
    }
  }
  const defaultProfile = opts.defaultProfile ? profiles[opts.defaultProfile] : profiles[0];
  const question = {
    name: "profile",
    type: "list",
    choices: Object.keys(profiles),
    message: "choose a profile from your AWS credentials file",
    default: defaultProfile,
    when: () => true
  };
  const answer = await import_inquirer3.default.prompt(question);
  return answer.profile;
}

// src/shared/aws/askForAwsRegion.ts
init_cjs_shims();
var import_inquirer4 = __toModule(require("inquirer"));

// src/shared/aws/aws-type-guards.ts
init_cjs_shims();
function isAwsProfile(input) {
  return typeof input === "object" && input !== null && Object.keys(input).includes("aws_access_key_id") && Object.keys(input).includes("aws_secret_access_key");
}

// src/shared/aws/checkIfAwsInstalled.ts
init_cjs_shims();
var import_async_shelljs2 = __toModule(require("async-shelljs"));

// src/shared/aws/convertProfileToApiCredential.ts
init_cjs_shims();
var import_chalk20 = __toModule(require("chalk"));
function convertProfileToApiCredential(profile2) {
  if (!isAwsProfile(profile2)) {
    const isObject = typeof profile2 === "object" && profile2 !== null;
    throw new DevopsError(import_chalk20.default`The {bold {red IAwsProfile}} information which was passed in to be converted to {bold IAwsCredentials} data was malformed and can not be converted! To be valid a key it must have both {green aws_access_key_id} and {green aws_secret_access_key} defined. [${isObject ? "keys found were " + Object.keys(profile2).join(", ") : `wrong type: ${typeof profile2}`}]\n\n`, "do-devops/invalid-aws-profile");
  }
  return {
    accessKeyId: profile2.aws_access_key_id,
    secretAccessKey: profile2.aws_secret_access_key
  };
}

// src/shared/aws/getApiGatewayEndpoints.ts
init_cjs_shims();
var import_chalk21 = __toModule(require("chalk"));
var import_aws_sdk = __toModule(require("aws-sdk"));

// src/shared/aws/userHasAwsProfile.ts
init_cjs_shims();
async function userHasAwsProfile(profileName) {
  const profiles = Object.keys(await getAwsProfileDictionary());
  return profiles.includes(profileName);
}

// src/shared/aws/getApiGatewayEndpoints.ts
async function getApiGatewayEndpoints(profileName, region) {
  if (!userHasAwsProfile(profileName)) {
    console.log(import_chalk21.default`- attempt to get {italics endpoints} not possible with the profile {blue ${profileName}} as you do not have credentials defined for this profile! ${emoji.angry}\n`);
    process.exit();
  }
  const profile2 = await getAwsProfile(profileName);
  const credential = convertProfileToApiCredential(profile2);
  const gw = new import_aws_sdk.APIGateway(__spreadProps(__spreadValues({}, credential), {
    region
  }));
  const gw2 = new import_aws_sdk.ApiGatewayV2(__spreadProps(__spreadValues({}, credential), {
    region
  }));
  const restApi = await gw.getRestApis().promise();
  const httpApi = await gw2.getApis().promise();
  return { httpApi, restApi };
}

// src/shared/aws/getAwsAccountId.ts
init_cjs_shims();

// src/shared/aws/getAwsUserProfile.ts
init_cjs_shims();
var import_aws_sdk2 = __toModule(require("aws-sdk"));

// src/shared/aws/getAwsProfile.ts
init_cjs_shims();
async function getAwsProfile(profileName) {
  const profile2 = await getAwsProfileDictionary();
  if (!profile2) {
    throw new DevopsError(`Attempt to get the AWS profile "${profileName}" failed because the AWS credentials file does not exist!`, "do-devops/no-credentials-file");
  }
  if (!profile2[profileName]) {
    throw new DevopsError(`The AWS profile "${profileName}" does not exist in the AWS credentials file! Valid profile names are: ${Object.keys(profile2).join(", ")}`, "do-devops/invalid-profile-name");
  }
  return profile2[profileName];
}

// src/shared/aws/getAwsDefaultRegion.ts
init_cjs_shims();
var import_aws_sdk3 = __toModule(require("aws-sdk"));

// src/shared/aws/getAwsIdentityFromProfile.ts
init_cjs_shims();
var import_aws_sdk4 = __toModule(require("aws-sdk"));
async function getAwsIdentityFromProfile(profile2) {
  const sts = new import_aws_sdk4.default.STS({
    accessKeyId: profile2.aws_access_key_id,
    secretAccessKey: profile2.aws_secret_access_key
  });
  const result = await sts.getCallerIdentity().promise();
  return {
    userId: result.UserId,
    accountId: result.Account,
    arn: result.Arn,
    user: result.Arn.split(":").pop()
  };
}

// src/shared/aws/getAwsLambdaFunctions.ts
init_cjs_shims();
var import_aws_sdk5 = __toModule(require("aws-sdk"));
async function getAwsLambdaFunctions(opts) {
  const profile2 = opts.profile ? opts.profile : await determineProfile(opts);
  const region = opts.region ? opts.region : await determineRegion(opts);
  if (!profile2 || !region) {
    throw new DevopsError(`Requesting a list of AWS functions requires an AWS profile and a specified region. One or both were missing [ p: ${profile2}, r: ${region}] `, "not-ready/missing-aws-properties");
  }
  const credentials = convertProfileToApiCredential(await getAwsProfile(profile2));
  const lambda = new import_aws_sdk5.Lambda(__spreadProps(__spreadValues({}, credentials), { region }));
  return lambda.listFunctions().promise();
}

// src/shared/aws/getAwsLambdaLayers.ts
init_cjs_shims();
var import_aws_sdk6 = __toModule(require("aws-sdk"));

// src/shared/aws/getAwsProfileDictionary.ts
init_cjs_shims();
async function getAwsProfileDictionary() {
  try {
    const credentialsFile = hasAwsProfileCredentialsFile();
    if (!credentialsFile) {
      return {};
    }
    const data = await readFile(credentialsFile);
    const targets = ["aws_access_key_id", "aws_secret_access_key", "region"];
    const extractor = (agg, curr) => {
      let profileSection = "unknown";
      for (const lineOfFile of curr) {
        if (lineOfFile.slice(-1) === "]") {
          profileSection = lineOfFile.slice(0, -1);
          agg[profileSection] = {};
        }
        for (const t of targets) {
          if (lineOfFile.includes(t)) {
            const [_, key, value] = lineOfFile.match(/\s*(\S+)\s*=\s*(\S+)/);
            if (key === "region") {
              agg[profileSection][key] = value;
            } else {
              agg[profileSection][key] = value;
            }
          }
        }
      }
      return agg;
    };
    const credentials = data ? data.split("[").map((i) => i.split("\n")).reduce(extractor, {}) : {};
    return credentials;
  } catch {
    return {};
  }
}

// src/shared/aws/getAwsProfileList.ts
init_cjs_shims();

// src/shared/aws/hasAwsCredentialsFile.ts
init_cjs_shims();
var import_path7 = __toModule(require("path"));
var import_fs4 = __toModule(require("fs"));
function hasAwsProfileCredentialsFile() {
  const homedir5 = require("os").homedir();
  const filePath = import_path7.default.join(homedir5, ".aws/credentials");
  return (0, import_fs4.existsSync)(filePath) ? filePath : false;
}

// src/shared/observations/determineCredentials.ts
init_cjs_shims();

// src/shared/observations/determineProfile.ts
init_cjs_shims();

// src/shared/serverless/index.ts
init_cjs_shims();

// src/shared/serverless/askAboutLogForwarding.ts
init_cjs_shims();
var import_chalk22 = __toModule(require("chalk"));
var import_inquirer5 = __toModule(require("inquirer"));

// src/shared/serverless/askForFunction.ts
init_cjs_shims();
var import_inquirer6 = __toModule(require("inquirer"));

// src/shared/serverless/getLocalServerlessFunctionsFromServerlessYaml.ts
init_cjs_shims();
async function getLocalServerlessFunctionsFromServerlessYaml() {
  return serverlessYamlExists() ? (await getServerlessYaml()).functions : {};
}

// src/shared/serverless/askForFunction.ts
async function askForFunction(message = "Which function do you want to use?") {
  const fns = Object.keys(await getLocalServerlessFunctionsFromServerlessYaml() || {});
  const question = {
    type: "list",
    message,
    name: "fn",
    choices: fns
  };
  const answer = await import_inquirer6.default.prompt(question);
  return answer.fn;
}

// src/shared/serverless/askForStage.ts
init_cjs_shims();
var import_inquirer7 = __toModule(require("inquirer"));
async function askForStage(message = "What stage are you working with?") {
  const question = {
    type: "list",
    name: "stage",
    message,
    default: "dev",
    choices: ["dev", "test", "stage", "prod"]
  };
  const answer = await import_inquirer7.default.prompt(question);
  return answer.stage;
}

// src/shared/serverless/findAllHandlerFiles.ts
init_cjs_shims();
var import_globby4 = __toModule(require("globby"));
var import_path8 = __toModule(require("path"));

// src/shared/serverless/findConfigFunctionDefnFiles.ts
init_cjs_shims();
var import_globby5 = __toModule(require("globby"));
var import_path9 = __toModule(require("path"));

// src/shared/serverless/findInlineFunctionDefnFiles.ts
init_cjs_shims();
var import_globby6 = __toModule(require("globby"));
var import_path10 = __toModule(require("path"));

// src/shared/serverless/getAccountInfoFromServerlessYaml.ts
init_cjs_shims();

// src/shared/serverless/getServerlessYaml.ts
init_cjs_shims();
var import_fs5 = __toModule(require("fs"));
var import_path11 = __toModule(require("path"));
var import_js_yaml = __toModule(require("js-yaml"));
async function getServerlessYaml() {
  const baseStructure = {
    functions: {},
    stepFunctions: { stateMachines: {} }
  };
  try {
    const fileContents = import_fs5.default.readFileSync(import_path11.default.join(process.cwd(), "serverless.yml"), {
      encoding: "utf-8"
    });
    const config = (0, import_js_yaml.load)(fileContents);
    return __spreadValues(__spreadValues({}, baseStructure), config);
  } catch (error) {
    const error_ = isDevopsError(error) ? new DevopsError(`Failure getting serverless.yml: ${error.message}`, error.name) : new DevopsError(`Failure getting serverless.yml`, "serverless/not-ready");
    throw error_;
  }
}

// src/shared/serverless/getAccountInfoFromServerlessYaml.ts
async function getAccountInfoFromServerlessYaml() {
  var _a, _b;
  try {
    const config = await getServerlessYaml();
    const info3 = {
      name: typeof config.service === "string" ? config.service : config.service.name,
      accountId: (_a = config == null ? void 0 : config.custom) == null ? void 0 : _a.accountId,
      region: config.provider.region,
      profile: config.provider.profile,
      pluginsInstalled: config.plugins || []
    };
    if ((_b = config == null ? void 0 : config.custom) == null ? void 0 : _b.logForwarding) {
      info3.logForwarding = config.custom.logForwarding.destinationARN;
    }
    return info3;
  } catch (error) {
    throw new DevopsError(`Problems getting serverless.yml's account info: ${error.message}`, "serverless-framework/account-info");
  }
}

// src/shared/serverless/getAwsProfileFromServerless.ts
init_cjs_shims();
var import_chalk23 = __toModule(require("chalk"));

// src/shared/observations/isServerless.ts
init_cjs_shims();
var import_fs6 = __toModule(require("fs"));
var import_path12 = __toModule(require("path"));
async function isServerless() {
  const hasServerlessConfig = import_fs6.default.existsSync(import_path12.default.join(process.cwd(), "serverless.yml"));
  let slsConfig;
  try {
    slsConfig = await getServerlessYaml();
  } catch {
  }
  const pkgJson = getPackageJson();
  const hasAsDevDep = pkgJson ? Object.keys(pkgJson.devDependencies || {}).includes("serverless") : false;
  const isUsingTypescriptMicroserviceTemplate = import_fs6.default.existsSync(import_path12.default.join(process.cwd(), "serverless-config/config.ts"));
  const hasProviderSection = slsConfig && slsConfig.provider ? true : false;
  const configIsParsable = hasServerlessConfig && slsConfig ? true : false;
  return hasServerlessConfig || hasAsDevDep || isUsingTypescriptMicroserviceTemplate ? {
    hasServerlessConfig,
    hasAsDevDep,
    isUsingTypescriptMicroserviceTemplate,
    hasProviderSection,
    configIsParsable
  } : false;
}

// src/shared/serverless/getLambdaFunctions.ts
init_cjs_shims();
var import_aws_sdk7 = __toModule(require("aws-sdk"));

// src/shared/serverless/getLocalHandlerInfo.ts
init_cjs_shims();

// src/shared/ast/index.ts
init_cjs_shims();

// src/shared/ast/astParseWithAcorn.ts
init_cjs_shims();
var recast = __toModule(require("recast"));

// src/@types/index.ts
init_cjs_shims();

// src/@types/ast-types.ts
init_cjs_shims();

// src/@types/aws.ts
init_cjs_shims();

// src/@types/build.ts
init_cjs_shims();

// src/@types/command.ts
init_cjs_shims();
var import_common_types3 = __toModule(require("common-types"));
function isCommandDescriptor(desc) {
  return (0, import_common_types3.isNonNullObject)(desc) && desc.short && desc.complete ? true : false;
}
function isDynamicCommandDefinition(defn) {
  return typeof defn === "function";
}
function isDoDevopsCommand(cmd) {
  return typeof cmd === "object" && typeof cmd.handler === "function" && typeof cmd.kind === "string" && cmd.description !== void 0;
}

// src/@types/config-types.ts
init_cjs_shims();
function configIsReady(config) {
  return typeof config === "object" && config !== null && config.kind === "integrated" && config.ready || config.kind === "project" && config.projectConfig === true || config.kind === "user" && config.userConfig === true;
}

// src/@types/defaultConfig.ts
init_cjs_shims();
var BuildTool;
(function(BuildTool2) {
  BuildTool2["typescript"] = "typescript";
  BuildTool2["webpack"] = "webpack";
  BuildTool2["rollup"] = "rollup";
  BuildTool2["bili"] = "bili";
  BuildTool2["yarn"] = "typescript";
  BuildTool2["npm"] = "webpack";
  BuildTool2["other"] = "rollup";
  BuildTool2["none"] = "bili";
})(BuildTool || (BuildTool = {}));

// src/@types/file-types.ts
init_cjs_shims();
function isFilenameNotContent(input) {
  return input.filename !== void 0;
}

// src/@types/general.ts
init_cjs_shims();

// src/@types/global.ts
init_cjs_shims();

// src/@types/image-types.ts
init_cjs_shims();

// src/@types/interactive-types.ts
init_cjs_shims();

// src/@types/npm-types.ts
init_cjs_shims();

// src/@types/observations.ts
init_cjs_shims();

// src/@types/option-types.ts
init_cjs_shims();

// src/@types/serverless-types.ts
init_cjs_shims();

// src/@types/test.ts
init_cjs_shims();
var UnitTestFramework;
(function(UnitTestFramework2) {
  UnitTestFramework2["jest"] = "jest";
  UnitTestFramework2["mocha"] = "mocha";
  UnitTestFramework2["other"] = "other";
})(UnitTestFramework || (UnitTestFramework = {}));

// src/@types/webpack.ts
init_cjs_shims();

// src/shared/ast/astParseWithAcorn.ts
function astParseWithAcorn(source) {
  const content = isFilenameNotContent(source) ? readFile(source.filename) : source.content;
  if (!content) {
    throw new DevopsError(`source passed to astParseWithAcron() was not valid`, "ast/invalid-source");
  }
  return recast.parse(content, {
    parser: require("recast/parsers/acorn")
  });
}

// src/shared/ast/astParseWithTypescript.ts
init_cjs_shims();
var recast2 = __toModule(require("recast"));
var import_fs7 = __toModule(require("fs"));
function astParseWithTypescript(filename) {
  const fileContents = (0, import_fs7.readFileSync)(filename, {
    encoding: "utf-8"
  });
  return filename.includes(".ts") ? recast2.parse(fileContents, {
    parser: require("recast/parsers/typescript")
  }) : recast2.parse(fileContents);
}

// src/shared/ast/findHandlerComments.ts
init_cjs_shims();

// src/shared/ast/findHandlerConfig.ts
init_cjs_shims();
var import_chalk24 = __toModule(require("chalk"));
function findHandlerConfig(filename, isWebpackZip = false) {
  const ast = astParseWithTypescript(filename);
  const hash = {};
  const config = namedExports(ast).find((i) => i.name === "config");
  if (!config) {
    return;
  } else {
    const fn = (filename.split("/").pop() || "").replace(".ts", "");
    for (const i of config.properties || []) {
      hash[i.name] = i.value;
    }
    hash.handler = isWebpackZip ? `.webpack/${fn}.handler` : filename.replace(".ts", ".handler");
    if (isWebpackZip) {
      if (hash.package) {
        console.log(import_chalk24.default`{grey - the handler function "${fn}" had a defined package config but it will be replaced by a {italic artifact} reference}`);
      }
      hash.package = { artifact: `.webpack/${fn}.zip` };
    }
    return {
      interface: config.interface,
      config: hash
    };
  }
}

// src/shared/ast/getDefaultExport.ts
init_cjs_shims();
function reduce(exp) {
  var _a, _b, _c, _d, _e, _f, _g;
  const symbols = new Set((_c = (_b = (_a = exp == null ? void 0 : exp.callee) == null ? void 0 : _a.loc) == null ? void 0 : _b.tokens) == null ? void 0 : _c.filter((t) => {
    var _a2;
    return ((_a2 = t == null ? void 0 : t.type) == null ? void 0 : _a2.label) === "name";
  }).map((i) => i.value));
  return {
    defaultExport: (_d = exp == null ? void 0 : exp.callee) == null ? void 0 : _d.name,
    symbols: [...symbols],
    args: (_g = (_f = (_e = exp == null ? void 0 : exp.callee) == null ? void 0 : _e.loc) == null ? void 0 : _f.tokens) == null ? void 0 : _g.filter((t) => t.type.label === "string").map((i) => i.value)
  };
}
function getDefaultExport(source) {
  var _a, _b, _c;
  const content = isFilenameNotContent(source) ? readFile(source.filename) : source.content;
  if (!content) {
    throw new DevopsError(`invalid source content passed into getDefaultExport()`, `ast/invalid-source`);
  }
  const defaultExports2 = ((_b = (_a = astParseWithAcorn(source).program) == null ? void 0 : _a.body) == null ? void 0 : _b.filter((i) => isTypeBasedObject(i) && i.type === "ExportDefaultDeclaration")) || [];
  if (defaultExports2.length > 1) {
    throw new DevopsError(`There were MORE than one default exports!`, "ast/too-many-exports");
  }
  return defaultExports2.length === 0 ? false : reduce((_c = defaultExports2[0]) == null ? void 0 : _c.declaration);
}

// src/shared/ast/getValidServerlessHandlers.ts
init_cjs_shims();
var import_chalk25 = __toModule(require("chalk"));
var import_globby7 = __toModule(require("globby"));
var import_path13 = __toModule(require("path"));
function getValidServerlessHandlers(opts = {}) {
  const allFiles = (0, import_globby7.sync)(import_path13.default.join(process.env.PWD || "", "/src/**/*.ts"));
  return allFiles.reduce((agg, curr) => {
    let ast;
    let status = "starting";
    try {
      ast = astParseWithTypescript(curr);
      status = "file-parsed";
      if (!ast.program.body[0].source) {
        if (opts.verbose) {
          console.log(import_chalk25.default`{grey - the file {blue ${toRelativePath(curr)}} has no source content; will be ignored}`);
        }
        return agg;
      }
      const loc = ast.program.body[0].source.loc;
      status = "loc-identified";
      const handler15 = loc.tokens.find((i) => i.value === "handler");
      status = handler15 ? "handler-found" : "handler-missing";
      if (handler15) {
        if (!Array.isArray(agg)) {
          throw new TypeError(`Found a handler but somehow the file aggregation is not an array! ${handler15}`);
        }
        agg.push(curr);
      }
      return agg;
    } catch (error) {
      console.log(import_chalk25.default`- Error processing  {red ${toRelativePath(curr)}} [s: ${status}]: {grey ${error.message}}`);
      return agg;
    }
  }, []);
}

// src/shared/ast/getValidStepFunctions.ts
init_cjs_shims();
var import_chalk26 = __toModule(require("chalk"));
var import_globby8 = __toModule(require("globby"));
var import_path14 = __toModule(require("path"));
var import_native_dash6 = __toModule(require("native-dash"));
function getValidStepFunctions(opts = {}) {
  const allFiles = (0, import_globby8.sync)(import_path14.default.join(process.env.PWD || "", "/src/**/*.ts"));
  return allFiles.filter((f) => fileIncludes(f, "StateMachine")).reduce((agg, curr) => {
    let ast;
    let status = "starting";
    try {
      write(getFileComponents(curr).fileWithoutExt + "-acorn.json", astParseWithAcorn({ filename: curr }).program.body.map((i) => ({
        type: i.type,
        description: Object.keys(i).map((k) => (0, import_native_dash6.describe)(k))
      })), { allowOverwrite: true });
      console.log({
        file: curr,
        parsed: getDefaultExport({ filename: curr })
      });
      ast = astParseWithTypescript(curr);
      status = "file-parsed";
      if (!ast.program.body[0].source) {
        if (opts.verbose) {
          console.log(import_chalk26.default`{grey - the file {blue ${toRelativePath(curr)}} has no source content; will be ignored}`);
        }
        return agg;
      }
      const loc = ast.program.body[0].source.loc;
      status = "loc-identified";
      const handler15 = loc.tokens.find((i) => i.value === "default");
      status = handler15 ? "found" : "missing";
      if (handler15) {
        if (!Array.isArray(agg)) {
          throw new TypeError(`Found a Step Function but the file aggregation is not an array! ${handler15}`);
        }
        agg.push(curr);
      }
      return agg;
    } catch (error) {
      console.log(import_chalk26.default`- Error processing  {red ${toRelativePath(curr)}} [s: ${status}]: {grey ${error.message}}`);
      return agg;
    }
  }, []);
}

// src/shared/ast/isTypeBasedObject.ts
init_cjs_shims();
var import_common_types4 = __toModule(require("common-types"));
function isTypeBasedObject(thing) {
  return (0, import_common_types4.isNonNullObject)(thing) && thing.type;
}

// src/shared/ast/namedExports.ts
init_cjs_shims();
var import_native_dash7 = __toModule(require("native-dash"));
function getSpread(node) {
  return (0, import_native_dash7.get)(node, "argument.name");
}
function getValue(node) {
  switch (node.type) {
    case "Literal":
    case "StringLiteral":
    case "NumericLiteral":
    case "BooleanLiteral":
      return (0, import_native_dash7.get)(node, "value");
    case "TemplateLiteral":
      return (0, import_native_dash7.get)(node, "quasis.0.value.cooked");
    case "ObjectExpression":
      return (0, import_native_dash7.get)(node, "properties", []).reduce((agg, i) => {
        agg[(0, import_native_dash7.get)(i, "key.name")] = getValue((0, import_native_dash7.get)(i, "value"));
        return agg;
      }, {});
    case "ArrayExpression":
      return (0, import_native_dash7.get)(node, "elements", []).map((i) => getValue(i));
    case "SpreadElement":
      return getSpread(node);
    default:
      console.log("unknown type:", node.type);
      write(`unhandled-node-${node.type}.json`, node, { offsetIfExists: true });
  }
}
function getVariableDeclaration(declaration) {
  const root = (0, import_native_dash7.get)(declaration, "declarations.0");
  const type = (0, import_native_dash7.get)(root, "init.type");
  const properties = (0, import_native_dash7.get)(root, "init.properties", []).map((i) => ({
    name: (0, import_native_dash7.get)(i, "key.name"),
    value: getValue((0, import_native_dash7.get)(i, "value")),
    type: (0, import_native_dash7.get)(i, "value.type")
  }));
  const params = (0, import_native_dash7.get)(root, "init.params", []).map((i) => (0, import_native_dash7.get)(i, "name", ""));
  return __spreadValues(__spreadValues({
    name: (0, import_native_dash7.get)(root, "id.name"),
    interface: (0, import_native_dash7.get)(root, "id.typeAnnotation.typeAnnotation.typeName.name"),
    type
  }, properties ? { properties } : {}), params.length > 0 ? { params } : {});
}
function getInterfaceDeclaration(declaration) {
  return {
    name: (0, import_native_dash7.get)(declaration, "id.name")
  };
}
function namedExports(file) {
  const ast = typeof file === "string" ? astParseWithTypescript(file) : file;
  const namedExports3 = ast.program.body.filter((i) => i.type === "ExportNamedDeclaration");
  const output = [];
  for (const i of namedExports3) {
    const type = (0, import_native_dash7.get)(i, "declaration.type");
    output.push(__spreadValues({
      type,
      kind: (0, import_native_dash7.get)(i, "declaration.kind") || type === "TSTypeAliasDeclaration" ? "type" : type === "TSInterfaceDeclaration" ? "interface" : "",
      interface: (0, import_native_dash7.get)(i, "declaration.declarations.0.id.typeAnnotation.typeAnnotation.typeName.name", null),
      comments: (0, import_native_dash7.get)(i, "comments", [])
    }, type === "VariableDeclaration" ? getVariableDeclaration((0, import_native_dash7.get)(i, "declaration")) : type === "TSInterfaceDeclaration" ? getInterfaceDeclaration((0, import_native_dash7.get)(i, "declaration")) : { name: "" }));
  }
  return output;
}

// src/shared/ast/validateWebpackConfig.ts
init_cjs_shims();
var import_path15 = __toModule(require("path"));

// src/shared/serverless/getLocalHandlerInfo.ts
var import_path16 = __toModule(require("path"));
var import_native_dash8 = __toModule(require("native-dash"));
var _cache;
async function getLocalHandlerInfo(breakCache = false) {
  if (_cache && !breakCache) {
    return _cache;
  }
  const sourcePaths = getValidServerlessHandlers();
  const convertToWebpackPath = (source) => import_path16.default.join(process.cwd(), ".webpack", (source.split("/").pop() || "").replace(".ts", ".js"));
  const webpackPaths = sourcePaths.map((i) => convertToWebpackPath(i));
  const sourceInfo = await fileInfo(...sourcePaths);
  const webpackFilesExist = filesExist(...webpackPaths);
  const webpackInfo = webpackFilesExist ? await fileInfo(...webpackFilesExist) : [];
  return sourceInfo.reduce((agg, source) => {
    return __spreadProps(__spreadValues({}, agg), {
      fn: source.filename,
      source: source.filepath,
      sourceModified: source.mtime,
      webpack: convertToWebpackPath(source.filepath),
      webpackModified: (0, import_native_dash8.get)(webpackInfo.find((w) => w.filename === source.filename) || {}, "stats.mtime", new Date("1970-01-01"))
    });
  }, []);
}

// src/shared/serverless/getMicroserviceConfig.ts
init_cjs_shims();
var import_chalk27 = __toModule(require("chalk"));
var import_path17 = __toModule(require("path"));
var import_async_shelljs3 = __toModule(require("async-shelljs"));

// src/shared/serverless/getServerlessBuildConfiguration.ts
init_cjs_shims();
var import_typed_mapper = __toModule(require("typed-mapper"));

// src/shared/yeoman/index.ts
init_cjs_shims();

// src/shared/yeoman/getYeomanConfig.ts
init_cjs_shims();
var import_chalk28 = __toModule(require("chalk"));
var import_fs8 = __toModule(require("fs"));
var import_destr4 = __toModule(require("destr"));
var import_path18 = __toModule(require("path"));
function getYeomanConfig(scaffold = "generator-lambda-typescript") {
  const yoFile = import_path18.default.posix.join(process.cwd(), ".yo-rc.json");
  const transientFile = import_path18.default.posix.join(process.cwd(), ".yo-transient.json");
  const hasYo = (0, import_fs8.existsSync)(yoFile);
  const hasTransient = (0, import_fs8.existsSync)(transientFile);
  let yo = {};
  let transient = {};
  if (hasYo) {
    try {
      yo = (0, import_destr4.default)((0, import_fs8.readFileSync)(yoFile, "utf-8"))[scaffold];
    } catch {
      console.log(import_chalk28.default`- there appears to {italic be} a yeoman config file but it could not be parsed ${emoji.poop}`);
      console.log(import_chalk28.default`{grey - Note: we are looking for the "${scaffold}" as a root property, other yeoman scaffoldings are not considered}`);
    }
  }
  if (hasTransient) {
    try {
      transient = (0, import_destr4.default)((0, import_fs8.readFileSync)(transientFile, "utf-8"));
    } catch {
      console.log(import_chalk28.default`- there appears to be a {italic transient} yeoman config file -- {blue .yo-transient.json} -- but it could not be parsed ${emoji.poop}`);
    }
  }
  return __spreadValues(__spreadValues({}, transient), yo);
}

// src/shared/yeoman/getYeomanScaffolds.ts
init_cjs_shims();
var import_fs9 = __toModule(require("fs"));
var import_destr5 = __toModule(require("destr"));
var import_path19 = __toModule(require("path"));
function getYeomanScaffolds() {
  const yoFile = import_path19.default.posix.join(process.cwd(), ".yo-rc.json");
  const hasYo = (0, import_fs9.existsSync)(yoFile);
  if (!hasYo) {
    return [];
  }
  return Object.keys((0, import_destr5.default)((0, import_fs9.readFileSync)(yoFile, "utf-8")));
}

// src/shared/serverless/getServerlessBuildConfiguration.ts
function transformYeomanFormat(input) {
  return import_typed_mapper.TypedMapper.map({
    name: "serviceName",
    accountId: "awsAccount",
    profile: "awsProfile",
    region: "awsRegion",
    devDependencies: () => [],
    pluginsInstalled: () => []
  }).convertObject(input);
}
async function getServerlessBuildConfiguration() {
  const modern = getYeomanScaffolds().includes("generator-lambda-typescript");
  const pkg = getPackageJson();
  if (!pkg) {
    throw new DevopsError(`Attempt to build Serverless configuration failed as there is no package.json the current working directory!`, "not-ready/missing-package-json");
  }
  const knownAccountInfo = __spreadProps(__spreadValues({}, modern ? transformYeomanFormat(getYeomanConfig()) : await getAccountInfoFromServerlessYaml()), {
    devDependencies: Object.keys(pkg.devDependencies || {}),
    pluginsInstalled: Object.keys(pkg.devDependencies || {}).filter((i) => i.startsWith("serverless-"))
  });
  const accountInfo = await askForAccountInfo(knownAccountInfo);
  return accountInfo;
}

// src/shared/serverless/sandbox.ts
init_cjs_shims();
var import_async_shelljs4 = __toModule(require("async-shelljs"));

// src/shared/git/index.ts
init_cjs_shims();

// src/shared/git/convertGitUrlToHttp.ts
init_cjs_shims();
function convertGitUrlToHttp(gitUrl) {
  return gitUrl.replace(/git(\+(ssh|https)){0,1}:\/\/(git@){0,1}/, "https://").replace(/\.git$/, "");
}

// src/shared/git/findOrgFromGitRemote.ts
init_cjs_shims();

// src/shared/git/getGitBranch.ts
init_cjs_shims();

// src/shared/git/git.ts
init_cjs_shims();
var import_simple_git = __toModule(require("simple-git"));
function git(dir, options16 = {}) {
  if (!dir) {
    dir = currentDirectory();
  }
  return (0, import_simple_git.default)(dir, options16);
}

// src/shared/git/getGitBranch.ts
async function getCurrentGitBranch(baseDir) {
  baseDir = baseDir ? baseDir : process.cwd();
  const g = git(baseDir);
  const branch = await g.branch();
  return branch.current;
}

// src/shared/git/getGitLastCommit.ts
init_cjs_shims();
async function getGitLastCommit() {
  const latest = (await git().log({ maxCount: 1, strictDate: true })).latest;
  return latest;
}

// src/shared/git/getGitLog.ts
init_cjs_shims();

// src/shared/git/getGitRemote.ts
init_cjs_shims();
async function getGitRemotes(baseDir) {
  try {
    baseDir = baseDir ? baseDir : process.cwd();
    const g = git(baseDir);
    const remotes = await g.getRemotes(true);
    return remotes.length > 0 ? remotes : [];
  } catch {
    return [];
  }
}

// src/shared/git/gitTags.ts
init_cjs_shims();

// src/shared/serverless/saveToServerlessYaml.ts
init_cjs_shims();
var import_chalk29 = __toModule(require("chalk"));
var import_fs10 = __toModule(require("fs"));
var import_path20 = __toModule(require("path"));
var import_js_yaml2 = __toModule(require("js-yaml"));
async function saveToServerlessYaml(data) {
  try {
    const filename = import_path20.default.join(process.cwd(), "serverless.yml");
    console.log({ filename, data });
    const yamlData = (0, import_js_yaml2.dump)(data);
    import_fs10.default.writeFileSync(filename, yamlData, { encoding: "utf-8" });
  } catch (error) {
    console.log(import_chalk29.default`- {red writing the {bold serverless.yml} file has failed!} ${emoji.poop}`);
    expect(isDevopsError(error)).toBeTruthy();
    if (isDevopsError(error)) {
      console.log(error.message);
      console.log(import_chalk29.default`{dim ${error.stack}}`);
      process.exit();
    }
  }
}

// src/shared/serverless/serverlessYamlExists.ts
init_cjs_shims();
var import_fs11 = __toModule(require("fs"));
var import_path21 = __toModule(require("path"));
function serverlessYamlExists() {
  return (0, import_fs11.existsSync)(import_path21.default.posix.join(process.cwd(), "serverless.yml"));
}

// src/shared/serverless/accountInfo/index.ts
init_cjs_shims();

// src/shared/serverless/accountInfo/askForAccountInfo.ts
init_cjs_shims();
var import_common_types5 = __toModule(require("common-types"));
var import_inquirer8 = __toModule(require("inquirer"));
var import_chalk30 = __toModule(require("chalk"));
async function askForAccountInfo(config = {}) {
  const pkgJson = getPackageJson();
  const profiles = await getAwsProfileDictionary();
  if (config.profile && config.name && config.accountId && config.region && config.pluginsInstalled && (config.logForwarding || pkgJson && !Object.keys(pkgJson.devDependencies || {}).includes("serverless-log-forwarding"))) {
    return config;
  }
  const baseProfileQuestion = {
    name: "profile",
    message: "Choose a profile from your AWS credentials file",
    default: config.profile,
    when: () => !config.profile
  };
  const profileQuestion = profiles ? __spreadValues(__spreadValues({}, baseProfileQuestion), {
    type: "list",
    choices: Object.keys(profiles)
  }) : __spreadValues(__spreadValues({}, baseProfileQuestion), { type: "input" });
  let questions = [
    {
      type: "input",
      name: "name",
      message: "What is the Service Name for this repo?",
      default: config.name || pkgJson ? pkgJson.name : void 0,
      when: () => !config.name
    },
    profileQuestion
  ];
  let answers2 = await import_inquirer8.default.prompt(questions);
  const merged = __spreadValues(__spreadValues({}, config), answers2);
  if (merged.profile && !userHasAwsProfile(merged.profile)) {
    console.log(import_chalk30.default`- you are deploying with the {green ${merged.profile} AWS profile but you do not have this defined yet! ${emoji.angry}`);
    console.log(import_chalk30.default`{grey - AWS profiles must be added in {blue ~/.aws/credentials}}`);
    console.log(import_chalk30.default`{grey - if you want to override the default behavior you can state a different profile with the {blue --profile} tag}`);
    process.exit();
  }
  if (!merged.profile) {
    console.log(import_chalk30.default`- you have not provided an AWS {bold profile}; exiting ...`);
    process.exit();
  }
  if (!await userHasAwsProfile(merged.profile)) {
    console.log(import_chalk30.default`- you do {bold NOT} have the credentials for the profile {blue ${merged.profile}}! Please add this before\n  trying again. ${emoji.angry}\n`);
    console.log(import_chalk30.default`{grey - the credentials file is located at {blue ~/.aws/credentials}}\n`);
    process.exit();
  }
  const awsProfile = await getAwsProfile(merged.profile);
  if (merged.region) {
    config.region = awsProfile.region;
  }
  if (!merged.accountId) {
    console.log(import_chalk30.default`- looking up the Account ID for the given profile`);
    try {
      merged.accountId = (await getAwsIdentityFromProfile(awsProfile)).accountId;
    } catch {
    }
  }
  questions = [
    {
      type: "input",
      name: "accountId",
      message: "what is the Amazon Account ID which you are deploying to?",
      when: () => !merged.accountId
    },
    {
      type: "list",
      name: "region",
      message: "what is the region you will be deploying to?",
      choices: import_common_types5.AWS_REGIONS,
      default: merged.region || awsProfile.region || "us-east-1",
      when: () => !config.region
    }
  ];
  let plugins;
  try {
    const sls = await getServerlessYaml();
    plugins = { pluginsInstalled: sls.plugins || [] };
  } catch {
    plugins = { pluginsInstalled: [] };
  }
  answers2 = __spreadValues(__spreadValues(__spreadValues({}, plugins), answers2), await import_inquirer8.default.prompt(questions));
  return merged;
}

// src/shared/serverless/build/index.ts
init_cjs_shims();

// src/shared/serverless/build/buildLambdaTypescriptProject.ts
init_cjs_shims();
var import_chalk31 = __toModule(require("chalk"));
var os = __toModule(require("os"));
var import_async_shelljs5 = __toModule(require("async-shelljs"));
var ACCOUNT_INFO_YAML = "./serverless-config/account-info.yml";
async function buildLambdaTypescriptProject(opts = {}, _config = {}, configFn) {
  var _a;
  const modern = getYeomanScaffolds().includes("generator-lambda-typescript");
  const accountInfo = await getServerlessBuildConfiguration();
  const hasWebpackPlugin = (_a = accountInfo == null ? void 0 : accountInfo.devDependencies) == null ? void 0 : _a.includes("serverless-webpack");
  if (opts.force) {
  }
  if (!modern) {
    saveYamlFile(ACCOUNT_INFO_YAML, accountInfo);
  }
  console.log(import_chalk31.default`- The account info for {bold ${accountInfo.name} [ }{dim ${accountInfo.accountId}} {bold ]} has been gathered`);
  const handlerInfo = await getLocalHandlerInfo();
  console.log(import_chalk31.default`{grey - handler functions [ {bold ${String(handlerInfo.length)}} ] have been identified}`);
  await createInlineExports(handlerInfo);
  console.log(import_chalk31.default`{grey - The inline function configuration file [ {bold {italic serverless-config/functions/inline.ts}} ] has been configured}`);
  await createFunctionEnum(handlerInfo);
  console.log(import_chalk31.default`{grey - The enumeration and type [ {bold {italic src/@types/functions.ts}} ] for the available functions has been configured }`);
  if (!hasWebpackPlugin) {
    await createWebpackEntryDictionaries(handlerInfo.map((i) => i.source));
    console.log(import_chalk31.default`{grey - added webpack {italic entry files} to facilitate code build and watch operations}`);
  } else {
    const exist = filesExist("webpack.js-entry-points.json", "webpack.js-entry-points.json");
    if (exist) {
      (0, import_async_shelljs5.rm)(...exist);
      console.log(import_chalk31.default`- ${emoji.eyeballs} removed webpack entry point files so as not to confuse with what the {italic serverless-webpack} plugin is doing}`);
    }
  }
  if (modern && configFn) {
    const serverless = configFn(accountInfo);
    await saveToServerlessYaml(serverless);
  } else {
    console.log(import_chalk31.default`- handing off the build of the {green {bold serverless.yml}} to the repo's {bold build} script\n`);
    await (0, import_async_shelljs5.asyncExec)("yarn ts-node serverless-config/build.ts --color=always", {
      env: __spreadValues(__spreadProps(__spreadValues({}, process.env), {
        TERM: "xterm-color"
      }), os.platform().includes("win") ? {} : { shell: "/bin/bash" })
    });
    (0, import_async_shelljs5.rm)(ACCOUNT_INFO_YAML);
    console.log(import_chalk31.default`{grey - removed the temporary {blue account-info.yml} file from the repo}`);
  }
  console.log(import_chalk31.default`{green - {bold serverless.yml} has been updated successfully ${emoji.rocket}}\n`);
}

// src/shared/serverless/build/clearOldFiles.ts
init_cjs_shims();
var import_path22 = __toModule(require("path"));
var import_fs12 = __toModule(require("fs"));
var import_async_shelljs6 = __toModule(require("async-shelljs"));

// src/shared/serverless/build/createFunctionEnum.ts
init_cjs_shims();
var import_chalk32 = __toModule(require("chalk"));
var import_path23 = __toModule(require("path"));
var import_fs13 = __toModule(require("fs"));
var import_util = __toModule(require("util"));
var write2 = (0, import_util.promisify)(import_fs13.writeFile);
async function createFunctionEnum(handlers) {
  const header = `export enum AvailableFunction {
`;
  const footer = `
}
  
export type IAvailableFunction = keyof typeof AvailableFunction;
`;
  const body = [];
  for (const handler15 of handlers) {
    const config = findHandlerConfig(handler15.source);
    if (!config) {
      console.log(import_chalk32.default`- ${emoji.angry} also excluding the {italic ${handler15.source.split("/").pop()}} in the generated enumeration of handlers`);
    } else {
      const fn = handler15.fn;
      const comment2 = config.config.description ? config.config.description : `${fn} handler`;
      body.push(`
  /**
   * ${comment2}
   **/
  ${fn} = "${fn}"`);
    }
  }
  const fileText = `${header}${body.join(",")}${footer}`;
  if (!(0, import_fs13.existsSync)(import_path23.default.join(process.cwd(), "/src/@types"))) {
    (0, import_fs13.mkdirSync)(import_path23.default.join(process.cwd(), "/src/@types"));
  }
  await write2(import_path23.default.resolve(import_path23.default.join(process.cwd(), "/src/@types/functions.ts")), fileText, {
    encoding: "utf-8"
  });
  return fileText;
}

// src/shared/serverless/build/createInlineExports.ts
init_cjs_shims();
var import_chalk33 = __toModule(require("chalk"));
var import_path24 = __toModule(require("path"));
var import_fs14 = __toModule(require("fs"));
var import_common_types6 = __toModule(require("common-types"));
function objectPrint(obj) {
  const contents = [];
  for (const key of Object.keys(obj)) {
    let value = obj[key];
    if (typeof value === "string") {
      value = `"${value.replace(/"/g, '\\"')}"`;
    }
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    contents.push(`  ${key}: ${value}`);
    contents.join(",\n	");
    continue;
  }
  return contents;
}
function warnAboutMissingTyping(config) {
  const incorrectOrMissingTyping = config.filter((i) => i.interface !== "IHandlerConfig");
  if (incorrectOrMissingTyping.length > 0) {
    console.log(import_chalk33.default`- there were ${String(incorrectOrMissingTyping.length)} handler functions who defined a {italic config} but did not type it as {bold IHandlerConfig}`);
    console.log(import_chalk33.default`{grey - the function configs needing attention are: {italic ${incorrectOrMissingTyping.map((i) => (0, import_common_types6.isServerlessFunctionHandler)(i.config) ? i.config.handler : i.config.image).join(", ")}}}`);
  }
}
async function createInlineExports(handlers) {
  var _a;
  const header = 'import { IServerlessFunction } from "common-types";\n';
  const body = [];
  const config = [];
  for (const handler15 of handlers) {
    const handlerConfig = findHandlerConfig(handler15.source, false);
    if (handlerConfig && handlerConfig.interface) {
      config.push(handlerConfig);
    } else {
      console.log(import_chalk33.default`- ${emoji.poop} the {red ${toRelativePath(handler15.source)}} file will be ignored as a handler as it has no CONFIG section defined. This is probably a mistake!`);
    }
  }
  const exportSymbols = [];
  warnAboutMissingTyping(config);
  for (const handler15 of config) {
    if ((0, import_common_types6.isServerlessFunctionHandler)(handler15.config)) {
      const fnName = (((_a = handler15 == null ? void 0 : handler15.config) == null ? void 0 : _a.handler.split("/").pop()) || "").replace(/\.[^.]+$/, "");
      exportSymbols.push(fnName);
      const symbol = `const ${fnName}: IServerlessFunction = { 
  ${objectPrint(handler15.config)}
  }
  `;
      body.push(symbol);
    } else {
      console.warn(`[${handler15.config.image}]: the serverless function passed into createInlineExports appears to define an "image" rather than a "handler". This should be investigated!`);
    }
  }
  const file = `
${header}
${body.join("\n")}

export default {
  ${exportSymbols.join(",\n	")}
}`;
  (0, import_fs14.writeFileSync)(import_path24.default.join(process.env.PWD || "", "serverless-config/functions/inline.ts"), file, {
    encoding: "utf-8"
  });
}

// src/shared/serverless/build/createWebpackEntryDictionaries.ts
init_cjs_shims();
var import_path25 = __toModule(require("path"));
function useKey(key) {
  return (agg, curr) => {
    agg[curr.fn] = curr[key];
    return agg;
  };
}
async function createWebpackEntryDictionaries(handlerFns) {
  const data = handlerFns.reduce((agg, f) => {
    const fn = (f.split("/").pop() || "").replace(".ts", "");
    const tsPath = "./" + import_path25.default.relative(process.cwd(), f);
    const jsPath = (tsPath.split("/").pop() || "").replace(/(.*)/, ".webpack/$1").replace(".ts", ".js");
    return [...agg, { fn, tsPath, jsPath }];
  }, []);
  await Promise.all([
    write("webpack.ts-entry-points.json", data.reduce(useKey("tsPath"), {})),
    write("webpack.js-entry-points.json", data.reduce(useKey("jsPath"), {}))
  ]);
}

// src/shared/serverless/build/saveFunctionsTypeDefinition.ts
init_cjs_shims();
var import_chalk34 = __toModule(require("chalk"));
var import_fs15 = __toModule(require("fs"));
var import_path26 = __toModule(require("path"));

// src/shared/serverless/build/writeInlineFunctions.ts
init_cjs_shims();
var fs5 = __toModule(require("fs"));
var import_path27 = __toModule(require("path"));
var import_util2 = __toModule(require("util"));
var writeFile3 = (0, import_util2.promisify)(fs5.writeFile);

// src/shared/serverless/build/zipWebpackFiles.ts
init_cjs_shims();
var import_chalk35 = __toModule(require("chalk"));
var import_path28 = __toModule(require("path"));

// src/@polyfills/bestzip.ts
init_cjs_shims();

// src/shared/serverless/build/zipWebpackFiles.ts
var import_bestzip2 = __toModule(require("bestzip"));

// src/shared/serverless/functions/index.ts
init_cjs_shims();

// src/shared/serverless/functions/detectDuplicateFunctionDefinitions.ts
init_cjs_shims();

// src/shared/serverless/functions/functions.ts
init_cjs_shims();
var import_path29 = __toModule(require("path"));
var import_fs16 = __toModule(require("fs"));

// src/shared/serverless/functions/getFilePath.ts
init_cjs_shims();

// src/shared/serverless/functions/getFunctionNames.ts
init_cjs_shims();

// src/shared/serverless/functions/getNamespacedLookup.ts
init_cjs_shims();
var import_path30 = __toModule(require("path"));

// src/shared/serverless/functions/validateExports.ts
init_cjs_shims();

// src/shared/serverless/layers/index.ts
init_cjs_shims();

// src/shared/serverless/layers/getLayersWithMeta.ts
init_cjs_shims();
var import_path31 = __toModule(require("path"));
function getLayersFromPackageJson() {
  const pkg = getPackageJson();
  if (!pkg) {
    throw new DevopsError(`Attempt to read layers from package.json but file is missing!`, "not-ready/missing-package-json");
  }
  const devDeps = Object.keys(pkg.devDependencies || {});
  const pkgJsonFiles = devDeps.filter((d) => {
    const foreignPkg = getPackageJson(import_path31.default.join(process.cwd(), "node_modules", d));
    if (!foreignPkg) {
      throw new DevopsError(`Attempt to get info on package info on "" requires that it be installed in the repo. Make sure to install deps before running this command.`, "not-ready/missing-dep");
    }
    const keywords = foreignPkg.keywords;
    return keywords ? keywords.includes("aws-layer-meta") || keywords.includes("aws-layer") : false;
  });
  return pkgJsonFiles.filter((i) => i).reduce((agg, d) => {
    const meta = require(import_path31.default.join(process.cwd(), "node_modules", d)).meta;
    const info3 = meta ? __spreadProps(__spreadValues({}, meta), { name: meta.name }) : { name: d, namespace: "unknown", versions: [] };
    agg.push(info3);
    return agg;
  }, []);
}

// src/shared/serverless/webpack/index.ts
init_cjs_shims();

// src/shared/serverless/webpack/getTranspiledTimestamps.ts
init_cjs_shims();

// src/shared/observations/determineProfile.ts
var profile;
async function determineProfile(opts, observations = new Set()) {
  var _a, _b;
  if (opts.profile) {
    return opts.profile;
  }
  if (observations.has("serverlessTs")) {
  }
  if (observations.has("serverlessYml")) {
    const serverlessYaml = await getServerlessYaml();
    if (serverlessYaml.provider.profile) {
      return serverlessYaml.provider.profile;
    }
  } else {
    console.log({ observations });
  }
  let doConfig;
  try {
    doConfig = getIntegratedConfig();
    if (configIsReady(doConfig) && ((_a = doConfig.aws) == null ? void 0 : _a.defaultProfile)) {
      profile = (_b = doConfig.aws) == null ? void 0 : _b.defaultProfile;
    }
  } catch {
  }
  if (!profile && opts.interactive) {
    try {
      profile = await askForAwsProfile({ exitOnError: false });
    } catch {
    }
  }
  if (profile) {
    saveProjectConfig({ aws: { defaultProfile: profile } });
  }
  return profile ? profile : false;
}

// src/shared/observations/determineLinter.ts
init_cjs_shims();
var import_destr6 = __toModule(require("destr"));
function determineLinter() {
  const observations = new Set();
  let eslint = false;
  let tslint = false;
  let prettier = false;
  const pkg = getPackageJson();
  if (pkg) {
    if (hasDevDependency("eslint")) {
      observations.add("eslint");
      if (hasDevDependency("@typescript-eslint/eslint-plugin")) {
        observations.add("typescriptEslintPlugin");
      }
      if (hasDevDependency("@typescript-eslint/parser")) {
        observations.add("typescriptEslintParser");
      }
      if (pkg.eslintConfig) {
        observations.add("eslintConfig");
        eslint = { config: (0, import_destr6.default)(pkg.eslintConfig), filename: "package.json" };
      } else {
        for (const filename of [".eslintrc", ".eslintrc.js", ".eslintrc.ts"]) {
          const fileContent = readFile(filename);
          eslint = { config: (0, import_destr6.default)(fileContent), filename };
        }
      }
    }
    if (hasDevDependency("tslint")) {
      observations.add("tslint");
      const fileContent = readFile("tslint.json");
      tslint = fileContent ? { config: (0, import_destr6.default)(fileContent), filename: "tslint.json" } : true;
    }
    if (hasDevDependency("prettier")) {
      observations.add("prettier");
      if (fileExists(".prettierrc")) {
        prettier = readFile(".prettierrc") || false;
      }
    }
    if (hasDevDependency("eslint-prettier-plugin")) {
      observations.add("eslintPrettierPlugin");
    }
  }
  return { observations, eslint, tslint, prettier };
}

// src/shared/observations/determinePackageManager.ts
init_cjs_shims();
var import_chalk42 = __toModule(require("chalk"));

// src/shared/install/index.ts
init_cjs_shims();

// src/shared/install/configureTestFramework.ts
init_cjs_shims();
async function configureTestFramework(framework, opts, _observations) {
  var _a;
  const log = logger(opts);
  const known = ["jest", "mocha", "uvu"];
  const config = (_a = getProjectConfig()) == null ? void 0 : _a.test;
  if (!config || !config.unitTestFramework || !config.testDirectory) {
    throw new DevopsError(`Can't configure a test framework without the configuration saved to the project's config file.`, "test/not-ready");
  }
  if (!known.includes(framework)) {
    log.shout(`- sorry but currently only know how to install: ${known.join(", ")}`);
    log.info(`- please ensure that you install the required dependencies for "${framework}"`);
    return false;
  }
  switch (framework) {
    case "uvu":
      await templateDirCopy("test/uvu/test-dir", config.testDirectory);
      break;
    case "jest":
      await templateDirCopy("test/jest/test-dir", config.testDirectory);
      await templateFileCopy("test/jest/jest.config.ts", "/jest.config.ts", {
        TEST_MATCHER: `["**/?(*)+(${config.testFilePostfix}).ts"]`,
        TEST_DIR: config.testDirectory
      });
      await templateFileCopy("test/jest/wallaby.js", "/wallaby.js");
      break;
    case "mocha":
      await templateDirCopy("test/mocha/test-dir", config.testDirectory);
      break;
  }
  return true;
}

// src/shared/install/installBuildSystem.ts
init_cjs_shims();
var import_chalk36 = __toModule(require("chalk"));

// src/shared/remove/index.ts
init_cjs_shims();

// src/shared/remove/removeTsLint.ts
init_cjs_shims();
async function removeTslint(opts, observations) {
  await removeDep(opts, observations, "tslint");
}

// src/shared/install/installBuildSystem.ts
async function installBuildSystem(opts, observations) {
  const log = logger(opts);
  const confirm = await askConfirmQuestion(import_chalk36.default`You do not currently have a {blue build} {italic system} defined. Would you like to have one setup?`);
  if (!confirm) {
    return false;
  }
  if (observations.has("tslint")) {
    await removeTslint(opts, observations);
  }
  if (!observations.has("eslint")) {
    const installed2 = await installEsLint(opts, observations);
    if (!installed2) {
      return false;
    }
    observations = getObservations();
  }
  let pkg = getPackageJson();
  const scripts = pkg.scripts ? pkg.scripts : {};
  if (!scripts.lint) {
    scripts.lint = `run-s lint:src lint:test lint:tsc`;
    scripts["lint:src"] = observations.has("eslint") ? "eslint src/**/*.ts" : "";
    scripts["lint:test"] = observations.has("eslint") ? "eslint src/**/*.ts" : "";
    scripts["lint:tsc"] = "npx tsc --noEmit";
  }
  const bundler = await askListQuestion(import_chalk36.default`Which transpiler/bundler will you use in this repo?`, ["tsc", "rollup", "webpack", "vite", "esbuild", "swc"]);
  await saveProjectConfig({ general: { bundler } });
  let devDeps = [];
  switch (bundler) {
    case "tsc":
      devDeps = [];
      scripts.build = `run-s clean lint build:bundle`;
      scripts["build:bundle"] = `ttsc -P tsconfig.build.json`;
      scripts.watch = scripts.watch ? scripts.watch : `ttsc -P tsconfig.build.json -w`;
      break;
    case "rollup":
      devDeps = [
        "rollup",
        "@ampproject/rollup-plugin-closure-compiler",
        "@rollup/plugin-commonjs @rollup/plugin-json",
        "@rollup/plugin-node-resolve",
        "rollup-plugin-analyzer",
        "rollup-plugin-terser",
        "rollup-plugin-typescript2"
      ];
      scripts.build = `npx node devops/build commonjs esnext --closure`;
      scripts["build:analyze"] = scripts["build:analyze"] ? scripts["build:analyze"] : `npx node devops/build esnext --analyze --closure`;
      scripts.watch = scripts.watch ? scripts.watch : `ttsc -P tsconfig.build.json -w`;
      await templateFileCopy("bundlers/rollup/build.single-entry.js", "/devops/build.js");
      break;
    case "webpack":
      devDeps = ["webpack"];
      break;
    case "esbuild":
      devDeps = ["esbuild"];
      break;
    case "swc":
      devDeps = ["@swc/core", "@swc/cli"];
      break;
    case "vite":
      devDeps = ["vite", "vite-plugin-md", "vite-plugin-components", "vite-ssg", "vite-plugin-pwa"];
      break;
  }
  await templateDirCopy("typescript", "/");
  log.whisper(import_chalk36.default`{gray - {blue tsconfig} files transferred}`);
  const installed = await installDevDep(opts, observations, ...devDeps, "typescript", "ttypescript", "typescript-transform-paths", "npm-run-all", "ts-node", "rimraf");
  if (!installed) {
    throw new DevopsError(`Problem installing dev dependencies for "tsc" build/bundle solution`);
  }
  log.whisper(import_chalk36.default`{gray - dev dependencies for {blue ${bundler}} are installed}`);
  pkg = getPackageJson(void 0, true);
  pkg.scripts = scripts;
  await savePackageJson(pkg);
  return true;
}

// src/shared/install/installEsLint.ts
init_cjs_shims();
var import_chalk37 = __toModule(require("chalk"));
async function installEsLint(opts, observations) {
  const log = logger(opts);
  const proceed = opts.silent ? opts.silent : await askConfirmQuestion(import_chalk37.default`Would you like to install and configure {blue eslint}?`);
  if (!proceed) {
    return false;
  }
  const success = await installDevDep(opts, observations, "eslint", "prettier", "@typescript-eslint/eslint-plugin", "@typescript-eslint/parser", "eslint-config-prettier", "eslint-plugin-import", "eslint-plugin-prettier", "eslint-plugin-promise", "eslint-plugin-unicorn");
  if (!success) {
    log.shout(`- ${emoji.poop} there was a problem installing the eslint dev dependencies`);
    return false;
  }
  log.whisper(import_chalk37.default`{gray - all {italic eslint} and {italic prettier} dependencies have been installed}`);
  await templateFileCopy("eslint/.eslintrc", "/.eslintrc");
  await templateFileCopy("eslint/.prettierrc.js", "/.prettierrc.js");
  log.whisper(import_chalk37.default`{gray - configuration files for both {italic eslint} and {italic prettier} have been saved}`);
  log.info(import_chalk37.default`- ${emoji.party} {blue eslint} has been installed and configured\n`);
  return true;
}

// src/shared/install/installGit.ts
init_cjs_shims();
var import_chalk38 = __toModule(require("chalk"));

// src/shared/install/installGitIgnore.ts
init_cjs_shims();
var import_chalk39 = __toModule(require("chalk"));

// src/shared/install/installPackageManager.ts
init_cjs_shims();
var import_chalk40 = __toModule(require("chalk"));
async function installPackageManager(opts, observations) {
  const log = logger(opts);
  let manager = opts.manager;
  if (opts.silent && !opts.manager) {
    throw new DevopsError(`Can not install a package manager silently when no manager is passed in as option`, "install/not-ready");
  }
  if (!manager) {
    manager = await askListQuestion("Which package manager would you like to use for this repo?", ["npm", "pnpm", "yarn"], { default: "npm" });
  }
  await saveProjectConfig({ general: { pkgManager: manager } });
  log.whisper(import_chalk40.default`{gray - ${manager} package manager saved to this repos {blue .do-devops.json} config file}`);
  await proxyToPackageManager("install", observations);
}

// src/shared/install/installTestFramework.ts
init_cjs_shims();
var import_chalk41 = __toModule(require("chalk"));
async function installTestFramework(framework, opts, observations) {
  const log = logger(observations);
  let installed;
  switch (framework) {
    case "uvu":
      installed = await installDevDep(opts, observations, "uvu", "ts-node");
      break;
    case "jest":
      installed = await installDevDep(opts, observations, "jest", "ts-jest", "@types/jest", "jest-extended");
      break;
    case "mocha":
      installed = await installDevDep(opts, observations, "mocha", "chai", "@types/mocha", "@types/chai", "ts-node");
      break;
    case "jasmine":
      installed = await installDevDep(opts, observations, "jasmine");
      break;
    case "qunit":
      installed = await installDevDep(opts, observations, "qunit");
      break;
    case "ava":
      installed = await installDevDep(opts, observations, "ava");
      break;
    default:
      throw new DevopsError(`Unknown test framework: ${framework}`, "install/unknown-test-framework");
  }
  if (installed) {
    log.whisper(import_chalk41.default`{gray - installed all {italic dev dependencies} for {bold {green ${framework}}}}`);
  }
  return installed;
}

// src/shared/observations/determinePackageManager.ts
async function determinePackageManager(opts, observations) {
  var _a;
  if (!observations.has("packageJson")) {
    throw new DevopsError(`Can not determine the default package manager in a directory that has no package.json file!`, "not-ready/missing-package-json");
  }
  if (observations.has("packageManagerConflict")) {
    console.log(`- ${emoji.warn}} there are indications of {italic more} than one package manager being used!`);
    const pkgManager = await askListQuestion("Which package manager do you expect to use in this repo?", ["npm", "pnpm", "yarn"], {
      default: observations.has("pnpm") ? "pnpm" : observations.has("yarn") ? "yarn" : "npm"
    });
    await saveProjectConfig({ general: { pkgManager } });
    const removed = await removeOtherLockFiles(pkgManager);
    if (removed.length > 0) {
      console.log(import_chalk42.default`- removed `);
    }
  }
  if (observations.has("yarn")) {
    return "yarn";
  }
  if (observations.has("npm")) {
    return "npm";
  }
  if (observations.has("pnpm")) {
    return "pnpm";
  }
  const config = getProjectConfig();
  if ((_a = config.general) == null ? void 0 : _a.pkgManager) {
    return config.general.pkgManager;
  }
  if (opts.interactive) {
    const manager = await askListQuestion("We couldn't determine your default package manager, please choose from the list.", ["npm", "pnpm", "yarn"], { default: "npm" });
    await installPackageManager(__spreadProps(__spreadValues({}, opts), { manager }), observations);
    return manager;
  }
  return false;
}

// src/shared/observations/determinePartition.ts
init_cjs_shims();

// src/shared/observations/determineRegion.ts
init_cjs_shims();
var import_chalk43 = __toModule(require("chalk"));
var import_native_dash9 = __toModule(require("native-dash"));
async function determineRegion(opts = {}, observations = new Set()) {
  var _a;
  const config = getIntegratedConfig();
  let region = opts.region || process.env.AWS_REGION;
  if (!region && observations.has("serverlessYml")) {
    try {
      region = (0, import_native_dash9.get)(await getServerlessYaml(), "provider.region", void 0);
    } catch {
    }
  }
  if (!region) {
    region = (0, import_native_dash9.get)(config, "global.defaultAwsRegion", void 0);
  }
  if (!region) {
    const profileName = await determineProfile(opts || {});
    if (profileName) {
      const profile2 = await getAwsProfile(profileName);
      if (profile2 && profile2.region) {
        region = profile2.region;
      }
    }
  }
  if (!region) {
    const userConfig = getUserConfig();
    if (configIsReady(userConfig) && ((_a = userConfig.aws) == null ? void 0 : _a.defaultRegion)) {
      if (!opts.quiet) {
        console.log(import_chalk43.default`{bold - AWS region has been resolved using the User's config ${emoji.eyeballs}}. This is the source of "last resort" but may be intended.`);
      }
      region = userConfig.aws.defaultRegion;
    }
  }
  return region;
}

// src/shared/observations/determineStackName.ts
init_cjs_shims();
var import_chalk44 = __toModule(require("chalk"));

// src/shared/observations/determineStage.ts
init_cjs_shims();
var import_chalk45 = __toModule(require("chalk"));
var process3 = __toModule(require("process"));
var import_native_dash10 = __toModule(require("native-dash"));
async function determineStage(opts, _observations = new Set()) {
  try {
    let stage = (0, import_native_dash10.get)(opts, "stage") || process3.env.NODE_ENV || process3.env.AWS_STAGE;
    if (!stage) {
      try {
        stage = (0, import_native_dash10.get)(await getServerlessYaml(), "provider.stage");
      } catch {
      }
    }
    if (opts.interactive) {
      stage = await askForStage();
    }
    return stage;
  } catch (error) {
    console.log(import_chalk45.default`- attempts to get the desired "stage" have failed! ${emoji.poop}`);
    console.log(import_chalk45.default`- {red ${error.message}}`);
    console.log(import_chalk45.default`{dim ${error.stack}}`);
    console.log();
    process3.exit();
  }
}

// src/shared/observations/determineTestFramework.ts
init_cjs_shims();
var import_chalk46 = __toModule(require("chalk"));
async function determineTestingFramework(observations, opts) {
  var _a, _b, _c, _d, _e, _f;
  const log = logger(opts);
  const known = ["ava", "jasmine", "jest", "mocha", "qunit", "uvu"];
  for (const fw of known) {
    if (observations.has(fw)) {
      return fw;
    }
  }
  let config = getProjectConfig();
  if ((_a = config.test) == null ? void 0 : _a.unitTestFramework) {
    if (!opts.interactive) {
      log.info(import_chalk46.default`- the test framework is configured as "${config.test.unitTestFramework}" in your do-devops config file but we {italic don't detect} the npm deps!`);
      return config.test.unitTestFramework;
    } else {
      log.shout(import_chalk46.default`- in the past, this project was setup to use the {yellow {bold ${config.test.unitTestFramework}}} unit test framework.`);
      log.shout(import_chalk46.default`- however, we can't detect the {bold npm} dependencies ${emoji.shocked}`);
      const install = await askConfirmQuestion("Install them now?");
      if (!install) {
        return config.test.unitTestFramework;
      }
    }
  }
  if (opts.interactive) {
    if (!((_b = config.test) == null ? void 0 : _b.unitTestFramework)) {
      const info3 = await askForUnitTestFramework(opts);
      if (!info3) {
        return false;
      }
      config = await saveProjectConfig({ test: info3 });
    }
    if (!config.test) {
      throw new DevopsError("Issue determining and/or saving test framework config!", "test/no-test-config");
    }
    const installAndConfig = await askConfirmQuestion(import_chalk46.default`Install and configure {italic ${config.test.unitTestFramework}} test framework for you?`);
    if (!installAndConfig) {
      return ((_c = config == null ? void 0 : config.test) == null ? void 0 : _c.unitTestFramework) || false;
    }
    if ((_d = config == null ? void 0 : config.test) == null ? void 0 : _d.unitTestFramework) {
      const installed = await installTestFramework(config.test.unitTestFramework, opts, observations);
      const configured = await configureTestFramework((_e = config == null ? void 0 : config.test) == null ? void 0 : _e.unitTestFramework, opts, observations);
      if (installed && configured) {
        log.info(import_chalk46.default`\n- ${emoji.party} {green ${config.test.unitTestFramework}} setup and ready to use in this repo!\n`);
      }
    }
  }
  return config && config.projectConfig && ((_f = config.test) == null ? void 0 : _f.unitTestFramework) ? config.test.unitTestFramework : false;
}

// src/shared/observations/getObserverations.ts
init_cjs_shims();
function getObservations() {
  let observations = new Set();
  const projectConfig = getProjectConfig();
  let pkgJson;
  try {
    pkgJson = getPackageJson();
  } catch {
  }
  if (pkgJson) {
    observations.add("packageJson");
    if (fileExists(currentDirectory(".gitignore"))) {
      observations.add("gitignore");
    }
    if (dirExists(currentDirectory(".git"))) {
      observations.add("git-init");
    }
    if (hasDevDependency("typescript")) {
      observations.add("typescript");
    }
    if (hasDevDependency("ttypescript")) {
      observations.add("ttypescript");
    }
    if (hasDevDependency("typescript-transform-paths")) {
      observations.add("typescriptTransformPaths");
    }
    if (hasDevDependency("rollup")) {
      observations.add("rollup");
    }
    if (hasDevDependency("webpack")) {
      observations.add("webpack");
    }
    if (hasDevDependency("vite")) {
      observations.add("vite");
    }
    if (hasDevDependency("vue")) {
      observations.add("vue");
    }
    if (hasDevDependency("esbuild")) {
      observations.add("esbuild");
    }
    if (hasDependency("firebase-admin") || hasDependency("@firebase/app")) {
      observations.add("firebase");
    }
    if (hasDependency("firemodel")) {
      observations.add("firemodel");
    }
    if (hasDependency("universal-fire")) {
      observations.add("universalFire");
    }
    if (hasDependency("supabase")) {
      observations.add("supabase");
    }
    if (hasDevDependency("mocha")) {
      observations.add("mocha");
    }
    if (hasDevDependency("jest")) {
      observations.add("jest");
    }
    if (hasDevDependency("uvu")) {
      observations.add("uvu");
    }
    if (hasDevDependency("serverless")) {
      observations.add("serverlessFramework");
    }
    if (fileExists("./serverless.yml")) {
      observations.add("serverlessYml");
    }
    if (fileExists("./serverless.ts")) {
      observations.add("serverlessTs");
    }
    if (hasDevDependency("webpack-plugin")) {
      observations.add("serverlessWebpackPlugin");
    }
    if (hasDevDependency("serverless-sam")) {
      observations.add("serverlessSamPlugin");
    }
    if (hasDevDependency("ts-node")) {
      observations.add("tsNode");
    }
    if (fileExists(IMAGE_CACHE)) {
      observations.add("image-cache");
    }
    if (fileExists(TS_IMAGE_SUPPORT_FILE)) {
      observations.add("image-ts-support");
    }
    if (projectConfig.image && projectConfig.image.rules.length > 0) {
      observations.add("image-rules-defined");
    }
    let pm = 0;
    if (fileExists(PKG_MGR_LOCK_FILE_LOOKUP.yarn)) {
      pm++;
      observations.add("yarn");
    }
    if (fileExists(PKG_MGR_LOCK_FILE_LOOKUP.pnpm)) {
      pm++;
      observations.add("pnpm");
      if (fileExists("pnpm-workspace.yaml")) {
        observations.add("monorepo");
        observations.add("pnpmWorkspaces");
      }
    }
    if (fileExists(PKG_MGR_LOCK_FILE_LOOKUP.npm)) {
      pm++;
      observations.add("npm");
    }
    if (pm > 1) {
      observations.add("packageManagerConflict");
    }
    if (hasDevDependency("lerna")) {
      observations.add("lerna");
      observations.add("monorepo");
    }
    if (pkgJson.private === true) {
      observations.add("private");
    }
    if (pkgJson.private === false) {
      observations.add("public");
    }
    if (!observations.has("git-init")) {
      try {
        const parent = getPackageJson(repoDirectory());
        if ((parent == null ? void 0 : parent.private) === "true") {
          observations.add("parent-private");
        } else {
          observations.add("parent-public");
        }
        if (fileExists(repoDirectory("pnpm-workspace.yaml"))) {
          observations.add("pnpmWorkspaces");
        }
      } catch {
        observations.add("no-parent-repo");
      }
    }
    if (hasMainExport()) {
      observations.add("cjs");
    }
    if (hasModuleExport()) {
      observations.add("esm");
    }
    if (hasTypingsExport()) {
      observations.add("typings");
    }
    const lint = determineLinter();
    observations = new Set([...observations, ...lint.observations]);
  }
  return observations;
}

// src/shared/observations/hasServerlessTsFile.ts
init_cjs_shims();

// src/shared/observations/isTypescriptMicroserviceProject.ts
init_cjs_shims();

// src/shared/npm/crud/installDevDep.ts
async function installDevDep(opts, observations, ...packages) {
  const log = logger(opts);
  const pkgManager = await determinePackageManager(__spreadProps(__spreadValues({}, opts), { interactive: true }), observations);
  const cmd = pkgManager === "npm" ? `npm install --save-dev ${packages.join(" ")}` : `${pkgManager} add ${pkgManager === "yarn" ? "--dev" : "--save-dev"} ${packages.join(" ")}`;
  log.whisper(import_chalk47.default`- installing with {blue ${cmd}}`);
  const response = (0, import_shelljs2.exec)(cmd);
  if (response.code === 0) {
    log.info(import_chalk47.default`\n- ${emoji.party} package${packages.length > 1 ? "s" : ""} [{italic {gray ${packages.join(", ")}}}] {italic installed} as dev dependenc${packages.length > 1 ? "ies" : "y"}\n`);
  } else {
    log.info(import_chalk47.default`{gray - {red failure} trying to install npm packages: ${cmd}}`);
    log.info(import_chalk47.default`\n{gray ${response.stderr}}\n`);
  }
  return response.code === 0 ? true : false;
}

// src/shared/npm/crud/removeDep.ts
init_cjs_shims();
var import_chalk48 = __toModule(require("chalk"));
var import_native_dash11 = __toModule(require("native-dash"));
var import_shelljs3 = __toModule(require_shell());
async function removeDep(opts, observations, ...packages) {
  var _a, _b;
  const log = logger(opts);
  const pkgManager = await determinePackageManager({}, observations);
  const cmd = `${pkgManager} remove ${packages}`;
  log.whisper(import_chalk48.default`- removing with {blue ${cmd}}`);
  const response = (0, import_shelljs3.exec)(cmd);
  if (response.code === 0) {
    log.info(import_chalk48.default`- ${emoji.party} Packages [{italic {gray {dim ${packages.join(", ")}}}}] {italic removed}`);
    const pkg = getPackageJson();
    let pkgChanged = false;
    for (const p of packages) {
      if ((_a = pkg == null ? void 0 : pkg.optionalDependencies) == null ? void 0 : _a[p]) {
        pkg.optionalDependencies = (0, import_native_dash11.omit)(pkg.optionalDependencies, p);
        pkgChanged = true;
      }
      if ((_b = pkg == null ? void 0 : pkg.peerDependencies) == null ? void 0 : _b[p]) {
        pkg.peerDependencies = (0, import_native_dash11.omit)(pkg.peerDependencies, p);
        pkgChanged = true;
      }
    }
    if (pkgChanged) {
      await savePackageJson(pkg);
    }
  } else {
    log.info(import_chalk48.default`- ${emoji.poop} failure while trying to remove npm packages: ${packages.join(", ")} [${response.code}]`);
    log.info(import_chalk48.default`\n{gray ${response.stderr}}\n`);
  }
  return response.code === 0 ? true : false;
}

// src/shared/npm/package-json/index.ts
init_cjs_shims();

// src/shared/npm/package-json/convertDepDictionaryToArray.ts
init_cjs_shims();
function convertDepDictionaryToArray(deps) {
  return Object.keys(deps).map((dep) => ({ name: dep, version: deps[dep] }));
}

// src/shared/npm/package-json/dependencies.ts
init_cjs_shims();

// src/shared/npm/package-json/getPackageJson.ts
init_cjs_shims();
var import_fs17 = __toModule(require("fs"));
var import_path32 = __toModule(require("path"));
var import_destr7 = __toModule(require("destr"));

// src/shared/npm/package-json/cache/packageJsonCache.ts
init_cjs_shims();
var packageJson;
var pathBasedPackageJson = {};
function getPackageJsonfromCache(overridePath) {
  return overridePath ? pathBasedPackageJson[overridePath] || false : packageJson ? packageJson : false;
}
function cacheLocalPackageJson(pkgJson, pathOverride) {
  if (pathOverride) {
    pathBasedPackageJson[pathOverride] = pkgJson;
  } else {
    packageJson = pkgJson;
  }
}

// src/shared/npm/package-json/getPackageJson.ts
function getPackageJson(pathOverride, force = false) {
  const p = !force ? getPackageJsonfromCache(pathOverride) : void 0;
  if (p) {
    return p;
  }
  const filename = import_path32.default.join((pathOverride == null ? void 0 : pathOverride.replace("package.json", "")) || process.cwd(), "package.json");
  if (!fileExists(filename)) {
    throw new DevopsError(`Attempt to get package.json [${filename}] file failed`, "not-ready/missing-package-json");
  }
  const pj = (0, import_destr7.default)(import_fs17.default.readFileSync(filename, { encoding: "utf-8" }));
  cacheLocalPackageJson(pj, pathOverride);
  return pj;
}

// src/shared/npm/package-json/dependencies.ts
function dependencies(dir) {
  const pkg = getPackageJson(dir);
  const dependencies2 = pkg.dependencies ? convertDepDictionaryToArray(pkg.dependencies) : [];
  const devDependencies = pkg.devDependencies ? convertDepDictionaryToArray(pkg.devDependencies) : [];
  const peerDependencies = pkg.peerDependencies ? convertDepDictionaryToArray(pkg.peerDependencies) : [];
  const optionalDependencies = pkg.optionalDependencies ? convertDepDictionaryToArray(pkg.optionalDependencies) : [];
  const total = dependencies2.length + devDependencies.length + peerDependencies.length + optionalDependencies.length;
  return {
    total,
    dependencies: dependencies2,
    devDependencies,
    peerDependencies,
    optionalDependencies,
    hasDependencies: dependencies2.length > 0,
    hasDevDependencies: devDependencies.length > 0,
    hasOptionalDependencies: optionalDependencies.length > 0,
    hasPeerDependencies: peerDependencies.length > 0
  };
}

// src/shared/npm/package-json/findPackageJson.ts
init_cjs_shims();
var import_find_up = __toModule(require("find-up"));
function findPackageJson(dir) {
  return import_find_up.default.sync("package.json", { cwd: dir || parentDirectory() });
}

// src/shared/npm/package-json/getExportsFromPackageJson.ts
init_cjs_shims();
var import_native_dash12 = __toModule(require("native-dash"));

// src/shared/npm/package-json/getExternalPackageJson.ts
init_cjs_shims();
var import_async_shelljs7 = __toModule(require("async-shelljs"));
var import_destr8 = __toModule(require("destr"));
async function getExternalPackageJson(pkg = "") {
  try {
    return (0, import_destr8.default)(await (0, import_async_shelljs7.asyncExec)(`npm info ${pkg} --json`, { silent: true }));
  } catch {
    throw new DevopsError(pkg ? `The package ${pkg} does not exist in NPM.` : "The local package does not exist in NPM.", "devops/does-not-exist");
  }
}

// src/shared/npm/package-json/hasDependency.ts
init_cjs_shims();
function hasDependency(dep, pathOveride) {
  try {
    const pkg = getPackageJson(pathOveride);
    const deps = pkg.dependencies;
    return deps && deps[dep];
  } catch {
    return false;
  }
}

// src/shared/npm/package-json/hasDevDependency.ts
init_cjs_shims();
function hasDevDependency(dep, pathOveride) {
  try {
    const pkg = getPackageJson(pathOveride);
    const devDeps = pkg.devDependencies;
    return devDeps && devDeps[dep];
  } catch {
    return false;
  }
}

// src/shared/npm/package-json/hasMainExport.ts
init_cjs_shims();
var import_path33 = __toModule(require("path"));
function hasMainExport(dep) {
  if (dep) {
    dep = import_path33.default.join(process.cwd(), "node_modules/", `${dep.replace(/\/{0,1}node_modules\/{0,1}/, "")}`);
  }
  const pkg = dep ? getPackageJson(dep) : getPackageJson();
  return pkg.main && pkg.main.length > 0 ? true : false;
}

// src/shared/npm/package-json/hasModuleExport.ts
init_cjs_shims();
var import_path34 = __toModule(require("path"));
function hasModuleExport(dep) {
  if (dep) {
    dep = import_path34.default.join(process.cwd(), "node_modules/", `${dep.replace(/\/{0,1}node_modules\/{0,1}/, "")}`);
  }
  const pkg = dep ? getPackageJson(dep) : getPackageJson();
  return pkg.module && pkg.module.length > 0 ? true : false;
}

// src/shared/npm/package-json/hasScript.ts
init_cjs_shims();
function hasScript(script, dep) {
  if (dep) {
    dep = `node_modules/${dep.replace(/\/{0,1}node_modules\/{0,1}/, "")}`;
  }
  const pkg = dep ? getPackageJson(dep) : getPackageJson();
  return Object.keys(pkg.scripts || {}).includes(script);
}

// src/shared/npm/package-json/hasTypings.ts
init_cjs_shims();
var import_path35 = __toModule(require("path"));
function hasTypingsExport(dep) {
  if (dep) {
    dep = import_path35.default.join(process.cwd(), "node_modules/", `${dep.replace(/\/{0,1}node_modules\/{0,1}/, "")}`);
  }
  const pkg = dep ? getPackageJson(dep) : getPackageJson();
  return pkg.typings || pkg.types ? true : false;
}

// src/shared/npm/package-json/pkgDepsInTable.ts
init_cjs_shims();
var import_chalk49 = __toModule(require("chalk"));
function formatDependencies(deps) {
  return deps.map((dep) => import_chalk49.default`{bold ${dep.name}} [{dim ${dep.version} }]`);
}
function pkgDepsInTable(opts = {}) {
  var _a;
  const {
    dependencies: dependencies2,
    devDependencies,
    optionalDependencies,
    peerDependencies
  } = getPackageJson();
  const deps = [
    { name: "Dependencies", data: opts.ignoreDeps ? void 0 : dependencies2 },
    { name: "Peer Deps", data: opts.ignorePeerDeps ? void 0 : peerDependencies },
    { name: "Optional Deps", data: opts.ignoreOptionalDeps ? void 0 : optionalDependencies },
    { name: "Dev Deps", data: opts.ignoreDevDeps ? void 0 : devDependencies }
  ].filter((i) => i.data && Object.keys(i.data).length > 0).map((i) => ({
    name: i.name,
    data: formatDependencies(convertDepDictionaryToArray(i.data))
  }));
  const columns = deps.map((i) => i.name);
  const max = Math.max(...deps.map((d) => d.data.length));
  const data = [];
  for (let idx = 0; idx < max; idx++) {
    const row = {};
    for (const col of columns) {
      const datum = ((_a = deps.find((c) => c.name === col)) == null ? void 0 : _a.data) || [];
      row[col] = datum[idx] ? datum[idx] : "";
    }
    data.push(row);
  }
  return toTable(data, ...columns);
}

// src/shared/npm/package-json/savePackageJson.ts
init_cjs_shims();
var import_fs18 = __toModule(require("fs"));
var import_path36 = __toModule(require("path"));
var import_util3 = __toModule(require("util"));
var write3 = (0, import_util3.promisify)(import_fs18.writeFile);
async function savePackageJson(pkg) {
  await write3(import_path36.default.join(process.cwd(), "package.json"), JSON.stringify(pkg, null, 2), {
    encoding: "utf-8"
  });
}

// src/shared/npm/package-manager/index.ts
init_cjs_shims();

// src/shared/npm/package-manager/pm-constants.ts
init_cjs_shims();
var PACKAGE_MANAGERS = [
  "npm",
  "pnpm",
  "yarn"
];
var PKG_MGR_LOCK_FILE_LOOKUP = {
  npm: "package-lock.json",
  pnpm: "pnpm-lock.yaml",
  yarn: "yarn.lock"
};

// src/shared/npm/package-manager/removeOtherLockFiles.ts
init_cjs_shims();
async function removeOtherLockFiles(pkgMgr) {
  const toRemove = PACKAGE_MANAGERS.filter((i) => i !== pkgMgr);
  const files = [];
  for (const mngr of toRemove) {
    const file = PKG_MGR_LOCK_FILE_LOOKUP[mngr];
    const filepath = currentDirectory(file);
    if (fileExists(filepath)) {
      files.push(file);
      removeFile(filepath);
    }
  }
  return files;
}

// src/shared/file/getMonoRepoPackages.ts
async function getMonoRepoPackages(baseDir) {
  const glob = ["**/package.json", "!**/node_modules"];
  return (await (0, import_globby9.default)(glob, { cwd: baseDir, deep: 10 })).map((i) => {
    return {
      name: getPackageJson(i).name,
      path: (0, import_path37.dirname)(i)
    };
  }).filter((i) => i.path !== ".");
}

// src/shared/file/lintfix.ts
init_cjs_shims();
var import_shelljs4 = __toModule(require_shell());
function lintfix(file, observations) {
  if (observations.has("eslint")) {
    const result = (0, import_shelljs4.exec)(`eslint ${file} --fix`, { silent: true });
    return result.code === 0 ? true : false;
  }
  return false;
}

// src/shared/file/readDataFile.ts
init_cjs_shims();
var import_path38 = __toModule(require("path"));
var process4 = __toModule(require("process"));
async function readDataFile(file, defaultExtension) {
  if (defaultExtension && defaultExtension.slice(0, 1) === ".") {
    defaultExtension = defaultExtension.slice(1);
  }
  let filename = import_path38.default.join(process4.cwd(), "test/data", file);
  if (defaultExtension && !file.includes("." + defaultExtension)) {
    filename += "." + defaultExtension;
  }
  return readFile(filename);
}

// src/shared/file/relativePath.ts
init_cjs_shims();
function toRelativePath(path60, base) {
  return path60.replace(base || process.cwd(), "").replace(/^\//, "");
}

// src/shared/file/saveFileToHomeDirectory.ts
init_cjs_shims();
var import_fs19 = __toModule(require("fs"));
var import_path39 = __toModule(require("path"));

// src/shared/file/saveYamlFile.ts
init_cjs_shims();
var import_chalk50 = __toModule(require("chalk"));
var import_path40 = __toModule(require("path"));
var import_util4 = __toModule(require("util"));
var import_js_yaml3 = __toModule(require("js-yaml"));
var import_fs20 = __toModule(require("fs"));
var write4 = (0, import_util4.promisify)(import_fs20.writeFile);
async function saveYamlFile(filename, data) {
  try {
    console.log(data);
    const yamlData = (0, import_js_yaml3.dump)(data);
    const fqFilename = import_path40.default.join(process.cwd(), filename);
    await write4(fqFilename, yamlData, { encoding: "utf-8" });
    return;
  } catch (error) {
    console.log(import_chalk50.default`- {red writing the {bold {italic ${filename}} YAML file has failed!} ${emoji.poop}}`);
    console.log(error.message);
    console.log(import_chalk50.default`{dim ${error.stack}}`);
    process.exit();
  }
}

// src/shared/file/stripFileExtension.ts
init_cjs_shims();

// src/shared/file/base-paths/index.ts
init_cjs_shims();

// src/shared/file/base-paths/currentDirectory.ts
init_cjs_shims();
var import_path41 = __toModule(require("path"));
function currentDirectory(offset, opts = {}) {
  const base = offset ? import_path41.default.posix.join(process.cwd(), offset) : process.cwd();
  return opts.base ? toRelativePath(base, opts.base) : base;
}

// src/shared/file/base-paths/executionDirectory.ts
init_cjs_shims();
var import_path42 = __toModule(require("path"));

// src/shared/stack/index.ts
init_cjs_shims();

// src/shared/stack/getCaller.ts
init_cjs_shims();
var import_callsites = __toModule(require("callsites"));

// src/shared/file/base-paths/homeDirectory.ts
init_cjs_shims();
var import_path43 = __toModule(require("path"));
var import_os = __toModule(require("os"));
function homeDirectory(offset, opts = {}) {
  const home = offset ? import_path43.default.posix.join((0, import_os.homedir)(), offset) : (0, import_os.homedir)();
  return opts.base ? toRelativePath(home, opts.base) : home;
}

// src/shared/file/base-paths/libraryDirectory.ts
init_cjs_shims();
var import_path44 = __toModule(require("path"));
function libraryDirectory(offset, opts = {}) {
  const base = __filename.replace(/(\/(do-devops|dd)\/).*/, "$1");
  const dir = offset ? import_path44.default.posix.join(base, offset) : base;
  return opts.base ? toRelativePath(dir, opts.base) : dir;
}

// src/shared/file/base-paths/parentDirectory.ts
init_cjs_shims();
var import_path45 = __toModule(require("path"));
function parentDirectory(offset, opts = {}) {
  const cwd3 = import_path45.default.posix.join(process.cwd(), "../");
  const base = offset ? import_path45.default.posix.join(cwd3, offset) : cwd3;
  return opts.base ? toRelativePath(base, opts.base) : base;
}

// src/shared/file/base-paths/repoDirectory.ts
init_cjs_shims();
var import_chalk51 = __toModule(require("chalk"));
var import_path48 = __toModule(require("path"));

// src/shared/file/existance/fileExists.ts
init_cjs_shims();
var import_fs21 = __toModule(require("fs"));
var import_os3 = __toModule(require("os"));
var import_path47 = __toModule(require("path"));

// src/shared/file/helpers/index.ts
init_cjs_shims();

// src/shared/file/helpers/interpolateFilepath.ts
init_cjs_shims();
var import_os2 = __toModule(require("os"));
var import_path46 = __toModule(require("path"));
function interpolateFilePath(filename) {
  if (filename.slice(0, 2) === "~/") {
    filename = import_path46.default.posix.join((0, import_os2.homedir)(), filename.slice(1));
  }
  if (filename.slice(0, 2) === "./") {
    filename = import_path46.default.posix.join(process.cwd(), filename.slice(2));
  }
  return filename;
}

// src/shared/file/existance/fileExists.ts
function fileExists(file) {
  file = interpolateFilePath(file);
  if (file.slice(0, 1) === "~") {
    file = import_path47.default.posix.join((0, import_os3.homedir)(), file.slice(1));
  }
  return (0, import_fs21.existsSync)(file);
}

// src/shared/file/base-paths/repoDirectory.ts
function repoDirectory(offset, opts = {}) {
  const start = offset ? import_path48.default.posix.join(process.cwd(), offset) : process.cwd();
  if (fileExists(currentDirectory("package.json"))) {
    return currentDirectory(offset);
  }
  const dir = findPackageJson(parentDirectory());
  if (!dir) {
    throw new DevopsError(import_chalk51.default`Attempt to locate the root of the repo for the current directory failed. No "package.json" was found above the {blue ${start}} directory`, "directory/not-found");
  }
  const filename = (0, import_path48.join)(dir, offset ? offset : "");
  return opts.base ? toRelativePath(filename, opts.base) : filename;
}

// src/shared/file/crud/index.ts
init_cjs_shims();

// src/shared/file/crud/readAndParseFile.ts
init_cjs_shims();

// src/shared/file/crud/readFile.ts
init_cjs_shims();
var import_chalk52 = __toModule(require("chalk"));
var import_fs23 = __toModule(require("fs"));

// src/shared/file/existance/filesExist.ts
init_cjs_shims();
var import_fs22 = __toModule(require("fs"));
var import_os4 = __toModule(require("os"));
var import_path49 = __toModule(require("path"));
function filesExist(...files) {
  const exists3 = [];
  for (let f of files) {
    if (![".", "/", "~"].includes(f.slice(0, 1))) {
      f = import_path49.default.posix.join(process.cwd(), f);
    }
    if (f.slice(0, 1) === "~") {
      f = import_path49.default.posix.join((0, import_os4.homedir)(), f.slice(1));
    }
    if ((0, import_fs22.existsSync)(f)) {
      exists3.push(f);
    }
  }
  return exists3.length > 0 ? exists3 : false;
}

// src/shared/file/crud/readFile.ts
function readFile(filename) {
  filename = interpolateFilePath(filename);
  try {
    return filesExist(filename) ? (0, import_fs23.readFileSync)(filename, { encoding: "utf-8" }) : void 0;
  } catch (error) {
    console.log(import_chalk52.default`{red - ${emoji.poop} ran into a problem reading file {blue ${filename}}.} Error message: ${error.message}`);
    console.log(import_chalk52.default`- Stack:{dim \n${error.stack}}`);
    process.exit(1);
  }
}

// src/shared/file/crud/readAndParseFile.ts
var import_destr9 = __toModule(require("destr"));

// src/shared/file/crud/readYamlConfig.ts
init_cjs_shims();
var import_chalk53 = __toModule(require("chalk"));
var import_fs24 = __toModule(require("fs"));
var import_js_yaml4 = __toModule(require("js-yaml"));

// src/shared/file/crud/removeFile.ts
init_cjs_shims();
var import_fs26 = __toModule(require("fs"));

// src/shared/file/existance/index.ts
init_cjs_shims();

// src/shared/file/existance/dirExists.ts
init_cjs_shims();
var import_fs25 = __toModule(require("fs"));
function dirExists(dir, ignoreSymLink = false) {
  dir = interpolateFilePath(dir);
  const exists3 = (0, import_fs25.existsSync)(dir);
  if (!exists3) {
    return false;
  }
  const info3 = (0, import_fs25.lstatSync)(dir);
  const isSymLink = info3.isSymbolicLink();
  const isDirectory = info3.isDirectory();
  if (!isDirectory) {
    throw new DevopsError(`The test to see if the path "${dir}" as a directory failed because that path exists but it is NOT a directory!`, "dir/exists-not-dir");
  }
  return !isSymLink || ignoreSymLink;
}

// src/shared/file/existance/ensureDirectory.ts
init_cjs_shims();
var fs7 = __toModule(require("fs"));
var import_util5 = __toModule(require("util"));
var exists2 = (0, import_util5.promisify)(fs7.exists);
var mkdir2 = (0, import_util5.promisify)(fs7.mkdir);
async function ensureDirectory(dir) {
  const doesExist = await exists2(dir);
  if (!doesExist) {
    await mkdir2(dir, { recursive: true });
    return true;
  }
  return;
}

// src/shared/file/crud/removeFile.ts
function removeFile(filename) {
  filename = interpolateFilePath(filename);
  if (!fileExists(filename)) {
    throw new DevopsError(`Attempt to remove a file -- ${filename} -- which does not exist!`, "removal-failed/does-not-exist");
  }
  const stat2 = (0, import_fs26.lstatSync)(filename);
  if (!stat2.isFile()) {
    throw new DevopsError(`Can not remove the file "${filename}" as it is not a file!`, "removal-failed/not-file");
  }
  try {
    (0, import_fs26.rmSync)(filename);
  } catch (error) {
    throw new DevopsError(`Problem encountered trying to remove file "${filename}": ${error.message}`, "removal-failed/other");
  }
}

// src/shared/file/crud/write.ts
init_cjs_shims();
var import_fs27 = __toModule(require("fs"));
var import_chalk54 = __toModule(require("chalk"));
var import_path50 = __toModule(require("path"));
function write(filename, data, options16 = {}) {
  try {
    const content = typeof data !== "string" ? options16.pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data) : data;
    filename = interpolateFilePath(filename);
    let offset;
    while (options16.offsetIfExists && fileExists(filename)) {
      const before = new RegExp(`-${offset}.(.*)$`);
      filename = offset ? filename.replace(before, ".$1") : filename;
      offset = !offset ? 1 : offset++;
      const parts = filename.split(".");
      filename = parts.slice(0, -1).join(".") + `-${offset}.` + parts.slice(-1);
    }
    if (!options16.offsetIfExists && !options16.allowOverwrite && fileExists(filename)) {
      throw new DevopsError(import_chalk54.default`The file "${filename}" already exists and the {italic overwrite} flag was not set. Write was not allowed.`, "do-devops/file-exists");
    }
    if (!dirExists(import_path50.default.dirname(filename))) {
      (0, import_fs27.mkdirSync)(import_path50.default.dirname(filename), { recursive: true });
    }
    (0, import_fs27.writeFileSync)(filename, content, {
      encoding: "utf-8"
    });
    return { filename, data };
  } catch (error) {
    if (isClassification(error, "do-devops/file-exists")) {
      throw error;
    }
    throw new DevopsError(`Problem writing file "${filename}": ${error.message}`, "do-devops/file-write-error");
  }
}

// src/shared/file/utility/index.ts
init_cjs_shims();

// src/shared/file/utility/diffFiles.ts
init_cjs_shims();
var import_chalk55 = __toModule(require("chalk"));
var import_diff = __toModule(require("diff"));
function diffFiles(file1, file2) {
  const content1 = readFile(file1);
  const content2 = readFile(file2);
  if (content1 && content2) {
    const differences = import_diff.default.diffChars(content1, content2);
    for (const block of differences) {
      const color = block.added ? import_chalk55.default.green : block.removed ? import_chalk55.default.red : import_chalk55.default.gray;
      process.stdout.write(color(block.value));
    }
  }
  console.log();
}

// src/shared/file/utility/directoryFiles.ts
init_cjs_shims();
var import_fs28 = __toModule(require("fs"));
var import_path51 = __toModule(require("path"));
function directoryFiles(dir) {
  try {
    const files = (0, import_fs28.readdirSync)(dir);
    return files.reduce((agg, file) => {
      const stats = (0, import_fs28.lstatSync)(import_path51.default.posix.join(dir, file));
      agg.push({ file, stats });
      return agg;
    }, []);
  } catch (error) {
    throw new DevopsError(`Attempt to get files from the directory "${dir}" failed: ${error.message}`, "do-devops/directoryFiles");
  }
}

// src/shared/file/utility/fileIncludes.ts
init_cjs_shims();
function fileIncludes(filename, ...lookFor) {
  const content = readFile(filename);
  if (content === void 0) {
    throw new DevopsError(`The file "${filename}" does not exist!`, "file/file-does-not-exist");
  }
  let result = true;
  for (const text of lookFor) {
    if (!content.includes(text)) {
      result = false;
      console.log("false result:", filename);
    }
  }
  return result;
}

// src/shared/file/utility/fileInfo.ts
init_cjs_shims();
var import_fs29 = __toModule(require("fs"));
var import_path52 = __toModule(require("path"));
var import_util6 = __toModule(require("util"));
var info = (0, import_util6.promisify)(import_fs29.stat);
async function fileInfo(...files) {
  let rememberFile;
  try {
    const promises = [];
    for (const file of files.filter((i) => i)) {
      const parts = getFileComponents(file);
      promises.push(info(file).then((s) => {
        return __spreadValues(__spreadValues({}, parts), s);
      }));
    }
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    throw new DevopsError(`Attempt to get info/stat from the file "${rememberFile}" [ ${import_path52.default.join(process.cwd(), rememberFile || "")} ] failed [ call included request for ${files.length} files ]: ${error.message}`, "do-devops/filesInfo");
  }
}

// src/shared/file/utility/getAllFilesOfType.ts
init_cjs_shims();
var import_globby10 = __toModule(require("globby"));
var import_path53 = __toModule(require("path"));

// src/shared/file/utility/getExportsFromFile.ts
init_cjs_shims();
var import_chalk56 = __toModule(require("chalk"));
var import_path54 = __toModule(require("path"));

// src/shared/file/utility/getFileComponents.ts
init_cjs_shims();
function getFileComponents(filepath, base) {
  const relative2 = toRelativePath(filepath, base);
  const parts = relative2.split("/");
  const start = parts.length > 1 ? parts[0] : "";
  const mid = parts.length > 2 ? parts.slice(1, -1).join("/") : "";
  const filename = parts.slice(-1)[0];
  const match = filename.trim().match(/\.(\w*)$/);
  const ext = match[1];
  const re = new RegExp(`.${ext}`);
  const fileWithoutExt = filename.replace(re, "");
  return { start, mid, filename, fileWithoutExt, ext, filepath: [start, mid].join("/"), full: filepath };
}

// src/shared/file/utility/getFilesUnderPath.ts
init_cjs_shims();
var import_globby11 = __toModule(require("globby"));
async function getFilesUnderPath(dir, extension) {
  dir = dir.replace(/\\/g, "/");
  const pattern = extension ? `${dir}/**/*.${extension}` : `${dir}/**`;
  const files = await (0, import_globby11.default)(pattern);
  return files || [];
}

// src/shared/file/utility/getSubdirectories.ts
init_cjs_shims();
var import_path55 = __toModule(require("path"));
var import_fs30 = __toModule(require("fs"));
function getSubdirectories(dir) {
  try {
    const files = (0, import_fs30.readdirSync)(dir);
    return files.filter((f) => {
      const stats = (0, import_fs30.lstatSync)(import_path55.default.posix.join(dir, f));
      return stats.isDirectory();
    });
  } catch (error) {
    throw new DevopsError(`Attempt to get files from the directory "${dir}" failed: ${error.message}`, "do-devops/directoryFiles");
  }
}

// src/shared/file/utility/isValidServerlessTs.ts
init_cjs_shims();
var import_chalk57 = __toModule(require("chalk"));
function isValidServerlessTs(fn, opts = {}) {
  const log = logger(opts);
  const filename = fn || currentDirectory("serverless.ts");
  const contents = readFile(filename);
  log.info(import_chalk57.default`{gray - validating integrity of {blue serverless.ts} file}`);
  if (!contents) {
    return false;
  }
  if (!fileIncludes(filename, "aws-orchestrate", "import", "export default")) {
    return false;
  }
  log.whisper(import_chalk57.default`{gray - {blue serverless.ts} file {italic looks} structurally valid }`);
  return true;
}

// src/shared/file/utility/symlinks.ts
init_cjs_shims();
var import_fs31 = __toModule(require("fs"));
var import_path56 = __toModule(require("path"));
function symlinks(dir, filter3) {
  return directoryFiles(dir).filter((f) => {
    if (!f.stats.isSymbolicLink()) {
      return false;
    }
    if (!filter3) {
      return true;
    }
    return filter3 === "only-dirs" ? f.stats.isDirectory() : !f.stats.isDirectory();
  }).map((lnk) => {
    const fullPath = import_path56.default.posix.join(dir, lnk.file);
    const linkTo = (0, import_fs31.readlinkSync)(fullPath, { encoding: "utf-8" });
    return __spreadProps(__spreadValues({}, lnk), { linkTo });
  });
}

// src/shared/file/utility/templateDirCopy.ts
init_cjs_shims();
var import_path57 = __toModule(require("path"));
async function templateDirCopy(source, target, replacements) {
  source = import_path57.default.posix.join(libraryDirectory("/templates"), source);
  target = import_path57.default.posix.join(currentDirectory(), target);
  if (!dirExists(source)) {
    throw new DevopsError(`The template directory "${source}" was not found!`, "template/source-dir-missing");
  }
  const files = await getFilesUnderPath(source);
  const problems = [];
  const transferred = [];
  for (const sourceFile of files) {
    const targetFile = import_path57.default.posix.join(target, getFileComponents(sourceFile).filename);
    const completed = await templateFileCopy(sourceFile.replace(libraryDirectory("templates"), ""), targetFile.replace(currentDirectory(), ""), replacements);
    if (!completed) {
      problems.push(sourceFile);
    } else {
      transferred.push(sourceFile);
    }
  }
  return __spreadValues({ transferred }, problems.length > 0 ? { problems } : {});
}

// src/shared/file/utility/templateFileCopy.ts
init_cjs_shims();
var import_path58 = __toModule(require("path"));
async function templateFileCopy(source, target, replacements) {
  source = import_path58.default.posix.join(libraryDirectory("/templates"), source);
  target = import_path58.default.posix.join(currentDirectory(), target);
  let content = readFile(source);
  if (content === void 0) {
    throw new DevopsError(`The template file "${source}" was not found!`, "template/source-file-missing");
  }
  if (replacements) {
    for (const lookFor of Object.keys(replacements)) {
      const re = new RegExp(lookFor, "g");
      content = content.replace(re, replacements[lookFor]);
    }
  }
  if (fileExists(target)) {
    const copy = await askAboutFileOverwrite(source, target);
    if (copy) {
      write(target, content, { allowOverwrite: true });
    } else {
      return false;
    }
  } else {
    write(target, content);
  }
  return true;
}

// src/shared/file/utility/tscValidation.ts
init_cjs_shims();
var import_chalk58 = __toModule(require("chalk"));
var import_shelljs5 = __toModule(require_shell());

// src/shared/core/util/doDevopsVersion.ts
function doDevopsVersion() {
  const libPkgJsonFilename = libraryDirectory();
  try {
    const version = fileExists(libPkgJsonFilename) ? getPackageJson(libPkgJsonFilename).version || "?" : "??";
    return version;
  } catch (error) {
    console.log(import_chalk59.default`{gray - ${emoji.poop} failed to detect do-devops version: ${error.message}}`);
    console.log(import_chalk59.default`{gray - library directory reported as being: ${libPkgJsonFilename}}`);
    return "?";
  }
}

// src/shared/core/util/commandAnnouncement.ts
function commandAnnouncement(cmdDefn, subCommand, isHelp) {
  const version = doDevopsVersion();
  console.log(import_chalk60.default.bold(`
do-devops ${import_chalk60.default.green.italic.bold(cmdDefn ? `${cmdDefn.kind}${subCommand ? ` ${subCommand}` : ""}` : "Help")}${isHelp && cmdDefn ? import_chalk60.default.dim.grey(` [help, v${version}]`) : ""}${isHelp && !cmdDefn ? import_chalk60.default.dim.grey(` v${version}`) : ""}
`));
}

// src/shared/core/util/finalizeCommandDefinition.ts
init_cjs_shims();
function finalizeCommandDefinition(cmdDefn, observations, options16 = {}) {
  const isGlobal = cmdDefn ? false : true;
  const d1 = isDynamicCommandDefinition(cmdDefn.description) ? cmdDefn.description(observations, options16) : cmdDefn.description;
  const description14 = isCommandDescriptor(d1) ? isGlobal ? d1.short : d1.complete : d1;
  const subCommands2 = isDynamicCommandDefinition(cmdDefn.subCommands) ? cmdDefn.subCommands(observations, options16) : cmdDefn.subCommands;
  return {
    kind: cmdDefn.kind,
    handler: cmdDefn.handler,
    syntax: cmdDefn.syntax || `dd ${cmdDefn.kind}${cmdDefn.subCommands ? " <cmd>" : ""} [options]`,
    description: description14,
    subCommands: subCommands2,
    options: __spreadValues(__spreadValues({}, cmdDefn.options), globalOptions),
    hiddenCommand: false
  };
}

// src/shared/core/util/formatCommandsSection.ts
init_cjs_shims();
var import_chalk61 = __toModule(require("chalk"));
var import_native_dash13 = __toModule(require("native-dash"));
function formatCommandsSection(subCommands2, cmd) {
  return {
    header: cmd ? import_chalk61.default`Sub-Commands for {bold ${cmd}}` : `Commands`,
    content: subCommands2.map((sc, idx) => ({
      name: (0, import_native_dash13.isOdd)(idx) ? import_chalk61.default`{dim ${sc.name}}` : sc.name,
      summary: (0, import_native_dash13.isOdd)(idx) ? import_chalk61.default`{dim ${sc.summary}}` : sc.summary
    }))
  };
}

// src/shared/core/util/globalCommandDescriptions.ts
init_cjs_shims();
function globalCommandDescriptions(observations) {
  return getAllCommands(observations).map((i) => {
    return {
      name: i.kind,
      summary: i.description
    };
  });
}

// src/shared/core/help.ts
function help(observations, cmdDefn) {
  const { kind, subCommands: subCommands2, description: description14, syntax: syntax2, options: options16 } = cmdDefn ? finalizeCommandDefinition(cmdDefn, observations) : {
    subCommands: globalCommandDescriptions(observations),
    description: "do-devops is a set of utility functions designed to make DevOps more fun in less time",
    syntax: "dd [cmd] [options]",
    options: globalOptions
  };
  const sections = [
    {
      header: "Description",
      content: description14
    },
    {
      header: "Syntax",
      content: syntax2
    }
  ];
  if (subCommands2) {
    sections.push(formatCommandsSection(subCommands2, kind));
  }
  if (kind) {
    sections.push({
      header: "Options",
      optionList: convertOptionsToArray(options16 || {})
    });
  }
  try {
    console.log((0, import_command_line_usage.default)(sections));
  } catch (error) {
    console.log(`  - ${emoji.poop}  ${import_chalk62.default.red("Problem displaying help:")} ${error.message}
`);
    console.log(import_chalk62.default.grey(error.stack));
  }
  console.log();
  process.exit();
}

// src/shared/core/helpContent.ts
init_cjs_shims();
var import_chalk63 = __toModule(require("chalk"));

// src/shared/core/isKnownCommand.ts
init_cjs_shims();
function isKnownCommand(cmd) {
  return typeof cmd === "string" && getAllCommands().map((i) => i.kind).includes(cmd);
}

// src/shared/core/options.ts
init_cjs_shims();
var globalOptions = {
  quiet: {
    alias: "q",
    type: Boolean,
    group: "global",
    description: "stops all output to {italic stdout}"
  },
  verbose: {
    alias: "v",
    type: Boolean,
    group: "global",
    description: "makes the output more verbose"
  },
  help: {
    alias: "h",
    type: Boolean,
    group: "global",
    description: "shows help for given command"
  }
};

// src/shared/core/parseCmdArgs.ts
init_cjs_shims();
var import_command_line_args = __toModule(require("command-line-args"));
function parseCmdArgs(cmd, incomingArgv) {
  const subCommandDefn = {
    command: __spreadValues(__spreadValues({}, {
      type: String,
      group: "subCommand",
      defaultOption: true
    }), cmd.greedy ? { multiple: true } : {})
  };
  const greedyCommandDefn = {
    argv: {
      type: String,
      group: "argv",
      defaultOption: true,
      multiple: true
    }
  };
  const optDefn = cmd.subCommands ? __spreadValues(__spreadValues(__spreadValues({}, globalOptions), subCommandDefn), cmd.options) : __spreadValues(__spreadValues(__spreadValues({}, globalOptions), cmd.options), cmd.greedy ? greedyCommandDefn : {});
  const { global, local, _unknown, subCommand, argv } = (0, import_command_line_args.default)(convertOptionsToArray(optDefn), {
    argv: incomingArgv,
    partial: true
  });
  const opts = __spreadValues(__spreadValues({}, global ? global : {}), local ? local : {});
  const sc = subCommand ? cmd.greedy ? subCommand == null ? void 0 : subCommand.command[0] : subCommand == null ? void 0 : subCommand.command : void 0;
  return {
    subCommand: sc,
    argv: cmd.greedy ? sc ? (sc == null ? void 0 : sc.slice(1)) || [] : argv.argv || [] : [],
    raw: incomingArgv,
    opts,
    unknown: _unknown || []
  };
}

// src/shared/core/proxyToPackageManager.ts
init_cjs_shims();
var import_child_process = __toModule(require("child_process"));
var import_chalk64 = __toModule(require("chalk"));
var import_process2 = __toModule(require("process"));
var NON_PROXY = new Set(["install", "outdated", "update", "why", "ls"]);
function isDevFlag(flag, mngr) {
  const matched = ["--save-dev", "--dev"].includes(flag);
  if (!matched) {
    return;
  }
  switch (mngr) {
    case "npm":
    case "pnpm":
      return "--save-dev";
    case "yarn":
    default:
      return "--dev";
  }
}
function isPeerFlag(flag, mngr) {
  const matched = ["--save-peer", "--peer"].includes(flag);
  if (!matched) {
    return;
  }
  switch (mngr) {
    case "npm":
    case "pnpm":
      return "--save-peer";
    case "yarn":
    default:
      return "--peer";
  }
}
function isOptionalFlag(flag, mngr) {
  const matched = ["--save-optional", "--optional"].includes(flag);
  if (!matched) {
    return;
  }
  switch (mngr) {
    case "npm":
    case "pnpm":
      return "--save-optional";
    case "yarn":
    default:
      return "--optional";
  }
}
async function proxyToPackageManager(cmd, observations, argv) {
  if (!observations.has("packageJson")) {
    console.log(import_chalk64.default`- ${emoji.shocked} the {green ${cmd}} command is only meant to used in the root of NodeJS which has a {blue package.json} file in it.\n`);
    process.exit();
  }
  const pkgManager = await determinePackageManager({ interactive: true }, observations);
  if (pkgManager) {
    let pkgCmd;
    let isScriptCmd = false;
    switch (cmd) {
      case "install":
        const args = argv == null ? void 0 : argv.map((a) => isPeerFlag(a, pkgManager) || isOptionalFlag(a, pkgManager) || isDevFlag(a, pkgManager) || a);
        pkgCmd = pkgManager === "yarn" ? args && args.length > 0 ? `yarn add ${args.join(" ")}` : "yarn" : `${pkgManager} install ${args ? "" + args.join(" ") : ""}`;
        break;
      case "outdated":
      case "upgrade":
      case "why":
        pkgCmd = `${pkgManager} ${cmd}${argv ? " " + argv.join(" ") : ""}`;
        break;
      case "ls":
        pkgCmd = pkgManager === "yarn" ? `yarn list --pattern "${argv == null ? void 0 : argv.pop()}"` : `${pkgManager} ls ${argv == null ? void 0 : argv.pop()}`;
        break;
      default:
        isScriptCmd = true;
        pkgCmd = pkgManager === "yarn" ? `yarn ${cmd} ${argv ? " " + argv.join(" ") : ""}` : `${pkgManager} run ${cmd}${argv ? " " + argv.join(" ") : ""}`;
    }
    if (NON_PROXY.has(cmd)) {
      console.log(import_chalk64.default`{gray - we detected use of the {blue ${pkgManager}} in this repo and will {italic proxy} "${cmd}" to: {blue ${pkgCmd}}}\n`);
    } else {
      if (isScriptCmd && !hasScript(cmd)) {
        console.log(import_chalk64.default`{gray - we {italic would} proxy this as {blue ${pkgCmd}} but you don't have "${cmd}" defined in your scripts section.}\n`);
        process.exit();
      }
      console.log(import_chalk64.default`{gray - we will proxy {blue ${pkgCmd}} for you}\n`);
    }
    const parts = pkgCmd.split(" ");
    (0, import_child_process.spawnSync)(parts[0], parts.filter((i) => i).slice(1), { stdio: "inherit", cwd: (0, import_process2.cwd)() });
  } else {
    console.log(import_chalk64.default`- we can not currently tell {italic which} package manager you're using.`);
    const answer = await askListQuestion("Would you like save the package manager to this repo in a config file?", ["not now, thanks", "npm", "pnpm", "yarn"]);
    if (answer !== "not now, thanks") {
      saveProjectConfig({ general: { pkgManager: answer } });
    }
  }
}

// src/shared/core/commands/index.ts
init_cjs_shims();

// src/shared/core/commands/getAllCommands.ts
init_cjs_shims();

// src/commands/index.ts
var commands_exports = {};
__export(commands_exports, {
  add: () => add_default,
  autoindex: () => autoindex_default,
  awsid: () => awsid_default,
  build: () => build_default,
  deploy: () => deploy_default,
  endpoints: () => endpoints_default,
  fns: () => fns_default,
  image: () => image_default,
  info: () => info_default,
  install: () => install_default,
  invoke: () => invoke_default,
  latest: () => latest_default,
  layers: () => layers_default,
  ls: () => ls_default,
  madge: () => madge_default2,
  outdated: () => outdated_default,
  pkg: () => pkg_default,
  scaffold: () => scaffold_default,
  ssm: () => ssm_default,
  test: () => test_default,
  upgrade: () => upgrade_default,
  watch: () => watch_default,
  why: () => why_default
});
init_cjs_shims();

// src/commands/add.ts
init_cjs_shims();
var import_chalk65 = __toModule(require("chalk"));
var command = {
  kind: "add",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("install", observations, raw);
    process.exit();
  },
  description: import_chalk65.default`proxies your package manager's {bold italic install / add } command`
};
var add_default = command;

// src/commands/install.ts
init_cjs_shims();
var import_chalk66 = __toModule(require("chalk"));
var command2 = {
  kind: "install",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("install", observations, raw);
    process.exit();
  },
  description: import_chalk66.default`proxies your package manager's {bold italic install} command (and yarn's "add" command)`
};
var install_default = command2;

// src/commands/ls.ts
init_cjs_shims();
var import_chalk67 = __toModule(require("chalk"));
var command3 = {
  kind: "ls",
  handler: async ({ observations, raw, argv }) => {
    if (!observations.has("packageJson")) {
      console.log(import_chalk67.default`- the {italic ls} command is only useful in a directory with a {blue package.json}`);
      process.exit();
    }
    if (argv.length === 0) {
      console.log(import_chalk67.default`- in order to run the {italic ls} command, we will need you to choose a dependency of this repo\n`);
      const dep = await askForDependency(observations);
      if (!dep) {
        process.exit();
      }
      raw = [dep];
    }
    await proxyToPackageManager("ls", observations, raw);
    return;
  },
  greedy: true,
  description: import_chalk67.default`proxies your package manager's {italic ls} / {italic list} command to determine which versions of a dep you have`
};
var ls_default = command3;

// src/commands/watch.ts
init_cjs_shims();
var import_chalk68 = __toModule(require("chalk"));
var command4 = {
  kind: "watch",
  handler: async ({ observations, raw }) => {
    if (!observations.has("packageJson")) {
      console.log(import_chalk68.default`- {italic watching} files in the repo is something which can only happen in directory with a {blue package.json}`);
      process.exit();
    }
    if (observations.has("serverlessFramework")) {
      if (hasScript("watch")) {
        console.log(import_chalk68.default`{gray - {bold note:} this is a serverless project but because you have a "watch" script, we will prefer that over the default do-devops watcher}`);
        proxyToPackageManager("watch", observations, raw);
        process.exit();
      } else {
        console.log(import_chalk68.default`- starting the Serverless Devops watcher`);
        process.exit();
      }
    }
    await proxyToPackageManager("watch", observations, raw);
    process.exit();
  },
  description: "proxies your package manager's 'watch' command"
};
var watch_default = command4;

// src/commands/autoindex/index.ts
init_cjs_shims();

// src/commands/autoindex/parts/index.ts
init_cjs_shims();

// src/commands/autoindex/parts/autoindex.ts
init_cjs_shims();
var import_chalk73 = __toModule(require("chalk"));
var import_globby13 = __toModule(require("globby"));
var import_path62 = __toModule(require("path"));

// src/commands/autoindex/private/index.ts
init_cjs_shims();

// src/commands/autoindex/private/exclusions.ts
init_cjs_shims();
function exclusions(file) {
  const hasExclusions = /^\/\/\s*#autoindex.*,\s*exclude:/;
  const explicit = hasExclusions.test(file) ? file.replace(/^\/\/\s*#autoindex.*,\s*exclude:([^\n;|]*)[\n;|][^\0]*/g, "$1").split(",").map((i) => i.trim()) : [];
  return [...new Set([...explicit, "index", "private"])];
}

// src/commands/autoindex/private/exportable.ts
init_cjs_shims();
var import_path59 = __toModule(require("path"));
var import_fs34 = __toModule(require("fs"));
var import_globby12 = __toModule(require("globby"));

// src/commands/autoindex/private/util/index.ts
init_cjs_shims();

// src/commands/autoindex/private/util/alreadyHasAutoindexBlock.ts
init_cjs_shims();
function alreadyHasAutoindexBlock(fileContent) {
  return fileContent.includes(START_REGION) && fileContent.includes(END_REGION);
}

// src/commands/autoindex/private/util/askHowToHandleMonoRepoIndexing.ts
init_cjs_shims();
var import_inquirer9 = __toModule(require("inquirer"));

// src/commands/autoindex/private/util/cleanOldBlockFormat.ts
init_cjs_shims();
function cleanOldBlockFormat(fileContents) {
  return fileContents.replace(/\/\/#region.*\/\/#endregion/s, "");
}

// src/commands/autoindex/private/util/communicateApi.ts
init_cjs_shims();
var import_chalk69 = __toModule(require("chalk"));

// src/commands/autoindex/private/util/createMetaInfo.ts
init_cjs_shims();

// src/commands/autoindex/private/util/removeExtension.ts
init_cjs_shims();
function removeExtension(file) {
  const parts = file.split(".");
  const [fn] = parts.length > 2 ? [file.replace("." + parts[parts.length - 1], ""), parts[parts.length - 1]] : file.split(".");
  return fn;
}
function removeAllExtensions(files) {
  return files.map((f) => removeExtension(f));
}

// src/commands/autoindex/private/util/createMetaInfo.ts
function createMetaInfo(exportType, sym, exclusions2, opts) {
  const output = [];
  output.push(`// export: ${exportType}; exclusions: ${exclusions2.join(", ")}.`);
  if (sym.files.length > 0) {
    output.push(`// files: ${sym.files.map((i) => removeExtension(i)).join(", ")}.`);
  }
  if (sym.dirs.length > 0) {
    output.push(`// directories: ${sym.dirs.join(", ")}.`);
  }
  if (opts.sfc !== false && sym.sfcs.length > 0) {
    output.push(`// SFCs: ${sym.sfcs.map((i) => removeExtension(i)).join(", ")}.`);
  }
  return output.join("\n");
}

// src/commands/autoindex/private/util/detectExportType.ts
init_cjs_shims();
function detectExportType(fileContent) {
  const defaultExport = /^\/\/\s*#autoindex:\s*default/;
  const namedOffsetExport = /^\/\/\s*#autoindex:\s*named-offset/;
  const offsetExport = /^\/\/\s*#autoindex:\s*offset/;
  if (defaultExport.test(fileContent)) {
    return ExportType.default;
  }
  if (namedOffsetExport.test(fileContent) || offsetExport.test(fileContent)) {
    return ExportType.namedOffset;
  }
  return ExportType.named;
}

// src/commands/autoindex/private/util/getExistingMetaInfo.ts
init_cjs_shims();
function getExportType(content) {
  const matches = content.match(/\/\/ export: (.*);/);
  return Array.isArray(matches) ? matches[1].trim() : "";
}
function getExclusions(content) {
  const matches = content.match(/\/\/ export: .*; exclusions: (.*)\./);
  return Array.isArray(matches) ? matches[1].trim().split(", ") : [];
}
function getFilesMeta(content) {
  const matches = content.match(/\/\/ files: (.*)\./);
  return Array.isArray(matches) ? matches[1].trim().split(", ") : [];
}
function getDirsMeta(content) {
  const matches = content.match(/\/\/ directories: (.*)\./);
  return Array.isArray(matches) ? matches[1].trim().split(", ") : [];
}
function getSFCsMeta(content) {
  const matches = content.match(/\/\/ SFCs: (.*)\./);
  return Array.isArray(matches) ? matches[1].trim().split(", ") : [];
}
function getExistingMetaInfo(fileContent) {
  const hasExistingMeta = alreadyHasAutoindexBlock(fileContent);
  const files = hasExistingMeta ? getFilesMeta(fileContent) : [];
  const dirs = hasExistingMeta ? getDirsMeta(fileContent) : [];
  const sfcs = hasExistingMeta ? getSFCsMeta(fileContent) : [];
  const exportType = hasExistingMeta ? getExportType(fileContent) : "";
  const exclusions2 = hasExistingMeta ? getExclusions(fileContent) : [];
  return { hasExistingMeta, files, dirs, sfcs, exportType, exclusions: exclusions2 };
}

// src/commands/autoindex/private/util/isAutoindexFile.ts
init_cjs_shims();
var import_chalk70 = __toModule(require("chalk"));
var import_fs32 = __toModule(require("fs"));
function isAutoindexFile(filename) {
  const log = logger();
  const file = (0, import_fs32.readFileSync)(filename, "utf-8");
  if (file.replace(/\s+/g, "") === "") {
    log.shout(import_chalk70.default`- ${emoji.shocked} the index file {blue ${filename}} was EMPTY!`);
    (0, import_fs32.writeFileSync)(filename, `// #autoindex`);
    log.shout(import_chalk70.default`- ${emoji.robot} made this file into an {italic autoindex} file\n`);
    return true;
  }
  return /^\/\/\s*#autoindex/.test(file);
}

// src/commands/autoindex/private/util/isOrphanedIndexFile.ts
init_cjs_shims();
var import_fs33 = __toModule(require("fs"));
function isOrphanedIndexFile(filename) {
  return /^\/\/\s*#autoindex.*orphan/.test((0, import_fs33.readFileSync)(filename, "utf-8"));
}

// src/commands/autoindex/private/util/noDifference.ts
init_cjs_shims();
function noDifference(existing, current) {
  return existing.every((v) => current.includes(v)) && current.every((v) => existing.includes(v));
}

// src/commands/autoindex/private/util/nonBlockContent.ts
init_cjs_shims();

// src/commands/autoindex/private/reference/index.ts
init_cjs_shims();

// src/commands/autoindex/private/reference/constants.ts
init_cjs_shims();
var START_REGION = "// #region autoindexed files";
var END_REGION = "// #endregion";
var comment = "//";
var noteIndent = `${comment} ${" ".repeat(0)}`;
var bulletLine = `${comment}${" ".repeat(4)}- `;
var bulletIndent = `${comment}${" ".repeat(20)}      `;
var info2 = [
  `${comment} Note:`,
  `${comment} -----`,
  `${noteIndent}This file was created by running: "dd devops autoindex"; it assumes you have`,
  `${noteIndent}the 'do-devops' pkg (that's "dd" on npm) installed as a dev dep.`,
  `${comment}`,
  `${noteIndent}By default it assumes that exports are named exports but this can be changed by`,
  `${noteIndent}adding a modifier to the '// #autoindex' syntax:`,
  `${comment}`,
  `${bulletLine}autoindex:named     same as default, exports "named symbols"`,
  `${bulletLine}autoindex:default   assumes each file is exporting a default export`,
  `${bulletIndent}and converts the default export to the name of the`,
  `${bulletIndent}file`,
  `${bulletLine}autoindex:offset    assumes files export "named symbols" but that each`,
  `${bulletIndent}file's symbols should be offset by the file's name`,
  `${bulletIndent}(useful for files which might symbols which collide`,
  `${bulletIndent}or where the namespacing helps consumers)`,
  `${comment}`,
  `${noteIndent}You may also exclude certain files or directories by adding it to the`,
  `${noteIndent}autoindex command. As an example:`,
  `${comment}`,
  `${bulletLine}autoindex:named, exclude: foo,bar,baz`,
  `${comment}`,
  `${noteIndent}Inversely, if you state a file to be an "orphan" then autoindex files`,
  `${noteIndent}below this file will not reference this autoindex file:`,
  `${comment}`,
  `${bulletLine}autoindex:named, orphan`,
  `${noteIndent}`,
  `${noteIndent}Also be aware that all of your content outside the "// #region" section in this file`,
  `${noteIndent}will be preserved in situations where you need to do something paricularly awesome.`,
  `${noteIndent}Keep on being awesome.`
];
var AUTOINDEX_INFO_MSG = info2.join("\n");

// src/commands/autoindex/private/reference/types.ts
init_cjs_shims();
var ExportAction;
(function(ExportAction2) {
  ExportAction2[ExportAction2["updated"] = 0] = "updated";
  ExportAction2[ExportAction2["added"] = 1] = "added";
  ExportAction2[ExportAction2["noChange"] = 2] = "noChange";
  ExportAction2[ExportAction2["refactor"] = 3] = "refactor";
})(ExportAction || (ExportAction = {}));
var ExportType;
(function(ExportType2) {
  ExportType2["default"] = "default";
  ExportType2["named"] = "named";
  ExportType2["namedOffset"] = "namedOffset";
})(ExportType || (ExportType = {}));

// src/commands/autoindex/private/util/nonBlockContent.ts
function nonBlockContent(content) {
  const re = new RegExp(`${START_REGION}.*${END_REGION}`, "s");
  return content.replace(re, "");
}

// src/commands/autoindex/private/util/replaceRegion.ts
init_cjs_shims();
function replaceRegion(fileContent, regionContent) {
  const re = new RegExp(`${START_REGION}.*${END_REGION}
.*`, "gs");
  return fileContent.replace(re, regionContent + "\n");
}

// src/commands/autoindex/private/util/structurePriorAutoindexContent.ts
init_cjs_shims();

// src/commands/autoindex/private/util/timestamp.ts
init_cjs_shims();
var import_date_fns4 = __toModule(require("date-fns"));
function timestamp() {
  return `// index last changed at: ${(0, import_date_fns4.format)(Date.now(), "Mo MMM, yyyy, hh:mm a ( O )")}`;
}

// src/commands/autoindex/private/util/unexpectedContent.ts
init_cjs_shims();
function unexpectedContent(fileContent) {
  const warnings = {};
  if (fileContent.includes("export type") || fileContent.includes("export interface")) {
    warnings["inline interfaces"] = true;
  }
  if (fileContent.includes("import ")) {
    warnings.imports = true;
  }
  if (fileContent.includes("enum ")) {
    warnings.enums = true;
  }
  if (fileContent.includes("function ")) {
    warnings.functions = true;
  }
  return Object.keys(warnings).length > 0 ? warnings : false;
}

// src/commands/autoindex/private/exportable.ts
async function exportable(filePath, excluded) {
  const dir = import_path59.default.posix.dirname(filePath);
  const thisFile = import_path59.default.posix.basename(filePath);
  const exclusions2 = new Set([...excluded, ...thisFile]);
  const files = (await (0, import_globby12.default)([`${dir}/*.ts`, `${dir}/*.js`])).filter((file) => !exclusions2.has(removeExtension(import_path59.default.posix.basename(file)))).map((i) => import_path59.default.posix.basename(i));
  const sfcs = (await (0, import_globby12.default)([`${dir}/*.vue`])).filter((file) => !exclusions2.has(removeExtension(import_path59.default.posix.basename(file)))).map((i) => import_path59.default.posix.basename(i));
  const dirs = [];
  const orphans = [];
  (0, import_fs34.readdirSync)(dir, { withFileTypes: true }).filter((i) => i.isDirectory()).filter((i) => !exclusions2.has(removeExtension(i.name))).map((i) => {
    const ts = import_path59.default.posix.join(dir, i.name, "index.ts");
    const js = import_path59.default.posix.join(dir, i.name, "index.js");
    if ((0, import_fs34.existsSync)(ts)) {
      if (!isOrphanedIndexFile(ts)) {
        dirs.push(i.name);
      } else {
        orphans.push(i.name);
      }
    } else if ((0, import_fs34.existsSync)(js)) {
      if (!isOrphanedIndexFile(js)) {
        dirs.push(i.name);
      } else {
        orphans.push(i.name);
      }
    }
  });
  return { files, base: dir, dirs, sfcs, orphans };
}

// src/commands/autoindex/private/processFiles.ts
init_cjs_shims();
var import_chalk71 = __toModule(require("chalk"));
var import_fs35 = __toModule(require("fs"));
var import_path60 = __toModule(require("path"));
async function processFiles(paths, opts, _o, scope) {
  const log = logger(opts);
  const results = {};
  const defaultExclusions = ["index", "private"];
  const baseExclusions = opts.add ? [...defaultExclusions, ...opts.add.split(",").map((i) => i.trim())] : defaultExclusions;
  for await (const path60 of paths) {
    const fileString = (0, import_fs35.readFileSync)(path60, { encoding: "utf-8" });
    const isAutoIndex = /^\/\/\s*#autoindex/;
    if (isAutoIndex.test(fileString)) {
      results[path60] = fileString;
    }
  }
  if (Object.keys(results).length === 0) {
    log.info(import_chalk71.default`- No {italic autoindex} files found in this package`);
  } else {
    for (const filePath of Object.keys(results)) {
      const fileContent = results[filePath];
      const dir = import_path60.default.posix.dirname(filePath);
      const blacklist = scope.blacklist.filter((i) => i.includes(dir)).flatMap((i) => i.replace(import_path60.default.posix.dirname(i) + "/", "").split(".").slice(0, -1));
      if (blacklist.length > 0) {
        log.whisper(import_chalk71.default`{gray - index file {blue ${highlightFilepath(filePath)}} will exclude the following based on {italic blacklist} rules:}`);
        for (const item of blacklist) {
          log.whisper(import_chalk71.default`{dim   - ${item}}`);
        }
      }
      const explicit = exclusions(fileContent);
      if (explicit.some((i) => !["index", "private"].includes(i))) {
        log.whisper(import_chalk71.default`{gray - index file {blue ${highlightFilepath(filePath)}} will exclude the following based on {italic explicit exclusions} in the file:}`);
        for (const item of explicit) {
          log.whisper(import_chalk71.default`{dim   - ${item}}`);
        }
      }
      const excluded = [...new Set([...explicit, ...baseExclusions, ...blacklist])];
      const exportableSymbols = await exportable(filePath, excluded);
      const exportType = detectExportType(fileContent);
      let autoIndexContent;
      switch (exportType) {
        case ExportType.default:
          autoIndexContent = defaultExports(exportableSymbols, opts);
          break;
        case ExportType.namedOffset:
          autoIndexContent = namedOffsetExports(exportableSymbols, opts);
          break;
        case ExportType.named:
          autoIndexContent = namedExports2(exportableSymbols, opts);
          break;
        default:
          throw new DevopsError(`Unknown export type: ${exportType}!`, "invalid-export-type");
      }
      const blockContent = `${START_REGION}

${timestamp()}
${createMetaInfo(exportType, exportableSymbols, excluded, opts)}
${autoIndexContent}

${AUTOINDEX_INFO_MSG}

${END_REGION}`;
      const existingContentMeta = getExistingMetaInfo(fileContent);
      let exportAction;
      const bracketedMessages = [];
      if (exportType !== ExportType.named) {
        bracketedMessages.push(import_chalk71.default`{grey using }{italic ${exportType}} {grey export}`);
      }
      const hasOldStyleBlock = /\/\/#region.*\/\/#endregion/s.test(fileContent);
      if (autoIndexContent && alreadyHasAutoindexBlock(fileContent)) {
        if (noDifference(existingContentMeta.files, removeAllExtensions(exportableSymbols.files)) && noDifference(existingContentMeta.dirs, removeAllExtensions(exportableSymbols.dirs)) && noDifference(existingContentMeta.sfcs, removeAllExtensions(exportableSymbols.sfcs)) && exportType === existingContentMeta.exportType && noDifference(existingContentMeta.exclusions, excluded)) {
          exportAction = hasOldStyleBlock ? ExportAction.refactor : ExportAction.noChange;
        } else {
          exportAction = ExportAction.updated;
        }
      } else if (autoIndexContent) {
        exportAction = ExportAction.added;
      }
      const warnings = unexpectedContent(nonBlockContent(fileContent));
      if (warnings) {
        bracketedMessages.push(import_chalk71.default` {red unexpected content: {italic {dim ${Object.keys(warnings).join(", ")} }}}`);
      }
      const excludedWithoutBase = excluded.filter((i) => !baseExclusions.includes(i));
      if (excludedWithoutBase.length > 0) {
        bracketedMessages.push(import_chalk71.default`{italic excluding:} {grey ${excludedWithoutBase.join(", ")}}`);
      }
      const bracketedMessage = bracketedMessages.length > 0 ? import_chalk71.default`{dim [ ${bracketedMessages.join(", ")} ]}` : "";
      const changeMessage = import_chalk71.default`- ${exportAction === ExportAction.added ? "added" : "updated"} ${highlightFilepath(filePath)} ${bracketedMessage}`;
      const refactorMessage = import_chalk71.default`- removing an old form of autoindex block style at ${highlightFilepath(filePath)}`;
      const unchangedMessage = import_chalk71.default`{dim - {italic no changes} to ${highlightFilepath(filePath)}} ${bracketedMessage}`;
      if (!opts.quiet && exportAction === ExportAction.noChange) {
        log.whisper(unchangedMessage);
      } else if (exportAction === ExportAction.refactor) {
        log.info(refactorMessage);
        (0, import_fs35.writeFileSync)(filePath, cleanOldBlockFormat(existingContentMeta.hasExistingMeta ? replaceRegion(fileContent, blockContent) : `${fileContent}
${blockContent}
`));
      } else {
        console.log(changeMessage);
        (0, import_fs35.writeFileSync)(filePath, cleanOldBlockFormat(existingContentMeta.hasExistingMeta ? replaceRegion(fileContent, blockContent) : `${fileContent}
${blockContent}
`));
      }
    }
  }
  if (!opts.quiet) {
    console.log();
  }
}

// src/commands/autoindex/private/watchHandler.ts
init_cjs_shims();
var import_chalk72 = __toModule(require("chalk"));
var import_path61 = __toModule(require("path"));
var filesToIgnore = [];
function watchHandler(dir, options16 = {}, o, scope) {
  const log = console.log.bind(console);
  return (evtBeingWatched) => {
    return (filepath) => {
      if (filesToIgnore.includes(filepath)) {
        filesToIgnore = filesToIgnore.filter((i) => i !== filepath);
        return;
      }
      let indexFiles;
      const fileIsIndexFile = (fp) => /(index|private).[jt]s/.test(fp);
      if (fileIsIndexFile(filepath)) {
        filesToIgnore.push(filepath);
        indexFiles = [filepath];
      } else {
        indexFiles = directoryFiles(dir).map((i) => import_path61.default.posix.join(dir, i.file)).filter((f) => isAutoindexFile(f));
        filesToIgnore = [...filesToIgnore, ...indexFiles];
      }
      const re = /.*packages\/(\S+?\/)/;
      const [_, pkg] = re.exec(filepath) || [void 0, void 0];
      const message = pkg ? import_chalk72.default`- the file ${highlightFilepath(filepath)} in package {italic ${pkg}} was {italic ${evtBeingWatched}} to a watched directory` : import_chalk72.default`- the file ${highlightFilepath(filepath)} was {italic ${evtBeingWatched}} to a watched directory`;
      if (!fileIsIndexFile(filepath)) {
        log(message);
      } else {
        if (evtBeingWatched === "unlinked") {
          indexFiles = [];
        }
      }
      if (indexFiles.length > 0) {
        processFiles(indexFiles, __spreadProps(__spreadValues({}, options16), { quiet: true }), o, scope).then(() => log());
      }
    };
  };
}

// src/commands/autoindex/private/export-formats/index.ts
init_cjs_shims();

// src/commands/autoindex/private/export-formats/defaultExports.ts
init_cjs_shims();
function defaultExports(exportable2, opts = {}) {
  const file = (file2) => `export { default as ${removeExtension(file2)} } from "./${opts.preserveExtension ? removeExtension(file2) + ".js" : removeExtension(file2)}";`;
  const dir = (dir2) => `export { default as ${removeExtension(dir2)} } from "./${dir2}/index${opts.preserveExtension ? ".js" : ""}";`;
  return exportTemplate(exportable2, opts, { file, dir });
}

// src/commands/autoindex/private/export-formats/exportTemplate.ts
init_cjs_shims();
function exportTemplate(exportable2, opts = {}, callbacks) {
  const contentLines = [];
  if (exportable2.files.length > 0) {
    contentLines.push("\n// local file exports");
    if (callbacks.file) {
      for (const file of exportable2.files) {
        contentLines.push(callbacks.file(file));
      }
    } else {
      contentLines.push("// the export strategy chosen does not write file exports");
    }
  }
  if (opts.sfc !== false && exportable2.sfcs.length > 0) {
    contentLines.push("\n// SFC components");
    for (const sfc of exportable2.sfcs) {
      contentLines.push(`export { default as ${removeExtension(sfc)} } from "./${sfc}";`);
    }
  }
  if (exportable2.dirs.length > 0) {
    contentLines.push("\n// directory exports");
  }
  if (callbacks.dir) {
    for (const dir of exportable2.dirs) {
      contentLines.push(callbacks.dir(dir));
    }
  } else {
    contentLines.push("// the export strategy chosen does not write directories to this file");
  }
  if (((exportable2 == null ? void 0 : exportable2.orphans) || []).length > 0) {
    contentLines.push(`
// there were directories orphaned: ${(exportable2.orphans || []).join(", ")}`);
  }
  return contentLines.join("\n");
}

// src/commands/autoindex/private/export-formats/namedExports.ts
init_cjs_shims();
function namedExports2(exportable2, opts = {}) {
  const file = (file2) => `export * from "./${opts.preserveExtension ? removeExtension(file2) + ".js" : removeExtension(file2)}";`;
  const dir = (dir2) => `export * from "./${dir2}/index${opts.preserveExtension ? ".js" : ""}";`;
  return exportTemplate(exportable2, opts, { file, dir });
}

// src/commands/autoindex/private/export-formats/namedOffsetExports.ts
init_cjs_shims();
function namedOffsetExports(exportable2, opts = {}) {
  const file = (file2) => `export * as ${removeExtension(file2)} from "./${opts.preserveExtension ? removeExtension(file2) + ".js" : removeExtension(file2)}";`;
  const dir = (dir2) => `export * as ${dir2} from "./${dir2}/index${opts.preserveExtension ? ".js" : ""}";`;
  return exportTemplate(exportable2, opts, { file, dir });
}

// src/commands/autoindex/parts/autoindex.ts
var import_chokidar = __toModule(require("chokidar"));
function setupWatcherDir(dir, ignored = [], opts, o, scope) {
  const EVENTS = ["add", "change", "unlink", "link"];
  const h = watchHandler(dir, opts, o, scope);
  const watcher = (0, import_chokidar.watch)(dir, {
    ignored,
    persistent: true,
    usePolling: true,
    interval: 100
  });
  watcher.on("ready", () => {
    watcher.on("error", (e) => {
      console.log(import_chalk73.default`{red Error occurred watching "${dir}":} ${e.message}\n`);
    });
    for (const evt of EVENTS) {
      watcher.on(evt, h((evt.includes("Dir") ? `${evt}ed directory` : `${evt}ed`).replace("ee", "e")));
    }
  });
  return watcher;
}
async function setupAutoIndexWatcher(watched, opts, o, scope) {
  const log = console.log.bind(console);
  const watcher = (0, import_chokidar.watch)("**/index.[jt]s", {
    ignored: "node_modules/*",
    persistent: true,
    usePolling: true,
    interval: 100
  });
  watcher.on("error", (e) => {
    log(import_chalk73.default`{red Error occurred watching for changes to autoindex files:} ${e.message}\n`);
  });
  watcher.on("ready", () => {
    const handlerForAutoIndexFiles = (evt) => {
      return async (filepath) => {
        if (!/(index|private)\.[jt]s/.test(filepath)) {
          return;
        }
        const watchedDirs = Object.keys(watched);
        const dir = import_path62.default.posix.dirname(filepath);
        switch (evt) {
          case "change":
            if (watchedDirs.includes(dir) && !isAutoindexFile(filepath)) {
              log(import_chalk73.default`- index file ${highlightFilepath(filepath)} is no longer an {italic autoindex} file`);
              if (watched[filepath]) {
                await watched[filepath].close();
              } else {
                log(import_chalk73.default`- {red Warn:} an autoindex file was converted to a non autoindexed file but when trying remove the watcher on that directory it appears it doesn't exist. This should not happen.`);
              }
            }
          case "add":
          case "link":
            if (!watchedDirs.includes(dir) && isAutoindexFile(filepath)) {
              log(`- new autoindex file detected: ${highlightFilepath(filepath)}; watcher started`);
              watched[filepath] = setupWatcherDir(dir, [], opts, o, scope);
              processFiles([filepath], opts, o, scope);
            }
            break;
          case "unlink":
            log({ dir, filepath, watched: Object.keys(watched) });
            if (watchedDirs.includes(dir)) {
              log(`- the autoindex file ${highlightFilepath(filepath)} has been removed`);
              if (watched[dir]) {
                await watched[dir].close();
              } else {
                log(import_chalk73.default`- {red Warn:} an autoindex file was removed but there was no existing watcher on that directory.`);
              }
            }
        }
      };
    };
    for (const evt of ["add", "change", "unlink", "link"]) {
      watcher.on(evt, handlerForAutoIndexFiles(evt));
    }
    log(import_chalk73.default`{grey - watcher events for autoindex discovery in place}`);
  });
  return watcher;
}
var handler = async ({ opts, observations }) => {
  var _a, _b, _c;
  const log = logger(opts);
  if (opts.config) {
    await askForAutoindexConfig(opts, observations);
    process.exit();
  }
  const projectConfig = getProjectConfig();
  const monoRepoPackages = await getMonoRepoPackages(process.cwd());
  if (monoRepoPackages.length > 0 && !opts.quiet) {
    console.log(import_chalk73.default`- ${emoji.eyeballs} monorepo detected with {yellow ${String(monoRepoPackages.length)}} packages`);
    for (const pkg of monoRepoPackages) {
      console.log(import_chalk73.default`{gray   - {bold ${pkg.name}} {italic at} {dim ${pkg.path}}}`);
    }
    console.log(import_chalk73.default`- ${emoji.run} will run each package separately based on it's own configuration`);
  }
  monoRepoPackages.push({ path: ".", name: getPackageJson(process.cwd()).name });
  const isMonorepo = monoRepoPackages.length > 1;
  for (const repo of monoRepoPackages) {
    const isRoot = isMonorepo && repo.path === ".";
    const name = isRoot ? `${repo.name} (ROOT)` : repo.name;
    if (isMonorepo) {
      log.info(import_chalk73.default`\n- running {blue autoindex} on repo {bold {yellow ${name}}}\n`);
    }
    const indexGlobs = ((_a = projectConfig.autoindex) == null ? void 0 : _a.indexGlobs) || [
      "**/index.ts",
      "**/index.js",
      "**/index.mjs",
      "!**/*.d.ts",
      "!**/node_modules",
      ...isMonorepo && repo.path === "." ? monoRepoPackages.filter((i) => i.path !== ".").map((i) => `!${i.path}/**`) : []
    ];
    const candidateFiles = (await (0, import_globby13.default)(indexGlobs, { cwd: (0, import_path62.join)(process.cwd(), repo.path) })).map((i) => (0, import_path62.join)(repo.path, i));
    const bGlob = (_b = projectConfig.autoindex) == null ? void 0 : _b.blacklistGlobs;
    const blacklist = bGlob ? (await (0, import_globby13.default)(bGlob, { cwd: (0, import_path62.join)(process.cwd(), repo.path) })).map((i) => (0, import_path62.join)(repo.path, i)) : [];
    const wGlob = (_c = projectConfig.autoindex) == null ? void 0 : _c.whitelistGlobs;
    const whitelist = wGlob ? (await (0, import_globby13.default)(wGlob, { cwd: (0, import_path62.join)(process.cwd(), repo.path) })).map((i) => (0, import_path62.join)(repo.path, i)) : void 0;
    const autoIndexFiles = candidateFiles.filter((fc) => isAutoindexFile(fc));
    if (candidateFiles.length === autoIndexFiles.length) {
      if (candidateFiles.length > 0) {
        log.info(import_chalk73.default`- found {yellow ${String(candidateFiles.length)}} index files, {bold {yellow {italic all}}} of which are setup to be autoindexed.`);
      }
    } else {
      log.info(import_chalk73.default`- found {yellow ${String(candidateFiles.length)}} {italic candidate} files, of which {yellow ${String(autoIndexFiles.length)}} have been setup to be autoindexed.`);
      const diff2 = candidateFiles.length - autoIndexFiles.length;
      if (diff2 > 0) {
        log.info(import_chalk73.default`- files {italic not} setup were:`);
        const missing = candidateFiles.filter((i) => !autoIndexFiles.includes(i));
        for (const file of missing) {
          log.info(import_chalk73.default`{dim   - ${file}}`);
        }
      }
    }
    if (autoIndexFiles.length > 0) {
      await processFiles(autoIndexFiles, opts, observations, { whitelist, blacklist });
    } else {
      log.info(import_chalk73.default`- No {italic index} files found in this package`);
    }
    if (opts.watch) {
      const watchedDirs = {};
      setupAutoIndexWatcher(watchedDirs, opts, observations, { whitelist, blacklist });
      for (const d of autoIndexFiles.map((i) => import_path62.default.posix.dirname(i))) {
        watchedDirs[d] = setupWatcherDir(d, [], opts, observations, { whitelist, blacklist });
      }
      console.log(import_chalk73.default`- watching {yellow {bold ${String(autoIndexFiles.length)}}} directories for autoindex changes`);
    }
  }
  if (isMonorepo) {
    log.shout(import_chalk73.default`\n- ${emoji.party} all repos have been updated with {blue autoindex}`);
  } else {
    log.shout(import_chalk73.default`- ${emoji.party} {blue autoindex} updated successfully`);
  }
};

// src/commands/autoindex/parts/description.ts
init_cjs_shims();
var import_chalk74 = __toModule(require("chalk"));
var autoindex = import_chalk74.default`{bgWhite {black autoindex }}`;
var description = {
  short: import_chalk74.default`Automates the building of {italic index.ts} files to aggregate folder's content`,
  complete: import_chalk74.default`Automates the building of {italic index} files; if you include a comment starting with {bold {yellow // #autoindex}} in a index file it will be auto-indexed when calling {blue do autoindex}.
  
By default ${autoindex} will assume that you are using {italic named} exports but this can be configured to what you need. Options are: {italic named, default,} and {italic named-offset}. To configure, simply add something like {bold {yellow // #autoindex:default}} to your file.

If you need to exclude certain files you can state the exclusions after the autoindex declaration: {bold {yellow // #autoindex, exclude:a,b,c}}`
};

// src/commands/autoindex/parts/options.ts
init_cjs_shims();
var import_chalk75 = __toModule(require("chalk"));
var options2 = {
  config: {
    type: Boolean,
    group: "local",
    description: `configure autoindex for a project`
  },
  add: {
    type: String,
    group: "local",
    description: "adds additional files to include as possible autoindex sources; you can comma delimit to add more than one"
  },
  glob: {
    type: String,
    group: "local",
    description: 'replaces the glob file matching pattern with your own (however "node_modules" still excluded)'
  },
  sfc: {
    type: Boolean,
    group: "local",
    description: import_chalk75.default`by default VueJS SFC files will be extracted as a default import but this can be turned off with this flag`
  },
  dir: {
    type: String,
    group: "local",
    description: 'by default will look for files in the "src" directory but you can redirect this to a different directory'
  },
  all: {
    alias: "a",
    type: Boolean,
    group: "local",
    description: import_chalk75.default`this option can be used in monorepos to avoid the interactive dialog and always set the scope of autoindex to ALL packages`
  },
  watch: {
    alias: "w",
    type: Boolean,
    group: "local",
    description: import_chalk75.default`watches for changes and runs {italic autoindex} when detected`
  },
  preserveExtension: {
    alias: "p",
    type: Boolean,
    group: "local",
    description: import_chalk75.default`exports -- by default -- will {italic not} include the file's {blue .js} extension but sometimes with ES modules you want to include this. If you do then you should set this flag.`
  }
};

// src/commands/autoindex/index.ts
var command5 = {
  kind: "autoindex",
  handler,
  description,
  options: options2,
  config: askForAutoindexConfig
};
var autoindex_default = command5;

// src/commands/awsid/index.ts
init_cjs_shims();

// src/commands/awsid/parts/index.ts
init_cjs_shims();

// src/commands/awsid/parts/awsid.ts
init_cjs_shims();
var import_chalk76 = __toModule(require("chalk"));

// src/commands/awsid/private/index.ts
init_cjs_shims();

// src/commands/awsid/private/askUser.ts
init_cjs_shims();
var import_inquirer10 = __toModule(require("inquirer"));
async function askUser(profiles) {
  const question = checkboxQuestion({
    name: "profiles",
    message: "Choose the profiles you want ID's for",
    choices: profiles
  });
  const answer = await (0, import_inquirer10.prompt)([question]);
  return answer.profiles;
}

// src/commands/awsid/parts/awsid.ts
var handler2 = async ({ unknown: argv, opts }) => {
  var _a;
  const profiles = await getAwsProfileDictionary();
  const profileNames = Object.keys(profiles);
  let chosen = [];
  if (!profiles) {
    console.log(import_chalk76.default`- ${emoji.robot} you do not have {italic any} AWS profiles in your credentials file!\n`);
    process.exit();
  }
  if (opts.all) {
    chosen = profileNames;
  } else if (argv.length === 0) {
    chosen = await askUser(Object.keys(profiles));
  } else {
    chosen = argv.filter((i) => profileNames.includes(i));
    if (chosen.length === 0) {
      console.log(import_chalk76.default`- there were {red no} valid profiles provided!`);
      console.log(import_chalk76.default`- valid profile names are: {blue ${profileNames.join(", ")}`);
    }
    if (chosen.length !== argv.length) {
      console.log(import_chalk76.default`- some profiles provided were not valid; valid ones are listed below`);
    }
  }
  const results = [];
  const errors = [];
  for (const profile2 of chosen) {
    try {
      results.push(__spreadValues({ profile: profile2 }, await getAwsIdentityFromProfile(profiles[profile2])));
      process.stdout.write(import_chalk76.default`{green .}`);
    } catch (error) {
      errors.push({ error, profile: profile2 });
      process.stdout.write(import_chalk76.default`{red .}`);
    }
  }
  console.log();
  console.log(results);
  if (errors.length > 0) {
    console.log(import_chalk76.default`- there ${errors.length === 1 ? "was" : "were"} ${errors.length} profile${errors.length === 1 ? "" : "s"} which encountered errors trying to authenticate, the rest were fine.`);
    for (const e of errors) {
      console.log(import_chalk76.default`- {bold {red ${e.profile}}}: {grey ${(_a = e == null ? void 0 : e.error) == null ? void 0 : _a.message}}`);
    }
  }
};

// src/commands/awsid/parts/description.ts
init_cjs_shims();
function description2() {
  return "Provides an easy way to access a particular (or all) AWS account ID's defined in the user's credentials file (~/.aws/credentials).";
}

// src/commands/awsid/parts/examples.ts
init_cjs_shims();

// src/commands/awsid/parts/options.ts
init_cjs_shims();
var options3 = {
  all: {
    alias: "a",
    type: Boolean,
    group: "local",
    description: "looks up the AWS account ID's for all profiles in the credentials file"
  }
};

// src/commands/awsid/parts/syntax.ts
init_cjs_shims();
var import_chalk77 = __toModule(require("chalk"));
var syntax = import_chalk77.default`yarn do {bold awsid} < {italic profile-name} | all >`;

// src/commands/awsid/index.ts
var command6 = {
  kind: "awsid",
  handler: handler2,
  description: description2,
  options: options3
};
var awsid_default = command6;

// src/commands/build/index.ts
init_cjs_shims();

// src/commands/build/parts/index.ts
init_cjs_shims();

// src/commands/build/parts/build.ts
init_cjs_shims();
var import_chalk81 = __toModule(require("chalk"));

// src/commands/build/util/index.ts
init_cjs_shims();

// src/commands/build/util/getBuildEnvironment.ts
init_cjs_shims();

// src/commands/build/util/processLambdaFns.ts
init_cjs_shims();
var import_chalk78 = __toModule(require("chalk"));
async function processLambdaFns(opts, observations) {
  const fns = getValidServerlessHandlers(opts);
  const log = logger(opts);
  if (fns.length === 0) {
    log.shout(import_chalk78.default`- ${emoji.eyeballs} no lambda function handlers found; see docs for how to ensure your fns are found`);
    log.info(import_chalk78.default`{gray - document can be found at {blue https://aws-orchestrate.com}}`);
    return;
  }
  log.info(import_chalk78.default`- found {yellow {bold ${fns.length}}} lambda functions`);
  const fnConfig = fns.map((fn) => findHandlerConfig(fn));
  log.whisper(import_chalk78.default`{gray - configuration blocks for lambda functions retrieved}`);
  const report = reportOnFnConfig(fnConfig);
  if (report.interfaces.has("IWrapperFunction")) {
    log.info(import_chalk78.default`- ${emoji.angry} detected use of {italic deprecated} {inverse  IWrapperFunction } interface; please switch to {inverse  IHandlerConfig } instead.`);
    log.whisper(import_chalk78.default`- The following {bold ${report.usage.withOtherInterface}} handler fns are missing the appropriate typing:\n\t{dim ${report.usage.handlersWithOtherInterface.map((i) => getFileComponents(i).filename).join("	")}}`);
  }
  const lambda = fnConfig.filter((f) => f !== void 0);
  write(currentDirectory(FNS_TYPES_FILE), createTsFile().addStringEnum({
    name: "LambdaFunction",
    description: "an enumeration of all locally defined lambda functions",
    elements: lambda.map((l) => ({
      el: `${getFileComponents(l.config.handler).filename.replace(".handler", "")}`,
      comment: l.config.description
    }))
  }).addType("ILambdaFunction", "keyof typeof LambdaFunction").generate(), { allowOverwrite: true });
  lintfix(currentDirectory(FNS_TYPES_FILE), observations);
  saveProjectConfig({
    build: {
      lambda: lambda.map((f) => f.config)
    }
  });
  log.whisper(import_chalk78.default`{gray - functions saved to the {italic do-devops} project config file}`);
}

// src/commands/build/util/processStepFns.ts
init_cjs_shims();
var import_chalk79 = __toModule(require("chalk"));
async function processStepFns(opts, _observations) {
  const log = logger(opts);
  const stepFns = getValidStepFunctions(opts);
  if (stepFns) {
    log.info(import_chalk79.default`- found {yellow {bold ${stepFns.length}}} Step Function`);
  }
}

// src/commands/build/util/reportOnFnConfig.ts
init_cjs_shims();
function reportOnFnConfig(fns) {
  const interfaces = new Set();
  const usage = {
    withWrapperFunction: 0,
    withOtherInterface: 0,
    noConfig: 0,
    handlersWithWrapperFunction: [],
    handlersWithOtherInterface: []
  };
  for (const c of fns) {
    if (!c) {
      usage.noConfig++;
      continue;
    }
    if (c.interface === `IWrapperFunction`) {
      usage.withWrapperFunction++;
      usage.handlersWithWrapperFunction.push(c.config.handler);
    } else {
      usage.withOtherInterface++;
      usage.handlersWithOtherInterface.push(c.config.handler);
    }
    interfaces.add(c.interface);
  }
  return { interfaces, usage };
}

// src/commands/build/util/serverlessTranspilation.ts
init_cjs_shims();
var import_chalk80 = __toModule(require("chalk"));
var import_matcher = __toModule(require("matcher"));

// src/commands/build/parts/build.ts
var handler3 = async ({ observations, opts, raw }) => {
  const log = logger(opts);
  const isServerless2 = observations.has("serverlessFramework");
  if (isServerless2) {
    if (!observations.has("serverlessTs")) {
      log.shout(import_chalk81.default`{bold - in order to use the {yellow Serverless Devops} commands, you'll need to have a {blue serverless.ts} file in the root of your repo}`);
      log.info(import_chalk81.default`{gray - to find more about this please refer to the docs: https://aws-orchestrate.com/devops}`);
      return false;
    }
    if (!isValidServerlessTs(void 0, opts)) {
      log.shout(import_chalk81.default`{bold - in order for the build process to run your {blue serverless.ts} file must produce a {italic default} export\n  of the {yellow Serverless()} configurator (exported in the {bold blue aws-orchestrate} library).}`);
      log.info(import_chalk81.default`{gray - to find more about this please refer to the docs: https://aws-orchestrate.com/devops}`);
      return false;
    }
    if (!observations.has("tsNode") || !observations.has("typescript")) {
      log.shout(import_chalk81.default`{bold - the {italic handoff} between your configuration in {blue serverless.ts} and the build script in {yellow do-devops} requires that you have {blue ts-node} and {blue typescript} installed as a dev dependency in the repo.}`);
      const answer = await askConfirmQuestion("Add this dev dep?");
      if (answer) {
        const success = await installDevDep(opts, observations, "ts-node", "typescript");
        if (!success) {
          log.info(`- please get these deps installed offline and then try build again`);
          return false;
        }
      } else {
        return false;
      }
    }
    log.shout(import_chalk81.default`{bold - ${emoji.run} Starting {yellow Serverless Devops} build process}\n`);
    await processLambdaFns(opts, observations);
    await processStepFns(opts, observations);
  } else {
    if (!hasScript("build") && !await installBuildSystem(opts, observations)) {
      return false;
    }
    await proxyToPackageManager("build", observations, raw);
  }
  return true;
};

// src/commands/build/parts/description.ts
init_cjs_shims();
function description3() {
  return "Efficient and clear build pipelines for serverless and then just a wrapper for yarn/npm/pnpm if the repo isn't a Serverless repo.";
}

// src/commands/build/parts/options.ts
init_cjs_shims();
var options4 = {
  force: {
    type: Boolean,
    group: "local",
    description: "forces the transpiling of code when building a serverless project"
  },
  interactive: {
    alias: "i",
    type: Boolean,
    group: "local",
    description: "allows choosing the functions interactively"
  }
};

// src/commands/build/index.ts
var command7 = {
  kind: "build",
  handler: handler3,
  description: description3,
  options: options4
};
var build_default = command7;

// src/commands/deploy/index.ts
init_cjs_shims();

// src/commands/deploy/parts/index.ts
init_cjs_shims();

// src/commands/deploy/parts/deploy.ts
init_cjs_shims();
var description4 = "Deployment services for {bold Serverless}";
var options5 = {
  interactive: {
    alias: "i",
    type: Boolean,
    group: "local",
    description: "allow interactive choices for the functions you want to deploy"
  },
  target: {
    alias: "t",
    typeLabel: "<target>",
    type: String,
    group: "local",
    description: "manually override the project target (serverless, npm)"
  },
  stage: {
    alias: "s",
    typeLabel: "<stage>",
    type: String,
    group: "local",
    description: "manually override the stage you're deploying to"
  },
  region: {
    alias: "r",
    typeLabel: "<region>",
    type: String,
    group: "local",
    description: "explicitly state the region you're deploying to"
  }
};
var handler4 = async ({ observations }) => {
  if (observations.has("serverlessFramework")) {
  } else {
    await proxyToPackageManager("deploy", observations);
  }
};

// src/commands/deploy/index.ts
var command8 = {
  kind: "deploy",
  handler: handler4,
  description: description4,
  options: options5
};
var deploy_default = command8;

// src/commands/endpoints/index.ts
init_cjs_shims();

// src/commands/endpoints/parts/index.ts
init_cjs_shims();

// src/commands/endpoints/parts/description.ts
init_cjs_shims();
var description5 = "Lists out all the endpoints defined in a given AWS profile/account.";

// src/commands/endpoints/parts/endpoints.ts
init_cjs_shims();
var import_table2 = __toModule(require("table"));
var import_chalk82 = __toModule(require("chalk"));
var handler5 = async ({ opts }) => {
  var _a, _b;
  const profileName = opts.profile ? opts.profile : await determineProfile(opts);
  if (!profileName) {
    console.log(`- couldn't determine the AWS profile to use; try setting it manually with ${import_chalk82.default.inverse(" --profile ")} option or switch to interactive mode with ${import_chalk82.default.inverse(" --interactive ")}
`);
    process.exit(1);
  }
  const region = opts.region ? opts.region : await determineRegion(opts);
  try {
    console.log(import_chalk82.default`- getting API {italic endpoints} for the profile {bold  ${profileName}} [ ${region} ]`);
    if (region) {
      const response = await getApiGatewayEndpoints(profileName, region);
      console.log({ response });
      const restApi = ((_a = response.restApi) == null ? void 0 : _a.items) ? response.restApi.items.map((i) => {
        return [i.id, i.name || "", i.description || ""];
      }) : [];
      const httpApi = ((_b = response.httpApi) == null ? void 0 : _b.Items) ? response.httpApi.Items.map((i) => {
        var _a2, _b2, _c, _d;
        return [
          i.ApiId || "",
          i.Name || "",
          i.ApiEndpoint || "",
          ((_b2 = (_a2 = i.CorsConfiguration) == null ? void 0 : _a2.AllowMethods) == null ? void 0 : _b2.join(", ")) || "None",
          ((_d = (_c = i.CorsConfiguration) == null ? void 0 : _c.AllowOrigins) == null ? void 0 : _d.join(", ")) || "unknown"
        ];
      }) : [];
      if (restApi.length > 0) {
        console.log("\nREST API Endpoints");
        console.log((0, import_table2.table)([...[["id", "name", "description"]], ...restApi]));
        console.log();
      } else {
        console.log(import_chalk82.default`{gray - no REST API endpoints found}`);
        console.log();
      }
      if (httpApi.length > 0) {
        console.log("HTTP API Endpoints");
        const t = [...[["id", "name", "endpoint", "methods", "origins"]], ...httpApi];
        console.log((0, import_table2.table)(t));
      }
    } else {
      console.log(`- could not determine ${import_chalk82.default.bold.yellow("AWS region")}; try using ${import_chalk82.default.inverse(" --region ")} option to set it explicitly
`);
    }
  } catch {
  }
};

// src/commands/endpoints/parts/options.ts
init_cjs_shims();
var options6 = {
  profile: {
    type: String,
    typeLabel: "<profileName>",
    group: "local",
    description: "set the AWS profile explicitly"
  },
  region: {
    type: String,
    typeLabel: "<region>",
    group: "local",
    description: "set the AWS region explicitly"
  },
  interactive: {
    type: Boolean,
    group: "local",
    description: "if the AWS profile or region can't be determined, the CLI will interactively ask which to use"
  }
};

// src/commands/endpoints/index.ts
var command9 = {
  kind: "endpoints",
  handler: handler5,
  description: description5,
  options: options6
};
var endpoints_default = command9;

// src/commands/fns/index.ts
init_cjs_shims();

// src/commands/fns/parts/index.ts
init_cjs_shims();

// src/commands/fns/parts/fns.ts
init_cjs_shims();
var import_chalk84 = __toModule(require("chalk"));
var import_native_dash14 = __toModule(require("native-dash"));
var import_table3 = __toModule(require("table"));

// src/commands/fns/parts/tables.ts
init_cjs_shims();
var import_chalk83 = __toModule(require("chalk"));
function functionsApiTable(fns) {
  return toTable(fns, {
    col: "FunctionName",
    name: "Function",
    formula: (f) => import_chalk83.default`{dim ${String(f).split("-").slice(0, -1).join("-")}-}{bold ${String(f).split("-").slice(-1)}}`,
    format: { width: 45, alignment: "left" }
  }, {
    col: "MemorySize",
    name: "Memory",
    format: { width: 8, alignment: "center" },
    minWidth: 104
  }, {
    col: "CodeSize",
    name: "Code Size",
    formula: (cs) => import_chalk83.default`${Math.floor(Number(cs) / 1e4) * 10} {italic kb}`,
    format: { width: 12, alignment: "right" },
    minWidth: 130
  }, {
    col: "Timeout",
    formula: (t) => `${t}s`,
    format: { width: 8, alignment: "right" },
    minWidth: 123
  }, {
    col: "Layers",
    formula: (i) => Array.isArray(i) ? i.map((i2) => (i2 == null ? void 0 : i2.Arn.split(":").slice(-2).join(":")) || "").join("\n") : "",
    format: { width: 20, alignment: "center" },
    minWidth: 155
  }, {
    col: "Description",
    format: { width: 42, alignment: "left", wrapWord: true }
  });
}

// src/commands/fns/parts/fns.ts
var handler6 = async ({
  unknown: argv,
  opts,
  observations
}) => {
  var _a;
  const filterBy = argv.length > 0 ? (fn) => fn.includes(argv[0]) : () => true;
  const isServerlessProject = observations.has("serverlessFramework");
  const region = opts.region ? opts.region : await determineRegion(opts);
  const stageFilterMsg = opts.stage ? import_chalk84.default`, filtered down to only those in the {bold ${opts.stage.toUpperCase()}} stage.` : "";
  if (!isServerlessProject) {
    if (opts.profile) {
      const filter3 = opts.stage ? (f) => {
        var _a2;
        return (_a2 = f.FunctionName) == null ? void 0 : _a2.includes(`-${opts.stage}-`);
      } : () => true;
      const fns = (_a = (await getAwsLambdaFunctions(opts)).Functions) == null ? void 0 : _a.filter(filter3);
      if (fns) {
        console.log(import_chalk84.default`- AWS functions found using {blue {bold ${opts.profile}}} profile {dim [ ${region} ]}${stageFilterMsg}\n`);
        if (opts.json) {
          console.log(import_chalk84.default`{gray - using {inverse  json } output directly from AWS api instead of a table}`);
          console.log(fns);
        } else {
          console.log(functionsApiTable(fns));
        }
        if (opts.output) {
          write(opts.output, fns, { allowOverwrite: true });
        }
      }
      console.log(import_chalk84.default`{gray - the AWS CLI provides access to data like this with} {bold aws lambda list-functions --profile ${opts.profile}}`);
    } else {
      console.log("- this project does not appear to be a Serverless project!");
      console.log(import_chalk84.default`{gray - if you want a list of functions, you can still get this by stating an AWS profile with the "--profile" option}\n`);
    }
    process.exit();
  } else if (observations.has("serverlessTs")) {
    if (opts.forceBuild) {
      console.log(`- detected use of the ${import_chalk84.default.blue("typescript-microservice")} template; rebuilding functions from config.`);
      await buildLambdaTypescriptProject();
    } else {
      console.log(import_chalk84.default`- detected use of the {blue typescript-microservice} template; use {bold {blue --forceBuild}} to rebuild prior to listing functions.\n`);
    }
  }
  try {
    const { width } = consoleDimensions();
    const fns = (await getServerlessYaml()).functions;
    const tableData = [
      [
        import_chalk84.default.bold.yellow("function"),
        import_chalk84.default.bold.yellow("events"),
        import_chalk84.default.bold.yellow("memory"),
        import_chalk84.default.bold.yellow("timeout"),
        import_chalk84.default.bold.yellow("description")
      ]
    ];
    if (fns) {
      for (const key of Object.keys(fns).filter(filterBy)) {
        const events = fns[key].events || [];
        tableData.push([
          key,
          events.map((i) => Object.keys(i)).join(", "),
          String(fns[key].memorySize || import_chalk84.default.grey("1024")),
          String(fns[key].timeout || import_chalk84.default.grey("3")),
          fns[key].description || ""
        ]);
      }
    }
    let tableConfig = {
      columns: {
        0: { width: 30, alignment: "left" },
        1: { width: 16, alignment: "left" },
        2: { width: 7, alignment: "center" },
        3: { width: 10, alignment: "center" },
        4: { width: 46, alignment: "left" }
      }
    };
    let output = (0, import_table3.table)(tableData, tableConfig);
    if (width < 70) {
      tableConfig = { columns: (0, import_native_dash14.omit)(tableConfig.columns, "2", "3", "4") };
      output = (0, import_table3.table)(tableData.map((i) => i.slice(0, 2), tableConfig));
    } else if (width < 80) {
      delete tableConfig.columns["3"];
      delete tableConfig.columns["4"];
      output = (0, import_table3.table)(tableData.map((i) => i.slice(0, 3), tableConfig));
    } else if (width < 125) {
      delete tableConfig.columns["4"];
      output = (0, import_table3.table)(tableData.map((i) => i.slice(0, 4), tableConfig));
    }
    console.log(output);
  } catch (error) {
    console.log(`- Error finding functions: ${error.message}
`);
    process.exit();
  }
};

// src/commands/fns/parts/description.ts
init_cjs_shims();
function description6() {
  return "Lists all serverless function handlers and basic meta about them";
}

// src/commands/fns/parts/options.ts
init_cjs_shims();
var import_chalk85 = __toModule(require("chalk"));
var options7 = {
  forceBuild: {
    alias: "f",
    type: Boolean,
    group: "local",
    description: import_chalk85.default`by default functions will be derived from {italic serverless.yml} but if you are in a {italic typescript-microservice} project you can force a rebuild prior to listing the functions`
  },
  profile: {
    type: String,
    group: "local",
    description: "allows you to explicitly state the AWS profile to use for this command"
  },
  region: {
    type: String,
    group: "local",
    description: "allows you to explicitly state the AWS region to use for this command"
  },
  stage: {
    type: String,
    group: "local",
    description: "allows the results to be filtered down to only those functions associated with a given stage"
  },
  json: {
    type: Boolean,
    group: "local",
    description: "display results as JSON instead of tables"
  },
  output: {
    type: String,
    typeLabel: "<filename>",
    group: "local",
    description: "output the AWS API as a JSON file in the local filesystem"
  }
};

// src/commands/fns/index.ts
var command10 = {
  kind: "fns",
  handler: handler6,
  description: description6,
  options: options7
};
var fns_default = command10;

// src/commands/image/index.ts
init_cjs_shims();
var import_chalk88 = __toModule(require("chalk"));

// src/commands/image/parts/index.ts
init_cjs_shims();

// src/commands/image/parts/handler.ts
init_cjs_shims();
var import_async_shelljs8 = __toModule(require("async-shelljs"));
var import_chalk86 = __toModule(require("chalk"));
var handler7 = async ({
  subCommand,
  opts,
  observations
}) => {
  const config = getProjectConfig().image;
  const log = logger(opts);
  const api = useImageApi(config ? config.rules : [], { clearCache: opts.force });
  switch (subCommand == null ? void 0 : subCommand.trim()) {
    case "config":
    case "configure":
      if (!config) {
        await askConfigureImageOptimization(observations);
      } else {
        await askImageConfiguration(observations, api);
      }
      break;
    case "optimize":
    case "convert":
      if (config && config.rules) {
        await api.convert();
      } else {
        throw new DevopsError(`Attempt to call optimize before any rules were configured!`, "image/not-ready");
      }
      break;
    case "watch":
      if (config && config.rules) {
        const api2 = useImageApi(config.rules);
        await api2.watch();
      } else {
        throw new DevopsError(`Attempt to call watch before any rules were configured!`, "image/not-ready");
      }
      break;
    case "summarize":
    case "summary":
      await api.summarize();
      break;
    case "":
      if (config) {
        log.info(import_chalk86.default`- the valid sub-commands for {blue dd image} are: {italic config, optimize,} and {italic watch}`);
      }
      break;
    default:
      log.shout(subCommand ? import_chalk86.default`the subcommand '${subCommand}' is not known!` : import_chalk86.default`the {bold {yellow image}} command expects a {italic sub-command}`);
      await (0, import_async_shelljs8.asyncExec)(`dd image --help`);
  }
  await api.close();
};

// src/commands/image/parts/options.ts
init_cjs_shims();
var import_chalk87 = __toModule(require("chalk"));
var options8 = {
  force: {
    alias: "f",
    type: Boolean,
    group: "local",
    description: import_chalk87.default`Force a full rebuild of the image cache as well as converted images`
  }
};

// src/commands/image/index.ts
var command11 = {
  kind: "image",
  handler: handler7,
  description: "Provides an image optimization solution leveraging image resizing, blurring, and more.",
  syntax: import_chalk88.default`dd image [ {italic sub-command} ] [ {italic options} ]`,
  greedy: false,
  options: options8,
  subCommands: [
    { name: "optimize", summary: "optimize/convert images based on configured rules" },
    {
      name: "watch",
      summary: "watch file system for changes to source images and optimize when changed"
    },
    { name: "config", summary: "configure rules for optimizing the images in this repo" },
    { name: "summarize", summary: "summarize the current configuration" }
  ]
};
var image_default = command11;

// src/commands/info/index.ts
init_cjs_shims();
var import_chalk93 = __toModule(require("chalk"));

// src/commands/info/parts/index.ts
init_cjs_shims();

// src/commands/info/parts/otherPackages.ts
init_cjs_shims();
var import_chalk89 = __toModule(require("chalk"));
var import_common_types7 = __toModule(require("common-types"));
async function getNpmInfo(pkgs, _opts) {
  const successful = [];
  const failed = [];
  for (const pkg of pkgs) {
    try {
      const info3 = await getExternalPackageJson(pkg);
      successful.push({ name: pkg, value: info3 });
    } catch (error) {
      failed.push({ name: pkg, error: error.message });
    }
  }
  return { successful, failed };
}
function getLatest(repo) {
  var _a;
  return ((_a = repo["dist-tags"]) == null ? void 0 : _a.latest) || repo.version;
}
function getUrls(repo) {
  const hp = repo.homepage;
  const gitUrl = (0, import_common_types7.isNpmInfoRepository)(repo.repository) ? repo.repository.url || "" : repo.repository || "";
  return hp ? gitUrl && !hp.includes("github.com") ? `${hp}
${convertGitUrlToHttp(gitUrl)}` : hp : "";
}
function getExports(repo) {
  const repoExports = [];
  if (repo.main) {
    repoExports.push("cjs");
  }
  if (repo.module) {
    repoExports.push("es");
  }
  if (repo.typings || repo.types) {
    repoExports.push("types");
  }
  return repoExports.length > 0 ? import_chalk89.default.italic(repoExports.join(", ")) : import_chalk89.default.italic.dim("none");
}
async function otherPackages(pkgs, opts, _observations) {
  const info3 = await getNpmInfo(pkgs, opts);
  const data = [];
  for (const repo of info3.successful) {
    data.push({
      repo: repo.name,
      latest: getLatest(repo.value),
      exports: getExports(repo.value),
      description: repo.value.description || import_chalk89.default`{italic no description}`,
      urls: getUrls(repo.value)
    });
  }
  const { width: w } = consoleDimensions();
  console.log(toTable(data, { name: "Repo", col: "repo", format: { width: 20 } }, { name: "Latest", col: "latest", format: { width: 8, alignment: "center" } }, { name: "Exports", col: "exports", format: { width: 14 } }, { name: "Description", col: "description", format: { wrapWord: true, width: 50 } }, {
    name: "URLs",
    col: "urls",
    format: { width: Math.min(w - 110, 50) },
    minWidth: 150
  }));
}

// src/commands/info/parts/thisRepo.ts
init_cjs_shims();
var import_async_shelljs10 = __toModule(require("async-shelljs"));
var import_chalk92 = __toModule(require("chalk"));
var import_path64 = __toModule(require("path"));
var import_date_fns5 = __toModule(require("date-fns"));
var import_table4 = __toModule(require("table"));

// src/commands/info/parts/components/monorepo.ts
init_cjs_shims();
var import_chalk91 = __toModule(require("chalk"));

// src/shared/monorepo/getLernaPackages.ts
init_cjs_shims();
var import_async_shelljs9 = __toModule(require("async-shelljs"));
var import_chalk90 = __toModule(require("chalk"));
var import_destr10 = __toModule(require("destr"));
var import_path63 = __toModule(require("path"));
function stripExtraneous(input) {
  const re = /.*(\[.*]).*/s;
  const [_, interior] = [...input.match(re) || []];
  return interior;
}
async function getLernaPackages(dir) {
  dir = dir ? dir : currentDirectory();
  const lerna = (0, import_path63.join)(dir, "node_modules/.bin/lerna");
  if (!fileExists(lerna)) {
    throw new DevopsError(import_chalk90.default`Attempt to get {bold green Lerna} package list failed as the Lerna command was not found locally at: {blue ${lerna}}`, "not-ready/lerna-missing");
  }
  const pkgs = (0, import_destr10.default)(stripExtraneous(await (0, import_async_shelljs9.asyncExec)(`node_modules/.bin/lerna list --json`, { silent: true })));
  return pkgs || [];
}

// src/commands/info/parts/components/monorepo.ts
async function monorepoInfo(o) {
  if (o.has("monorepo")) {
    const type = o.has("pnpmWorkspaces") ? import_chalk91.default`{bold {yellow pnpm} workspaces}` : o.has("yarnWorkspaces") ? import_chalk91.default`{bold {yellow yarn}} workspaces}` : o.has("lerna") ? import_chalk91.default`{bold {yellow lerna}}` : o.has("rushjs") ? import_chalk91.default`{bold {yellow Rush}}` : import_chalk91.default`{bold {red unknown}}`;
    const list = o.has("lerna") ? `. Packages are:

${(await getLernaPackages()).map((p) => `- ${p.name}`).join("\n")}` : "";
    return ["Monorepo", import_chalk91.default`This repo is a {bold {green monorepo}} managed by ${type}${list}`];
  }
  return ["", ""];
}

// src/commands/info/parts/thisRepo.ts
async function thisRepo(opts, observations) {
  let npm;
  try {
    npm = await getExternalPackageJson();
  } catch {
  }
  const pkg = getPackageJson();
  const linkedRepos = symlinks(currentDirectory("node_modules")).filter((s) => !s.linkTo.startsWith(".pnpm/"));
  const pkgManagerConflict = observations.has("packageManagerConflict") ? import_chalk92.default`- {yellow {bold ${emoji.hazzard}}} there are conflicts in lock files from more than one package manager!` : false;
  if (pkgManagerConflict) {
    console.log(pkgManagerConflict);
    const cont = await askConfirmQuestion("Resolve this conflict?");
    if (cont) {
      await resolvePackageManagerConflict(observations);
    }
  }
  observations = getObservations();
  const linked = linkedRepos.length > 0 ? [
    "Linked\nRepos",
    linkedRepos.map((r) => import_chalk92.default`{bold ${r.file} -} {dim ${import_path64.default.posix.resolve(r.linkTo)}}`).join("\n")
  ] : void 0;
  const pkgExports = [
    { name: "commonjs", value: pkg.main },
    { name: "es-module", value: pkg.module },
    { name: "typings", value: pkg.typings || pkg.types }
  ].filter((i) => i.value);
  const exportsRow = pkgExports.length > 0 ? ["Exports", pkgExports.map((i) => import_chalk92.default`{bold ${i.name}} - {dim ${i.value}}`).join("\n")] : ["Exports", import_chalk92.default`{italic no exports found in {blue package.json}}`];
  const priorVersions = npm ? npm.versions.filter((i) => i !== (npm == null ? void 0 : npm.version)).slice(0, 5).join(", ") : "";
  const dateFormat = "dd MMM yyyy";
  const gitLastCommit = await getGitLastCommit();
  const gitInfo = gitLastCommit ? import_chalk92.default`- Latest commit ${green(gitLastCommit.hash.slice(0, 8))} on {green ${gitLastCommit.refs}}\n- committed by {green ${gitLastCommit.author_name} {dim <${gitLastCommit.author_email}>}} on {green ${(0, import_date_fns5.format)(new Date(gitLastCommit.date), dateFormat)}}` : import_chalk92.default`{italic {dim no commits found}}`;
  const localFilesChanged = (await (0, import_async_shelljs10.asyncExec)("git diff --name-only", {
    silent: true
  })).split("\n").length;
  const npmInfo = [
    [
      true,
      npm ? import_chalk92.default`This repo was first published on {green ${(0, import_date_fns5.format)((0, import_date_fns5.parseISO)(npm.time.created), dateFormat)}} and last modified on {green ${(0, import_date_fns5.format)((0, import_date_fns5.parseISO)(npm.time.modified), dateFormat)}}.\n\n` : ""
    ],
    [
      false,
      npm ? import_chalk92.default`The latest published version is ${import_chalk92.default.bold.green(npm.version)} [ ${(0, import_date_fns5.format)((0, import_date_fns5.parseISO)(npm.time[npm.version]), dateFormat)} ].\nLocally in package.json, version is ${import_chalk92.default.bold.green(pkg.version)}.` : import_chalk92.default`Locally in {italic package.json}, the version is ${import_chalk92.default.bold.green(pkg.version)} but this is {italic not} an npm package.`
    ],
    [true, import_chalk92.default`\n\nPrior versions include: {italic ${priorVersions}}`],
    [
      true,
      npm && npm.author ? import_chalk92.default`\n\nThe author of the repo is {green {bold ${typeof npm.author === "string" ? npm.author : npm.author.name}${typeof npm.author === "object" && npm.author.email ? ` <${npm.author.email}>` : ""}}}` : ""
    ]
  ];
  const depsSummary = `This repo has ${green(Object.keys((pkg == null ? void 0 : pkg.dependencies) || {}).length)} dependencies${npm ? import_chalk92.default`, with a total of ${green(npm.dist.fileCount)} files\nand a unpacked size of ${green(npm.dist.unpackedSize / 1e3, import_chalk92.default` {italic kb}`)}.` : "."}`;
  const depDetails = `${depsSummary}

The dependencies are:
 - ${dim(Object.keys((pkg == null ? void 0 : pkg.dependencies) || {}).join("\n - "))}`;
  console.log(import_chalk92.default`Info on package {green {bold ${pkg.name}}}\n`);
  const npmInformation = pkg.private === true ? `This is a private repository (not published to NPM)` : npmInfo.filter((i) => opts.verbose || !i[0]).map((i) => i[1]).join("");
  const gitRemotes = (await getGitRemotes()).map((i) => import_chalk92.default`- {bold ${i.name}:} ${i.refs.fetch}`);
  const repoInfo = pkg.repository && typeof pkg.repository === "object" ? convertGitUrlToHttp(pkg.repository.url) : pkg.repository ? convertGitUrlToHttp(pkg.repository) : import_chalk92.default`{red The repository is ${import_chalk92.default.bold("not")} stated in {blue package.json}}; it may be deduced by the GIT remotes:\n${gitRemotes.join("\n")}`;
  const data = [
    await monorepoInfo(observations),
    [
      import_chalk92.default.bold("Desc"),
      pkg.description ? pkg.description : import_chalk92.default.bold.italic("no description provided!")
    ],
    exportsRow,
    [
      "NPM",
      npmInformation
    ],
    [import_chalk92.default.bold("Deps"), opts.verbose === true ? depDetails : depsSummary],
    [
      "Repo ",
      repoInfo
    ],
    ["Scripts", Object.keys((pkg == null ? void 0 : pkg.scripts) || {}).join(", ")],
    [
      "GIT",
      gitInfo + import_chalk92.default`\n\n- {yellow ${String(localFilesChanged)}} files changed locally on {yellow ${await getCurrentGitBranch()}}`
    ],
    ["Tags ", pkg.keywords ? pkg.keywords.join(", ") : import_chalk92.default.italic.dim("none")]
  ].filter((i) => Array.isArray(i) && i[0]);
  if (linked) {
    data.push(linked);
  }
  const tblConfig = {
    columns: [{ alignment: "left" }, { width: 69, wrapWord: true }]
  };
  console.log((0, import_table4.table)(data, tblConfig));
}

// src/commands/info/parts/components/index.ts
init_cjs_shims();

// src/commands/info/index.ts
var command12 = {
  kind: "info",
  handler: async ({ argv, opts, observations }) => {
    if (opts.listDeps) {
      console.log(pkgDepsInTable());
      return;
    }
    if (opts.allDeps) {
      const pkg = getPackageJson();
      const deps = Object.keys(pkg.dependencies || {});
      if (deps.length === 0) {
        console.log(`- there are no dependencies for this repo
`);
        process.exit();
      }
      console.log(import_chalk93.default`- ${emoji.run} getting NPM info for {bold {yellow ${String(deps.length)}}} dependencies`);
      return otherPackages(deps, opts, observations);
    }
    return (argv == null ? void 0 : argv.length) > 0 ? otherPackages(argv, opts, observations) : thisRepo(opts, observations);
  },
  description: "Summarized information about the current repo; or alternatively a set of external npm packages (if stated).",
  syntax: "dd info <repo1> <repo2> ... [options]",
  options: {
    allDeps: {
      type: Boolean,
      alias: "a",
      group: "local",
      description: "If specified, will provide info across all of this repo's dependencies"
    },
    listDeps: {
      type: Boolean,
      alias: "l",
      group: "local",
      description: "List in tabular format all deps: deps, dev deps, optional and peer"
    }
  },
  greedy: true
};
var info_default = command12;

// src/commands/invoke/index.ts
init_cjs_shims();

// src/commands/invoke/parts/index.ts
init_cjs_shims();

// src/commands/invoke/parts/invoke-meta.ts
init_cjs_shims();
var description7 = "invoke serverless functions locally, leveraging test data where desired";
var options9 = {
  stage: {
    type: String,
    typeLabel: "<stage>",
    group: "local",
    description: 'state the "stage" you want to emulate with invokation'
  },
  data: {
    type: String,
    typeLabel: "<dataFile>",
    group: "local",
    description: "use a known data input"
  },
  interactive: {
    alias: "i",
    type: Boolean,
    group: "local",
    description: "bring up an interactive dialog to choose the data file"
  }
};

// src/commands/invoke/parts/invoke.ts
init_cjs_shims();
var import_chalk94 = __toModule(require("chalk"));
var import_async_shelljs11 = __toModule(require("async-shelljs"));
var handler8 = async ({
  observations,
  opts,
  unknown: argv,
  raw
}) => {
  if (!observations.has("serverlessFramework")) {
    await proxyToPackageManager("invoke", observations, raw);
    process.exit();
  }
  try {
    const sls = await isServerless();
    if (!sls) {
      console.log(import_chalk94.default`{red - This project is not configured as a {bold Serverless} project!} ${emoji.angry}\n`);
      process.exit();
    }
    if (argv.length > 1) {
      console.log(import_chalk94.default`{dim - you have stated more than one function to {italic invoke}.}`);
      console.log(import_chalk94.default`{dim - this command only executes one at a time; the rest are ignored.}`);
    }
    let fn;
    if (argv.length === 0) {
      fn = await askForFunction();
    } else {
      fn = argv[0];
      const availableFns = Object.keys(await getLocalServerlessFunctionsFromServerlessYaml() || {});
      if (!availableFns.includes(fn)) {
        console.log(import_chalk94.default`{red - The function "{white ${fn}}" is not a valid function!} ${emoji.shocked}`);
        console.log("- valid functions are:");
        console.log(import_chalk94.default`{dim   - ${availableFns.join("\n  - ")}}`);
        process.exit();
      }
    }
    let data;
    if (opts.data) {
      try {
        data = await readDataFile(opts.data, "json");
      } catch {
        const possible = await getDataFiles({
          filterBy: opts.data
        });
        if (possible.length > 1) {
          data = await askForDataFile(possible);
        } else if (possible.length === 1) {
          data = await readDataFile(possible[0]);
        } else {
          console.log(import_chalk94.default`{red - Data file "${opts.data}" not found!}`);
          data = await askForDataFile();
        }
      }
    }
    if (opts.interactive) {
      data = await askForDataFile();
    }
    if (!opts.quiet) {
      console.log(import_chalk94.default`{grey > sls invoke local --function {dim {white ${fn}}} --data '{dim {white ${data}}}'}`);
    }
    await (0, import_async_shelljs11.asyncExec)(`sls invoke local --function ${fn} --data '${data}'`);
  } catch (error) {
    console.log(`- Error finding functions: ${error.message}
`);
    process.exit();
  }
};

// src/commands/invoke/index.ts
var command13 = {
  kind: "invoke",
  handler: handler8,
  description: description7,
  options: options9
};
var invoke_default = command13;

// src/commands/latest/index.ts
init_cjs_shims();

// src/commands/latest/parts/index.ts
init_cjs_shims();

// src/commands/latest/parts/description.ts
init_cjs_shims();
var description8 = () => "Provides the latest semver tag in the current repo.";

// src/commands/latest/parts/latest.ts
init_cjs_shims();
var import_chalk95 = __toModule(require("chalk"));
var handler9 = async ({ opts }) => {
  const g = git();
  const latest = (await g.tags()).latest;
  const status = await g.status();
  const pkg = getPackageJson();
  if (!pkg) {
    console.log(`- the "latest" command provides you with the latest version of the repo in the {italic current} directory`);
    console.log(`   however it appears you're in directory without a package.json file! ${emoji.shocked}
`);
    console.log(import_chalk95.default`- please move to a new directory or pass in the optional '--repo [repo]' parameter to name a repo`);
    process.exit();
  }
  const pkgVersion = pkg.version;
  const aheadBehind = status.ahead === 0 && status.behind === 0 ? "" : `
- Your local repo is ${status.ahead > 0 ? `ahead by ${status.ahead} commits` : `behind by ${status.behind} commits`}`;
  const changes = status.not_added.length === 0 && status.modified.length === 0 ? "" : import_chalk95.default`\n- Locally you have {yellow ${status.not_added.length > 0 ? status.not_added.length : "zero"}} {italic new} files and {yellow ${status.modified.length}} {italic modified} files`;
  const conflicts = status.conflicted.length === 0 ? "" : import_chalk95.default`- ${emoji.poop} There are {bold {red ${status.conflicted.length}}} conflicted files!`;
  if (opts.verbose) {
    console.log(import_chalk95.default`The remote repo's latest version is {bold {yellow ${latest}}}; {blue package.json} is ${pkgVersion === latest ? "the same" : `is {bold ${pkgVersion}}`}.${aheadBehind}${changes}${conflicts}`);
    console.log("\n");
  } else {
    console.log(latest);
  }
  return latest;
};

// src/commands/latest/parts/options.ts
init_cjs_shims();
var import_chalk96 = __toModule(require("chalk"));
var options10 = {
  repo: {
    alias: "r",
    type: String,
    group: "local",
    description: import_chalk96.default`by default the "latest" command works off the current working dirs repo but you can specify a foreign npm repo and get the latest of that repo`
  }
};

// src/commands/latest/index.ts
var command14 = {
  kind: "latest",
  handler: handler9,
  description: description8,
  options: options10
};
var latest_default = command14;

// src/commands/layers/index.ts
init_cjs_shims();

// src/commands/layers/parts/index.ts
init_cjs_shims();

// src/commands/layers/parts/description.ts
init_cjs_shims();
var description9 = "Reports on the AWS layers defined in a given Serverless repo";

// src/commands/layers/parts/layers.ts
init_cjs_shims();
var import_chalk97 = __toModule(require("chalk"));
var META_LINK_MSG = import_chalk97.default`{dim - the results rely on meta-data tagging; check out this link for more info:\n      {blueBright https://github.com/inocan-group/do-devops/docs/layer-meta.md}}\n`;
var handler10 = async ({ observations }) => {
  if (observations.has("serverlessFramework")) {
    const layers = getLayersFromPackageJson();
    if (layers.length > 0) {
      console.log(toTable(layers, { col: "name", format: { width: 30, alignment: "left" } }, {
        col: "versions",
        formula: (v) => {
          var _a;
          return Array.isArray(v) ? ((_a = v.pop()) == null ? void 0 : _a.version) || "unknown" : v || "unknown";
        },
        format: { width: 7, alignment: "center" }
      }, { col: "description", format: { width: 64, alignment: "left", wrapWord: true } }));
      console.log(META_LINK_MSG);
    } else {
      console.log(import_chalk97.default`- there were {italic no} layers found as dependencies to this repo`);
      console.log(META_LINK_MSG);
    }
  } else {
    console.log(import_chalk97.default`- the current directory is not a Serverless repo\n`);
  }
};

// src/commands/layers/index.ts
var command15 = {
  kind: "layers",
  handler: handler10,
  description: description9
};
var layers_default = command15;

// src/commands/madge/index.ts
init_cjs_shims();

// src/commands/madge/madge.ts
init_cjs_shims();
var import_async_shelljs12 = __toModule(require("async-shelljs"));
var import_chalk99 = __toModule(require("chalk"));

// src/commands/madge/parts/options.ts
init_cjs_shims();
var import_chalk98 = __toModule(require("chalk"));
var options11 = {
  circular: {
    type: Boolean,
    alias: "c",
    group: "local",
    description: import_chalk98.default`Madge's {bold {italic circular}} circular reference checker`
  },
  orphans: {
    type: Boolean,
    alias: "o",
    group: "local",
    description: import_chalk98.default`Madge's {bold {italic orphans}} checker which shows which modules no one is depending on`
  },
  leaves: {
    type: Boolean,
    alias: "l",
    group: "local",
    description: import_chalk98.default`Madge's {bold {italic leaves}} checker which shows modules with no dependencies`
  },
  summary: {
    type: Boolean,
    alias: "s",
    group: "local",
    description: "Madge's {bold {italic summary}} command which provides an overview to repo"
  },
  json: {
    type: Boolean,
    alias: "j",
    group: "local",
    description: "output as JSON"
  },
  image: {
    type: String,
    alias: "i",
    group: "local",
    description: "write graph to file as an image"
  },
  layout: {
    type: String,
    group: "local",
    description: import_chalk98.default`layout engine for graph; choices are: {dim {italic dot, neato, fdp, sfdp, twopi, circo}}`
  },
  "include-npm": {
    type: Boolean,
    group: "local",
    description: "include shallow NPM modules (default: false)"
  },
  extensions: {
    type: String,
    group: "local",
    description: import_chalk98.default`comma separated string of valid file extensions (uses {bold {italic js,ts}} as a default)`
  }
};

// src/commands/madge/madge.ts
var command16 = {
  kind: "madge",
  handler: async ({ opts, argv }) => {
    const log = logger(opts);
    const flags = [];
    if (opts.verbose) {
      flags.push("--debug", "--warning");
    }
    if (opts.json) {
      flags.push("--json");
    }
    if (opts.extensions) {
      flags.push(`--extensions ${opts.extensions}`);
    } else {
      flags.push(`--extensions ts,js`);
    }
    if (opts.layout) {
      const valid = ["dot", "neato", "fdp", "sfdp", "twopi", "circo"];
      if (!valid.includes(opts.layout)) {
        log.info(import_chalk99.default`- ${emoji.warn} you passed in {red ${opts.layout}} for a {italic layout}; this will likely not be recognized by {blue madge} CLI`);
        log.info(import_chalk99.default`{gray - valid layouts include: {italic ${valid.join(", ")}}}`);
      }
      flags.push(`--layout ${opts.layout}`);
    }
    if (opts["include-npm"]) {
      flags.push("--include-npm");
    }
    if (opts.image) {
      flags.push(`--image ${opts.image}`);
    }
    const dir = argv[0] || "src";
    if (!opts.circular && !opts.summary && !opts.orphans && !opts.leaves) {
      const which = await askListQuestion(import_chalk99.default`Which {italic Madge} command(s) would you like to run?`, ["circular", "summary", "orphans", "leaves"]);
      opts[which] = true;
    }
    if (opts.circular) {
      const cmd = `pnpx madge ${dir} --circular ${flags.join(" ")}`;
      log.info(import_chalk99.default`\n- running {bold madge} with following command: {blue ${cmd}}`);
      const response = (0, import_async_shelljs12.exec)(cmd);
      if (response.code !== 0) {
        process.exit(response.code);
      }
    }
    if (opts.summary) {
      const cmd = `npx madge ${dir} --summary ${flags.join(" ")}`;
      log.info(import_chalk99.default`\n- running {bold madge} with following command: {blue ${cmd}}`);
      const response = (0, import_async_shelljs12.exec)(cmd);
      if (response.code !== 0) {
        process.exit(response.code);
      }
    }
    if (opts.orphans) {
      const cmd = `npx madge ${dir} --orphans ${flags.join(" ")}`;
      log.info(import_chalk99.default`\n- running {bold madge} with following command: {blue ${cmd}}`);
      const response = (0, import_async_shelljs12.exec)(cmd);
      if (response.code !== 0) {
        process.exit(response.code);
      }
    }
    if (opts.leaves) {
      const cmd = `npx madge --leaves ${flags.join(" ")}`;
      log.info(import_chalk99.default`\n- running {bold madge} with following command: {blue ${cmd}}`);
      const response = (0, import_async_shelljs12.exec)(cmd);
      if (response.code !== 0) {
        process.exit(response.code);
      }
    }
    return;
  },
  description: import_chalk99.default`provides a proxy of the highly useful {bold madge} utilities; by default running across all javascript and typescript files in the {blue src} directory.`,
  options: options11
};
var madge_default = command16;

// src/commands/madge/index.ts
var madge_default2 = madge_default;

// src/commands/outdated/index.ts
init_cjs_shims();
var command17 = {
  kind: "outdated",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("outdated", observations, raw);
    process.exit();
  },
  description: "proxies your package manager's 'outdated' command"
};
var outdated_default = command17;

// src/commands/pkg/index.ts
init_cjs_shims();

// src/commands/pkg/parts/index.ts
init_cjs_shims();

// src/commands/pkg/parts/pkg.ts
init_cjs_shims();
var import_chalk100 = __toModule(require("chalk"));
var import_async_shelljs13 = __toModule(require("async-shelljs"));
var handler11 = async ({ opts, observations }) => {
  const stage = await determineStage(opts);
  const region = await determineRegion(opts);
  if (!observations.has("serverlessFramework")) {
    console.log(`  - the {bold pkg} command is only intended for use in repos that use the Serverless framework
`);
    return;
  }
  console.log(import_chalk100.default`- {bold Serverless} {italic packaging} for {bold ${stage}} stage ${emoji.party}`);
  const command24 = `sls package --stage ${stage} --region ${region} ${opts.dir ? `--package ${opts.dir}` : ""}`;
  console.log(import_chalk100.default`{dim {italic ${command24}}}\n`);
  await (0, import_async_shelljs13.asyncExec)(command24, { silent: opts.quiet ? true : false });
  const directory = opts.dir ? opts.dir : ".serverless";
  console.log(import_chalk100.default`\n{bold {green - Packaging is complete!}} ${emoji.rocket}`);
  console.log(import_chalk100.default`- the assets can all be found in the {italic {blue ${directory}} directory.}`);
  await (0, import_async_shelljs13.asyncExec)(`ls -l ${directory}`);
  if (opts.validate) {
    console.log(import_chalk100.default`\n- validating the {bold cloudformation} {italic create} template ${emoji.eyeballs}`);
    const validateCmd = `aws cloudformation validate-template --template-body file://${directory}/cloudformation-template-create-stack.json`;
    try {
      console.log(import_chalk100.default`{dim    ${validateCmd}}`);
      await (0, import_async_shelljs13.asyncExec)(validateCmd);
    } catch {
      console.log(import_chalk100.default`{red - Error validating the {italic create} template!}`);
    }
    console.log(import_chalk100.default`\n- validating the {bold cloudformation} {italic update} template ${emoji.eyeballs}`);
    const validateUpdate = `aws cloudformation validate-template --template-body file://${directory}/cloudformation-template-update-stack.json`;
    try {
      console.log(import_chalk100.default`{dim    ${validateUpdate}}`);
      await (0, import_async_shelljs13.asyncExec)(validateUpdate);
    } catch {
      console.log(import_chalk100.default`{red - Error validating the {italic update} template!} ${emoji.poop}`);
    }
  }
};

// src/commands/pkg/parts/pkg-meta.ts
init_cjs_shims();
var import_chalk101 = __toModule(require("chalk"));
var description10 = import_chalk101.default`Package up resources for {bold Serverless} publishing but do not actually {italic deploy}.`;
var options12 = {
  stage: {
    type: String,
    typeLabel: "<stage>",
    group: "local",
    description: "the AWS stage which is being targetted"
  },
  profile: {
    type: String,
    typeLabel: "<profile>",
    group: "local",
    description: "The AWS credential profile being used for this CLI command"
  },
  region: {
    type: String,
    typeLabel: "<region>",
    group: "local",
    description: "The AWS region being used for this CLI command"
  },
  dir: {
    alias: "d",
    type: String,
    typeLabel: "<directory>",
    group: "local",
    description: import_chalk101.default`by default assets are saved to the {italic .serverless} directory but you can change this to a different directory if you like.`
  },
  validate: {
    type: Boolean,
    group: "local",
    description: import_chalk101.default`after the package is completed the {bold cloudformation} template can be validated`
  }
};

// src/commands/pkg/index.ts
var command18 = {
  kind: "pkg",
  handler: handler11,
  description: description10,
  options: options12
};
var pkg_default = command18;

// src/commands/scaffold/index.ts
init_cjs_shims();

// src/commands/scaffold/parts/index.ts
init_cjs_shims();

// src/commands/scaffold/parts/meta.ts
init_cjs_shims();
var description11 = "helps to scaffold a project with common features";
var options13 = {};

// src/commands/scaffold/parts/scaffold.ts
init_cjs_shims();
var import_chalk102 = __toModule(require("chalk"));
var import_async_shelljs14 = __toModule(require("async-shelljs"));
var scaffolds = ["typescript", "eslint", "jest", "vitesse", "vitesse-webext"];
var handler12 = async ({
  opts,
  observations
}) => {
  const which = await askCheckboxQuestion("choose the scaffolds you want to use", scaffolds);
  if (which.includes("eslint")) {
    await installEsLint(opts, observations);
  }
  if (which.includes("jest")) {
    await installTestFramework("jest", opts, observations);
  }
  if (which.includes("vitesse") || which.includes("vitesse-webext")) {
    const pkg = which.includes("vitesse-ext") ? "vitesse-webext" : "vitesse";
    let confirm = true;
    let dir = ".";
    if (observations.has("packageJson")) {
      confirm = await askConfirmQuestion(import_chalk102.default`- install {bold {blue Vitesse${pkg.includes("ext") ? import_chalk102.default`{italic  browser extension}` : ""}}} starter template for VueJS/ViteJS into {bold {yellow current}} directory?`);
    } else {
      const dirChoices = [
        "current directory",
        ...getSubdirectories(process.cwd()),
        "(new subdirectory)"
      ];
      const subOrCurrent = await askListQuestion(wordWrap(import_chalk102.default`- since you're not in a dir with a {italic package.json} we need to establish which directory you want to install the {bold blue Vitesse} start template into.`), dirChoices);
      if (subOrCurrent === "(new subdirectory)") {
        dir = await askInputQuestion("- specify directory name:");
      } else if (subOrCurrent === "current directory") {
        dir = ".";
      } else {
        dir = subOrCurrent;
      }
    }
    if (confirm) {
      (0, import_async_shelljs14.asyncExec)(`npx degit antfu/${pkg} ${dir} --force`);
      console.log(import_chalk102.default`- vitesse ${pkg.includes("ext") ? "browser extension " : ""}template installed`);
      await (0, import_async_shelljs14.asyncExec)(`pnpm install`);
      console.log(import_chalk102.default`\n- ${emoji.party} Vitesse ${pkg.includes("ext") ? "browser extension " : ""}template installed and all deps are loaded \n`);
    } else {
      process.exit();
    }
  }
  return;
};

// src/commands/scaffold/index.ts
var command19 = {
  kind: "scaffold",
  handler: handler12,
  description: description11,
  options: options13
};
var scaffold_default = command19;

// src/commands/ssm/index.ts
init_cjs_shims();

// src/commands/ssm/parts/index.ts
init_cjs_shims();

// src/commands/ssm/parts/commands.ts
init_cjs_shims();

// src/commands/ssm/parts/description.ts
init_cjs_shims();
var import_chalk103 = __toModule(require("chalk"));
function description12(..._opts) {
  return import_chalk103.default`allows an easy interaction with AWS's {bold {yellow SSM}} parameter system for managing secrets. Subcommands include: {italic set}, {italic get}, and {italic list}.`;
}

// src/commands/ssm/parts/examples.ts
init_cjs_shims();

// src/commands/ssm/parts/options.ts
init_cjs_shims();
var import_chalk104 = __toModule(require("chalk"));
var options14 = {
  profile: {
    type: String,
    typeLabel: "<profileName>",
    group: "local",
    description: "set the AWS profile explicitly"
  },
  region: {
    type: String,
    typeLabel: "<region>",
    group: "local",
    description: "set the AWS region explicitly"
  },
  stage: {
    type: String,
    typeLabel: "<stage>",
    group: "local",
    description: "set the stage explicitly"
  },
  nonStandardPath: {
    type: Boolean,
    group: "local",
    description: "allows the naming convention for SSM paths to be ignored for a given operation"
  },
  description: {
    type: String,
    group: "local",
    description: "sets the description of the SSM variable (only used in ADD)"
  },
  force: {
    alias: "f",
    type: Boolean,
    group: "local",
    description: import_chalk104.default`force a {italic set} operation to complete even when the variable being set alread exists`
  },
  base64: {
    type: Boolean,
    group: "local",
    description: import_chalk104.default`adding this flag will encode with base64 when adding and decode from base64 to utf-8 when getting`
  }
};

// src/commands/ssm/parts/ssm.ts
init_cjs_shims();
var import_chalk109 = __toModule(require("chalk"));

// src/commands/ssm/private/index.ts
init_cjs_shims();

// src/commands/ssm/private/subCommands/index.ts
var subCommands_exports = {};
__export(subCommands_exports, {
  get: () => get_exports,
  list: () => list_exports,
  set: () => set_exports
});
init_cjs_shims();

// src/commands/ssm/private/subCommands/get.ts
var get_exports = {};
__export(get_exports, {
  execute: () => execute
});
init_cjs_shims();
var import_chalk105 = __toModule(require("chalk"));
var import_native_dash15 = __toModule(require("native-dash"));
var import_aws_ssm = __toModule(require("aws-ssm"));
var import_date_fns6 = __toModule(require("date-fns"));
var import_table5 = __toModule(require("table"));
var execute = async ({ opts, unknown }) => {
  const profile2 = await determineProfile(__spreadProps(__spreadValues({}, opts), { interactive: true }));
  if (!profile2) {
    console.log(import_chalk105.default`- Couldn't determine the AWS Profile; try setting it manually with {inverse  --profile }.`);
    console.log(import_chalk105.default`- alternatively use the {inverse --interactive } option to have the CLI interactively let you select`);
    process.exit();
  }
  const profileInfo = await getAwsProfile(profile2);
  const region = opts.region || profileInfo.region || await determineRegion(__spreadProps(__spreadValues({}, opts), { interactive: true }));
  const secrets = unknown;
  const nonStandardPath = opts.nonStandardPath || false;
  const { width } = consoleDimensions();
  if (!region) {
    throw new DevopsError(`Getting SSM secrets requires an ${import_chalk105.default.bold("AWS Region")} and none could be deduced. You can explicitly state this by adding "--region XYZ" to the command.`);
  }
  if (!profile2) {
    throw new DevopsError(`Getting SSM secrets requires an ${import_chalk105.default.bold("AWS Profile")} and none could be deduced. You can explicitly state this by adding "--profile XYZ" to the command.`);
  }
  if (!opts.quiet) {
    console.log(`- Getting SSM details for: ${import_chalk105.default.italic.grey.bold(secrets.join(", "))}
`);
  }
  const tableConfig = {
    columns: {
      0: { width: 30, alignment: "left" },
      1: { width: width > 125 ? 60 : width > 100 ? 40 : 35 },
      2: { width: 8, alignment: "center" },
      3: { width: 16, alignment: "center" }
    }
  };
  const ssm = new import_aws_ssm.SSM({ profile: profile2, region });
  for await (const secret of secrets) {
    const tableData = [
      [
        import_chalk105.default.yellow.bold("Path"),
        import_chalk105.default.yellow.bold("ARN"),
        import_chalk105.default.yellow.bold("Version"),
        import_chalk105.default.yellow.bold("LastUpdated")
      ]
    ];
    const data = await ssm.get(secret, { decrypt: true, nonStandardPath });
    tableData.push([
      data.path,
      data.arn,
      String(data.version),
      (0, import_date_fns6.format)(data.lastUpdated, "dd MMM, yyyy")
    ]);
    const value = opts.base64 ? (0, import_native_dash15.fromBase64)(String(data.value)) : String(data.value);
    if (!opts.quiet) {
      console.log((0, import_table5.table)(tableData, tableConfig));
      console.log(import_chalk105.default.yellow.bold("VALUE:\n"));
      console.log(value);
      console.log();
    } else {
      console.log(value);
    }
  }
};

// src/commands/ssm/private/subCommands/list.ts
var list_exports = {};
__export(list_exports, {
  execute: () => execute2
});
init_cjs_shims();
var import_chalk106 = __toModule(require("chalk"));
var import_process3 = __toModule(require("process"));
var import_date_fns7 = __toModule(require("date-fns"));
var import_table6 = __toModule(require("table"));
var import_aws_ssm2 = __toModule(require("aws-ssm"));
var execute2 = async ({
  opts,
  observations,
  unknown: argv
}) => {
  const profile2 = await determineProfile(__spreadProps(__spreadValues({}, opts), { interactive: true }), observations);
  if (!profile2) {
    console.log(import_chalk106.default`- Couldn't determine the AWS Profile; try setting it manually with {inverse  --profile }.`);
    console.log(import_chalk106.default`- alternatively use the {inverse --interactive } option to have the CLI interactively let you select`);
    import_process3.default.exit();
  }
  const profileInfo = await getAwsProfile(profile2);
  const region = opts.region || profileInfo.region || await determineRegion(__spreadProps(__spreadValues({}, opts), { interactive: true }));
  const filterBy = argv.length > 0 ? argv[0] : void 0;
  if (!profile2 || !region) {
    console.log(import_chalk106.default`{red - missing information!}`);
    console.log(import_chalk106.default`To list SSM params the AWS {italic profile} and {italic region} must be stated. These could {bold not} be determined so exiting.`);
    console.log(import_chalk106.default`{dim note that the easiest way to get an explicit profile/region is to use the {bold --profile} and {bold --region} switches on the command line.}\n`);
    import_process3.default.exit();
  }
  if (!opts.quiet) {
    console.log(`- Listing SSM parameters in profile "${import_chalk106.default.bold(profile2)}", region "${import_chalk106.default.bold(region)}"${filterBy ? `; results reduced to those with "${import_chalk106.default.bold(filterBy)}" in the name.` : ""}`);
    console.log();
  }
  const ssm = new import_aws_ssm2.SSM({
    profile: profile2,
    region
  });
  const list = await ssm.describeParameters();
  const tableData = [
    [
      import_chalk106.default.bold("Name"),
      import_chalk106.default.bold("Version"),
      import_chalk106.default.bold("Type"),
      import_chalk106.default.bold("LastModified"),
      import_chalk106.default.bold("User")
    ]
  ];
  for (const i of list.filter((i2) => !filterBy || (i2.Name || "").includes(filterBy))) {
    tableData.push([
      i.Name || "",
      String(i.Version),
      i.Type || "",
      i.LastModifiedDate ? (0, import_date_fns7.format)(i.LastModifiedDate, "dd MMM, yyyy") : "",
      i.LastModifiedUser ? i.LastModifiedUser.replace(/.*user\//, "") : ""
    ]);
  }
  const tableConfig = {
    columns: {
      0: { width: 42, alignment: "left" },
      1: { width: 8, alignment: "center" },
      2: { width: 14, alignment: "center" },
      3: { width: 18, alignment: "center" },
      4: { width: 14 }
    }
  };
  console.log((0, import_table6.table)(tableData, tableConfig));
};

// src/commands/ssm/private/subCommands/set.ts
var set_exports = {};
__export(set_exports, {
  execute: () => execute3
});
init_cjs_shims();
var import_chalk107 = __toModule(require("chalk"));
var import_aws_ssm3 = __toModule(require("aws-ssm"));
var import_native_dash16 = __toModule(require("native-dash"));
var execute3 = async ({ opts, unknown: argv }) => {
  if (argv.length < 2) {
    console.log(import_chalk107.default`The "dd ssm set" command expects the variable name and value as parameters on the command line: {blue {bold do ssm set} <{italic name}> <{italic value}>}\n`);
    console.log(import_chalk107.default`{grey {bold - Note:} you can include a {italic partial name} for the variable and things like the AWS profile, region, stage, and version number\n  will be filled in where possible}\n`);
    process.exit(1);
  }
  let [name, value] = argv;
  const profile2 = await determineProfile(__spreadProps(__spreadValues({}, opts), { interactive: true }));
  if (!profile2) {
    console.log(import_chalk107.default`- Couldn't determine the AWS Profile; try setting it manually with {inverse  --profile }.`);
    console.log(import_chalk107.default`- alternatively use the {inverse --interactive } option to have the CLI interactively let you select`);
    process.exit();
  }
  const profileInfo = await getAwsProfile(profile2);
  const identity = await getAwsIdentityFromProfile(profileInfo);
  const region = opts.region || profileInfo.region || await determineRegion(opts);
  const stage = opts.stage || process.env.AWS_STAGE || process.env.NODE_ENV || await askForStage(import_chalk107.default`SSM variables should be namespaced to a STAGE, what stage are you setting for {dim [ profile: {italic ${profile2}}, region: {italic ${region}}, account: {italic ${identity.accountId}} ]}?`);
  const ssm = new import_aws_ssm3.SSM({ profile: profile2, region });
  name = await completeSsmName(name, { stage });
  if (opts.base64) {
    value = (0, import_native_dash16.toBase64)(value);
  }
  process.env.AWS_STAGE = stage;
  try {
    await ssm.put(name, value, {
      description: opts.description,
      override: opts.force
    });
    console.log(import_chalk107.default`\n- ${emoji.party} the {bold {yellow ${name}}} variable was set successfully to the {italic ${region}} region {dim [ profile: {italic ${profile2}}, region: {italic ${region}}, account: {italic ${identity.accountId}} ]}\n`);
  } catch (error) {
    console.log();
    if ((error == null ? void 0 : error.code) === "ParameterAlreadyExists") {
      console.log(import_chalk107.default`- {red {bold Paramater Already Exists!}} to overwrite a parameter which already exists you must add {blue --force} to the CLI command`);
    } else {
      console.log(import_chalk107.default`{red {bold Error:}} ${error.message}`);
    }
    console.log();
    process.exit(1);
  }
};

// src/commands/ssm/private/completeSsmName.ts
init_cjs_shims();
var import_chalk108 = __toModule(require("chalk"));
function nameToUpper(parts) {
  return [...parts.slice(0, -1), parts.slice(-1)[0].toUpperCase()].join("/");
}
async function completeSsmName(name, hints = {}) {
  const parts = name.split("/");
  const lastIsUpper = parts.slice(-1)[0].toUpperCase() === parts.slice(-1)[0];
  if (!lastIsUpper) {
    console.log(import_chalk108.default`\n- The last component of the name is intended -- {italic by convention} -- to be UPPERCASE.\n  Therefore we will convert your name to ${nameToUpper(parts)} with your permission.\n`);
    const cont = await askConfirmQuestion("Continue?");
    if (!cont) {
      console.log();
      process.exit();
    }
  }
  if (parts.length === 2) {
    return `/${hints.stage || "dev"}/${hints.version || 1}/${nameToUpper(parts)}`;
  }
  if (parts.length > 2) {
    if (Number.isInteger(parts[1])) {
      return nameToUpper(parts);
    } else {
      console.log(import_chalk108.default`\nThe SSM variable {italic name} does not appear to be correctly formatted. The format\nshould be:\n`);
      console.log(import_chalk108.default`/{dim [stage]}/{dim [version]}/{dim [moduleName]}/{dim [VAR NAME]}\n`);
      console.log(import_chalk108.default`In most cases the best strategy is just to state the module name and final\nvariable name and let the autocomplete do the rest.`);
      throw new DevopsError("Incorrect SSM variable formatting", "ssm/invalid-format");
    }
  }
  throw new DevopsError("Incorrect SSM variable structure", "ssm/invalid-structure");
}

// src/commands/ssm/parts/ssm.ts
var handler13 = async (input) => {
  const { subCommand, observations } = input;
  const validSubCommands = ["list", "get", "set"];
  if (!subCommand) {
    console.log(import_chalk109.default`- the SSM command requires you pick a valid sub-command; choose from: {italic ${validSubCommands.join(", ")}}`);
    process.exit();
  }
  if (!validSubCommands.includes(subCommand)) {
    console.log(`- please choose a ${import_chalk109.default.italic("valid")} ${import_chalk109.default.bold.yellow("SSM")} sub-command: ${Object.keys(subCommands_exports).join(", ")}`);
    console.log();
    process.exit();
  }
  const serverless = observations.has("serverlessFramework") && observations.has("serverlessTs");
  if (serverless) {
    await buildLambdaTypescriptProject();
  }
  try {
    await subCommands_exports[subCommand].execute(input);
  } catch (error) {
    console.log(import_chalk109.default`{red - Ran into error when running "ssm ${subCommand}":}\n  - ${error.message}\n`);
    console.log(import_chalk109.default`{grey - ${error.stack}}`);
    process.exit(1);
  }
};

// src/commands/ssm/parts/subCommands.ts
init_cjs_shims();
var subCommands = [
  { name: "list", summary: "list all SSM secrets in a given AWS profile" },
  { name: "get", summary: "get the details for a particular SSM secret" },
  { name: "set", summary: "set/add a SSM secret" }
];

// src/commands/ssm/parts/syntax.ts
init_cjs_shims();

// src/commands/ssm/index.ts
var command20 = {
  kind: "ssm",
  handler: handler13,
  description: description12,
  options: options14,
  subCommands
};
var ssm_default = command20;

// src/commands/test/index.ts
init_cjs_shims();

// src/commands/test/parts/index.ts
init_cjs_shims();

// src/commands/test/parts/description.ts
init_cjs_shims();
function description13() {
  return "Test some or all of your tests and incorporate useful test data without effort.";
}

// src/commands/test/parts/examples.ts
init_cjs_shims();

// src/commands/test/parts/options.ts
init_cjs_shims();
var options15 = {
  onSourceChanged: {
    type: Boolean,
    group: "local",
    description: "only run tests if the source files in the repo are changed from what is in git"
  }
};

// src/commands/test/parts/test.ts
init_cjs_shims();
var import_async_shelljs15 = __toModule(require("async-shelljs"));
var handler14 = async ({ raw, observations, opts, argv }) => {
  var _a, _b, _c;
  const log = logger(opts);
  const unitTestFramework = await determineTestingFramework(observations, __spreadProps(__spreadValues({}, opts), {
    interactive: true
  }));
  if (!unitTestFramework) {
    log.shout("- we couldn't determine a testing framework so exiting ...");
    return;
  }
  if (hasScript("test")) {
    proxyToPackageManager("test", observations, raw);
  } else {
    const config = getProjectConfig();
    let cmd;
    switch (unitTestFramework) {
      case "jest":
        cmd = `npx jest ${raw.join(" ")}`;
        break;
      case "uvu":
        cmd = `npx uvu ${(_a = config.test) == null ? void 0 : _a.testDirectory} -r ts-node/register ${raw.join(" ")}`;
        break;
      case "mocha":
        cmd = argv.length === 0 ? `mocha -r ts-node/register ${(_b = config.test) == null ? void 0 : _b.testDirectory}/**/*${(_c = config.test) == null ? void 0 : _c.testFilePostfix}.ts` : `mocha -r ts-node/register ${raw.join(" ")}`;
        break;
      default:
        console.log(`- currently do-devops is not setup to run tests with {bold {yellow ${unitTestFramework}}}`);
        return;
    }
    (0, import_async_shelljs15.exec)(cmd);
  }
};

// src/commands/test/index.ts
var command21 = {
  kind: "test",
  handler: handler14,
  description: description13,
  options: options15,
  greedy: true
};
var test_default = command21;

// src/commands/upgrade/index.ts
init_cjs_shims();
var command22 = {
  kind: "upgrade",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("upgrade", observations, raw);
    process.exit();
  },
  description: "proxies your package manager's 'upgrade' command"
};
var upgrade_default = command22;

// src/commands/why/index.ts
init_cjs_shims();
var import_chalk110 = __toModule(require("chalk"));
var command23 = {
  kind: "why",
  handler: async ({ observations, raw }) => {
    if (raw.length === 0) {
      console.log(import_chalk110.default`- invalid command syntax, you must state a repo to report on: {blue dd {bold [repo]} {italic [opts]}}\n`);
      if (observations.has("packageJson")) {
        console.log(import_chalk110.default`{gray - you often want to target a repo that is listed as a dependency in this repo.\n- The deps in this repo are ({italic excluding dev deps}):}\n`);
        console.log(pkgDepsInTable({ ignoreDevDeps: true }));
      }
      process.exit();
    }
    await proxyToPackageManager("why", observations, raw);
    process.exit();
  },
  description: "proxies your package manager's 'why' command"
};
var why_default = command23;

// src/shared/core/commands/getCommand.ts
init_cjs_shims();
function getCommand(cmd) {
  const defn = commands_exports[cmd];
  if (!isDoDevopsCommand(defn)) {
    throw new DevopsError(`The command "${cmd}" is not defined correctly! Make sure all commands export a valid 'IDoDevopsCommand' interface.`, "do-devops/invalid-command-definition");
  }
  return commands_exports[cmd];
}

// src/shared/core/commands/getAllCommands.ts
function getAllCommands(observations = new Set(), opts = {}) {
  const cmds = Object.keys(commands_exports);
  return cmds.map((cmd) => finalizeCommandDefinition(getCommand(cmd), observations, opts));
}

// src/dd.ts
(async () => {
  const mainCommand = (0, import_command_line_args2.default)([{ name: "command", defaultOption: true, type: String }], {
    stopAtFirstUnknown: true
  });
  const remaining = mainCommand._unknown || [];
  const cmdName = mainCommand.command;
  if (!cmdName && mainCommand._unknown && mainCommand._unknown.includes("--version")) {
    console.log(doDevopsVersion());
    process6.exit();
  }
  const observations = getObservations();
  if (!cmdName && mainCommand._unknown && mainCommand._unknown.includes("--observations")) {
    console.log(`Observations:`, [...observations].map((i) => import_chalk111.default`{inverse  ${i} }`).join(" "));
    process6.exit();
  }
  if (!cmdName) {
    commandAnnouncement(void 0, void 0, true);
    help(observations);
    process6.exit();
  }
  if (isKnownCommand(cmdName)) {
    const cmdDefn = getCommand(cmdName);
    const cmdInput = __spreadProps(__spreadValues({}, parseCmdArgs(cmdDefn, remaining)), { observations });
    if (cmdInput.opts.help) {
      commandAnnouncement(cmdDefn, cmdInput.subCommand, true);
      help(observations, cmdDefn);
      process6.exit();
    }
    try {
      commandAnnouncement(cmdDefn, cmdInput.subCommand);
      await cmdDefn.handler(cmdInput);
      if (cmdInput.unknown && cmdInput.unknown.filter((i) => i).length > 0) {
        const plural = cmdInput.unknown.length === 1 ? false : true;
        const preposition = cmdInput.unknown.length === 1 ? "was" : "were";
        console.log(import_chalk111.default`- Note: {italic there ${preposition} ${cmdInput.unknown.length} {italic unknown} parameter${plural ? "s" : ""} received (and ignored): {gray ${cmdInput.unknown.join(", ")}}}`);
      }
    } catch (error) {
      console.log(import_chalk111.default`\n{red An Error has occurred while running: {italic {bold do-devops ${cmdName}}}}`);
      console.log(`- ${error.message}`);
      console.log(import_chalk111.default`{grey   ${error.stack}}\n`);
      process6.exit();
    }
  } else {
    if (hasScript(cmdName)) {
      proxyToPackageManager(cmdName, observations, mainCommand._unknown);
    } else {
      console.log(`${import_chalk111.default.bold.red("Whoops! ")} ${import_chalk111.default.italic.yellowBright(cmdName)} is an unknown command! 

- Valid command syntax is: ${import_chalk111.default.bold.inverse(" dd [command] <options> ")}
  where valid commands are: ${import_chalk111.default.italic(getAllCommands().map((i) => i.kind).sort().join(", "))}

` + import_chalk111.default`{dim - If you want more help with a specific command, use} ${inverted(" dd [cmd] --help ")}\n`);
    }
  }
})();
