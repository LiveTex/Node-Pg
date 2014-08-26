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

assert.throws( function() { first = pg.init(); }, Error, "Bad init" );

assert.throws( function() { pg.exec(first, first, function(table) {}, console.error); }, Error, "Incorrect req with bad handle" );

assert.throws( function() { pg.exec(second, second, function(table) {}, console.error); }, Error, "Incorrect req with good handle");

assert.throws( function() { pg.destroy(); }, Error, "Destroy without handle" );

assert.throws( function() { pg.destroy(first); }, Error, "Destroy with incorrect handle" );

assert.doesNotThrow( function() { second = pg.init(5, init_info); }, Error, "Good init" );

assert.doesNotThrow( function() { pg.exec(second, "SELECT 1 AS value", function(table) {}, console.error); }, Error, "Good req with good handle" );

assert.doesNotThrow( function() { pg.destroy(second); }, Error, "Good destroy with correct handle" );
