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