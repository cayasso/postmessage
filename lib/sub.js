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
