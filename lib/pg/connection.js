


/**
 * @param {!pg.QueryQueue} queryQueue
 * @param {string} options
 * @param {function(!pg.Connection, Error)} breakCallback
 * @constructor
 */
pg.Connection = function(queryQueue, options, breakCallback) {

	/**
	 * @type {!pg.QueryQueue}
	 * @private
	 */
	this.__queryQueue = queryQueue;

	/**
	 * @type {pg.Query}
	 * @private
	 */
	this.__currentQuery = null;

	var self = this;

	/**
	 * @type {number}
	 * @private
	 */
	this.__descriptor = __pg.connect(options, function(broken, task, err, res) {
		if (broken) {
			self.__descriptor = 0;

			breakCallback(self, err);
		}

		if (task === 1) {
			var query = self.__currentQuery;
			self.__currentQuery = null;

			self.process();

			process.nextTick(function () {
				if (query !== null) {
					query.callback(err, res);
					query.callback = null;
				}
			});

		} else if (task === 0 && !broken) {
			self.process();
		}
	});
};

pg.Connection.prototype.process = function() {
	if (this.__descriptor !== 0 &&
		this.__currentQuery === null) {

		this.__currentQuery = this.__queryQueue.shift();
		if (this.__currentQuery !== null) {
			__pg.exec(this.__descriptor, this.__currentQuery.command);
		} else {
			this.disconnect()
		}
	}
};


pg.Connection.prototype.disconnect = function() {
	if (this.__descriptor !== 0) {
		__pg.disconnect(this.__descriptor);
		this.__descriptor = 0;
	}
};