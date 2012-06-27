
var ii = 0;

/**
 * @param {!pg.QueryQueue} queryQueue
 * @param {string} options
 * @param {function(!pg.Connection, Error)} breakCallback
 * @constructor
 */
pg.Connection = function(queryQueue, options, breakCallback) {
	console.log("connection", ++ii);

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

	/**
	 * @type {boolean}
	 * @private
	 */
	this.__isBusy = false;

	var self = this;

	var descriptor = __pg.connect(options, function(broken, task, err, res) {
		if (broken) {
			console.log("disconnected");

			self.__descriptor = 0;

			breakCallback(self, err);
		} else {
			self.__isBusy = false;
		}

		if (task === 1) {
			console.log("query exec");

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
			console.log("connected");

			self.__descriptor = descriptor;
			self.process();
		}
	});
};


/**
 * @return {boolean}
 */
pg.Connection.prototype.isBusy = function() {
	return this.__isBusy;
};


pg.Connection.prototype.process = function() {
	if (this.__descriptor !== 0 &&
		this.__currentQuery === null) {

		this.__isBusy = true;

		this.__currentQuery = this.__queryQueue.shift();
		if (this.__currentQuery !== null) {

			__pg.exec(this.__descriptor, this.__currentQuery.command);
		} else {
			this.disconnect();
		}
	}
};


pg.Connection.prototype.disconnect = function() {
	if (this.__descriptor !== 0) {
		__pg.disconnect(this.__descriptor);
		this.__descriptor = 0;
	}
};