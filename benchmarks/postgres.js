var pg = require('pg');


var count = parseInt(process.argv[3]);
var query = process.argv[4]  || "SELECT 1";


var r = 0;
var e = 0;
var t = Date.now();
var mem = 0;


var client = new pg.Client('tcp://postgres:123@' + process.argv[2] +  '/postgres');
client.connect(function() {
  function exec() {
    client.query(query, callback);
  }

  function callback(err) {
    if (err !== null) {
      e += 1;
    }

    mem += process.memoryUsage().heapUsed/1024/1024;

    if ((r += 1) === count) {
      console.log('[NODE-POSTGRES] | R:', r, ' | E:', e, ' | T:', Date.now() - t, ' | M:', (Math.round(mem/r*10)/10));
      //run();
    }
  }

  function run() {
    r = 0;
    e = 0;
    t = Date.now();
    mem = 0;

    for (var i = 0; i < count; i += 1) {
      exec();
    }
  }


  run();
});







