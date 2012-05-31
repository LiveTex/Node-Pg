

/**
 * @param {string} command
 * @param {function(Error, pg.ResultTable)=} opt_callback
 * @constructor
 */
pg.Query = function(command, opt_callback) {

	/**
	 * @type {string}
	 * @private
	 */
	this.command = command;

	/**
	 * @type {?function(Error, pg.ResultTable)}
	 * @private
	 */
	this.callback = null;

	/**
	 * @type {pg.Query}
	 */
	this.next = null;


	/**
	 * @type {pg.Query}
	 */
	this.prev = null;


	if (opt_callback !== undefined) {
		this.callback = opt_callback;
	}
};