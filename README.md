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


* `pg.Row`:`{Object.<string, (number|string|boolean|null)>}` - Table result row definition.
* `pg.Table`:`{Array.<!pg.Row>}` - Definition of query result table.
* `pg.ResultHandler`:`{?function(pg.Table)}` - Definition of function type to handle query execution result. Function argument - query result table.
* `pg.ErrorHandler`:`{?function(string, number=)}` - Definition of function type to handle errors. Function arguments are error message string and optional error code. 
* `pg.PreparedValue`:`{?(number|string|boolean)}` - Definition of value types for insertion to prepared query. 
* `pg.PreparedParams`:`{Object.<string, (!pg.PreparedValue|!Array.<!pg.PreparedValue>)>}` - Definition of data object for query preparation. 


### Methods


#### pg.escapeString:`string`

Escape strings in sql queries. For string escape we use <a href="http://goo.gl/X43TE">dollar-quoting</a>.

Arguments:

* `string`:`string` Original string.

Returns escaped string.


#### pg.escapeArray:`string`

Escape array of values. Array is casted to string of escaped elements divided by comma.

Arguments:

* `array`:`!Array.<!pg.PreparedValue>` Array of values.

Returns escaped strings divided by comma.



## License

Modified BSD License
