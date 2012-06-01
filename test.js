/*var __pg = require('./bin/pg.node');

var querystring = require('querystring');


var connection = __pg.connect(querystring.stringify({
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
}, ' '), function(isBroken, error, result) {
	console.log(arguments);
});

__pg.exec(connection, "SELECT NOW()");

__pg.disconnect(connection);
*/


var arr = [ 1, 2, 3, 1, 4, 5, 6, 6, 8, 1, 5, 6 ];
console.log(arr);
for (var i = 0; i < arr.length; i++) {
	if (arr[i] === 1) {
		arr.splice(i,1);
		i--;
	}
}
console.log(global.arr + "'");

