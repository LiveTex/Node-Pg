


/**
 * @constructor
 */
pg.Pool = function() {

	/**
	 * @type {string}
	 * @private
	 */
	this.__connectionInfo = '';

	/**
	 * @type {?function(Error)}
	 * @private
	 */
	this.__breakCallback = null;

	/**
	 * @type {!pg.QueryQueue}
	 * @private
	 */
	this.__queryQueue = new pg.QueryQueue();


	/**
	 * @type {Array.<!pg.Connection>}
	 * @private
	 */
	this.__connections = [];

	/**
	 * @type {number}
	 * @private
	 */
	this.__maxSize = 0;
};


/**
 * @param {number} size
 * @param {!Object} options
 * @param {function(Error)=} opt_breakCallback
 */
pg.Pool.prototype.init = function(size, options, opt_breakCallback) {
	this.__connectionInfo = decodeURI(querystring.stringify(options, ' '));
	this.__breakCallback = opt_breakCallback || null;
	this.__maxSize = size;
};


/**
 * @param {string} query
 * @param {function(Error, pg.ResultTable)=} opt_callback
 */
pg.Pool.prototype.exec = function(query, opt_callback) {
	this.__queryQueue.push(new pg.Query(query, opt_callback));

	var i = 0,
		l = this.__connections.length;

	var allBusy = true;
	while (i < l) {
		if (!this.__connections[i].isBusy()) {
			this.__connections[i].process();

			allBusy = false;
		}

		i++;
	}

	if (allBusy === true && l < this.__maxSize) {
		this.__spawnConnection();
	}
};


pg.Pool.prototype.destroy = function() {
	while (this.__connections.length > 0) {
		this.__connections.shift().disconnect();
	}
};


/**
 * @private
 */
pg.Pool.prototype.__spawnConnection = function() {
	var self = this;
	var connection = new pg.Connection(
		this.__queryQueue, this.__connectionInfo, function(connection, error) {
			var index = self.__connections.indexOf(connection);
			if (index !== -1) {
				self.__connections.splice(index, 1);
			}

			if (self.__breakCallback !== null) {
				self.__breakCallback(error);
			}
		}
	);

	this.__connections.push(connection);
};