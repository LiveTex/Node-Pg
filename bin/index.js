var __pg = require('./pg.node');

var events 		= require('events');
var querystring = require('querystring');
var util 		= require('util');
var $JSCompiler_alias_NULL$$ = null, $pg$__pool$$ = $JSCompiler_alias_NULL$$;
function $pg$Pool$$($connectionCount$$1$$, $connectionOptions$$1$$) {
  this.$__connectionString$ = querystring.stringify($connectionOptions$$1$$, " ");
  console.log(this.$__connectionString$);
  this.$__queryQueue$ = [];
  this.$__connections$ = Array($connectionCount$$1$$)
}
;function $pg$Query$$($command$$, $opt_callback$$4$$) {
  this.$__command$ = $command$$;
  this.$__callback$ = $opt_callback$$4$$ || $JSCompiler_alias_NULL$$
}
$pg$Query$$.prototype.apply = function $$pg$Query$$$$apply$($error$$3$$, $result$$) {
  this.$__callback$ !== $JSCompiler_alias_NULL$$ && (this.$__callback$($error$$3$$, $result$$), this.$__callback$ = $JSCompiler_alias_NULL$$);
  this.$__command$ = ""
};
function $pg$Connection$$($queryQueue$$) {
  this.$__descriptor$ = 0;
  this.$__queryQueue$ = $queryQueue$$;
  this.$__currentQuery$ = $JSCompiler_alias_NULL$$
}
$pg$Connection$$.prototype.connect = function $$pg$Connection$$$$connect$($options$$2$$) {
  var $self$$1$$ = this;
  this.$__descriptor$ = __pg.connect($options$$2$$, function($query$$5_taskId$$, $status$$, $error$$4$$, $result$$1$$) {
    if(2 === $status$$) {
      if($self$$1$$.$__descriptor$ = 0, $error$$4$$ !== $JSCompiler_alias_NULL$$) {
        throw $error$$4$$;
      }
    }else {
      0 === $query$$5_taskId$$ ? $JSCompiler_StaticMethods_process$$($self$$1$$) : ($query$$5_taskId$$ = $self$$1$$.$__currentQuery$, $self$$1$$.$__currentQuery$ = $JSCompiler_alias_NULL$$, $JSCompiler_StaticMethods_process$$($self$$1$$), $query$$5_taskId$$ !== $JSCompiler_alias_NULL$$ && $query$$5_taskId$$.apply($error$$4$$, $result$$1$$))
    }
  })
};
function $JSCompiler_StaticMethods_process$$($JSCompiler_StaticMethods_process$self$$) {
  if(0 !== $JSCompiler_StaticMethods_process$self$$.$__descriptor$ && $JSCompiler_StaticMethods_process$self$$.$__currentQuery$ === $JSCompiler_alias_NULL$$) {
    var $next$$ = $JSCompiler_StaticMethods_process$self$$.$__queryQueue$.shift();
    void 0 !== $next$$ ? (__pg.exec($JSCompiler_StaticMethods_process$self$$.$__descriptor$, $next$$.$__command$), $JSCompiler_StaticMethods_process$self$$.$__currentQuery$ = $next$$) : $JSCompiler_StaticMethods_process$self$$.$__currentQuery$ = $JSCompiler_alias_NULL$$
  }
}
;exports.init = function $exports$init$($connectionCount$$, $connectionOptions$$) {
  for(var $JSCompiler_StaticMethods_init$self$$inline_1$$ = $pg$__pool$$ = new $pg$Pool$$($connectionCount$$, $connectionOptions$$), $i$$inline_2$$ = 0, $l$$inline_3$$ = $JSCompiler_StaticMethods_init$self$$inline_1$$.$__connections$.length, $connection$$inline_4$$ = $JSCompiler_alias_NULL$$;$i$$inline_2$$ < $l$$inline_3$$;) {
    $connection$$inline_4$$ = new $pg$Connection$$($JSCompiler_StaticMethods_init$self$$inline_1$$.$__queryQueue$), $connection$$inline_4$$.connect($JSCompiler_StaticMethods_init$self$$inline_1$$.$__connectionString$), $JSCompiler_StaticMethods_init$self$$inline_1$$.$__connections$[$i$$inline_2$$] = $connection$$inline_4$$, $i$$inline_2$$++
  }
};
exports.exec = function $exports$exec$($query$$3$$, $callback$$33$$) {
  if($pg$__pool$$ !== $JSCompiler_alias_NULL$$) {
    var $JSCompiler_StaticMethods_execQuery$self$$inline_7$$ = $pg$__pool$$;
    $JSCompiler_StaticMethods_execQuery$self$$inline_7$$.$__queryQueue$.push(new $pg$Query$$($query$$3$$, $callback$$33$$));
    for(var $i$$inline_8$$ = 0, $l$$inline_9$$ = $JSCompiler_StaticMethods_execQuery$self$$inline_7$$.$__connections$.length;$i$$inline_8$$ < $l$$inline_9$$;) {
      $JSCompiler_StaticMethods_process$$($JSCompiler_StaticMethods_execQuery$self$$inline_7$$.$__connections$[$i$$inline_8$$]), $i$$inline_8$$++
    }
  }
};

