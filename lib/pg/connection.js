


/**
 * @param {!Object.<string, string>=} opt_options
 * @extends {events.EventEmitter}
 * @constructor
 */
pg.Connection = function(opt_options) {
	events.EventEmitter.call(this);

	/**
	 * @type {string}
	 * @private
	 */
	this.__optionsString = querystring.stringify(opt_options, ' ');


	/**
	 * @type {number}
	 * @private
	 */
	this.__descriptor = 0;


	/**
	 * @type {function(this:pg.Connection, Error, ?number)}
	 * @private
	 */
	this.__handleConnection = this.__handleConnection.bind(this);
};

util.inherits(pg.Connection, events.EventEmitter);

/**
 *
 * @param {!Object.<string, string>=} opt_options
 */
pg.Connection.prototype['connect'] = function(opt_options) {
	if (opt_options !== undefined) {
		this.__optionsString = querystring.stringify(opt_options, ' ');
	}

	__pg.connect(this.__optionsString, this.__handleConnection);
};


/**
 * @param {string} query
 * @param {function(Error, Array.<!Object.<string, string>>)} callback
 */
pg.Connection.prototype['exec'] = function(query, callback) {
	__pg.exec(this.__descriptor, query, callback);
};


/**
 * @return {boolean}
 */
pg.Connection.prototype['isBusy'] = function() {
	return __pg.isBusy(this.__descriptor);
};


/**
 * @return {boolean}
 */
pg.Connection.prototype['isValid'] = function() {
	return __pg.isValid(this.__descriptor);
};


pg.Connection.prototype['disconnect'] = function() {
	__pg.disconnect(this.__descriptor);
};

/**
 * @param {Error} error
 * @param {?number} descriptor
 * @private
 */
pg.Connection.prototype.__handleConnection = function(error, descriptor) {
	if (descriptor !== null) {
		this.__descriptor = descriptor;
		this.emit('connected');
	} else {
		this.emit('error', error);
	}
};