var pg = require('./pg.node');

pg.connect('user=relive dbname=relive hostaddr=127.0.0.1 port=6432', function(error, connection) {
    console.log(error, connection);
    
	console.log(pg.isBusy(connection));

	pg.exec(connection, 'SELECT * FROM main.member', function(err, result) {
	    console.log(err);
	    pg.disconnect(connection);
		console.log(pg.isValid(connection));
	});
	
	console.log(pg.isBusy(connection));
	console.log(pg.isValid(connection));
});

console.log(pg.isBusy(null));
console.log(pg.isValid(null));


/*pg.exec(connection, 'SELECT * FROM main.member', function(err, result) {
    console.log(err, result.length);
});*/

//pg.disconnect(connection);


