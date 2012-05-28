var __pg = require('./pg.node');

var events 		= require('events');
var querystring = require('querystring');
var util 		= require('util');
function $pg$Connection$$($opt_options$$5$$) {
  events.EventEmitter.call(this);
  this.$__optionsString$ = querystring.stringify($opt_options$$5$$, " ");
  this.$__descriptor$ = 0;
  this.$__handleConnection$ = this.$__handleConnection$.bind(this)
}
util.inherits($pg$Connection$$, events.EventEmitter);
$pg$Connection$$.prototype.connect = function $$pg$Connection$$$$connect$($opt_options$$6$$) {
  void 0 !== $opt_options$$6$$ && (this.$__optionsString$ = querystring.stringify($opt_options$$6$$, " "));
  __pg.connect(this.$__optionsString$, this.$__handleConnection$)
};
$pg$Connection$$.prototype.exec = function $$pg$Connection$$$$exec$($query$$3$$, $callback$$34$$) {
  __pg.exec(this.$__descriptor$, $query$$3$$, $callback$$34$$)
};
$pg$Connection$$.prototype.isBusy = function $$pg$Connection$$$$isBusy$() {
  return __pg.isBusy(this.$__descriptor$)
};
$pg$Connection$$.prototype.isValid = function $$pg$Connection$$$$isValid$() {
  return __pg.isValid(this.$__descriptor$)
};
$pg$Connection$$.prototype.disconnect = function $$pg$Connection$$$$disconnect$() {
  __pg.disconnect(this.$__descriptor$)
};
$pg$Connection$$.prototype.$__handleConnection$ = function $$pg$Connection$$$$$__handleConnection$$($error$$3$$, $descriptor$$1$$) {
  null !== $descriptor$$1$$ ? (this.$__descriptor$ = $descriptor$$1$$, this.emit("connected")) : this.emit("error", $error$$3$$)
};
exports.Connection = $pg$Connection$$;
var $connection$$ = new $pg$Connection$$({user:"relive", dbname:"relive", hostaddr:"127.0.0.1", port:6432});
$connection$$.addListener("connected", function() {
  $connection$$.exec("SELECT NOW()", function($error$$4$$, $result$$) {
    console.log($error$$4$$, $result$$)
  })
});
$connection$$.addListener("error", function($error$$5$$) {
  console.log($error$$5$$)
});
$connection$$.connect();

