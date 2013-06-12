# Livetex-Node-Pg

Multithread Postgres driver for Node-JS builded on libpq and libjemalloc.



## Examples

### Simple query processing

    var pg = require('livetex-node-pg');

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

    var pg = require('livetex-node-pg');

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


    var pg = require('livetex-node-pg');
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

### Type definitions


* `pg.Row` - Table result row definition. `{Object.<string, (number|string|boolean|null)>}`
* `pg.Table` - Definition of query result table. `{Array.<!pg.Row>}`
* `pg.ResultHandler` - Definition of function type to handle query execution
result. Function argument - query result table. `{?function(pg.Table)}`
* `pg.ErrorHandler` - Definition of function type to handle errors. Function
arguments are error message string and optional error code. `{?function(string, number=)}`
* `pg.PreparedValue` - Definition of value types for insertion to prepared query. `{?(number|string|boolean)}`
* `pg.PreparedParams` - Definition of data object for query preparation. `{Object.<string, (!pg.PreparedValue|!Array.<!pg.PreparedValue>)>}`


## License

Modified BSD License
