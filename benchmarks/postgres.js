var pg = require('pg');


var count = parseInt(process.argv[3]);
var query = process.argv[4]  || "SELECT 1";

var options = {
	user: 'relive',
	database: 'relive',
	host: process.argv[2],
	port: '6432'
};

var mem = 0;

function exec() {
	pg.connect(options, function(err, client) {
		if (client === null) {
			e++;
			r++;
		} else {
			client.query(query, callback);
		}
	});
}

var r = 0;
var e = 0;
function callback(err, res) {
	exec();

	if (err !== null) {
		e++;
	}

	mem += process.memoryUsage().heapUsed/1024/1024;

	//console.log(res);

	r++;
	if (r == count) {
		console.log('[NODE-POSTGRES] | R:', r, ' | E:', e, ' | T:', Date.now() - t, ' | M:', (Math.round(mem/r*10)/10));
		process.exit();
	}
}


var t = Date.now();
var i = 0;
while (i < count) {
	setTimeout(function() {
		exec();
	}, 100 * Math.sqrt(i));

	i++;
}



