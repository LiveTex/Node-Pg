var __pg = require('./pg.node');

var events 		= require('events');
var querystring = require('querystring');
var util 		= require('util');
var $JSCompiler_alias_NULL$$ = null, $pg$__pool$$ = $JSCompiler_alias_NULL$$;
function $pg$__getPool$$() {
  $pg$__pool$$ === $JSCompiler_alias_NULL$$ && ($pg$__pool$$ = new $pg$Pool$$);
  return $pg$__pool$$
}
;function $pg$Pool$$() {
  this.$__queryQueue$ = new $pg$QueryQueue$$;
  this.$__connections$ = []
}
function $JSCompiler_StaticMethods_init$$($JSCompiler_StaticMethods_init$self$$, $size$$9$$, $i$$1_options$$2$$) {
  function $breakHandler$$($connection$$2_index$$43$$) {
    $connection$$2_index$$43$$ = $JSCompiler_StaticMethods_init$self$$.$__connections$.indexOf($connection$$2_index$$43$$);
    -1 !== $connection$$2_index$$43$$ && ($JSCompiler_StaticMethods_init$self$$.$__connections$[$connection$$2_index$$43$$] = new $pg$Connection$$($JSCompiler_StaticMethods_init$self$$.$__queryQueue$, $info$$, $breakHandler$$))
  }
  for(var $info$$ = decodeURI(querystring.stringify($i$$1_options$$2$$, " ")), $i$$1_options$$2$$ = 0;$i$$1_options$$2$$ < $size$$9$$;) {
    $JSCompiler_StaticMethods_init$self$$.$__connections$[$i$$1_options$$2$$] = new $pg$Connection$$($JSCompiler_StaticMethods_init$self$$.$__queryQueue$, $info$$, $breakHandler$$), $i$$1_options$$2$$++
  }
}
;function $pg$Query$$($command$$, $opt_callback$$5$$) {
  this.$command$ = $command$$;
  this.$prev$ = this.next = this.$callback$ = $JSCompiler_alias_NULL$$;
  void 0 !== $opt_callback$$5$$ && (this.$callback$ = $opt_callback$$5$$)
}
;function $pg$QueryQueue$$() {
  this.origin = new $pg$Query$$("");
  this.origin.$prev$ = this.origin;
  this.origin.next = this.origin
}
$pg$QueryQueue$$.prototype.push = function $$pg$QueryQueue$$$$push$($query$$5$$) {
  var $tail$$ = this.origin.next;
  $tail$$.$prev$ = $query$$5$$;
  $query$$5$$.next = $tail$$;
  this.origin.next = $query$$5$$;
  $query$$5$$.$prev$ = this.origin
};
$pg$QueryQueue$$.prototype.shift = function $$pg$QueryQueue$$$$shift$() {
  if(this.origin.$prev$ !== this.origin) {
    var $head$$ = this.origin.$prev$;
    $head$$.$prev$.next = this.origin;
    this.origin.$prev$ = $head$$.$prev$;
    $head$$.next = $JSCompiler_alias_NULL$$;
    $head$$.$prev$ = $JSCompiler_alias_NULL$$;
    return $head$$
  }
  return $JSCompiler_alias_NULL$$
};
function $pg$Connection$$($queryQueue$$, $options$$3$$, $opt_breakCallback$$) {
  function $breakHandler$$1$$($err$$) {
    if(void 0 !== $opt_breakCallback$$) {
      $opt_breakCallback$$($self$$2$$, $err$$)
    }else {
      if($err$$ !== $JSCompiler_alias_NULL$$) {
        throw $err$$;
      }
    }
  }
  var $self$$2$$ = this;
  this.$__queryQueue$ = $queryQueue$$;
  this.$__currentQuery$ = $JSCompiler_alias_NULL$$;
  this.$__descriptor$ = 0;
  var $descriptor$$1$$ = __pg.connect($options$$3$$, function($broken$$, $task$$, $err$$1$$, $res$$) {
    if(1 === $task$$) {
      $broken$$ && ($self$$2$$.$__descriptor$ = 0, $breakHandler$$1$$($err$$1$$));
      var $query$$6$$ = $self$$2$$.$__currentQuery$;
      $self$$2$$.$__currentQuery$ = $JSCompiler_alias_NULL$$;
      $JSCompiler_StaticMethods_process$$($self$$2$$);
      process.nextTick(function() {
        if($query$$6$$ !== $JSCompiler_alias_NULL$$) {
          $query$$6$$.$callback$($err$$1$$, $res$$);
          $query$$6$$.$callback$ = $JSCompiler_alias_NULL$$
        }
      })
    }else {
      0 === $task$$ && ($broken$$ ? $breakHandler$$1$$($err$$1$$) : ($self$$2$$.$__descriptor$ = $descriptor$$1$$, $JSCompiler_StaticMethods_process$$($self$$2$$)))
    }
  })
}
function $JSCompiler_StaticMethods_process$$($JSCompiler_StaticMethods_process$self$$) {
  if(0 !== $JSCompiler_StaticMethods_process$self$$.$__descriptor$ && $JSCompiler_StaticMethods_process$self$$.$__currentQuery$ === $JSCompiler_alias_NULL$$) {
    var $next$$ = $JSCompiler_StaticMethods_process$self$$.$__queryQueue$.shift();
    $next$$ !== $JSCompiler_alias_NULL$$ && __pg.exec($JSCompiler_StaticMethods_process$self$$.$__descriptor$, $next$$.$command$);
    $JSCompiler_StaticMethods_process$self$$.$__currentQuery$ = $next$$
  }
}
$pg$Connection$$.prototype.disconnect = function $$pg$Connection$$$$disconnect$() {
  0 !== this.$__descriptor$ && (__pg.disconnect(this.$__descriptor$), this.$__descriptor$ = 0)
};
exports.init = function $exports$init$($connectionCount$$, $connectionOptions$$) {
  $JSCompiler_StaticMethods_init$$($pg$__getPool$$(), $connectionCount$$, $connectionOptions$$)
};
exports.exec = function $exports$exec$($query$$3$$, $opt_callback$$4$$) {
  var $JSCompiler_StaticMethods_execQuery$self$$inline_0$$ = $pg$__getPool$$();
  $JSCompiler_StaticMethods_execQuery$self$$inline_0$$.$__queryQueue$.push(new $pg$Query$$($query$$3$$, $opt_callback$$4$$));
  for(var $i$$inline_2$$ = 0, $l$$inline_3$$ = $JSCompiler_StaticMethods_execQuery$self$$inline_0$$.$__connections$.length;$i$$inline_2$$ < $l$$inline_3$$;) {
    $JSCompiler_StaticMethods_process$$($JSCompiler_StaticMethods_execQuery$self$$inline_0$$.$__connections$[$i$$inline_2$$]), $i$$inline_2$$++
  }
};
exports.destroy = function $exports$destroy$() {
  for(var $JSCompiler_StaticMethods_destroy$self$$inline_5$$ = $pg$__getPool$$();0 < $JSCompiler_StaticMethods_destroy$self$$inline_5$$.$__connections$.length;) {
    $JSCompiler_StaticMethods_destroy$self$$inline_5$$.$__connections$.shift().disconnect()
  }
};

