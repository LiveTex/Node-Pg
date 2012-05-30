


/**
 * Основная область имен модуля.
 * 
 * @namespace
 */
var pg = {};


/** @typedef {Array.<!Object.<string, string>>} */
pg.ResultTable;


/**
 * @enum
 */
pg.ConnectionStatus = {
	BUSY:   0,
	FREE:   1,
	BROKEN: 2,
	LOADED: 3
};


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
	pg.__pool = new pg.Pool(connectionCount, connectionOptions);
	pg.__pool.init();
};


/**
 * @param {string} query
 * @param {function(Error, pg.ResultTable)} callback
 */
pg.exec = function(query, callback) {
	if (pg.__pool !== null) {
		pg.__pool.execQuery(new pg.Query(query, callback));
	}
};
