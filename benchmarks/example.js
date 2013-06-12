var pg = require('../bin');
var preparedQuery = "SELECT $word1 AS word1, $word2 AS word2";

pg.init(20, {
  'user': 'postgres',
  'dbname': 'postgres',
  'hostaddr': '127.0.0.1',
  'password': '123'
});

pg.execPrepared(preparedQuery, {
  'word1': 'hello',
  'word2': 'world'
}, function(table) {
  console.log('Result table:', table);
}, console.error);
