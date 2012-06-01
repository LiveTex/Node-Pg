


/**
 * @constructor
 */
pg.Pool = function() {
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
};


/**
 *
 * @param {number} size
 * @param {!Object} options
 * @param {function(Error)=} opt_breakCallback
 */
pg.Pool.prototype['init'] = function(size, options, opt_breakCallback) {
	var info = decodeURI(querystring.stringify(options, ' '));

	var self = this;
	var breakHandler = function(connection, error) {
		var index = self.__connections.indexOf(connection);
		if (index !== -1) {
			self.__connections[index] =
				new pg.Connection(self.__queryQueue, info, breakHandler);
		}

		if (opt_breakCallback !== undefined) {
			opt_breakCallback(error);
		}
	};

	while (this.__connections.length < size) {
		this.__connections.push
			(new pg.Connection(this.__queryQueue, info, breakHandler));
	}
};


/**
 * @param {string} query
 * @param {function(Error, pg.ResultTable)=} opt_callback
 */
pg.Pool.prototype['exec'] = function(query, opt_callback) {
	this.__queryQueue.push(new pg.Query(query, opt_callback));

	var i = 0,
		l = this.__connections.length;

	while (i < l) {
		this.__connections[i].process();

		i++;
	}
};


pg.Pool.prototype['destroy'] = function() {
	while (this.__connections.length > 0) {
		this.__connections.shift().disconnect();
	}
};
