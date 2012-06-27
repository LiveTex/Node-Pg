


/**
 * @param {!pg.QueryQueue} queryQueue
 * @param {string} options
 * @param {function(!pg.Connection, Error)} breakCallback
 * @constructor
 */
pg.Connection = function(queryQueue, options, breakCallback) {
	var self = this;

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

	/**
	 * @type {function(!pg.Connection, Error)}
	 * @private
	 */
	this.__breakCallback = breakCallback;

	/**
	 * @type {number}
	 * @private
	 */
	this.__disconnectTimeout = -1;

	/**
	 * @type {number}
	 * @private
	 */
	this.__descriptor = __pg.connect(options, function(broken, task, err, res) {
		if (broken) {
			if (self.__descriptor !== 0) {
				self.__descriptor = 0;
				self.__breakCallback(self, err);
			}
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
			this.__stopDisconnectTimeout();

			__pg.exec(this.__descriptor, this.__currentQuery.command);
		} else {
			this.__startDisconnectTimeout();
		}
	}
};


pg.Connection.prototype.disconnect = function() {
	if (this.__descriptor !== 0) {
		__pg.disconnect(this.__descriptor);

		this.__descriptor = 0;
		this.__breakCallback(this, null);
	}
};


pg.Connection.prototype.__startDisconnectTimeout = function() {
	if (this.__disconnectTimeout === -1) {
		var self = this;
		this.__disconnectTimeout = setTimeout(function() {
			self.disconnect();

			self.__disconnectTimeout = -1;
		}, 1000);
	}

};

pg.Connection.prototype.__stopDisconnectTimeout = function() {
	if (this.__disconnectTimeout !== -1) {
		clearTimeout(this.__disconnectTimeout);

		this.__disconnectTimeout = -1;
	}
};