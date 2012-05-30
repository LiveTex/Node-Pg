var __pg = require('./bin/pg.node');

var events 		= require('events');
var querystring = require('querystring');
var util 		= require('util');

/*pg.init({
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
});*/

var i = 0;
var r = 0;
var c = 10000;
var t;

//var query = "SELECT NOW()";
var query = "SELECT * FROM main.request LIMIT 100";

function callback(error, result) {
	r++;
	console.log(Date.now() - t, r);
	if (r === c) {
		process.exit();
	}
}

t = Date.now();



var d = __pg.connect(querystring.stringify({
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
}, ' '), function(taskId, status, error, result) {
	__pg.exec(d, query);

	if (taskId !== 0) {
		callback(error, result);
	}
});

var d2 = __pg.connect(querystring.stringify({
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
}, ' '), function(taskId, status, error, result) {
	__pg.exec(d2, query);

	if (taskId !== 0) {
		callback(error, result);
	}
});

var d3 = __pg.connect(querystring.stringify({
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
}, ' '), function(taskId, status, error, result) {
	__pg.exec(d3, query);

	if (taskId !== 0) {
		callback(error, result);
	}
});

var d4 = __pg.connect(querystring.stringify({
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
}, ' '), function(taskId, status, error, result) {
	__pg.exec(d4, query);

	if (taskId !== 0) {
		callback(error, result);
	}
});




