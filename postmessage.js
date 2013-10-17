;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-bind/index.js", function(exports, require, module){

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = [].slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

});
require.register("postmessage/lib/pub.js", function(exports, require, module){
/**
 * Expose `Subscriber`.
 */

module.exports = Publisher;

/**
 * Initialize a new `Publisher`.
 *
 * @param {window} win The target window.
 * @api public
 */

function Publisher(target) {
  if (!(this instanceof Publisher)) return new Publisher(target);
  this.defaults().target(target);
}

/**
 * Reset publisher setting (target & origin) to defaults.
 *
 * @return {Publisher} self
 * @api public
 */

Publisher.prototype.defaults = function defaults() {
  this.delay = 600; // to give change to iframe to load
  this._origin = "*";
  this._target = window.parent;
  return this;
};

/**
 * Set the target window object, it defaults to `window`.
 *
 * @param {window} target The target window.
 * @return {Publisher} self
 * @api public
 */

Publisher.prototype.target = function target(target) {
  if (!arguments.length) return this._target;
  this._target = target || this._target;
  return this;
};

/**
 * Set target origin, it default to `*`.
 *
 * @param {String} origin The domain eg. http://mysite.com
 * @return {Publisher} self
 * @api public
 */

Publisher.prototype.origin = function origin(origin) {
  if (!arguments.length) return this._origin;
  this._origin = origin || this._origin;
  return this;
};

/**
 * Send a message to the target origin.
 *
 * @param {Mixed} data The message to send.
 * @param {String} [origin] The domain, its optional.
 * @param {window} [target] The target window, its optional.
 * @return {Publisher} self
 * @api public
 */

Publisher.prototype.send =
Publisher.prototype.publish = function send(data, origin, target) {
  var pub = this, target = pub._target;
  pub.target(target).origin(origin);
  setTimeout(function send (){
    target.postMessage(JSON.stringify(data), pub._origin);
    pub.delay = 0;
  }, pub.delay);
  return this;
};
});
require.register("postmessage/lib/sub.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var bind = require('bind');

/**
 * Expose `Subscriber`.
 */

module.exports = Subscriber;

/**
 * Initialize a new `Subscriber`.
 *
 * @param {window} win A window object
 * @api public
 */

function Subscriber(win) {
  if (!(this instanceof Subscriber)) return new Subscriber(win);
  this.defaults(win);
  this._bind();
}

/**
 * Reset subscriber setting (listeners & origins) to defaults.
 *
 * @return {Subscriber} self
 * @api private
 */

Subscriber.prototype.defaults = function defaults(win) {
  this.fns = [];
  this.origins = [];
  this.win = win || window;
  return this;
};

/**
 * Bind subcriber events.
 *
 * @return {Subscriber} self
 * @api private
 */

Subscriber.prototype._bind = function _bind() {
  this.onmessage = bind(this, 'onmessage');
  this.win.addEventListener('message', this.onmessage, false);
  return this;
};

/**
 * Unbind subcriber events.
 *
 * @return {Subscriber} self
 * @api private
 */

Subscriber.prototype._unbind = function _unbind() {
  this.win.removeEventListener('message', this.onmessage, false);
  return this;
};


/**
 * Called upon incoming message.
 *
 * @param {Event} e
 * @return {Subscriber} self
 * @api private
 */

Subscriber.prototype.onmessage = function onmessage(e) {
  if (this.matches()) {
    for (var i = 0, l = this.fns.length; i < l; ++i) {
      this.fns[i](JSON.parse(e.data), e);
    }
  }
  return this;
};

/**
 * Add origin domains to white list.
 *
 * @param {String} origin The domain eg. http://mysite.com
 * @return {Subscriber} self
 * @api public
 */

Subscriber.prototype.origin = function origin(origin) {
  if ('string' === typeof origin) {
    this.origins.push(origin);
  }
  return this;
};

/**
 * Check if given origin is in white list.
 *
 * @param {String} origin The domain
 * @return {Boolean}
 * @api private
 */

Subscriber.prototype.matches = function matches(origin) {
  var oRE = new RegExp('^(' + this.origins.join('|') + ')$');
  return 0 === this.origins.length || oRE.test(origin);
};

/**
 * Subscribe or register an event handler.
 *
 * @param {Function} fn The callback function.
 * @return {Subscriber} self
 * @api public
 */

Subscriber.prototype.bind =
Subscriber.prototype.subscribe = function binding(fn) {
  if ('function' === typeof fn) {
    fn.id = this.fns.length + 1;
    this.fns.push(fn);
  }
  return this;
};

/**
 * Unregister an event handler.
 *
 * @param {Function} fn The callback function.
 * @return {Subscriber} self
 * @api public
 */

Subscriber.prototype.unbind =
Subscriber.prototype.unsubscribe = function unbinding(fn) {
  if (!arguments.length) {
    this.fns = [];
  } else {
    if ('function' === typeof fn) {
      var fns = this.fns;
      for (var i in fns) {
        if (fns[i] == fn && fn.id === fns[i].id) {
          fns.splice(i, 1);
          break;
        }
      }
    }
  }
  return this;
};

/**
 * Destroy the subscriber.
 *
 * @return {Subscriber} self
 * @api public
 */

Subscriber.prototype.destroy = function destroying() {
  this._unbind();
  this.defaults();
  return this;
};

});
require.register("postmessage/lib/index.js", function(exports, require, module){
/**
 * Expose modules.
 */

module.exports = {
  pub: require('./pub'),
  sub: require('./sub')
};
});
require.register("postmessage/index.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var pm = require('./lib');

/**
 * Expose module.
 */

module.exports = PostMessage;

/**
 * Factory method for getting a post message object.
 *
 * @param {String} type
 * @return {Subcriber|Publisher}
 * @api public
 */

function PostMessage(type){
  return pm[type];
}

/**
 * Expose modules.
 */

PostMessage.Pub = pm.pub;
PostMessage.Sub = pm.sub;
});
require.alias("component-bind/index.js", "postmessage/deps/bind/index.js");
require.alias("component-bind/index.js", "bind/index.js");

require.alias("postmessage/index.js", "postmessage/index.js");

if (typeof exports == "object") {
  module.exports = require("postmessage");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("postmessage"); });
} else {
  this["postmessage"] = require("postmessage");
}})();