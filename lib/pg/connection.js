



/**
 * @param {!pg.QueryQueue} queryQueue
 * @param {string} options
 * @param {function(!pg.Connection, Error)=} opt_breakCallback
 * @constructor
 */
pg.Connection = function(queryQueue, options, opt_breakCallback) {
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
	 * @type {number}
	 * @private
	 */
	this.__descriptor = 0;

	var breakHandler = function(err) {
		if (opt_breakCallback !== undefined) {
			opt_breakCallback(self, err);
		} else if (err !== null) {
			throw err;
		}
	};

	var descriptor = __pg.connect(options, function(broken, task, err, res) {
		if (task === 1) {
			if (broken) {
				self.__descriptor = 0;
				breakHandler(err);
			}

			var query = self.__currentQuery;
			self.__currentQuery = null;

			self.process();

			process.nextTick(function () {
				if (query !== null) {
					query.callback(err, res);
					query.callback = null;
				}
			});
		} else if (task === 0) {
			if (broken) {
				breakHandler(err);
			} else {
				self.__descriptor = descriptor;

				self.process();
			}
		}
	});
};


pg.Connection.prototype.process = function() {
	if (this.__descriptor !== 0 &&
		this.__currentQuery === null) {

		var next = this.__queryQueue.shift();
		if (next !== null) {
			__pg.exec(this.__descriptor, next.command);
		}

		this.__currentQuery = next;
	}
};



pg.Connection.prototype.disconnect = function() {
	if (this.__descriptor !== 0) {
		__pg.disconnect(this.__descriptor);

		this.__descriptor = 0;
	}
};