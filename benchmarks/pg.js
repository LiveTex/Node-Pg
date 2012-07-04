var pg = require('../bin');

pg.init(20, {
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': process.argv[2],
	'password': 'fyfvdcthfd5',
	'port': 6432
});

var count = parseInt(process.argv[3]);
var query = process.argv[4]  || "SELECT 1";
//var query = "SELECT m.id AS member_id, m.login, m.firstname, m.lastname, m.middlename, m.nickname, (CASE WHEN m.flag_online=false THEN 0 ELSE (CASE WHEN m.flag_busy=false THEN 1 ELSE 2 END) END)::int AS state, m.tag, m.ip, m.photo_url, 'sip:000' || m.id || '@' || c.sip_host AS sip_uri, (CASE WHEN c.flag_voice_account=false::bool THEN 0 ELSE (CASE WHEN m.flag_voice=false THEN 0 ELSE 1 END) END)::int AS flag_voice, TIMESTAMP_TO_UNIXTIME(CASE WHEN mmlt.ctime IS NULL THEN '1970-01-01 03:00:00'::timestamp ELSE mmlt.ctime END) AS msg_ctime FROM main.member AS m INNER JOIN main.member AS c ON (c.id=m.chief_id AND c.flag_valid=true::bool) LEFT OUTER JOIN main.member_msg_last_time AS mmlt ON (mmlt.flag_valid=true::bool AND mmlt.member_id=22299::bigint AND mmlt.other_member_id=m.id) WHERE m.chief_id=20281::bigint AND m.flag_valid=true::bool AND m.flag_operator=true::bool;";

var r = 0;
var e = 0;

var mem = 0;

function exec() {
	pg.exec(query, callback);
}

function callback(err, res) {
//	exec();

	if (err !== null) {
		e++;
	}

	mem += process.memoryUsage().heapUsed/1024/1024;

	r++;
	if (r === count) {
		console.log('[NODE-PG] | R:', r, ' | E:', e, ' | T:', Date.now() - t, ' | M:', (Math.round(mem/r*10)/10));
		process.exit();
	}

	//console.log(r, ':', pg.getSize());
}


var t = Date.now();
var i = 0;
while (i < count) {

	//setTimeout(function() {
		exec();
	//}, 100 * Math.sqrt(i));

	i++;
}


