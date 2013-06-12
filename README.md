# Livetex-Node-Pg

Multithread Postgres driver for Node-JS builded on libpq and libjemalloc.



## Examples

### Simple query processing

    var pg = require('../bin');

    pg.init(20, {
      'user': 'postgres',
      'dbname': 'postgres',
      'hostaddr': '127.0.0.1',
      'password': '123'
    });

    pg.exec("SELECT 1 AS value", function(table) {
      console.log('Result table:', table);
    }, console.error);

    pg.exec("SELECT 2 AS another_value", function(table) {
      console.log('Result table:', table);
    }, console.error);

You don't have to wait any connection ready events before calling `exec` or
any other method.


### Process destroying

    var pg = require('../bin');

    pg.init(20, {
      'user': 'postgres',
      'dbname': 'postgres',
      'hostaddr': '127.0.0.1',
      'password': '123'
    });

    pg.exec("SELECT 1 AS value", function(table) {
      console.log('Result table:', table);
    }, console.error);

    pg.destroy();

Nothing happen after `destroy` call.


### Prepared queries


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

    pg.execPrepared(preparedQuery, {
      'word1': 'bye',
      'word2': 'bye'
    }, function(table) {
      console.log('Result table:', table);
    }, console.error);

You can pass different params to one prepared query.


## API


## License

Modified BSD License
