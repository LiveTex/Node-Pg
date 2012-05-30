var pg = require('./bin');
pg.init(4, {
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
});

var count = 0 + process.argv[2];
var size  = 0 + process.argv[3];

var query = "SELECT * FROM main.request LIMIT " + size;

var r = 0;
function callback(error, result) {
	r++;
	console.log(Date.now() - t, r, result.length);
	if (r == count) {
		console.log(">>> ", Date.now() - t, "УРА!");
		process.exit();
	}
}

var t = Date.now();
var i = 0;
while (i < count) {
	pg.exec(query, callback);

	i++;
}
