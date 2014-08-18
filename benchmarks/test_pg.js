var pg = require('../bin');

//pool_init(pool, args[0]->ToInteger()->Int32Value(), *str, v8::Local<v8::Function>::Cast(args[2]));

var first = pg.init(5, {
  'dbname': 'relive',
  'user': 'test',
  'password': 'lttest',
  'host': '192.168.48.14',
  'port': '5432'
});

var second = pg.init(5, {
  'dbname': 'relive',
  'user': 'test',
  'password': 'lttest',
  'host': '192.168.48.14',
  'port': '5432',
  'connect_timeout': '5'
});

var un;




pg.exec(first, "SELECT 1 AS value", function(table) {
  console.log('Result table:', table);
  pg.destroy(first);
}, console.error);

pg.exec(second, "SELECT 1 AS value", function(table) {
  console.log('Result table:', table);
  pg.destroy(second);
}, console.error);

 // pg.destroy(first);
 // pg.destroy(second);