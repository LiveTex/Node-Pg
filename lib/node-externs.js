


/**
 * @type {!Object}
 */
var exports = {};


/**
 * @namespace
 */
var console = {};


/**
 * @param {...*} var_msg
 */
console.log = function(var_msg) {};


/**
 * @namespace
 */
var process = {};


/**
 * @param {function()} callback
 */
process.nextTick = function(callback) {};


/**
 * @namespace
 */
var querystring = {};


/**
 * @param {Object=} obj
 * @param {string=} sep
 * @param {string=} eq
 * @return {string}
 */
querystring.stringify = function(obj, sep, eq) {};


/**
 * @namespace
 */
var util = {};


/**
 * @param {function()} Class
 * @param {function()} Parent
 */
util.inherits = function(Class, Parent) {};


/**
 * @namespace
 */
var events = {};


/**
 * @constructor
 */
events.EventEmitter = function() {};


/**
 * @param {string} type
 * @param {function()} listener
 */
events.EventEmitter.prototype.addListener = function(type, listener) {};

/**
 * @param {string} type
 * @param {function()} listener
 */
events.EventEmitter.prototype.once = function(type, listener) {};


/**
 * @param {string} type
 * @param {function()} listener
 */
events.EventEmitter.prototype.removeListener = function(type, listener) {};


/**
 * @param {string=} opt_type
 */
events.EventEmitter.prototype.removeAllListeners = function(opt_type) {};


/**
 * @param {string} type
 * @param {...} var_args
 */
events.EventEmitter.prototype.emit = function(type, var_args) {};















