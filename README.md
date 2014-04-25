# Livetex-Node-Pg

Multithreaded Postgres driver for Node-JS built with `libpq` and `libjemalloc`.

####Install via npm: 
    npm install livetex-node-pg
    
## Examples

### Simple query processing

```js
var pg = require('livetex-node-pg');

pg.init(20, {
  'user': 'postgres',
  'dbname': 'postgres',
  'hostaddr': '127.0.0.1',
  'password': 'postgres'
});

pg.exec("SELECT 1 AS value", function(table) {
  console.log('Result table:', table);
}, console.error);

pg.exec("SELECT 2 AS another_value", function(table) {
  console.log('Result table:', table);
}, console.error);
```

You don't have to wait any connection ready events before calling `exec` or
any other method.


### Process destroying

```js
var pg = require('livetex-node-pg');

pg.init(20, {
  'user': 'postgres',
  'dbname': 'postgres',
  'hostaddr': '127.0.0.1',
  'password': 'postgres'
});

pg.exec("SELECT 1 AS value", function(table) {
  console.log('Result table:', table);
}, console.error);

pg.destroy();
```

Nothing happen after `destroy` call.

### Prepared queries

```js
var pg = require('livetex-node-pg');
var preparedQuery = "SELECT $word1 AS word1, $word2 AS word2";

pg.init(20, {
  'user': 'postgres',
  'dbname': 'postgres',
  'hostaddr': '127.0.0.1',
  'password': 'postgres'
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
```

You can pass different params to one prepared query.

## API

### Type definitions

* **pg.Row**:`Object.<string, (number|string|boolean|null)>` - Table result row definition.
* **pg.Table**:`Array.<!pg.Row>` - Definition of query result table.
* **pg.ResultHandler**:`?function(pg.Table)` - Definition of function type to handle query execution result. Function argument - query result table.
* **pg.ErrorHandler**:`?function(string, number=)` - Definition of function type to handle errors. Function arguments are error message string and optional error code. 
* **pg.PreparedValue**:`?(number|string|boolean)` - Definition of value types for insertion to prepared query. 
* **pg.PreparedParams**:`Object.<string, (!pg.PreparedValue|!Array.<!pg.PreparedValue>)>` - Definition of data object for query preparation. 


### Methods


#### pg.escapeString:`string`
Escapes strings in sql queries. For string escape we use <a href="http://goo.gl/X43TE">dollar-quoting</a>.

Arguments:

* string:`string` Original string.

Returns escaped string.


#### pg.escapeArray:`string`

Escapes array of values. Array is casted to string of escaped elements divided by comma.

Arguments:

* array:`!Array.<!pg.PreparedValue>` Array of values.

Returns escaped strings divided by comma.


#### pg.init: `void`

Initializes connections pool.

Arguments: 

* size: `number` Pool size - Count of pool connections.
* options: `!Object` Connection options. Options must be an object with keys specified in <a href="http://goo.gl/eqPw4">documentation</a>.
* opt_errorHandler: `!pg.ErrorHandler=` Connection error handler. `console.error` will be used by default.


#### pg.exec: `void`

Executes SQL-query.

Arguments:

* query: `string` SQL-query string.
* complete: `!pg.ResultHandler` Success result handler.
* cancel: `!pg.ErrorHandler` Execution error handler.


#### pg.execPrepared: `void`

Executes prepared SQL-query.

Arguments:

* query: `string` Prepared SQL-query string.
* params: `!pg.PreparedParams` Data object for query preparation.
* complete: `!pg.ResultHandler` Success result handler.
* cancel: `!pg.ErrorHandler` Execution error handler.


#### pg.prepareQuery: `string`

Prepares ready-to-use SQL-query.

Arguments:

* query: `string` Prepared SQL-query string.
* params: `!pg.PreparedParams` Data object for query preparation.

Returns ready-to-use SQL-query.


#### pg.destroy: `void`

Destroys connection pool.

## License

Modified BSD License
