var pg = require('pg');


var count = parseInt(process.argv[3]);
//var query = process.argv[4]  || "SELECT 1";
var query = "SELECT c.id AS chat_id, c.chat_type_id, c.visitor_id, c.flag_visitor_chat_close, v.firstname, v.email, v.phone, ( CASE WHEN (v.flag_websocket=true) THEN true ELSE CASE WHEN (v.time_websocket_close IS NULL) THEN false ELSE CASE WHEN (timestamp_to_unixtime(v.time_websocket_close) < (timestamp_to_unixtime(NOW()) - 15)) THEN false ELSE true END END END )::int AS flag_online, TIMESTAMP_TO_UNIXTIME(c.ctime) AS ctime, TIMESTAMP_TO_UNIXTIME(c.atime) AS atime, v.flag_valid, v.ip, v.tag, v.site_id, v.visit_count, v.page_count, v.country_name, v.city_name, v.referer AS referrer, v.use_time, c.member_id, (CASE WHEN (ca.callback_url IS NULL) THEN '' ELSE ca.callback_url END)::text AS chat_attr_url, (CASE WHEN (ca.flag_value1 IS NULL) THEN false ELSE ca.flag_value1 END)::bool AS chat_attr1_flag, (CASE WHEN (ca.name1 IS NULL) THEN '' ELSE ca.name1 END)::text AS chat_attr1_name, (CASE WHEN (ca.value1 IS NULL) THEN '' ELSE ca.value1 END)::text AS chat_attr1_value, (CASE WHEN (ca.flag_value2 IS NULL) THEN false ELSE ca.flag_value2 END)::bool AS chat_attr2_flag, (CASE WHEN (ca.name2 IS NULL) THEN '' ELSE ca.name2 END)::text AS chat_attr2_name, (CASE WHEN (ca.value2 IS NULL) THEN '' ELSE ca.value2 END)::text AS chat_attr2_value FROM main.chat AS c INNER JOIN main.visitor_archive AS v ON (v.id=c.visitor_id) LEFT OUTER JOIN main.chat_attr AS ca ON (ca.id=c.chat_attr_value_id AND ca.flag_valid=true::bool) WHERE c.flag_valid=true::bool AND c.flag_open=true::bool AND c.member_id=568::bigint";

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

	console.log(err, res);

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



