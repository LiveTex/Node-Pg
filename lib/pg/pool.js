


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
	 * @type {number}
	 * @private
	 */
	this.__maxSize = 0;

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
 * @param {number} size
 * @param {!Object} options
 */
pg.Pool.prototype.init = function(size, options) {
	this.__connectionInfo = decodeURI(querystring.stringify(options, ' '));
	this.__maxSize = size;
};


/**
 * @return {number}
 */
pg.Pool.prototype.getPoolSize = function() {
	return this.__connections.length;
};


/**
 * @return {number}
 */
pg.Pool.prototype.getQueueSize = function() {
	return this.__queryQueue.length;
};


/**
 * @param {string} query
 * @param {function(Error, pg.ResultTable)=} opt_callback
 */
pg.Pool.prototype.exec = function(query, opt_callback) {
	this.__queryQueue.push(new pg.Query(query, opt_callback));

	var i = 0,
		l = this.__connections.length;

	while (i < l) {
		this.__connections[i].process();
		i++;
	}

	if (this.__queryQueue.length > 0 && this.__maxSize > l) {
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

			if (error !== null) {
				console.error('[ERROR]: Postgres connection error:', error.message);
			}
		}
	);

	this.__connections.push(connection);
};