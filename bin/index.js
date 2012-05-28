var pg = require('./pg');

/*pg.connect('user=relive dbname=relive hostaddr=127.0.0.1 port=6432', function(error, connection) {
    console.log(error, connection);

	/*pg.exec(connection, 'SELECT * FROM main.member', function(err, result) {
	    console.log(err, result);
	});
	
});*/

console.log(pg.isBusy(null));


/*pg.exec(connection, 'SELECT * FROM main.member', function(err, result) {
    console.log(err, result.length);
});*/

//pg.disconnect(connection);


