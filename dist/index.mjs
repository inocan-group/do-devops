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
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var __filename, __dirname;
var init_esm_shims = __esm({
  "node_modules/tsup/assets/esm_shims.js"() {
    __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(__filename);
  }
});

// node_modules/fs.realpath/old.js
var require_old = __commonJS({
  "node_modules/fs.realpath/old.js"(exports) {
    init_esm_shims();
    var pathModule = __require("path");
    var isWindows = process.platform === "win32";
    var fs8 = __require("fs");
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
    exports.realpathSync = function realpathSync(p, cache2) {
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
    exports.realpath = function realpath(p, cache2, cb) {
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
  "node_modules/fs.realpath/index.js"(exports, module) {
    init_esm_shims();
    module.exports = realpath;
    realpath.realpath = realpath;
    realpath.sync = realpathSync;
    realpath.realpathSync = realpathSync;
    realpath.monkeypatch = monkeypatch;
    realpath.unmonkeypatch = unmonkeypatch;
    var fs8 = __require("fs");
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
  "node_modules/concat-map/index.js"(exports, module) {
    init_esm_shims();
    module.exports = function(xs, fn) {
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
  "node_modules/balanced-match/index.js"(exports, module) {
    init_esm_shims();
    "use strict";
    module.exports = balanced;
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
  "node_modules/brace-expansion/index.js"(exports, module) {
    init_esm_shims();
    var concatMap = require_concat_map();
    var balanced = require_balanced_match();
    module.exports = expandTop;
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
  "node_modules/minimatch/minimatch.js"(exports, module) {
    init_esm_shims();
    module.exports = minimatch;
    minimatch.Minimatch = Minimatch;
    var path61 = { sep: "/" };
    try {
      path61 = __require("path");
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
      if (path61.sep !== "/") {
        pattern = pattern.split(path61.sep).join("/");
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
      if (path61.sep !== "/") {
        f = f.split(path61.sep).join("/");
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
  "node_modules/inherits/inherits_browser.js"(exports, module) {
    init_esm_shims();
    if (typeof Object.create === "function") {
      module.exports = function inherits(ctor, superCtor) {
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
      module.exports = function inherits(ctor, superCtor) {
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
  "node_modules/inherits/inherits.js"(exports, module) {
    init_esm_shims();
    try {
      util = __require("util");
      if (typeof util.inherits !== "function")
        throw "";
      module.exports = util.inherits;
    } catch (e) {
      module.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/path-is-absolute/index.js
var require_path_is_absolute = __commonJS({
  "node_modules/path-is-absolute/index.js"(exports, module) {
    init_esm_shims();
    "use strict";
    function posix(path61) {
      return path61.charAt(0) === "/";
    }
    function win32(path61) {
      var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
      var result = splitDeviceRe.exec(path61);
      var device = result[1] || "";
      var isUnc = Boolean(device && device.charAt(1) !== ":");
      return Boolean(result[2] || isUnc);
    }
    module.exports = process.platform === "win32" ? win32 : posix;
    module.exports.posix = posix;
    module.exports.win32 = win32;
  }
});

// node_modules/glob/common.js
var require_common = __commonJS({
  "node_modules/glob/common.js"(exports) {
    init_esm_shims();
    exports.setopts = setopts;
    exports.ownProp = ownProp;
    exports.makeAbs = makeAbs;
    exports.finish = finish;
    exports.mark = mark;
    exports.isIgnored = isIgnored;
    exports.childrenIgnored = childrenIgnored;
    function ownProp(obj, field) {
      return Object.prototype.hasOwnProperty.call(obj, field);
    }
    var fs8 = __require("fs");
    var path61 = __require("path");
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
        self.cwd = path61.resolve(options16.cwd);
        self.changedCwd = self.cwd !== cwd3;
      }
      self.root = options16.root || path61.resolve(self.cwd, "/");
      self.root = path61.resolve(self.root);
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
        abs = path61.join(self.root, f);
      } else if (isAbsolute(f) || f === "") {
        abs = f;
      } else if (self.changedCwd) {
        abs = path61.resolve(self.cwd, f);
      } else {
        abs = path61.resolve(f);
      }
      if (process.platform === "win32")
        abs = abs.replace(/\\/g, "/");
      return abs;
    }
    function isIgnored(self, path62) {
      if (!self.ignore.length)
        return false;
      return self.ignore.some(function(item) {
        return item.matcher.match(path62) || !!(item.gmatcher && item.gmatcher.match(path62));
      });
    }
    function childrenIgnored(self, path62) {
      if (!self.ignore.length)
        return false;
      return self.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path62));
      });
    }
  }
});

// node_modules/glob/sync.js
var require_sync = __commonJS({
  "node_modules/glob/sync.js"(exports, module) {
    init_esm_shims();
    module.exports = globSync;
    globSync.GlobSync = GlobSync;
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var Glob = require_glob().Glob;
    var util = __require("util");
    var path61 = __require("path");
    var assert = __require("assert");
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
            e = path61.join(this.root, e);
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
          prefix = path61.join(this.root, prefix);
        } else {
          prefix = path61.resolve(this.root, prefix);
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
  "node_modules/wrappy/wrappy.js"(exports, module) {
    init_esm_shims();
    module.exports = wrappy;
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
  "node_modules/once/once.js"(exports, module) {
    init_esm_shims();
    var wrappy = require_wrappy();
    module.exports = wrappy(once);
    module.exports.strict = wrappy(onceStrict);
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
  "node_modules/inflight/inflight.js"(exports, module) {
    init_esm_shims();
    var wrappy = require_wrappy();
    var reqs = Object.create(null);
    var once = require_once();
    module.exports = wrappy(inflight);
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
  "node_modules/glob/glob.js"(exports, module) {
    init_esm_shims();
    module.exports = glob;
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var inherits = require_inherits();
    var EE = __require("events").EventEmitter;
    var path61 = __require("path");
    var assert = __require("assert");
    var isAbsolute = require_path_is_absolute();
    var globSync = require_sync();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var inflight = require_inflight();
    var util = __require("util");
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
            e = path61.join(this.root, e);
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
          prefix = path61.join(this.root, prefix);
        } else {
          prefix = path61.resolve(this.root, prefix);
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
  "node_modules/shelljs/src/common.js"(exports) {
    init_esm_shims();
    "use strict";
    var os2 = __require("os");
    var fs8 = __require("fs");
    var glob = require_glob();
    var shell = require_shell();
    var shellMethods = Object.create(shell);
    exports.extend = Object.assign;
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
    exports.config = config;
    var state = {
      error: null,
      errorCode: 0,
      currentCmd: "shell.js"
    };
    exports.state = state;
    delete process.env.OLDPWD;
    function isObject(a) {
      return typeof a === "object" && a !== null;
    }
    exports.isObject = isObject;
    function log() {
      if (!config.silent) {
        console.error.apply(console, arguments);
      }
    }
    exports.log = log;
    function convertErrorOutput(msg) {
      if (typeof msg !== "string") {
        throw new TypeError("input must be a string");
      }
      return msg.replace(/\\/g, "/");
    }
    exports.convertErrorOutput = convertErrorOutput;
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
    exports.error = error;
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
    exports.ShellString = ShellString;
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
    exports.parseOptions = parseOptions;
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
    exports.expand = expand;
    var buffer = typeof Buffer.alloc === "function" ? function(len) {
      return Buffer.alloc(len || config.bufLength);
    } : function(len) {
      return new Buffer(len || config.bufLength);
    };
    exports.buffer = buffer;
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
    exports.unlinkSync = unlinkSync;
    function statFollowLinks() {
      return fs8.statSync.apply(fs8, arguments);
    }
    exports.statFollowLinks = statFollowLinks;
    function statNoFollowLinks() {
      return fs8.lstatSync.apply(fs8, arguments);
    }
    exports.statNoFollowLinks = statNoFollowLinks;
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
    exports.randomFileName = randomFileName;
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
    exports.wrap = wrap;
    function _readFromPipe() {
      return state.pipedValue;
    }
    exports.readFromPipe = _readFromPipe;
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
    exports.register = _register;
  }
});

// node_modules/shelljs/commands.js
var require_commands = __commonJS({
  "node_modules/shelljs/commands.js"(exports, module) {
    init_esm_shims();
    module.exports = [
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
  "node_modules/shelljs/src/error.js"(exports, module) {
    init_esm_shims();
    var common = require_common2();
    function error() {
      return common.state.error;
    }
    module.exports = error;
  }
});

// node_modules/shelljs/shell.js
var require_shell = __commonJS({
  "node_modules/shelljs/shell.js"(exports) {
    init_esm_shims();
    var common = require_common2();
    require_commands().forEach(function(command6) {
      __require("./src/" + command6);
    });
    exports.exit = process.exit;
    exports.error = require_error();
    exports.ShellString = common.ShellString;
    exports.env = process.env;
    exports.config = common.config;
  }
});

// src/shared/index.ts
init_esm_shims();

// src/shared/ast/index.ts
init_esm_shims();

// src/shared/ast/astParseWithAcorn.ts
init_esm_shims();
import {
  parse as parse10
} from "recast";

// src/@types/index.ts
init_esm_shims();

// src/@types/ast-types.ts
init_esm_shims();

// src/@types/aws.ts
init_esm_shims();

// src/@types/build.ts
init_esm_shims();

// src/@types/command.ts
init_esm_shims();
import { isNonNullObject } from "common-types";

// src/@types/config-types.ts
init_esm_shims();
function configIsReady(config) {
  return typeof config === "object" && config !== null && config.kind === "integrated" && config.ready || config.kind === "project" && config.projectConfig === true || config.kind === "user" && config.userConfig === true;
}

// src/@types/defaultConfig.ts
init_esm_shims();
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
init_esm_shims();
function isFilenameNotContent(input) {
  return input.filename !== void 0;
}

// src/@types/general.ts
init_esm_shims();

// src/@types/global.ts
init_esm_shims();

// src/@types/image-types.ts
init_esm_shims();

// src/@types/interactive-types.ts
init_esm_shims();

// src/@types/npm-types.ts
init_esm_shims();

// src/@types/observations.ts
init_esm_shims();

// src/@types/option-types.ts
init_esm_shims();

// src/@types/serverless-types.ts
init_esm_shims();

// src/@types/test.ts
init_esm_shims();
var UnitTestFramework;
(function(UnitTestFramework2) {
  UnitTestFramework2["jest"] = "jest";
  UnitTestFramework2["mocha"] = "mocha";
  UnitTestFramework2["other"] = "other";
})(UnitTestFramework || (UnitTestFramework = {}));

// src/@types/webpack.ts
init_esm_shims();

// src/shared/file/index.ts
init_esm_shims();

// src/shared/file/createTsFile.ts
init_esm_shims();

// src/shared/file/getDataFiles.ts
init_esm_shims();
import globby from "globby";
import path2 from "path";
import process2 from "process";

// src/shared/file/getMonoRepoPackages.ts
init_esm_shims();
import globby6 from "globby";
import { dirname } from "path";

// src/shared/npm/index.ts
init_esm_shims();

// src/shared/npm/timingFromNpmInfo.ts
init_esm_shims();
import { first, last } from "native-dash";

// src/shared/npm/crud/index.ts
init_esm_shims();

// src/shared/npm/crud/installDevDep.ts
init_esm_shims();
var import_shelljs4 = __toModule(require_shell());
import chalk105 from "chalk";

// src/shared/core/index.ts
init_esm_shims();

// src/shared/core/convertOptionsToArray.ts
init_esm_shims();

// src/shared/core/help.ts
init_esm_shims();
import chalk8 from "chalk";
import commandLineUsage from "command-line-usage";

// src/shared/ui/index.ts
init_esm_shims();

// src/shared/ui/consoleDimensions.ts
init_esm_shims();
import { exec } from "async-shelljs";

// src/shared/ui/durationSince.ts
init_esm_shims();
import { formatDistance } from "date-fns";

// src/shared/ui/emoji.ts
init_esm_shims();
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
init_esm_shims();
import chalk from "chalk";

// src/shared/ui/inverted.ts
init_esm_shims();
import chalk2 from "chalk";
var inverted = chalk2.black.bgHex("A9A9A9");

// src/shared/ui/numberWithCommas.ts
init_esm_shims();

// src/shared/ui/styles.ts
init_esm_shims();
import chalk3 from "chalk";

// src/shared/ui/toTable.ts
init_esm_shims();
import chalk4 from "chalk";
import { table } from "table";

// src/errors/index.ts
init_esm_shims();

// src/errors/DevopsError.ts
init_esm_shims();
import { isTypeSubtype } from "common-types";
var DevopsError = class extends Error {
  constructor(message, classification = "do-devops/unknown") {
    super(message);
    this.kind = "DevopsError";
    const parts = classification.split("/");
    const [type, subType] = parts.length === 1 ? ["devops", parts[0]] : parts;
    this.name = `${type}/${subType}`;
    this.code = subType;
    this.classification = isTypeSubtype(classification) ? classification : `do-devops/${classification.replace(/\//g, "")}`;
  }
};

// src/shared/ui/truncate.ts
init_esm_shims();

// src/shared/ui/wordWrap.ts
init_esm_shims();
import smartwrap from "smartwrap";
function wordWrap(text, options16 = {}) {
  text = options16.removeExistingCR ? text.replace(/\n/g, "") : text;
  return smartwrap(text, { width: options16.wrapDistance || 80 });
}

// src/shared/core/util/index.ts
init_esm_shims();

// src/shared/core/util/commandAnnouncement.ts
init_esm_shims();
import chalk6 from "chalk";

// src/shared/core/util/doDevopsVersion.ts
init_esm_shims();
import chalk5 from "chalk";

// src/shared/core/util/finalizeCommandDefinition.ts
init_esm_shims();

// src/shared/core/util/formatCommandsSection.ts
init_esm_shims();
import chalk7 from "chalk";
import { isOdd } from "native-dash";

// src/shared/core/util/globalCommandDescriptions.ts
init_esm_shims();

// src/shared/core/helpContent.ts
init_esm_shims();
import chalk9 from "chalk";

// src/shared/core/isKnownCommand.ts
init_esm_shims();

// src/shared/core/logger.ts
init_esm_shims();
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

// src/shared/core/options.ts
init_esm_shims();

// src/shared/core/parseCmdArgs.ts
init_esm_shims();
import commandLineArgs from "command-line-args";

// src/shared/core/proxyToPackageManager.ts
init_esm_shims();
import { spawnSync } from "child_process";
import chalk50 from "chalk";

// src/shared/config/index.ts
init_esm_shims();

// src/shared/config/getIntegratedConfig.ts
init_esm_shims();
import merge from "deepmerge";
import { omit } from "native-dash";
function getIntegratedConfig() {
  const userConfig = getUserConfig();
  const projectConfig = getProjectConfig();
  if (!userConfig.userConfig && !projectConfig.projectConfig) {
    return { kind: "integrated", ready: false, userConfig: false, projectConfig: false };
  }
  const u = omit(userConfig, "kind");
  const p = omit(projectConfig, "kind");
  const merged = merge(merge(u, p), {
    kind: "integrated",
    ready: userConfig.userConfig || projectConfig.projectConfig
  });
  return merged;
}

// src/shared/config/getProjectConfig.ts
init_esm_shims();
import parse from "destr";

// src/shared/config/constants.ts
init_esm_shims();
var CONFIG_FILE = ".do-devops.json";
var DEFAULT_PROJECT_CONFIG = {
  kind: "project",
  projectConfig: true,
  general: {},
  aws: {}
};

// src/shared/config/getProjectConfig.ts
function getProjectConfig() {
  return parse(readFile(currentDirectory(CONFIG_FILE))) || {
    projectConfig: false,
    kind: "project"
  };
}

// src/shared/config/getUserConfig.ts
init_esm_shims();
import parse2 from "destr";
function getUserConfig() {
  return parse2(readFile(homeDirectory(CONFIG_FILE))) || {
    userConfig: false,
    kind: "user"
  };
}

// src/shared/config/saveProjectConfig.ts
init_esm_shims();
import merge2 from "deepmerge";
import { writeFileSync } from "fs";
import { set } from "native-dash";
function configMerge(current, updated) {
  return __spreadProps(__spreadValues({}, merge2(current, updated)), {
    kind: "project",
    projectConfig: true
  });
}
function configSet(current, dotPath, payload) {
  const config = __spreadProps(__spreadValues({}, current), {
    kind: "project",
    projectConfig: true
  });
  set(current, dotPath, payload);
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
  writeFileSync(currentDirectory(CONFIG_FILE), JSON.stringify(newConfig, null, 2), {
    encoding: "utf-8"
  });
  return newConfig;
}

// src/shared/config/saveUserConfig.ts
init_esm_shims();
import merge3 from "deepmerge";
import { writeFileSync as writeFileSync2 } from "fs";

// src/shared/interactive/index.ts
init_esm_shims();

// src/shared/interactive/askForDataFile.ts
init_esm_shims();
import inquirer from "inquirer";

// src/shared/interactive/general/index.ts
init_esm_shims();

// src/shared/interactive/general/ask.ts
init_esm_shims();
import inquirer2 from "inquirer";
async function ask(question) {
  return inquirer2.prompt([question]);
}

// src/shared/interactive/general/askCheckboxQuestion.ts
init_esm_shims();

// src/shared/interactive/general/askConfirmQuestion.ts
init_esm_shims();
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
init_esm_shims();
import chalk10 from "chalk";
import { join, relative } from "path";
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
      choice = dirs.length === 0 ? await askListQuestion(ask2, [...subDirs, COMPLETED]) : await askListQuestion(chalk10`Thanks. The selected path so far is: {blue ${dirs.join("/")}}\nNow choose either a subdirectory or "COMPLETED" to finish the selection.`, [COMPLETED, ...subDirs]);
      if (choice !== COMPLETED) {
        dirs.push(choice);
        operatingDir = join(operatingDir, `${choice}/`);
        const created = await ensureDirectory(operatingDir);
        if (created) {
          console.log(chalk10`{dim - the {bold ${choice}} directory {italic didn't exist} so we've created it for you.}`);
          choice = COMPLETED;
        }
      }
    }
  }
  const relativeDirectory = relative(repoDirectory(), operatingDir);
  console.log(chalk10`{bold {yellow ${options16.name || "Selected Directory"}:} ${relativeDirectory}}`);
  return relativeDirectory;
}

// src/shared/interactive/general/askInputQuestion.ts
init_esm_shims();
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
init_esm_shims();
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
init_esm_shims();

// src/shared/interactive/general/confirmQuestion.ts
init_esm_shims();

// src/shared/interactive/general/inputQuestion.ts
init_esm_shims();

// src/shared/interactive/general/listQuestion.ts
init_esm_shims();

// src/shared/interactive/specific/index.ts
init_esm_shims();

// src/shared/interactive/specific/askAboutFileOverride.ts
init_esm_shims();
var import_shelljs = __toModule(require_shell());
import chalk11 from "chalk";

// src/shared/interactive/specific/askForDependency.ts
init_esm_shims();
import chalk12 from "chalk";
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
  const kind = await askListQuestion(chalk12`Which {italic type} of dependency`, choices);
  if (!kind) {
    return false;
  }
  const depChoices = deps[kind];
  const answer = await askListQuestion(chalk12`- Choose the {italic specific} dependency to run "ls" on`, depChoices.map((i) => ({ value: i.name, name: chalk12`${i.name} {dim - ${i.version}}` })));
  return answer;
}

// src/shared/interactive/specific/askForUnitTestFramework.ts
init_esm_shims();
import chalk13 from "chalk";
import { equal } from "native-dash";

// src/constants.ts
init_esm_shims();
var IMAGE_CACHE = ".image-metadata.json";

// src/shared/interactive/specific/askUserAboutEditorCommand.ts
init_esm_shims();

// src/shared/interactive/specific/resolvePackageManagerConflict.ts
init_esm_shims();
import chalk14 from "chalk";

// src/shared/interactive/specific/configuration/index.ts
init_esm_shims();

// src/shared/interactive/specific/configuration/askForAutoindexConfig.ts
init_esm_shims();
import chalk15 from "chalk";

// src/shared/interactive/specific/images/index.ts
init_esm_shims();

// src/shared/interactive/specific/images/askAddImageRule.ts
init_esm_shims();
import chalk17 from "chalk";

// src/shared/data/index.ts
init_esm_shims();

// src/shared/data/csvParser.ts
init_esm_shims();
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
init_esm_shims();
import chalk16 from "chalk";
async function askImageConfiguration(o, api) {
  const log = logger();
  log.info(chalk16`Welcome back, your {bold {yellow image}} configuration summary is:\n`);
  log.info(chalk16`{bold {yellow Rules:}}`);
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
  rule.source = await askForNestedDirectory(wordWrap(chalk17`What is the root directory for {bold {blue source images}}?`), { name: "Source Directory", filter, leadChoices: [config.sourceDir] });
  rule.destination = await askForNestedDirectory(chalk17`What is the root directory for {bold {blue destination/optimized images}}?`, { name: "Destination Directory", filter, leadChoices: [config.destinationDir] });
  rule.glob = await askInputQuestion(wordWrap(chalk17`What is the {italic glob pattern} used to identify the images: `));
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
init_esm_shims();
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
init_esm_shims();
import chalk23 from "chalk";
import path3 from "path";

// src/shared/images/index.ts
init_esm_shims();

// src/shared/images/createMetaFor.ts
init_esm_shims();

// src/shared/images/getImages.ts
init_esm_shims();
import { sync } from "globby";
function getImages(dir) {
  return sync([
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
init_esm_shims();
import { exiftool } from "exiftool-vendored";

// src/shared/images/useExifTool/conversion-tools.ts
init_esm_shims();
import { ExifDateTime } from "exiftool-vendored";

// src/@type-guards/index.ts
init_esm_shims();

// src/@type-guards/errors.ts
init_esm_shims();
function isDevopsError(err) {
  return typeof err === "object" && err.kind === "DevopsError";
}
function isClassification(error, classification) {
  return isDevopsError(error) && error.classification === classification;
}

// src/@type-guards/image-guards.ts
init_esm_shims();
function isExifDate(d) {
  return typeof d === "object" && Object.keys(d).includes("year") && !Object.keys(d).includes("second") && Object.keys(d).includes("zone");
}

// src/shared/images/useExifTool/conversion-tools.ts
function convertExifDateToExifDataString(d) {
  return isExifDate(d) ? ExifDateTime.fromISO(d.toISOString()) : d;
}
function convertToExifDateTime(d) {
  if (!d) {
    return void 0;
  } else if (isExifDate(d)) {
    d = convertExifDateToExifDataString(d);
  } else if (typeof d === "string") {
    d = ExifDateTime.fromISO(d);
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
init_esm_shims();
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
      return exiftool.version();
    },
    getMetadata: async (file, force = false) => {
      if (Object.keys(cache).includes(file) && !force) {
        return cache[file];
      }
      const meta = improveMetaResults(await exiftool.read(file));
      cache[file] = meta;
      return meta;
    },
    removeAllMeta: async (image, keepOriginalCopy = false) => {
      await exiftool.deleteAllTags(image).catch((error) => {
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
      await exiftool.write(file, { [tag]: value });
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
      await exiftool.write(image, tags);
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
      await exiftool.write(image, eraser);
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
      await exiftool.write(image, payload);
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
      return exiftool.end();
    }
  };
  return api;
}

// src/shared/images/useImageApi.ts
init_esm_shims();
import chalk22 from "chalk";
import destr from "destr";

// src/shared/images/useImageApi/convertStale.ts
init_esm_shims();
import chalk20 from "chalk";

// src/shared/images/useImageApi/checkCacheFreshness.ts
init_esm_shims();
import chalk18 from "chalk";
import globby2 from "globby";
import { join as join2 } from "path";
async function checkCacheFreshness(cache2, rule) {
  const log = logger();
  const baseDir = rule.source;
  const globPattern = rule.glob;
  const targetFiles = (await globby2(globPattern, {
    cwd: join2(repoDirectory(), baseDir),
    onlyFiles: true,
    stats: true,
    caseSensitiveMatch: false
  })).map((i) => ({ name: join2(baseDir, i.path), modified: i.stats.mtimeMs }));
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
  log.whisper(chalk18`{dim - there were {bold ${targetFiles.length}} source images discovered for the {blue ${rule.name}} rule. Of which ${missing.length} were {italic missing} from the cache and ${outOfDate.length} were in the cache but stale.}`);
  return { missing, outOfDate };
}

// src/shared/images/useImageApi/refreshCache.ts
init_esm_shims();
import chalk19 from "chalk";
import { format } from "date-fns";

// src/shared/images/useImageApi/buildTagsFromCache.ts
init_esm_shims();
function buildTagsFromCache(tags, cache2, sourceFile) {
  return tags.reduce((acc, tag) => {
    const c = cache2.source[sourceFile];
    acc = __spreadProps(__spreadValues({}, acc), { [tag]: c.meta[tag] });
    return acc;
  }, {});
}

// src/shared/images/useImageApi/saveImageCache.ts
init_esm_shims();
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
  log.whisper(chalk19`{dim - using the "${rule.name}" rule, {bold ${optimized.length}} images have been resized using Sharp to fit "web formats"}`);
  if (rule.preBlur) {
    const waitBlurry = [];
    for (const file of stale) {
      waitBlurry.push(tools.sharp.blurredPreImage(file, rule.destination));
    }
    const blurred = await Promise.all(waitBlurry);
    log.whisper(chalk19`{dim - produced a blurred image preload for ${blurred.length} images associated to "${rule.name}" rule}`);
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
    log.whisper(chalk19`- Metadata properties -- {italic ${rule.preserveMeta.join(", ")}} -- have been added to the web images where they were available in the source image`);
  }
  if (rule.copyright) {
    const cpPromises = [];
    for (const file of optimized) {
      cpPromises.push(tools.exif.addCopyright(file.file, rule.copyright));
    }
    await Promise.all(cpPromises);
    log.whisper(chalk19`- copyright notices have been applied to the {yellow {bold ${optimized.length}}} images which were created as a result of recent changes to source files`);
  }
  log.info(chalk19`- ${emoji.party} all images are now up-to-date based on recent source image changes [ {dim ${format(Date.now(), "h:mm:ss aaaa")}} ]`);
}

// src/shared/images/useImageApi/createTsSupportFile.ts
init_esm_shims();
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
    log.info(chalk20`- checking rule {blue ${rule.name}} for stale source images [ {dim ${i + 1} {italic of} ${rules.length}} ]`);
    const { missing, outOfDate } = await checkCacheFreshness(tools.cache, rule);
    if (missing.length > 0) {
      log.whisper(chalk20`{dim - there are {bold ${missing.length}} images not currently in the cache: {dim ${missing.join(", ")}}}`);
    }
    if (outOfDate.length > 0) {
      log.whisper(chalk20`- there are ${outOfDate.length} images who are out of date: {dim ${missing.join(", ")}}`);
    }
    if (missing.length === 0 && outOfDate.length === 0) {
      log.info(chalk20`- ${emoji.party} all images in {blue ${rule.name}} are current; no work needed.`);
      log.info(chalk20`{dim - if you need to force image production use {blue dd optimize --force}}`);
    } else {
      await refreshCache2(rule, tools, [...missing, ...outOfDate]);
      const changes = [...missing, ...outOfDate];
      const resized = [];
      for (const img of changes) {
        resized.push(tools.sharp.resizeToWebFormats(img, rule.destination, rule.widths));
      }
      const resizedComplete = [...await Promise.all(resized)].flat();
      log.whisper(chalk20`{dim - the following images were {italic resized}:\n${wordWrap(resizedComplete.map((i2) => i2.file).join("	"), { wrapDistance: 120 })}}\n`);
    }
  }
  if (config == null ? void 0 : config.supportTS) {
    createTsSupportFile(rules, tools);
  }
}

// src/shared/images/useImageApi/watchForChange.ts
init_esm_shims();
async function watchForChange(_rules, _tools, _options) {
}

// src/shared/images/useImageApi/summarize.ts
init_esm_shims();
import chalk21 from "chalk";
import { formatDistance as formatDistance2 } from "date-fns";
function summarize(rules, tools) {
  const log = logger();
  if (!tools.cache) {
    log.shout(chalk21`- ${emoji.eyeballs} there is no image cache; do you want to run {dd image convert} first?`);
  }
  if (!tools.cache.source) {
    console.log(wordWrap(chalk21`- ${emoji.eyeballs} there appears to be something wrong with your image cache as the cache file does exist but the "source" folder is missing. Please have a look but it is probably best that you re-build the cache with {blue dd image optimize --force}`));
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
  const lastUpdate = formatDistance2(sourceImages.reduce((mostRecent, i) => i.modified > mostRecent ? i.modified : mostRecent, 0), Date.now(), { addSuffix: true });
  log.info(chalk21`{bold Summary of Image Configuration}`);
  log.info(chalk21`{bold ------------------------------}\n`);
  log.info(chalk21`- there are {yellow {bold ${sourceImages.length}}} source images in the cache`);
  log.info(chalk21`- the last detected change in these source images was ${lastUpdate}`);
  log.info(chalk21`{dim - the rules {italic plus} source images have produced {bold {yellow ${convertedImages.length}}} optimized images}`);
  log.info();
  log.info(chalk21`  Rule Overview:`);
  log.info(chalk21`  --------------`);
  for (const r of rules || []) {
    const sourceFromRule = sourceImages.filter((i) => (i == null ? void 0 : i.rule) === r.name);
    const convertedFromRule = convertedImages.filter((i) => (i == null ? void 0 : i.rule) === r.name);
    log.info(chalk21`    - ${r.name}: {dim source: {gray "}${r.source}{gray "}, destination: {gray "}${r.destination}{gray "}, glob: {gray "}${r.glob}{gray "}, source images: ${sourceFromRule.length}, optimized images: ${convertedFromRule.length}}`);
  }
}

// src/shared/images/useImageApi.ts
function useImageApi(rules, options16 = {}) {
  const log = logger();
  const exif = useExifTools();
  const sharp2 = useSharp();
  const cacheFileExists = fileExists(IMAGE_CACHE);
  log.whisper(cacheFileExists && options16.clearCache !== true ? chalk22`{dim - cache file found on disk, loading ...}` : options16.clearCache === true ? chalk22`{dim - starting with clean cache due to "clearCache" flag}` : chalk22`{dim - no cache file found on disk, will start with clean cache}`);
  const cache2 = cacheFileExists && options16.clearCache !== true ? destr(readFile(IMAGE_CACHE)) : { source: {}, converted: {} };
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
init_esm_shims();
import { omit as omit2 } from "native-dash";
import { join as join3 } from "path";
import sharp from "sharp";
function outFilename(dir, name, width, format6) {
  return join3(dir, `${name}-${width}.${format6}`);
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
    const result = sharp.simd();
    if (!result) {
      console.log(`- Sharp attempted to establish use of simd acceleration but hardware platform did not allow it.`);
    }
  }
  const api = {
    resizeImage: async (image, outDir, width, format6, options17 = {}) => {
      const name = getFileComponents(image).fileWithoutExt;
      const out = outFilename(outDir, name, width, format6);
      return sharp(image).toFormat(format6, options17).resize(width).toFile(out).then((info3) => {
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
      return sharp(source).metadata().then((meta) => {
        return omit2(meta, "exif", "iptc", "icc", "xmp");
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
      const blurFilename = join3(outDir, baseName);
      await sharp(image).toFormat("jpg", { mozjpeg: true, progressive: true }).blur(true).resize({ width: size }).toFile(blurFilename);
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
    imageDirs.add(path3.dirname(i));
  }
  log.shout(wordWrap(chalk23`Welcome weary traveler! It appears you've not configured {bold {blue images}} for this repo before. Let's get that out of the way now.\n`));
  const sourceDir = await askForNestedDirectory(wordWrap(chalk23`You are expected to choose a {blue source directory} to act as the {italic default} dir for all your rule's source images. Choose from the directories below ({italic dirs with image will be at top of list}):`), {
    name: "Source Directory",
    filter: filter2,
    leadChoices: [...imageDirs]
  });
  log.info();
  const destinationDir = await askForNestedDirectory(wordWrap(chalk23`Now choose a {italic default} {blue destination directory} for images; {bold rules} will still need choose this too but they'll default to whatever you choose.\n\n`) + wordWrap(chalk23`Note: the most common directory to target would be the {blue /public} directory as this is typically where build tools look for static assets like images.`) + chalk23`\n\nChoose from list:`, {
    name: "Destination Directory",
    filter: filter2,
    leadChoices: ["public"]
  });
  log.info();
  log.shout(wordWrap(chalk23`The {italic general} configuration of the image service is now complete but {italic rules} are a key component of having a complete setup. For this reason we will add one rule now and if you want to add more later simply run {blue dd image config} again and choose "add rule" from the options.\n\n`));
  const rule = {};
  rule.name = await askInputQuestion(`Each rule needs to have a "name" to identify it (you can change later without issue):`);
  rule.source = await askForNestedDirectory(wordWrap(chalk23`Each rule must state a root directory for their {bold {blue source}} images;\nit is already defaulted to the general setting you chose earlier but if this rule should start somewhere else feel free to change`), { name: "Rule Source Directory", filter: filter2, leadChoices: [sourceDir] });
  rule.destination = await askForNestedDirectory(chalk23`Similarly, a rule has a default {bold {blue destination}} directory`, { name: "Rule Destination Directory", filter: filter2, leadChoices: [destinationDir] });
  rule.glob = await askInputQuestion(wordWrap(chalk23`Finally, a rule must express a "glob pattern" for picking up the images it sees as source images (the glob pattern will be applied in the source directory you just chose). An example glob pattern to find all PNG images recurssively would be ${chalk23.bgWhite.blackBright("**/*.png")}: `));
  const sizeOptions = [
    "high-quality [ 1024, 1280, 1536, 2048, 2560 ]",
    "full-width [ 640, 768, 1024, 1280, 1536 ]",
    "half-width [ 320, 384, 512, 640, 768 ]",
    "quarter-width [ 160, 192, 256, 320, 384 ]",
    "icon [ 128, 192, 256, 512 ]",
    "custom"
  ];
  const sizeName = await askListQuestion(wordWrap(`When a source image is optimized it will be converted to JPG, AVIF, and WebP formats but it will also be done in different sizes. There are a number of default options listed below which largely trigger off of two variables:
`) + chalk23` 1. the responsive breakpoints we use for responsive design\n  2. the idea of what percentage the screen width the image will typically occupy\n\n` + wordWrap(chalk23`Note:\n  - some smaller displays {italic do} have much higher DPI so they can display high resolution;\n  - also due to {italic responsive design} sometimes smaller displays take up more width on a percentage basis\n\nChoose from the defaults or design your own:`), sizeOptions, { default: "full-width [ 640, 768, 1024, 1280, 1536 ]" });
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
  log.info(chalk23`\n\nFantastic, you have default properties configured {bold plus} your first rule defined!\n`);
  log.info(chalk23`- to convert images run {blue dd image optimize} and your rule will be executed.`);
  log.info(chalk23`- the {blue .do-devop.json} file in the root of the repo will host your configuration.`);
  log.info(chalk23`- you can always edit the config directly in the config file or if you prefer use the {blue dd image config} menu`);
  return { sourceDir, targetDir: destinationDir, rules };
}

// src/shared/interactive/specific/images/askImageDefaults.ts
init_esm_shims();
import chalk24 from "chalk";
async function askImageDefaults(o, api) {
  const log = logger();
  const config = getProjectConfig().image;
  log.info(chalk24`Current settings for image can be found in the -- {blue ${CONFIG_FILE}} {italic file} -- and are as follows:`);
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
init_esm_shims();
async function askRemoveImageRule(o, api) {
  const log = logger();
  const config = getProjectConfig().image;
  const rule = await askListQuestion(`Which rule do you want to remove?`, api.rules.map((i) => i.name));
  await saveProjectConfig("image.rules", config.rules.filter((i) => i.name !== rule));
  log.info(`- ${rule} has been removed from configuration`);
  return askImageConfiguration(o, api);
}

// src/shared/observations/index.ts
init_esm_shims();

// src/shared/observations/determineAccountId.ts
init_esm_shims();
import { isAwsAccountId } from "common-types";

// src/shared/aws/index.ts
init_esm_shims();

// src/shared/aws/addAwsProfile.ts
init_esm_shims();
import path4 from "path";
import { appendFileSync, readFileSync } from "fs";
function addAwsProfile(name, profile2) {
  const homedir5 = __require("os").homedir();
  const filePath = path4.join(homedir5, ".aws/credentials");
  const fileContents = readFileSync(filePath, "utf-8");
  if (fileContents.includes(`[${name}]`)) {
    throw new Error(`The AWS profile "${name}" already exists, attempt to add it has failed!`);
  }
  let newProfile = `
[${name}]
`;
  for (const key of Object.keys(profile2)) {
    newProfile += `${key} = ${profile2[key]}
`;
  }
  appendFileSync(filePath, newProfile);
}

// src/shared/aws/askForAwsProfile.ts
init_esm_shims();
import inquirer3 from "inquirer";
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
  const answer = await inquirer3.prompt(question);
  return answer.profile;
}

// src/shared/aws/askForAwsRegion.ts
init_esm_shims();
import inquirer4 from "inquirer";
async function askForAwsRegion() {
  const question = {
    type: "list",
    name: "region",
    message: "What AWS region do you want to target?",
    default: "us-east-1",
    choices: [
      "us-east-1",
      "us-east-2",
      "us-west-1",
      "us-west-2",
      "eu-west-1",
      "eu-west-2",
      "eu-west-3",
      "eu-north-1",
      "eu-central-1",
      "sa-east-1",
      "ca-central-1",
      "ap-south-1",
      "ap-northeast-1",
      "ap-northeast-2",
      "ap-northeast-3",
      "ap-southeast-1",
      "ap-southeast-2"
    ]
  };
  const answer = await inquirer4.prompt(question);
  return answer.region;
}

// src/shared/aws/aws-type-guards.ts
init_esm_shims();
function isAwsProfile(input) {
  return typeof input === "object" && input !== null && Object.keys(input).includes("aws_access_key_id") && Object.keys(input).includes("aws_secret_access_key");
}
function isAwsCredentials(input) {
  return typeof input === "object" && input !== null && Object.keys(input).includes("accessKeyId") && Object.keys(input).includes("secretAccessKey");
}

// src/shared/aws/checkIfAwsInstalled.ts
init_esm_shims();
import { asyncExec } from "async-shelljs";
async function checkIfAwsInstalled() {
  try {
    await asyncExec("aws", { silent: true });
    return true;
  } catch {
    return false;
  }
}

// src/shared/aws/convertProfileToApiCredential.ts
init_esm_shims();
import chalk25 from "chalk";
function convertProfileToApiCredential(profile2) {
  if (!isAwsProfile(profile2)) {
    const isObject = typeof profile2 === "object" && profile2 !== null;
    throw new DevopsError(chalk25`The {bold {red IAwsProfile}} information which was passed in to be converted to {bold IAwsCredentials} data was malformed and can not be converted! To be valid a key it must have both {green aws_access_key_id} and {green aws_secret_access_key} defined. [${isObject ? "keys found were " + Object.keys(profile2).join(", ") : `wrong type: ${typeof profile2}`}]\n\n`, "do-devops/invalid-aws-profile");
  }
  return {
    accessKeyId: profile2.aws_access_key_id,
    secretAccessKey: profile2.aws_secret_access_key
  };
}

// src/shared/aws/getApiGatewayEndpoints.ts
init_esm_shims();
import chalk26 from "chalk";
import { APIGateway, ApiGatewayV2 } from "aws-sdk";

// src/shared/aws/userHasAwsProfile.ts
init_esm_shims();
async function userHasAwsProfile(profileName) {
  const profiles = Object.keys(await getAwsProfileDictionary());
  return profiles.includes(profileName);
}

// src/shared/aws/getApiGatewayEndpoints.ts
async function getApiGatewayEndpoints(profileName, region) {
  if (!userHasAwsProfile(profileName)) {
    console.log(chalk26`- attempt to get {italics endpoints} not possible with the profile {blue ${profileName}} as you do not have credentials defined for this profile! ${emoji.angry}\n`);
    process.exit();
  }
  const profile2 = await getAwsProfile(profileName);
  const credential = convertProfileToApiCredential(profile2);
  const gw = new APIGateway(__spreadProps(__spreadValues({}, credential), {
    region
  }));
  const gw2 = new ApiGatewayV2(__spreadProps(__spreadValues({}, credential), {
    region
  }));
  const restApi = await gw.getRestApis().promise();
  const httpApi = await gw2.getApis().promise();
  return { httpApi, restApi };
}

// src/shared/aws/getAwsAccountId.ts
init_esm_shims();

// src/shared/aws/getAwsUserProfile.ts
init_esm_shims();
import { IAM } from "aws-sdk";

// src/shared/aws/getAwsProfile.ts
init_esm_shims();
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

// src/shared/aws/getAwsUserProfile.ts
async function getAwsUserProfile(awsProfile) {
  if (typeof awsProfile === "string") {
    awsProfile = await getAwsProfile(awsProfile);
  }
  const up = await new IAM({
    accessKeyId: awsProfile.aws_access_key_id,
    secretAccessKey: awsProfile.aws_secret_access_key
  }).getUser().promise();
  return up.User;
}

// src/shared/aws/getAwsAccountId.ts
async function getAwsAccountId(awsProfile) {
  const user = await getAwsUserProfile(awsProfile);
  const [_, accountId] = user.Arn.match(/arn.*::(\d+):.*/);
  return accountId;
}

// src/shared/aws/getAwsDefaultRegion.ts
init_esm_shims();
import { EC2 } from "aws-sdk";
async function getAwsDefaultRegion(profileName) {
  const profile2 = await getAwsProfile(profileName);
  const credential = convertProfileToApiCredential(profile2);
  if (!credential) {
    throw new DevopsError(`Could not get the credentials for the profile "${profileName}".`, "not-allowed/no-credentials");
  }
  const api = new EC2(__spreadValues({}, credential));
  return api.describeAvailabilityZones().promise();
}

// src/shared/aws/getAwsIdentityFromProfile.ts
init_esm_shims();
import AWS from "aws-sdk";
async function getAwsIdentityFromProfile(profile2) {
  const sts = new AWS.STS({
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
init_esm_shims();
import { Lambda } from "aws-sdk";
async function getAwsLambdaFunctions(opts) {
  const profile2 = opts.profile ? opts.profile : await determineProfile(opts);
  const region = opts.region ? opts.region : await determineRegion(opts);
  if (!profile2 || !region) {
    throw new DevopsError(`Requesting a list of AWS functions requires an AWS profile and a specified region. One or both were missing [ p: ${profile2}, r: ${region}] `, "not-ready/missing-aws-properties");
  }
  const credentials = convertProfileToApiCredential(await getAwsProfile(profile2));
  const lambda = new Lambda(__spreadProps(__spreadValues({}, credentials), { region }));
  return lambda.listFunctions().promise();
}

// src/shared/aws/getAwsLambdaLayers.ts
init_esm_shims();
import { Lambda as Lambda2 } from "aws-sdk";
async function getAwsLambdaLayers(opts) {
  const profile2 = opts.profile ? opts.profile : await determineProfile(opts);
  const region = opts.region ? opts.region : await determineRegion(opts);
  if (!profile2 || !region) {
    throw new DevopsError(`Requesting a list of AWS functions requires an AWS profile and a specified region. One or both were missing [ p: ${profile2}, r: ${region}] `, "not-ready/missing-aws-properties");
  }
  const credentials = convertProfileToApiCredential(await getAwsProfile(profile2));
  const lambda = new Lambda2(__spreadValues({}, credentials));
  return lambda.listLayers().promise();
}

// src/shared/aws/getAwsProfileDictionary.ts
init_esm_shims();
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
init_esm_shims();
async function getAwsProfileList() {
  const dict = await getAwsProfileDictionary();
  const keys = Object.keys(dict);
  if (keys.length === 0) {
    return [];
  }
  return keys.map((i) => __spreadProps(__spreadValues({}, dict[i]), { name: i }));
}

// src/shared/aws/hasAwsCredentialsFile.ts
init_esm_shims();
import path5 from "path";
import { existsSync } from "fs";
function hasAwsProfileCredentialsFile() {
  const homedir5 = __require("os").homedir();
  const filePath = path5.join(homedir5, ".aws/credentials");
  return existsSync(filePath) ? filePath : false;
}

// src/shared/observations/determineCredentials.ts
init_esm_shims();

// src/shared/observations/determineProfile.ts
init_esm_shims();

// src/shared/serverless/index.ts
init_esm_shims();

// src/shared/serverless/askAboutLogForwarding.ts
init_esm_shims();
import chalk27 from "chalk";
import inquirer5 from "inquirer";

// src/shared/serverless/askForFunction.ts
init_esm_shims();
import inquirer6 from "inquirer";

// src/shared/serverless/getLocalServerlessFunctionsFromServerlessYaml.ts
init_esm_shims();

// src/shared/serverless/askForStage.ts
init_esm_shims();
import inquirer7 from "inquirer";

// src/shared/serverless/findAllHandlerFiles.ts
init_esm_shims();
import { sync as sync2 } from "globby";
import path6 from "path";

// src/shared/serverless/findConfigFunctionDefnFiles.ts
init_esm_shims();
import { sync as sync3 } from "globby";
import path7 from "path";

// src/shared/serverless/findInlineFunctionDefnFiles.ts
init_esm_shims();
import { sync as sync4 } from "globby";
import path8 from "path";

// src/shared/serverless/getAccountInfoFromServerlessYaml.ts
init_esm_shims();

// src/shared/serverless/getServerlessYaml.ts
init_esm_shims();
import fs from "fs";
import path9 from "path";
import { load } from "js-yaml";
async function getServerlessYaml() {
  const baseStructure = {
    functions: {},
    stepFunctions: { stateMachines: {} }
  };
  try {
    const fileContents = fs.readFileSync(path9.join(process.cwd(), "serverless.yml"), {
      encoding: "utf-8"
    });
    const config = load(fileContents);
    return __spreadValues(__spreadValues({}, baseStructure), config);
  } catch (error) {
    const error_ = isDevopsError(error) ? new DevopsError(`Failure getting serverless.yml: ${error.message}`, error.name) : new DevopsError(`Failure getting serverless.yml`, "serverless/not-ready");
    throw error_;
  }
}

// src/shared/serverless/getAwsProfileFromServerless.ts
init_esm_shims();
import chalk28 from "chalk";

// src/shared/observations/isServerless.ts
init_esm_shims();
import fs2 from "fs";
import path10 from "path";

// src/shared/serverless/getLambdaFunctions.ts
init_esm_shims();
import { Lambda as Lambda3 } from "aws-sdk";

// src/shared/serverless/getLocalHandlerInfo.ts
init_esm_shims();
import path11 from "path";
import { get } from "native-dash";

// src/shared/serverless/getMicroserviceConfig.ts
init_esm_shims();
import chalk29 from "chalk";
import path12 from "path";
import { asyncExec as asyncExec2 } from "async-shelljs";

// src/shared/serverless/getServerlessBuildConfiguration.ts
init_esm_shims();
import { TypedMapper } from "typed-mapper";

// src/shared/yeoman/index.ts
init_esm_shims();

// src/shared/yeoman/getYeomanConfig.ts
init_esm_shims();
import chalk30 from "chalk";
import { existsSync as existsSync2, readFileSync as readFileSync2 } from "fs";
import parse3 from "destr";
import path13 from "path";

// src/shared/yeoman/getYeomanScaffolds.ts
init_esm_shims();
import { existsSync as existsSync3, readFileSync as readFileSync3 } from "fs";
import parse4 from "destr";
import path14 from "path";

// src/shared/serverless/sandbox.ts
init_esm_shims();
import { asyncExec as asyncExec3 } from "async-shelljs";

// src/shared/git/index.ts
init_esm_shims();

// src/shared/git/convertGitUrlToHttp.ts
init_esm_shims();

// src/shared/git/findOrgFromGitRemote.ts
init_esm_shims();

// src/shared/git/getGitBranch.ts
init_esm_shims();

// src/shared/git/git.ts
init_esm_shims();
import simpleGit from "simple-git";

// src/shared/git/getGitLastCommit.ts
init_esm_shims();

// src/shared/git/getGitLog.ts
init_esm_shims();

// src/shared/git/getGitRemote.ts
init_esm_shims();

// src/shared/git/gitTags.ts
init_esm_shims();

// src/shared/serverless/saveToServerlessYaml.ts
init_esm_shims();
import chalk31 from "chalk";
import fs3 from "fs";
import path15 from "path";
import { dump } from "js-yaml";

// src/shared/serverless/serverlessYamlExists.ts
init_esm_shims();
import { existsSync as existsSync4 } from "fs";
import path16 from "path";

// src/shared/serverless/accountInfo/index.ts
init_esm_shims();

// src/shared/serverless/accountInfo/askForAccountInfo.ts
init_esm_shims();
import { AWS_REGIONS } from "common-types";
import inquirer8 from "inquirer";
import chalk32 from "chalk";

// src/shared/serverless/build/index.ts
init_esm_shims();

// src/shared/serverless/build/buildLambdaTypescriptProject.ts
init_esm_shims();
import chalk33 from "chalk";
import {
  platform
} from "os";
import { asyncExec as asyncExec4, rm } from "async-shelljs";

// src/shared/serverless/build/clearOldFiles.ts
init_esm_shims();
import path17 from "path";
import { existsSync as existsSync5 } from "fs";
import { rm as rm2 } from "async-shelljs";

// src/shared/serverless/build/createFunctionEnum.ts
init_esm_shims();
import chalk35 from "chalk";
import path18 from "path";
import { existsSync as existsSync6, mkdirSync, writeFile } from "fs";

// src/shared/ast/findHandlerConfig.ts
init_esm_shims();
import chalk34 from "chalk";
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
        console.log(chalk34`{grey - the handler function "${fn}" had a defined package config but it will be replaced by a {italic artifact} reference}`);
      }
      hash.package = { artifact: `.webpack/${fn}.zip` };
    }
    return {
      interface: config.interface,
      config: hash
    };
  }
}

// src/shared/serverless/build/createFunctionEnum.ts
import { promisify } from "util";
var write2 = promisify(writeFile);

// src/shared/serverless/build/createInlineExports.ts
init_esm_shims();
import chalk36 from "chalk";
import path19 from "path";
import { writeFileSync as writeFileSync3 } from "fs";
import {
  isServerlessFunctionHandler
} from "common-types";

// src/shared/serverless/build/createWebpackEntryDictionaries.ts
init_esm_shims();
import path20 from "path";

// src/shared/serverless/build/saveFunctionsTypeDefinition.ts
init_esm_shims();
import chalk37 from "chalk";
import fs4 from "fs";
import path21 from "path";

// src/shared/serverless/build/writeInlineFunctions.ts
init_esm_shims();
import {
  writeFile as writeFile2
} from "fs";
import path22 from "path";
import { promisify as promisify2 } from "util";
var writeFile3 = promisify2(writeFile2);

// src/shared/serverless/build/zipWebpackFiles.ts
init_esm_shims();
import chalk38 from "chalk";
import path23 from "path";

// src/@polyfills/bestzip.ts
init_esm_shims();

// src/shared/serverless/build/zipWebpackFiles.ts
import zip from "bestzip";

// src/shared/serverless/functions/index.ts
init_esm_shims();

// src/shared/serverless/functions/detectDuplicateFunctionDefinitions.ts
init_esm_shims();

// src/shared/serverless/functions/functions.ts
init_esm_shims();
import path24 from "path";
import { writeFileSync as writeFileSync4 } from "fs";

// src/shared/serverless/functions/getFilePath.ts
init_esm_shims();

// src/shared/serverless/functions/getFunctionNames.ts
init_esm_shims();

// src/shared/serverless/functions/getNamespacedLookup.ts
init_esm_shims();
import path25 from "path";

// src/shared/serverless/functions/validateExports.ts
init_esm_shims();

// src/shared/serverless/layers/index.ts
init_esm_shims();

// src/shared/serverless/layers/getLayersWithMeta.ts
init_esm_shims();
import path26 from "path";

// src/shared/serverless/webpack/index.ts
init_esm_shims();

// src/shared/serverless/webpack/getTranspiledTimestamps.ts
init_esm_shims();

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
init_esm_shims();
import parse5 from "destr";

// src/shared/observations/determinePackageManager.ts
init_esm_shims();
import chalk45 from "chalk";

// src/shared/install/index.ts
init_esm_shims();

// src/shared/install/configureTestFramework.ts
init_esm_shims();

// src/shared/install/installBuildSystem.ts
init_esm_shims();
import chalk39 from "chalk";

// src/shared/remove/index.ts
init_esm_shims();

// src/shared/remove/removeTsLint.ts
init_esm_shims();

// src/shared/install/installEsLint.ts
init_esm_shims();
import chalk40 from "chalk";

// src/shared/install/installGit.ts
init_esm_shims();
import chalk41 from "chalk";

// src/shared/install/installGitIgnore.ts
init_esm_shims();
import chalk42 from "chalk";

// src/shared/install/installPackageManager.ts
init_esm_shims();
import chalk43 from "chalk";
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
  log.whisper(chalk43`{gray - ${manager} package manager saved to this repos {blue .do-devops.json} config file}`);
  await proxyToPackageManager("install", observations);
}

// src/shared/install/installTestFramework.ts
init_esm_shims();
import chalk44 from "chalk";

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
      console.log(chalk45`- removed `);
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
init_esm_shims();

// src/shared/observations/determineRegion.ts
init_esm_shims();
import chalk46 from "chalk";
import { get as get2 } from "native-dash";
async function determineRegion(opts = {}, observations = new Set()) {
  var _a;
  const config = getIntegratedConfig();
  let region = opts.region || process.env.AWS_REGION;
  if (!region && observations.has("serverlessYml")) {
    try {
      region = get2(await getServerlessYaml(), "provider.region", void 0);
    } catch {
    }
  }
  if (!region) {
    region = get2(config, "global.defaultAwsRegion", void 0);
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
        console.log(chalk46`{bold - AWS region has been resolved using the User's config ${emoji.eyeballs}}. This is the source of "last resort" but may be intended.`);
      }
      region = userConfig.aws.defaultRegion;
    }
  }
  return region;
}

// src/shared/observations/determineStackName.ts
init_esm_shims();
import chalk47 from "chalk";

// src/shared/observations/determineStage.ts
init_esm_shims();
import chalk48 from "chalk";
import {
  env,
  exit
} from "process";
import { get as get3 } from "native-dash";

// src/shared/observations/determineTestFramework.ts
init_esm_shims();
import chalk49 from "chalk";

// src/shared/observations/getObserverations.ts
init_esm_shims();

// src/shared/observations/hasServerlessTsFile.ts
init_esm_shims();

// src/shared/observations/isTypescriptMicroserviceProject.ts
init_esm_shims();

// src/shared/core/proxyToPackageManager.ts
import { cwd } from "process";
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
    console.log(chalk50`- ${emoji.shocked} the {green ${cmd}} command is only meant to used in the root of NodeJS which has a {blue package.json} file in it.\n`);
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
      console.log(chalk50`{gray - we detected use of the {blue ${pkgManager}} in this repo and will {italic proxy} "${cmd}" to: {blue ${pkgCmd}}}\n`);
    } else {
      if (isScriptCmd && !hasScript(cmd)) {
        console.log(chalk50`{gray - we {italic would} proxy this as {blue ${pkgCmd}} but you don't have "${cmd}" defined in your scripts section.}\n`);
        process.exit();
      }
      console.log(chalk50`{gray - we will proxy {blue ${pkgCmd}} for you}\n`);
    }
    const parts = pkgCmd.split(" ");
    spawnSync(parts[0], parts.filter((i) => i).slice(1), { stdio: "inherit", cwd: cwd() });
  } else {
    console.log(chalk50`- we can not currently tell {italic which} package manager you're using.`);
    const answer = await askListQuestion("Would you like save the package manager to this repo in a config file?", ["not now, thanks", "npm", "pnpm", "yarn"]);
    if (answer !== "not now, thanks") {
      saveProjectConfig({ general: { pkgManager: answer } });
    }
  }
}

// src/shared/core/commands/index.ts
init_esm_shims();

// src/shared/core/commands/getAllCommands.ts
init_esm_shims();

// src/commands/index.ts
init_esm_shims();

// src/commands/add.ts
init_esm_shims();
import chalk51 from "chalk";
var command = {
  kind: "add",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("install", observations, raw);
    process.exit();
  },
  description: chalk51`proxies your package manager's {bold italic install / add } command`
};

// src/commands/install.ts
init_esm_shims();
import chalk52 from "chalk";
var command2 = {
  kind: "install",
  handler: async ({ observations, raw }) => {
    await proxyToPackageManager("install", observations, raw);
    process.exit();
  },
  description: chalk52`proxies your package manager's {bold italic install} command (and yarn's "add" command)`
};

// src/commands/ls.ts
init_esm_shims();
import chalk53 from "chalk";
var command3 = {
  kind: "ls",
  handler: async ({ observations, raw, argv }) => {
    if (!observations.has("packageJson")) {
      console.log(chalk53`- the {italic ls} command is only useful in a directory with a {blue package.json}`);
      process.exit();
    }
    if (argv.length === 0) {
      console.log(chalk53`- in order to run the {italic ls} command, we will need you to choose a dependency of this repo\n`);
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
  description: chalk53`proxies your package manager's {italic ls} / {italic list} command to determine which versions of a dep you have`
};

// src/commands/watch.ts
init_esm_shims();
import chalk54 from "chalk";

// src/commands/autoindex/index.ts
init_esm_shims();

// src/commands/autoindex/parts/index.ts
init_esm_shims();

// src/commands/autoindex/parts/autoindex.ts
init_esm_shims();
import chalk59 from "chalk";
import globby4 from "globby";
import path30, { join as join4 } from "path";

// src/commands/autoindex/private/index.ts
init_esm_shims();

// src/commands/autoindex/private/exclusions.ts
init_esm_shims();

// src/commands/autoindex/private/exportable.ts
init_esm_shims();
import path27 from "path";
import { existsSync as existsSync7, readdirSync } from "fs";
import globby3 from "globby";

// src/commands/autoindex/private/util/index.ts
init_esm_shims();

// src/commands/autoindex/private/util/alreadyHasAutoindexBlock.ts
init_esm_shims();

// src/commands/autoindex/private/util/askHowToHandleMonoRepoIndexing.ts
init_esm_shims();
import inquirer9 from "inquirer";

// src/commands/autoindex/private/util/cleanOldBlockFormat.ts
init_esm_shims();

// src/commands/autoindex/private/util/communicateApi.ts
init_esm_shims();
import chalk55 from "chalk";

// src/commands/autoindex/private/util/createMetaInfo.ts
init_esm_shims();

// src/commands/autoindex/private/util/removeExtension.ts
init_esm_shims();

// src/commands/autoindex/private/util/detectExportType.ts
init_esm_shims();

// src/commands/autoindex/private/util/getExistingMetaInfo.ts
init_esm_shims();

// src/commands/autoindex/private/util/isAutoindexFile.ts
init_esm_shims();
import chalk56 from "chalk";
import { readFileSync as readFileSync4, writeFileSync as writeFileSync5 } from "fs";

// src/commands/autoindex/private/util/isOrphanedIndexFile.ts
init_esm_shims();
import { readFileSync as readFileSync5 } from "fs";

// src/commands/autoindex/private/util/noDifference.ts
init_esm_shims();

// src/commands/autoindex/private/util/nonBlockContent.ts
init_esm_shims();

// src/commands/autoindex/private/reference/index.ts
init_esm_shims();

// src/commands/autoindex/private/reference/constants.ts
init_esm_shims();
var comment = "//";
var noteIndent = `${comment} ${" ".repeat(0)}`;
var bulletLine = `${comment}${" ".repeat(4)}- `;
var bulletIndent = `${comment}${" ".repeat(20)}      `;
var info = [
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
var AUTOINDEX_INFO_MSG = info.join("\n");

// src/commands/autoindex/private/reference/types.ts
init_esm_shims();
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

// src/commands/autoindex/private/util/replaceRegion.ts
init_esm_shims();

// src/commands/autoindex/private/util/structurePriorAutoindexContent.ts
init_esm_shims();

// src/commands/autoindex/private/util/timestamp.ts
init_esm_shims();
import { format as format2 } from "date-fns";

// src/commands/autoindex/private/util/unexpectedContent.ts
init_esm_shims();

// src/commands/autoindex/private/processFiles.ts
init_esm_shims();
import chalk57 from "chalk";
import { readFileSync as readFileSync6, writeFileSync as writeFileSync6 } from "fs";
import path28 from "path";

// src/commands/autoindex/private/watchHandler.ts
init_esm_shims();
import chalk58 from "chalk";
import path29 from "path";

// src/commands/autoindex/private/export-formats/index.ts
init_esm_shims();

// src/commands/autoindex/private/export-formats/defaultExports.ts
init_esm_shims();

// src/commands/autoindex/private/export-formats/exportTemplate.ts
init_esm_shims();

// src/commands/autoindex/private/export-formats/namedExports.ts
init_esm_shims();

// src/commands/autoindex/private/export-formats/namedOffsetExports.ts
init_esm_shims();

// src/commands/autoindex/parts/autoindex.ts
import { watch } from "chokidar";

// src/commands/autoindex/parts/description.ts
init_esm_shims();
import chalk60 from "chalk";
var autoindex = chalk60`{bgWhite {black autoindex }}`;
var description = {
  short: chalk60`Automates the building of {italic index.ts} files to aggregate folder's content`,
  complete: chalk60`Automates the building of {italic index} files; if you include a comment starting with {bold {yellow // #autoindex}} in a index file it will be auto-indexed when calling {blue do autoindex}.
  
By default ${autoindex} will assume that you are using {italic named} exports but this can be configured to what you need. Options are: {italic named, default,} and {italic named-offset}. To configure, simply add something like {bold {yellow // #autoindex:default}} to your file.

If you need to exclude certain files you can state the exclusions after the autoindex declaration: {bold {yellow // #autoindex, exclude:a,b,c}}`
};

// src/commands/autoindex/parts/options.ts
init_esm_shims();
import chalk61 from "chalk";
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
    description: chalk61`by default VueJS SFC files will be extracted as a default import but this can be turned off with this flag`
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
    description: chalk61`this option can be used in monorepos to avoid the interactive dialog and always set the scope of autoindex to ALL packages`
  },
  watch: {
    alias: "w",
    type: Boolean,
    group: "local",
    description: chalk61`watches for changes and runs {italic autoindex} when detected`
  },
  preserveExtension: {
    alias: "p",
    type: Boolean,
    group: "local",
    description: chalk61`exports -- by default -- will {italic not} include the file's {blue .js} extension but sometimes with ES modules you want to include this. If you do then you should set this flag.`
  }
};

// src/commands/awsid/index.ts
init_esm_shims();

// src/commands/awsid/parts/index.ts
init_esm_shims();

// src/commands/awsid/parts/awsid.ts
init_esm_shims();
import chalk62 from "chalk";

// src/commands/awsid/private/index.ts
init_esm_shims();

// src/commands/awsid/private/askUser.ts
init_esm_shims();
import { prompt } from "inquirer";

// src/commands/awsid/parts/description.ts
init_esm_shims();

// src/commands/awsid/parts/examples.ts
init_esm_shims();

// src/commands/awsid/parts/options.ts
init_esm_shims();

// src/commands/awsid/parts/syntax.ts
init_esm_shims();
import chalk63 from "chalk";
var syntax = chalk63`yarn do {bold awsid} < {italic profile-name} | all >`;

// src/commands/build/index.ts
init_esm_shims();

// src/commands/build/parts/index.ts
init_esm_shims();

// src/commands/build/parts/build.ts
init_esm_shims();
import chalk67 from "chalk";

// src/commands/build/util/index.ts
init_esm_shims();

// src/commands/build/util/getBuildEnvironment.ts
init_esm_shims();

// src/commands/build/util/processLambdaFns.ts
init_esm_shims();
import chalk64 from "chalk";

// src/shared/file/lintfix.ts
init_esm_shims();
var import_shelljs2 = __toModule(require_shell());

// src/commands/build/util/processStepFns.ts
init_esm_shims();
import chalk65 from "chalk";

// src/commands/build/util/reportOnFnConfig.ts
init_esm_shims();

// src/commands/build/util/serverlessTranspilation.ts
init_esm_shims();
import chalk66 from "chalk";
import matcher from "matcher";

// src/commands/build/parts/description.ts
init_esm_shims();

// src/commands/build/parts/options.ts
init_esm_shims();

// src/commands/deploy/index.ts
init_esm_shims();

// src/commands/deploy/parts/index.ts
init_esm_shims();

// src/commands/deploy/parts/deploy.ts
init_esm_shims();

// src/commands/endpoints/index.ts
init_esm_shims();

// src/commands/endpoints/parts/index.ts
init_esm_shims();

// src/commands/endpoints/parts/description.ts
init_esm_shims();

// src/commands/endpoints/parts/endpoints.ts
init_esm_shims();
import { table as table2 } from "table";
import chalk68 from "chalk";

// src/commands/endpoints/parts/options.ts
init_esm_shims();

// src/commands/fns/index.ts
init_esm_shims();

// src/commands/fns/parts/index.ts
init_esm_shims();

// src/commands/fns/parts/fns.ts
init_esm_shims();
import chalk70 from "chalk";
import { omit as omit3 } from "native-dash";
import { table as table3 } from "table";

// src/commands/fns/parts/tables.ts
init_esm_shims();
import chalk69 from "chalk";

// src/commands/fns/parts/description.ts
init_esm_shims();

// src/commands/fns/parts/options.ts
init_esm_shims();
import chalk71 from "chalk";
var options7 = {
  forceBuild: {
    alias: "f",
    type: Boolean,
    group: "local",
    description: chalk71`by default functions will be derived from {italic serverless.yml} but if you are in a {italic typescript-microservice} project you can force a rebuild prior to listing the functions`
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

// src/commands/image/index.ts
init_esm_shims();
import chalk74 from "chalk";

// src/commands/image/parts/index.ts
init_esm_shims();

// src/commands/image/parts/handler.ts
init_esm_shims();
import { asyncExec as asyncExec5 } from "async-shelljs";
import chalk72 from "chalk";
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
        log.info(chalk72`- the valid sub-commands for {blue dd image} are: {italic config, optimize,} and {italic watch}`);
      }
      break;
    default:
      log.shout(subCommand ? chalk72`the subcommand '${subCommand}' is not known!` : chalk72`the {bold {yellow image}} command expects a {italic sub-command}`);
      await asyncExec5(`dd image --help`);
  }
  await api.close();
};

// src/commands/image/parts/options.ts
init_esm_shims();
import chalk73 from "chalk";
var options8 = {
  force: {
    alias: "f",
    type: Boolean,
    group: "local",
    description: chalk73`Force a full rebuild of the image cache as well as converted images`
  }
};

// src/commands/image/index.ts
var command4 = {
  kind: "image",
  handler: handler7,
  description: "Provides an image optimization solution leveraging image resizing, blurring, and more.",
  syntax: chalk74`dd image [ {italic sub-command} ] [ {italic options} ]`,
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

// src/commands/info/index.ts
init_esm_shims();
import chalk79 from "chalk";

// src/commands/info/parts/index.ts
init_esm_shims();

// src/commands/info/parts/otherPackages.ts
init_esm_shims();
import chalk75 from "chalk";
import { isNpmInfoRepository } from "common-types";

// src/commands/info/parts/thisRepo.ts
init_esm_shims();
import { asyncExec as asyncExec7 } from "async-shelljs";
import chalk78 from "chalk";
import path31 from "path";
import { format as format3, parseISO } from "date-fns";
import { table as table4 } from "table";

// src/commands/info/parts/components/monorepo.ts
init_esm_shims();
import chalk77 from "chalk";

// src/shared/monorepo/getLernaPackages.ts
init_esm_shims();
import { asyncExec as asyncExec6 } from "async-shelljs";
import chalk76 from "chalk";
import parse6 from "destr";
import { join as join5 } from "path";

// src/commands/info/parts/components/index.ts
init_esm_shims();

// src/commands/invoke/index.ts
init_esm_shims();

// src/commands/invoke/parts/index.ts
init_esm_shims();

// src/commands/invoke/parts/invoke-meta.ts
init_esm_shims();

// src/commands/invoke/parts/invoke.ts
init_esm_shims();
import chalk80 from "chalk";
import { asyncExec as asyncExec8 } from "async-shelljs";

// src/commands/latest/index.ts
init_esm_shims();

// src/commands/latest/parts/index.ts
init_esm_shims();

// src/commands/latest/parts/description.ts
init_esm_shims();

// src/commands/latest/parts/latest.ts
init_esm_shims();
import chalk81 from "chalk";

// src/commands/latest/parts/options.ts
init_esm_shims();
import chalk82 from "chalk";
var options10 = {
  repo: {
    alias: "r",
    type: String,
    group: "local",
    description: chalk82`by default the "latest" command works off the current working dirs repo but you can specify a foreign npm repo and get the latest of that repo`
  }
};

// src/commands/layers/index.ts
init_esm_shims();

// src/commands/layers/parts/index.ts
init_esm_shims();

// src/commands/layers/parts/description.ts
init_esm_shims();

// src/commands/layers/parts/layers.ts
init_esm_shims();
import chalk83 from "chalk";
var META_LINK_MSG = chalk83`{dim - the results rely on meta-data tagging; check out this link for more info:\n      {blueBright https://github.com/inocan-group/do-devops/docs/layer-meta.md}}\n`;

// src/commands/madge/index.ts
init_esm_shims();

// src/commands/madge/madge.ts
init_esm_shims();
import { exec as exec4 } from "async-shelljs";
import chalk85 from "chalk";

// src/commands/madge/parts/options.ts
init_esm_shims();
import chalk84 from "chalk";
var options11 = {
  circular: {
    type: Boolean,
    alias: "c",
    group: "local",
    description: chalk84`Madge's {bold {italic circular}} circular reference checker`
  },
  orphans: {
    type: Boolean,
    alias: "o",
    group: "local",
    description: chalk84`Madge's {bold {italic orphans}} checker which shows which modules no one is depending on`
  },
  leaves: {
    type: Boolean,
    alias: "l",
    group: "local",
    description: chalk84`Madge's {bold {italic leaves}} checker which shows modules with no dependencies`
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
    description: chalk84`layout engine for graph; choices are: {dim {italic dot, neato, fdp, sfdp, twopi, circo}}`
  },
  "include-npm": {
    type: Boolean,
    group: "local",
    description: "include shallow NPM modules (default: false)"
  },
  extensions: {
    type: String,
    group: "local",
    description: chalk84`comma separated string of valid file extensions (uses {bold {italic js,ts}} as a default)`
  }
};

// src/commands/madge/madge.ts
var command5 = {
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
        log.info(chalk85`- ${emoji.warn} you passed in {red ${opts.layout}} for a {italic layout}; this will likely not be recognized by {blue madge} CLI`);
        log.info(chalk85`{gray - valid layouts include: {italic ${valid.join(", ")}}}`);
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
      const which = await askListQuestion(chalk85`Which {italic Madge} command(s) would you like to run?`, ["circular", "summary", "orphans", "leaves"]);
      opts[which] = true;
    }
    if (opts.circular) {
      const cmd = `pnpx madge ${dir} --circular ${flags.join(" ")}`;
      log.info(chalk85`\n- running {bold madge} with following command: {blue ${cmd}}`);
      const response = exec4(cmd);
      if (response.code !== 0) {
        process.exit(response.code);
      }
    }
    if (opts.summary) {
      const cmd = `npx madge ${dir} --summary ${flags.join(" ")}`;
      log.info(chalk85`\n- running {bold madge} with following command: {blue ${cmd}}`);
      const response = exec4(cmd);
      if (response.code !== 0) {
        process.exit(response.code);
      }
    }
    if (opts.orphans) {
      const cmd = `npx madge ${dir} --orphans ${flags.join(" ")}`;
      log.info(chalk85`\n- running {bold madge} with following command: {blue ${cmd}}`);
      const response = exec4(cmd);
      if (response.code !== 0) {
        process.exit(response.code);
      }
    }
    if (opts.leaves) {
      const cmd = `npx madge --leaves ${flags.join(" ")}`;
      log.info(chalk85`\n- running {bold madge} with following command: {blue ${cmd}}`);
      const response = exec4(cmd);
      if (response.code !== 0) {
        process.exit(response.code);
      }
    }
    return;
  },
  description: chalk85`provides a proxy of the highly useful {bold madge} utilities; by default running across all javascript and typescript files in the {blue src} directory.`,
  options: options11
};

// src/commands/outdated/index.ts
init_esm_shims();

// src/commands/pkg/index.ts
init_esm_shims();

// src/commands/pkg/parts/index.ts
init_esm_shims();

// src/commands/pkg/parts/pkg.ts
init_esm_shims();
import chalk86 from "chalk";
import { asyncExec as asyncExec9 } from "async-shelljs";

// src/commands/pkg/parts/pkg-meta.ts
init_esm_shims();
import chalk87 from "chalk";
var description10 = chalk87`Package up resources for {bold Serverless} publishing but do not actually {italic deploy}.`;
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
    description: chalk87`by default assets are saved to the {italic .serverless} directory but you can change this to a different directory if you like.`
  },
  validate: {
    type: Boolean,
    group: "local",
    description: chalk87`after the package is completed the {bold cloudformation} template can be validated`
  }
};

// src/commands/scaffold/index.ts
init_esm_shims();

// src/commands/scaffold/parts/index.ts
init_esm_shims();

// src/commands/scaffold/parts/meta.ts
init_esm_shims();

// src/commands/scaffold/parts/scaffold.ts
init_esm_shims();
import chalk96 from "chalk";
import { asyncExec as asyncExec10 } from "async-shelljs";

// src/shared/file/utility/index.ts
init_esm_shims();

// src/shared/file/utility/diffFiles.ts
init_esm_shims();
import chalk88 from "chalk";
import diff from "diff";

// src/shared/file/utility/directoryFiles.ts
init_esm_shims();
import { readdirSync as readdirSync2, lstatSync } from "fs";
import path32 from "path";

// src/shared/file/utility/fileIncludes.ts
init_esm_shims();
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
init_esm_shims();
import { stat } from "fs";
import path33 from "path";
import { promisify as promisify3 } from "util";
var info2 = promisify3(stat);

// src/shared/file/utility/getAllFilesOfType.ts
init_esm_shims();
import { sync as sync5 } from "globby";
import path34 from "path";

// src/shared/file/utility/getExportsFromFile.ts
init_esm_shims();
import chalk89 from "chalk";
import path35 from "path";

// src/shared/file/utility/getFileComponents.ts
init_esm_shims();
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
init_esm_shims();
import globby5 from "globby";

// src/shared/file/utility/getSubdirectories.ts
init_esm_shims();
import path36 from "path";
import { readdirSync as readdirSync3, lstatSync as lstatSync2 } from "fs";
function getSubdirectories(dir) {
  try {
    const files = readdirSync3(dir);
    return files.filter((f) => {
      const stats = lstatSync2(path36.posix.join(dir, f));
      return stats.isDirectory();
    });
  } catch (error) {
    throw new DevopsError(`Attempt to get files from the directory "${dir}" failed: ${error.message}`, "do-devops/directoryFiles");
  }
}

// src/shared/file/utility/isValidServerlessTs.ts
init_esm_shims();
import chalk90 from "chalk";

// src/shared/file/utility/symlinks.ts
init_esm_shims();
import { readlinkSync } from "fs";
import path37 from "path";

// src/shared/file/utility/templateDirCopy.ts
init_esm_shims();
import path38 from "path";

// src/shared/file/utility/templateFileCopy.ts
init_esm_shims();
import path49 from "path";

// src/shared/file/base-paths/index.ts
init_esm_shims();

// src/shared/file/base-paths/currentDirectory.ts
init_esm_shims();
import path39 from "path";

// src/shared/file/relativePath.ts
init_esm_shims();
function toRelativePath(path61, base) {
  return path61.replace(base || process.cwd(), "").replace(/^\//, "");
}

// src/shared/file/base-paths/currentDirectory.ts
function currentDirectory(offset, opts = {}) {
  const base = offset ? path39.posix.join(process.cwd(), offset) : process.cwd();
  return opts.base ? toRelativePath(base, opts.base) : base;
}

// src/shared/file/base-paths/executionDirectory.ts
init_esm_shims();
import path40 from "path";

// src/shared/stack/index.ts
init_esm_shims();

// src/shared/stack/getCaller.ts
init_esm_shims();
import callsites from "callsites";

// src/shared/file/base-paths/homeDirectory.ts
init_esm_shims();
import path41 from "path";
import { homedir } from "os";
function homeDirectory(offset, opts = {}) {
  const home = offset ? path41.posix.join(homedir(), offset) : homedir();
  return opts.base ? toRelativePath(home, opts.base) : home;
}

// src/shared/file/base-paths/libraryDirectory.ts
init_esm_shims();
import path42 from "path";

// src/shared/file/base-paths/parentDirectory.ts
init_esm_shims();
import path43 from "path";
function parentDirectory(offset, opts = {}) {
  const cwd3 = path43.posix.join(process.cwd(), "../");
  const base = offset ? path43.posix.join(cwd3, offset) : cwd3;
  return opts.base ? toRelativePath(base, opts.base) : base;
}

// src/shared/file/base-paths/repoDirectory.ts
init_esm_shims();
import chalk91 from "chalk";
import path46, { join as join6 } from "path";

// src/shared/file/existance/fileExists.ts
init_esm_shims();
import { existsSync as existsSync8 } from "fs";
import { homedir as homedir3 } from "os";
import path45 from "path";

// src/shared/file/helpers/index.ts
init_esm_shims();

// src/shared/file/helpers/interpolateFilepath.ts
init_esm_shims();
import { homedir as homedir2 } from "os";
import path44 from "path";
function interpolateFilePath(filename) {
  if (filename.slice(0, 2) === "~/") {
    filename = path44.posix.join(homedir2(), filename.slice(1));
  }
  if (filename.slice(0, 2) === "./") {
    filename = path44.posix.join(process.cwd(), filename.slice(2));
  }
  return filename;
}

// src/shared/file/existance/fileExists.ts
function fileExists(file) {
  file = interpolateFilePath(file);
  if (file.slice(0, 1) === "~") {
    file = path45.posix.join(homedir3(), file.slice(1));
  }
  return existsSync8(file);
}

// src/shared/file/base-paths/repoDirectory.ts
function repoDirectory(offset, opts = {}) {
  const start = offset ? path46.posix.join(process.cwd(), offset) : process.cwd();
  if (fileExists(currentDirectory("package.json"))) {
    return currentDirectory(offset);
  }
  const dir = findPackageJson(parentDirectory());
  if (!dir) {
    throw new DevopsError(chalk91`Attempt to locate the root of the repo for the current directory failed. No "package.json" was found above the {blue ${start}} directory`, "directory/not-found");
  }
  const filename = join6(dir, offset ? offset : "");
  return opts.base ? toRelativePath(filename, opts.base) : filename;
}

// src/shared/file/crud/index.ts
init_esm_shims();

// src/shared/file/crud/readAndParseFile.ts
init_esm_shims();

// src/shared/file/crud/readFile.ts
init_esm_shims();
import chalk92 from "chalk";
import { readFileSync as readFileSync7 } from "fs";

// src/shared/file/existance/filesExist.ts
init_esm_shims();
import { existsSync as existsSync9 } from "fs";
import { homedir as homedir4 } from "os";
import path47 from "path";
function filesExist(...files) {
  const exists3 = [];
  for (let f of files) {
    if (![".", "/", "~"].includes(f.slice(0, 1))) {
      f = path47.posix.join(process.cwd(), f);
    }
    if (f.slice(0, 1) === "~") {
      f = path47.posix.join(homedir4(), f.slice(1));
    }
    if (existsSync9(f)) {
      exists3.push(f);
    }
  }
  return exists3.length > 0 ? exists3 : false;
}

// src/shared/file/crud/readFile.ts
function readFile(filename) {
  filename = interpolateFilePath(filename);
  try {
    return filesExist(filename) ? readFileSync7(filename, { encoding: "utf-8" }) : void 0;
  } catch (error) {
    console.log(chalk92`{red - ${emoji.poop} ran into a problem reading file {blue ${filename}}.} Error message: ${error.message}`);
    console.log(chalk92`- Stack:{dim \n${error.stack}}`);
    process.exit(1);
  }
}

// src/shared/file/crud/readAndParseFile.ts
import parse7 from "destr";

// src/shared/file/crud/readYamlConfig.ts
init_esm_shims();
import chalk93 from "chalk";
import { readFileSync as readFileSync8 } from "fs";
import { load as load2 } from "js-yaml";

// src/shared/file/crud/removeFile.ts
init_esm_shims();
import { lstatSync as lstatSync4, rmSync } from "fs";

// src/shared/file/existance/index.ts
init_esm_shims();

// src/shared/file/existance/dirExists.ts
init_esm_shims();
import { existsSync as existsSync10, lstatSync as lstatSync3 } from "fs";
function dirExists(dir, ignoreSymLink = false) {
  dir = interpolateFilePath(dir);
  const exists3 = existsSync10(dir);
  if (!exists3) {
    return false;
  }
  const info3 = lstatSync3(dir);
  const isSymLink = info3.isSymbolicLink();
  const isDirectory = info3.isDirectory();
  if (!isDirectory) {
    throw new DevopsError(`The test to see if the path "${dir}" as a directory failed because that path exists but it is NOT a directory!`, "dir/exists-not-dir");
  }
  return !isSymLink || ignoreSymLink;
}

// src/shared/file/existance/ensureDirectory.ts
init_esm_shims();
import {
  exists,
  mkdir
} from "fs";
import { promisify as promisify4 } from "util";
var exists2 = promisify4(exists);
var mkdir2 = promisify4(mkdir);
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
  const stat2 = lstatSync4(filename);
  if (!stat2.isFile()) {
    throw new DevopsError(`Can not remove the file "${filename}" as it is not a file!`, "removal-failed/not-file");
  }
  try {
    rmSync(filename);
  } catch (error) {
    throw new DevopsError(`Problem encountered trying to remove file "${filename}": ${error.message}`, "removal-failed/other");
  }
}

// src/shared/file/crud/write.ts
init_esm_shims();
import { mkdirSync as mkdirSync2, writeFileSync as writeFileSync7 } from "fs";
import chalk94 from "chalk";
import path48 from "path";
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
      throw new DevopsError(chalk94`The file "${filename}" already exists and the {italic overwrite} flag was not set. Write was not allowed.`, "do-devops/file-exists");
    }
    if (!dirExists(path48.dirname(filename))) {
      mkdirSync2(path48.dirname(filename), { recursive: true });
    }
    writeFileSync7(filename, content, {
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

// src/shared/file/utility/tscValidation.ts
init_esm_shims();
var import_shelljs3 = __toModule(require_shell());
import chalk95 from "chalk";

// src/commands/ssm/index.ts
init_esm_shims();

// src/commands/ssm/parts/index.ts
init_esm_shims();

// src/commands/ssm/parts/commands.ts
init_esm_shims();

// src/commands/ssm/parts/description.ts
init_esm_shims();
import chalk97 from "chalk";

// src/commands/ssm/parts/examples.ts
init_esm_shims();

// src/commands/ssm/parts/options.ts
init_esm_shims();
import chalk98 from "chalk";
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
    description: chalk98`force a {italic set} operation to complete even when the variable being set alread exists`
  },
  base64: {
    type: Boolean,
    group: "local",
    description: chalk98`adding this flag will encode with base64 when adding and decode from base64 to utf-8 when getting`
  }
};

// src/commands/ssm/parts/ssm.ts
init_esm_shims();
import chalk103 from "chalk";

// src/commands/ssm/private/index.ts
init_esm_shims();

// src/commands/ssm/private/subCommands/index.ts
init_esm_shims();

// src/commands/ssm/private/subCommands/get.ts
init_esm_shims();
import chalk99 from "chalk";
import { fromBase64 } from "native-dash";
import { SSM } from "aws-ssm";
import { format as format4 } from "date-fns";
import { table as table5 } from "table";

// src/commands/ssm/private/subCommands/list.ts
init_esm_shims();
import chalk100 from "chalk";
import process4 from "process";
import { format as format5 } from "date-fns";
import { table as table6 } from "table";
import { SSM as SSM2 } from "aws-ssm";

// src/commands/ssm/private/subCommands/set.ts
init_esm_shims();
import chalk101 from "chalk";
import { SSM as SSM3 } from "aws-ssm";
import { toBase64 } from "native-dash";

// src/commands/ssm/private/completeSsmName.ts
init_esm_shims();
import chalk102 from "chalk";

// src/commands/ssm/parts/subCommands.ts
init_esm_shims();

// src/commands/ssm/parts/syntax.ts
init_esm_shims();

// src/commands/test/index.ts
init_esm_shims();

// src/commands/test/parts/index.ts
init_esm_shims();

// src/commands/test/parts/description.ts
init_esm_shims();

// src/commands/test/parts/examples.ts
init_esm_shims();

// src/commands/test/parts/options.ts
init_esm_shims();

// src/commands/test/parts/test.ts
init_esm_shims();
import { exec as exec6 } from "async-shelljs";

// src/commands/upgrade/index.ts
init_esm_shims();

// src/commands/why/index.ts
init_esm_shims();
import chalk104 from "chalk";

// src/shared/core/commands/getCommand.ts
init_esm_shims();

// src/shared/npm/crud/removeDep.ts
init_esm_shims();
var import_shelljs5 = __toModule(require_shell());
import chalk106 from "chalk";
import { omit as omit4 } from "native-dash";

// src/shared/npm/package-json/index.ts
init_esm_shims();

// src/shared/npm/package-json/convertDepDictionaryToArray.ts
init_esm_shims();
function convertDepDictionaryToArray(deps) {
  return Object.keys(deps).map((dep) => ({ name: dep, version: deps[dep] }));
}

// src/shared/npm/package-json/dependencies.ts
init_esm_shims();

// src/shared/npm/package-json/getPackageJson.ts
init_esm_shims();
import fs7 from "fs";
import path50 from "path";
import parse8 from "destr";

// src/shared/npm/package-json/cache/packageJsonCache.ts
init_esm_shims();
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
  const filename = path50.join((pathOverride == null ? void 0 : pathOverride.replace("package.json", "")) || process.cwd(), "package.json");
  if (!fileExists(filename)) {
    throw new DevopsError(`Attempt to get package.json [${filename}] file failed`, "not-ready/missing-package-json");
  }
  const pj = parse8(fs7.readFileSync(filename, { encoding: "utf-8" }));
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
init_esm_shims();
import fu from "find-up";
function findPackageJson(dir) {
  return fu.sync("package.json", { cwd: dir || parentDirectory() });
}

// src/shared/npm/package-json/getExportsFromPackageJson.ts
init_esm_shims();
import { retain } from "native-dash";

// src/shared/npm/package-json/getExternalPackageJson.ts
init_esm_shims();
import { asyncExec as asyncExec11 } from "async-shelljs";
import parse9 from "destr";

// src/shared/npm/package-json/hasDependency.ts
init_esm_shims();

// src/shared/npm/package-json/hasDevDependency.ts
init_esm_shims();

// src/shared/npm/package-json/hasMainExport.ts
init_esm_shims();
import path51 from "path";

// src/shared/npm/package-json/hasModuleExport.ts
init_esm_shims();
import path52 from "path";

// src/shared/npm/package-json/hasScript.ts
init_esm_shims();
function hasScript(script, dep) {
  if (dep) {
    dep = `node_modules/${dep.replace(/\/{0,1}node_modules\/{0,1}/, "")}`;
  }
  const pkg = dep ? getPackageJson(dep) : getPackageJson();
  return Object.keys(pkg.scripts || {}).includes(script);
}

// src/shared/npm/package-json/hasTypings.ts
init_esm_shims();
import path53 from "path";

// src/shared/npm/package-json/pkgDepsInTable.ts
init_esm_shims();
import chalk107 from "chalk";

// src/shared/npm/package-json/savePackageJson.ts
init_esm_shims();
import { writeFile as writeFile4 } from "fs";
import path54 from "path";
import { promisify as promisify5 } from "util";
var write3 = promisify5(writeFile4);

// src/shared/npm/package-manager/index.ts
init_esm_shims();

// src/shared/npm/package-manager/pm-constants.ts
init_esm_shims();
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
init_esm_shims();
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

// src/shared/file/readDataFile.ts
init_esm_shims();
import path55 from "path";
import {
  cwd as cwd2
} from "process";

// src/shared/file/saveFileToHomeDirectory.ts
init_esm_shims();
import { existsSync as existsSync11, writeFileSync as writeFileSync8 } from "fs";
import path56 from "path";

// src/shared/file/saveYamlFile.ts
init_esm_shims();
import chalk108 from "chalk";
import path57 from "path";
import { promisify as promisify6 } from "util";
import { dump as dump2 } from "js-yaml";
import { writeFile as writeFile5 } from "fs";
var write4 = promisify6(writeFile5);

// src/shared/file/stripFileExtension.ts
init_esm_shims();

// src/shared/ast/astParseWithAcorn.ts
function astParseWithAcorn(source) {
  const content = isFilenameNotContent(source) ? readFile(source.filename) : source.content;
  if (!content) {
    throw new DevopsError(`source passed to astParseWithAcron() was not valid`, "ast/invalid-source");
  }
  return parse10(content, {
    parser: __require("recast/parsers/acorn")
  });
}

// src/shared/ast/astParseWithTypescript.ts
init_esm_shims();
import {
  parse as parse11
} from "recast";
import { readFileSync as readFileSync9 } from "fs";
function astParseWithTypescript(filename) {
  const fileContents = readFileSync9(filename, {
    encoding: "utf-8"
  });
  return filename.includes(".ts") ? parse11(fileContents, {
    parser: __require("recast/parsers/typescript")
  }) : parse11(fileContents);
}

// src/shared/ast/findHandlerComments.ts
init_esm_shims();
function findHandlerComments(filename) {
  const ast = astParseWithTypescript(filename);
  const fn = namedExports(ast).find((i) => i.name === "fn");
  const fnComments = fn ? fn.comments.filter((i) => i.leading) : [];
  const handler15 = namedExports(ast).find((i) => i.name === "handler");
  const handlerComments = handler15 ? handler15.comments.filter((i) => i.leading) : [];
  return fnComments.length > 0 ? fnComments : handlerComments.length > 0 ? handlerComments : [];
}

// src/shared/ast/getDefaultExport.ts
init_esm_shims();
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
init_esm_shims();
import chalk109 from "chalk";
import { sync as sync6 } from "globby";
import path58 from "path";
function getValidServerlessHandlers(opts = {}) {
  const allFiles = sync6(path58.join(process.env.PWD || "", "/src/**/*.ts"));
  return allFiles.reduce((agg, curr) => {
    let ast;
    let status = "starting";
    try {
      ast = astParseWithTypescript(curr);
      status = "file-parsed";
      if (!ast.program.body[0].source) {
        if (opts.verbose) {
          console.log(chalk109`{grey - the file {blue ${toRelativePath(curr)}} has no source content; will be ignored}`);
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
      console.log(chalk109`- Error processing  {red ${toRelativePath(curr)}} [s: ${status}]: {grey ${error.message}}`);
      return agg;
    }
  }, []);
}

// src/shared/ast/getValidStepFunctions.ts
init_esm_shims();
import chalk110 from "chalk";
import { sync as sync7 } from "globby";
import path59 from "path";
import { describe } from "native-dash";
function getValidStepFunctions(opts = {}) {
  const allFiles = sync7(path59.join(process.env.PWD || "", "/src/**/*.ts"));
  return allFiles.filter((f) => fileIncludes(f, "StateMachine")).reduce((agg, curr) => {
    let ast;
    let status = "starting";
    try {
      write(getFileComponents(curr).fileWithoutExt + "-acorn.json", astParseWithAcorn({ filename: curr }).program.body.map((i) => ({
        type: i.type,
        description: Object.keys(i).map((k) => describe(k))
      })), { allowOverwrite: true });
      console.log({
        file: curr,
        parsed: getDefaultExport({ filename: curr })
      });
      ast = astParseWithTypescript(curr);
      status = "file-parsed";
      if (!ast.program.body[0].source) {
        if (opts.verbose) {
          console.log(chalk110`{grey - the file {blue ${toRelativePath(curr)}} has no source content; will be ignored}`);
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
      console.log(chalk110`- Error processing  {red ${toRelativePath(curr)}} [s: ${status}]: {grey ${error.message}}`);
      return agg;
    }
  }, []);
}

// src/shared/ast/isTypeBasedObject.ts
init_esm_shims();
import { isNonNullObject as isNonNullObject2 } from "common-types";
function isTypeBasedObject(thing) {
  return isNonNullObject2(thing) && thing.type;
}

// src/shared/ast/namedExports.ts
init_esm_shims();
import { get as get4 } from "native-dash";
function getSpread(node) {
  return get4(node, "argument.name");
}
function getValue(node) {
  switch (node.type) {
    case "Literal":
    case "StringLiteral":
    case "NumericLiteral":
    case "BooleanLiteral":
      return get4(node, "value");
    case "TemplateLiteral":
      return get4(node, "quasis.0.value.cooked");
    case "ObjectExpression":
      return get4(node, "properties", []).reduce((agg, i) => {
        agg[get4(i, "key.name")] = getValue(get4(i, "value"));
        return agg;
      }, {});
    case "ArrayExpression":
      return get4(node, "elements", []).map((i) => getValue(i));
    case "SpreadElement":
      return getSpread(node);
    default:
      console.log("unknown type:", node.type);
      write(`unhandled-node-${node.type}.json`, node, { offsetIfExists: true });
  }
}
function getVariableDeclaration(declaration) {
  const root = get4(declaration, "declarations.0");
  const type = get4(root, "init.type");
  const properties = get4(root, "init.properties", []).map((i) => ({
    name: get4(i, "key.name"),
    value: getValue(get4(i, "value")),
    type: get4(i, "value.type")
  }));
  const params = get4(root, "init.params", []).map((i) => get4(i, "name", ""));
  return __spreadValues(__spreadValues({
    name: get4(root, "id.name"),
    interface: get4(root, "id.typeAnnotation.typeAnnotation.typeName.name"),
    type
  }, properties ? { properties } : {}), params.length > 0 ? { params } : {});
}
function getInterfaceDeclaration(declaration) {
  return {
    name: get4(declaration, "id.name")
  };
}
function namedExports(file) {
  const ast = typeof file === "string" ? astParseWithTypescript(file) : file;
  const namedExports3 = ast.program.body.filter((i) => i.type === "ExportNamedDeclaration");
  const output = [];
  for (const i of namedExports3) {
    const type = get4(i, "declaration.type");
    output.push(__spreadValues({
      type,
      kind: get4(i, "declaration.kind") || type === "TSTypeAliasDeclaration" ? "type" : type === "TSInterfaceDeclaration" ? "interface" : "",
      interface: get4(i, "declaration.declarations.0.id.typeAnnotation.typeAnnotation.typeName.name", null),
      comments: get4(i, "comments", [])
    }, type === "VariableDeclaration" ? getVariableDeclaration(get4(i, "declaration")) : type === "TSInterfaceDeclaration" ? getInterfaceDeclaration(get4(i, "declaration")) : { name: "" }));
  }
  return output;
}

// src/shared/ast/validateWebpackConfig.ts
init_esm_shims();
import path60 from "path";
function validateWebpackConfig(filename = "webpack.config.js") {
  const config = astParseWithTypescript(path60.posix.join(process.cwd(), filename));
  console.log(config.program.body);
}
export {
  addAwsProfile,
  askForAwsProfile,
  askForAwsRegion,
  astParseWithAcorn,
  astParseWithTypescript,
  checkIfAwsInstalled,
  convertProfileToApiCredential,
  findHandlerComments,
  findHandlerConfig,
  getApiGatewayEndpoints,
  getAwsAccountId,
  getAwsDefaultRegion,
  getAwsIdentityFromProfile,
  getAwsLambdaFunctions,
  getAwsLambdaLayers,
  getAwsProfile,
  getAwsProfileDictionary,
  getAwsProfileList,
  getAwsUserProfile,
  getDefaultExport,
  getValidServerlessHandlers,
  getValidStepFunctions,
  hasAwsProfileCredentialsFile,
  isAwsCredentials,
  isAwsProfile,
  isTypeBasedObject,
  namedExports,
  userHasAwsProfile,
  validateWebpackConfig
};
