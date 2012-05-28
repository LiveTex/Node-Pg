
exports['Connection'] = pg.Connection;

var connection = new pg.Connection({
	'user':'relive',
	'dbname':'relive',
	'hostaddr':'127.0.0.1',
	'port': 6432
});

connection.addListener('connected', function() {
	connection.exec('SELECT NOW()', function(error, result) {
		console.log(error, result);
	});
});


connection.addListener('error', function(error) {
	console.log(error);
});

connection.connect();