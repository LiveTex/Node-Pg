

/**
 * Module namespace.
 *
 * @namespace
 */
var pg = {};


/**
 * Cpp namespace.
 *
 * @namespace
 */
var __pg = require('./pg.node');


/**
 * Table result row definition.
 *
 * @see pg.Table
 * @typedef {Object.<string, (number|string|boolean)>}
 */
pg.Row;


/**
 * Definition of query result table.
 *
 * @typedef {Array.<!pg.Row>}
 */
pg.Table;


/**
 * Definition of function type to handle query execution result.
 *
 * Function argument - query result table.
 *
 * @see pg.Table
 * @typedef {?function(pg.Table)}
 */
pg.ResultHandler;


/**
 * Definition of function type to handle errors.
 *
 * Function arguments are error message string and optional error code.
 *
 * @typedef {?function(string, number=)}
 */
pg.ErrorHandler;


/**
 * Definition of value types for insertion to prepared query.
 *
 * @typedef {?(number|string|boolean)}
 */
pg.PreparedValue;


/**
 * Definition of data object for query preparation.
 *
 * @see pg.PreparedValue
 * @typedef {Object.<string, (!pg.PreparedValue|!Array.<!pg.PreparedValue>)>}
 */
pg.PreparedParams;


/**
 * @type {!RegExp}
 */
pg.__PARAM_EXP = /\$([a-z0-9_]+)/ig;


/**
 * @type {string}
 */
pg.__ESC_SALT = '$seihg304$';


/**
 * Escape strings in sql queries.
 *
 * For string escape we use
 * <a href="http://goo.gl/X43TE">dollar-quoting</a>.
 *
 * @param {string} string Original string.
 * @return {string} Escaped string.
 */
pg.escapeString = function(string) {
  return pg.__ESC_SALT +
      string.replace(/\$/g, '\\$').replace(/\0/ig, '') + pg.__ESC_SALT;
};


/**
 * Escape array of values.
 *
 * Array is casted to string of escaped elements divided by comma.
 *
 * @see pg.escapeString
 * @param {!Array.<!pg.PreparedValue>} array Array of values.
 * @return {string} Escaped strings divided by comma.
 */
pg.escapeArray = function(array) {
  var i = 0,
      l = array.length;

  var result = '';

  while (i < l) {
    var item = array[i];
    if (item !== null && item !== undefined) {

      if (result.length === 0) {
        result = pg.escapeString(item.toString());
      } else {
        result += ',' + pg.escapeString(item.toString());
      }

    }

    i += 1;
  }

  return result;
};


/**
 * Connections pool initialization.
 *
 * @see pg.ErrorHandler
 * @see console.error
 * @param {number} size Pool size - Count of pool connections.
 * @param {!Object} options Connection options. Options must be an object with
 * keys specified in <a href="http://goo.gl/eqPw4">documentation</a>.
 * @param {!pg.ErrorHandler=} opt_errorHandler Connection error handler.
 *    <pre>console.error</pre> will be used by default.
 * return handle
 */
pg.init = function(size, connectionLifetime, options, opt_errorHandler) {
  return __pg.init(size, connectionLifetime, querystring.unescape(
      querystring.stringify(options, ' ')), opt_errorHandler);
};

/**
 * SQL-query executing.
 *
 * @see pg.ResultHandler
 * @see pg.ErrorHandler
 * @param {string} query SQL-query string.
 * @param {!pg.ResultHandler} complete Success result handler.
 * @param {!pg.ErrorHandler} cancel Execution error handler.
 */
pg.exec = function(handle, query, complete, cancel) {
  __pg.exec(handle, query, function(error, result) {
    if (error.length > 0) {
      cancel(error);
    } else {
      complete(result);
    }
  });
};


/**
 * Executes prepared SQL-query.
 *
 * Query to prepare is a query like
 * <pre>SELECT $value1 AS value1, $value2 AS value2</pre>, where
 * <pre>$value1</pre> and <pre>$value2</pre> are placeholders for
 * prepared values of <pre>value1</pre> and <pre>value2</pre>.
 *
 * @see pg.prepareQuery
 * @param {string} query Prepared SQL-query string.
 * @param {!pg.PreparedParams} params Data object for query preparation.
 * @param {!pg.ResultHandler} complete Success result handler.
 * @param {!pg.ErrorHandler} cancel Execution error handler.
 */
pg.execPrepared = function(query, params, complete, cancel) {
  pg.exec(pg.prepareQuery(query, params), complete, cancel);
};


/**
 * Prepare ready-to-use SQL-query.
 *
 * @param {string} query Prepared SQL-query string.
 * @param {!pg.PreparedParams} params Data object for query preparation.
 * @return {string} Ready-to-use SQL-query.
 */
pg.prepareQuery = function(query, params) {

  /**
   * @param {string} placeholder Placeholder.
   * @param {string} name Parameter's name.
   * @return {string} String for replace.
   */
  function replacer(placeholder, name) {
    var param = params[name];

    if (param instanceof Array) {
      return pg.escapeArray(param);
    } else if (typeof param === 'string') {
      return pg.escapeString(param);
    } else if (typeof param === 'number') {
      return isFinite(param) ? String(param) : '0';
    } else if (typeof param === 'boolean') {
      return String(param);
    }

    return '\'\'';
  }

  return query.replace(pg.__PARAM_EXP, replacer);
};

/**
 * Destroy connection pool.
 */
pg.destroy = function(handle) {
   __pg.destroy(handle);
};

