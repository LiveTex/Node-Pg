

/**
 * @param {string} command
 * @param {function(Error, pg.ResultTable)} opt_callback
 * @constructor
 */
pg.Query = function(command, opt_callback) {

	/**
	 * @type {string}
	 * @private
	 */
	this.__command = command;

	/**
	 * @type {?function(Error, pg.ResultTable)}
	 * @private
	 */
	this.__callback = opt_callback || null;
};


/**
 * @return {string}
 */
pg.Query.prototype.getCommand = function() {
	return this.__command;
};


/**
 * @param {Error} error
 * @param {pg.ResultTable} result
 */
pg.Query.prototype.apply = function(error, result) {
	if (this.__callback !== null) {
		this.__callback(error, result);
		this.__callback = null;
	}

	this.__command = '';
};
