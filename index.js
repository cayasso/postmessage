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