


/**
 * Основная область имен модуля.
 * 
 * @namespace
 */
var pg = {};


/** @typedef {Array.<!Object.<string, string>>} */
pg.ResultTable;


/**
 * @type {pg.Pool}
 * @private
 */
pg.__pool = null;

/**
 * @param {number} connectionCount
 * @param {!Object} connectionOptions
 */
pg.init = function(connectionCount, connectionOptions) {
	pg.__getPool().init(connectionCount, connectionOptions);
};


pg.destroy = function() {
	pg.__getPool().destroy();
};


/**
 * @param {string} query
 * @param {function(Error, pg.ResultTable)=} opt_callback
 */
pg.exec = function(query, opt_callback) {
	pg.__getPool().execQuery(new pg.Query(query, opt_callback));
};


/**
 * @private
 * @return {!pg.Pool}
 */
pg.__getPool = function() {
	if (pg.__pool === null) {
		pg.__pool = new pg.Pool();
	}

	return pg.__pool;
};