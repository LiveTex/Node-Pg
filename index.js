var __pg = require('./bin/pg.node');


var connection = __pg.connect(
	'user=relive dbname=relive hostaddr=127.0.0.1 port=6432', 
	function(status, err, result, id) {
		console.log(status, err, id);
	}
);

console.log(connection);

console.log(__pg.exec(connection, 'SELECT * FROM main.member'));
console.log(__pg.exec(connection, 'SELECT * FROM main.member'));
console.log(__pg.exec(connection, 'SELECT * FROM main.member'));
console.log(__pg.exec(connection, 'SELECT * FROM main.member'));
console.log(__pg.exec(connection, 'SELECT * FROM main.member'));
console.log(__pg.exec(connection, 'SELECT * FROM main.member'));
console.log(__pg.exec(connection, 'SELECT * FROM main.member'));
console.log(__pg.exec(connection, 'SELECT * FROM main.member'));

console.log(__pg.disconnect(connection));
