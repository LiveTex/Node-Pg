var pg = require('../bin');

pg.init(80, {
	'user': 'relive',
	'dbname': 'relive',
	'hostaddr': '192.168.48.15',
	'password': 'fyfvdcthfd5',
	'port': 6432
});

var query = "SELECT m.id AS member_id, m.login, m.firstname, m.lastname, m.middlename, m.nickname, (CASE WHEN m.flag_online=false THEN 0 ELSE (CASE WHEN m.flag_busy=false THEN 1 ELSE 2 END) END)::int AS state, m.tag, m.ip, m.photo_url, 'sip:000' || m.id || '@' || c.sip_host AS sip_uri, (CASE WHEN c.flag_voice_account=false::bool THEN 0 ELSE (CASE WHEN m.flag_voice=false THEN 0 ELSE 1 END) END)::int AS flag_voice, TIMESTAMP_TO_UNIXTIME(CASE WHEN mmlt.ctime IS NULL THEN '1970-01-01 03:00:00'::timestamp ELSE mmlt.ctime END) AS msg_ctime FROM main.member AS m INNER JOIN main.member AS c ON (c.id=m.chief_id AND c.flag_valid=true::bool) LEFT OUTER JOIN main.member_msg_last_time AS mmlt ON (mmlt.flag_valid=true::bool AND mmlt.member_id=22299::bigint AND mmlt.other_member_id=m.id) WHERE m.chief_id=20281::bigint AND m.flag_valid=true::bool AND m.flag_operator=true::bool;";

function exec() {
	var t = Date.now();

	pg.exec(query, function() {
		console.log('time: ' + (Date.now() - t),
					'pool size: ' + pg.getPoolSize(),
					'queue length: ' + pg.getQueueSize());
	});
}

setInterval(function() {

	var i = 0;
	while (i < 100) {

		setTimeout(function() {
			exec();
		}, 1000 * Math.random());

		i++;
	}

}, 1000);


