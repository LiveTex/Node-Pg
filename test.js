/*
console.log();*/

var __pg = require('./bin/pg.node');

var querystring = require('querystring');

var info = querystring.stringify({
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
}, ' ');

var query = "SELECT 1";

var t = Date.now();

__pg.init(20, info, function(error) {
	console.log(error);
});

var r = 0;
var c = 50000;

function callback(result, error) {	
	r++;
	if (r === c) {
		console.log(r, Date.now() - t);
		process.exit();
	}
}


i = 0
while (i < c) {
	__pg.exec(query, callback);
	
	i++;
}
