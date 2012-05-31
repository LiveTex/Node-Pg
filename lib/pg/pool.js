


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
 */
pg.Pool.prototype.init = function(size, options) {
	var info = decodeURI(querystring.stringify(options, ' '));

	var self = this;
	var breakHandler = function(connection, error) {
		var index = self.__connections.indexOf(connection);
		if (index !== -1) {
			self.__connections[index] =
				new pg.Connection(self.__queryQueue, info, breakHandler);
		}
	};

	var i = 0;
	while (i < size) {
		this.__connections[i] =
			new pg.Connection(this.__queryQueue, info, breakHandler);

		i++;
	}
};


/**
 * @param {!pg.Query} query
 */
pg.Pool.prototype.execQuery = function(query) {
	this.__queryQueue.push(query);

	var i = 0,
		l = this.__connections.length;

	while (i < l) {
		this.__connections[i].process();

		i++;
	}
};


pg.Pool.prototype.destroy = function() {
	while (this.__connections.length > 0) {
		this.__connections.shift().disconnect();
	}
};

