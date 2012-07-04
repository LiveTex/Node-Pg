var pg = require('../bin');

pg.init(250, {
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '192.168.48.15',
	'password': 'fyfvdcthfd5',
	'port': 6432
});

function getQuery() {
	return "SELECT * FROM main.message WHERE id=" + Math.round(10000*Math.random());
}


function exec() {
	var t = Date.now();

	pg.exec(getQuery(), function() {
		console.log('time: ' + (Date.now() - t));
	});
}

setInterval(function() {

	var i = 0;
	while (i < 3000) {

		setTimeout(function() {
			exec();
		}, 1000 * Math.random());

		i++;
	}

}, 1000);


