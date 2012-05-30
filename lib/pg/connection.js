



/**
 * @param {!Array.<!pg.Query>} queryQueue
 * @constructor
 */
pg.Connection = function(queryQueue) {

	/**
	 * @type {number}
	 * @private
	 */
	this.__descriptor = 0;

	/**
	 * @type {!Array.<!pg.Query>}
	 * @private
	 */
	this.__queryQueue = queryQueue;

	/**
	 * @type {pg.Query}
	 * @private
	 */
	this.__currentQuery = null;
};


/**
 * @param {string} options
 */
pg.Connection.prototype.connect = function(options) {
	var self = this;

	this.__descriptor =	__pg.connect(options,
		function(taskId, status, error, result) {
			if (status === pg.ConnectionStatus.BROKEN) {
				self.__descriptor = 0;

				if (error !== null) {
					throw error;
				}
			} else {
				if (taskId === 0) {
					self.process();
				} else {
					var query = self.__currentQuery;
					self.__currentQuery = null;

					self.process();

					if (query !== null) {
						query.apply(error, result);
					}
				}
			}
		}
	);
};


/**
 * @param {function(Error)=} opt_callback
 */
pg.Connection.prototype.disconnect = function(opt_callback) {
	if (this.__descriptor !== 0) {
		__pg.disconnect(this.__descriptor);

		this.__descriptor = 0;
	}
};


pg.Connection.prototype.process = function() {
	if (this.__descriptor !== 0 &&
		this.__currentQuery === null) {


		var next = this.__queryQueue.shift();

		if (next !== undefined) {
			__pg.exec(this.__descriptor, next.getCommand());

			this.__currentQuery = next;
		} else {
			this.__currentQuery = null;
		}
	}
};
