var pg = require('pg');

var count = 10000; //parseInt(process.argv[2]);
var query = "SELECT NOW()";

var options = {
	user: 'relive',
	database: 'relive',
	host: '127.0.0.1',
	port: '6432'
};

var mem = 0;

var r = 0;
var e = 0;
function callback(err, res) {
	if (err !== null) {
		e++;
	}

	mem += process.memoryUsage().heapUsed/1024/1024;

	r++;
	if (r == count) {
		console.log('[NODE-POSTGRES] | R:', r, ' | E:', e, ' | T:', Date.now() - t, ' | M:', (Math.round(mem/r*10)/10));
		process.exit();
	}
}

var t = Date.now();
var i = 0;
while (i < count) {
	pg.connect(options, function(err, client) {
		if (client === null) {
			e++;
			r++;
		} else {
			client.query(query, callback);
		}
	});
	i++;
}



