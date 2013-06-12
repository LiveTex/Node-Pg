


/**
 * Нативная часть модуля.
 * 
 * @namespace 
 */
var __pg = {};


/**
 * @param {number} size
 * @param {string} options
 * @param {function(string)} callback
 */
__pg.init = function(size, options, callback) {};


/**
 * Запрос в базу данных.
 * 
 * @param {string} query
 * @param {function(string, !Array.<!Object.<string, (number|string|boolean|null)>>)} callback
 */
__pg.exec = function(query, callback) {};


/**
 * 
 */
__pg.destroy = function() {};


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
 * @param {string} str
 * @return {string}
 */
querystring.unescape = function(str) {};



/**
 * @namespace
 */
var console = {};


/**
 * @deprecated
 * @param {...*} var_msg
 */
console.log = function(var_msg) {};


/**
 * @param {...*} var_msg
 */
console.info = function(var_msg) {};


/**
 * @param {...*} var_msg
 */
console.warn = function(var_msg) {};


/**
 * @param {...*} var_msg
 */
console.error = function(var_msg) {};


console.trace = function() {};


/**
 * @param {string} name
 */
console.time = function(name) {};


/**
 * @param {string} name
 */
console.timeEnd = function(name) {};
