/*
console.log();*/

var __pg = require('./bin/pg.node');

var querystring = require('querystring');

var info = querystring.stringify({
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '127.0.0.1',
	'port': 6432
}, ' ');

var query = "SELECT 1"; //"SELECT m.id AS member_id, m.login, m.firstname, m.lastname, m.middlename, m.nickname, (CASE WHEN m.flag_online=false THEN 0 ELSE (CASE WHEN m.flag_busy=false THEN 1 ELSE 2 END) END)::int AS state, m.tag, m.ip, m.photo_url, 'sip:000' || m.id || '@' || c.sip_host AS sip_uri, (CASE WHEN c.flag_voice_account=false::bool THEN 0 ELSE (CASE WHEN m.flag_voice=false THEN 0 ELSE 1 END) END)::int AS flag_voice, TIMESTAMP_TO_UNIXTIME(CASE WHEN mmlt.ctime IS NULL THEN '1970-01-01 03:00:00'::timestamp ELSE mmlt.ctime END) AS msg_ctime FROM main.member AS m INNER JOIN main.member AS c ON (c.id=m.chief_id AND c.flag_valid=true::bool) LEFT OUTER JOIN main.member_msg_last_time AS mmlt ON (mmlt.flag_valid=true::bool AND mmlt.member_id=22299::bigint AND mmlt.other_member_id=m.id) WHERE m.chief_id=20281::bigint AND m.flag_valid=true::bool AND m.flag_operator=true::bool;";


var t = Date.now();

__pg.init(20, info, function(error) {
	console.log(error);
});

var r = 0;
var c = 50000;

function callback(result, error) {	
	r++;
	if (r === c) {
		console.log(r, Date.now() - t);
		process.exit();
	}
}


i = 0
while (i < c) {
	__pg.exec(query, callback);
	
	i++;
}
