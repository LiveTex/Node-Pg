var pg = require('pg');



var count =  0 + process.argv[2];
var size  =  0 + process.argv[3];

var query = "SELECT * FROM main.request LIMIT " + size;

var options = {
	user: 'relive',
	database: 'relive',
	host: '127.0.0.1',
	port: '6432'
};

var r = 0;
function callback(error, result) {
	r++;
	console.log(Date.now() - t, r, result.rows.length);
	if (r == count) {
		console.log(">>> ", Date.now() - t, "ХАХА!");
		process.exit();
	}
}

var t = Date.now();
var i = 0;
while (i < count) {
	pg.connect(options, function(err, client) {	client.query(query, callback); });
	i++;
}



