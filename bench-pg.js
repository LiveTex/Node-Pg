var pg = require('./bin');

pg.init(12, {
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
});

var count = parseInt(process.argv[2]);
var query = "SELECT NOW()";

var r = 0;
function callback(err, res) {
	r++;

	//console.log(r, err, res);
	if (r === count) {
		console.log('node-pg: ' + count + '\t' + (Date.now() - t));
		process.exit();
	}
}

var t = Date.now();
var i = 0;
while (i < count) {
	pg.exec(query, callback);

	/*if (i === 3) {
		pg.destroy();
	}*/

	i++;
}
/*
pg.init(12, {
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
});*/