


/**
 * @namespace
 */
var pg = {};


/**
 * @const
 * @type {string}
 */
pg.VERSION = '';


/**
 * @param {number} size
 * @param {!Object} options
 * @param {number=} opt_defferingTime
 */
pg.init = function(size, options, opt_defferingTime) {};


/**
 * @param {string} query
 * @param {function(Error, Array.<!Object.<string, (string|boolean|number|null)>>)} callback
 */
pg.exec = function(query, callback) {};


/**
 * @param {string} query
 * @param {function(Error)} callback
 */
pg.jointExec = function(query, callback) {};


pg.destroy = function() {};
