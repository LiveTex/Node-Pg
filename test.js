/*var querystring = require('querystring');
console.log(querystring.stringify({
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
}));*/

var __pg = require('./bin/pg.node');

/*


var connection = __pg.connect(querystring.stringify({
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
}, ' '), function(isBroken, error, result) {
	console.log(arguments);
});


__pg.exec(connection, "SELECT NOW()");
__pg.exec(connection, "SELECT NOW()");
__pg.exec(connection, "SELECT NOW()");


__pg.disconnect(connection);


*/