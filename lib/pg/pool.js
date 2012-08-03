


/**
 * @constructor
 */
pg.Pool = function() {};


/**
 * @param {number} size
 * @param {!Object} options
 */
pg.Pool.prototype.init = function(size, options) {
	__pg.init(20, querystring.unescape(querystring.stringify(options, ' ')), function(error) {
		console.log(error);
	});
};


/**
 * @param {string} query
 * @param {function(Error, pg.ResultTable)} callback
 */
pg.Pool.prototype.exec = function(query, callback) {
	__pg.exec(query, callback);
};


pg.Pool.prototype.destroy = function() {
	__pg.destroy();
};
