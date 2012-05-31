


/**
 * @constructor
 */
pg.QueryQueue = function() {
	/**
	 * @type {!pg.Query}
	 */
	this.origin = new pg.Query('');

	this.origin.prev = this.origin;
	this.origin.next = this.origin;
};


/**
 * @param {!pg.Query} query
 */
pg.QueryQueue.prototype.push = function(query) {
	var tail = this.origin.next;

	tail.prev = query;
	query.next = tail;

	this.origin.next = query;
	query.prev = this.origin;
};


/**
 * @return {pg.Query}
 */
pg.QueryQueue.prototype.shift = function() {
	if (this.origin.prev !== this.origin) {
		var head = this.origin.prev;

		head.prev.next = this.origin;
		this.origin.prev = head.prev;

		head.next = null;
		head.prev = null;

		return head;
	}

	return null;
};