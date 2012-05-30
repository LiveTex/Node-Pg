


/**
 *
 * @param {number} connectionCount
 * @param {!Object} connectionOptions
 * @constructor
 */
pg.Pool = function(connectionCount, connectionOptions) {
	/**
	 * @type {string}
	 * @private
	 */
	this.__connectionString = querystring.stringify(connectionOptions, ' ');

	console.log(this.__connectionString);

	/**
	 * @type {!Array.<!pg.Query>}
	 * @private
	 */
	this.__queryQueue = [];


	/**
	 * @type {Array.<!pg.Connection>}
	 * @private
	 */
	this.__connections = new Array(connectionCount);
};


pg.Pool.prototype.init = function() {
	var i = 0,
		l = this.__connections.length;

	var connection = null;
	while (i < l) {
		connection = new pg.Connection(this.__queryQueue);
		connection.connect(this.__connectionString);

		this.__connections[i] = connection;
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


