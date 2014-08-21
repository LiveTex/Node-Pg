var assert = require('assert');
var pg = require('../bin');

var init_info = {
  'dbname': 'relive',
  'user': 'test',
  'password': 'lttest',
  'host': '192.168.48.14',
  'port': '5432',
  'connect_timeout': '5'
}

var first, second;

//first = pg.init(5, init_info);
second = pg.init(5, init_info);

pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
//pg.exec(first, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
pg.exec(second, "SELECT 1 AS value", function(table) {
	console.log('Result table:', table);
	pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
	pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
	pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
	pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
	pg.exec(second, "SELECT 1 AS value", function(table) {
		console.log('Result table:', table);
		pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
		pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
		pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
		pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
		pg.exec(second, "SELECT 1 AS value", function(table) {
			console.log('Result table:', table);
			pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
			pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
			pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
			pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
			pg.exec(second, "SELECT 1 AS value", function(table) {
				console.log('Result table:', table);
				pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
				pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
				pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
				pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
				pg.exec(second, "SELECT 1 AS value", function(table) {
					console.log('Result table:', table);
					pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
					pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
					pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
					pg.exec(second, "SELECT 1 AS value", function(table) {console.log('Result table:', table);}, console.error);
				}, console.error);
			}, console.error);
		}, console.error);
	}, console.error);
}, console.error);