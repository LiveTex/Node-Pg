var __pg = require('./pg.node');

var events 		= require('events');
var querystring = require('querystring');
var util 		= require('util');
var $JSCompiler_alias_NULL$$ = null;
function $pg$Pool$$() {
  this.$__queryQueue$ = new $pg$QueryQueue$$;
  this.$__connections$ = []
}
$pg$Pool$$.prototype.init = function $$pg$Pool$$$$init$($size$$9$$, $options$$2$$, $opt_breakCallback$$) {
  function $breakHandler$$($connection$$2$$, $error$$3$$) {
    var $index$$43$$ = $self$$1$$.$__connections$.indexOf($connection$$2$$);
    -1 !== $index$$43$$ && ($self$$1$$.$__connections$[$index$$43$$] = new $pg$Connection$$($self$$1$$.$__queryQueue$, $info$$, $breakHandler$$));
    void 0 !== $opt_breakCallback$$ && $opt_breakCallback$$($error$$3$$)
  }
  for(var $info$$ = decodeURI(querystring.stringify($options$$2$$, " ")), $self$$1$$ = this;this.$__connections$.length < $size$$9$$;) {
    this.$__connections$.push(new $pg$Connection$$(this.$__queryQueue$, $info$$, $breakHandler$$))
  }
};
$pg$Pool$$.prototype.exec = function $$pg$Pool$$$$exec$($query$$3$$, $opt_callback$$4$$) {
  this.$__queryQueue$.push(new $pg$Query$$($query$$3$$, $opt_callback$$4$$));
  for(var $i$$1$$ = 0, $l$$ = this.$__connections$.length;$i$$1$$ < $l$$;) {
    $JSCompiler_StaticMethods_process$$(this.$__connections$[$i$$1$$]), $i$$1$$++
  }
};
$pg$Pool$$.prototype.destroy = function $$pg$Pool$$$$destroy$() {
  for(;0 < this.$__connections$.length;) {
    this.$__connections$.shift().disconnect()
  }
};
function $pg$Query$$($command$$, $opt_callback$$5$$) {
  this.$command$ = $command$$;
  this.$prev$ = this.next = this.$callback$ = $JSCompiler_alias_NULL$$;
  void 0 !== $opt_callback$$5$$ && (this.$callback$ = $opt_callback$$5$$)
}
;function $pg$QueryQueue$$() {
  this.$__origin$ = new $pg$Query$$("");
  this.$__origin$.$prev$ = this.$__origin$;
  this.$__origin$.next = this.$__origin$
}
$pg$QueryQueue$$.prototype.push = function $$pg$QueryQueue$$$$push$($query$$4$$) {
  var $tail$$ = this.$__origin$.next;
  $tail$$.$prev$ = $query$$4$$;
  $query$$4$$.next = $tail$$;
  this.$__origin$.next = $query$$4$$;
  $query$$4$$.$prev$ = this.$__origin$
};
$pg$QueryQueue$$.prototype.shift = function $$pg$QueryQueue$$$$shift$() {
  if(this.$__origin$.$prev$ !== this.$__origin$) {
    var $head$$ = this.$__origin$.$prev$;
    $head$$.$prev$.next = this.$__origin$;
    this.$__origin$.$prev$ = $head$$.$prev$;
    $head$$.next = $JSCompiler_alias_NULL$$;
    $head$$.$prev$ = $JSCompiler_alias_NULL$$;
    return $head$$
  }
  return $JSCompiler_alias_NULL$$
};
function $pg$Connection$$($queryQueue$$, $options$$3$$, $breakCallback$$) {
  this.$__queryQueue$ = $queryQueue$$;
  this.$__currentQuery$ = $JSCompiler_alias_NULL$$;
  this.$__descriptor$ = 0;
  var $self$$2$$ = this, $descriptor$$1$$ = __pg.connect($options$$3$$, function($broken$$, $task$$, $err$$, $res$$) {
    $broken$$ && ($self$$2$$.$__descriptor$ = 0, $breakCallback$$($self$$2$$, $err$$));
    if(1 === $task$$) {
      var $query$$5$$ = $self$$2$$.$__currentQuery$;
      $self$$2$$.$__currentQuery$ = $JSCompiler_alias_NULL$$;
      $JSCompiler_StaticMethods_process$$($self$$2$$);
      process.nextTick(function() {
        if($query$$5$$ !== $JSCompiler_alias_NULL$$) {
          $query$$5$$.$callback$($err$$, $res$$);
          $query$$5$$.$callback$ = $JSCompiler_alias_NULL$$
        }
      })
    }else {
      0 === $task$$ && !$broken$$ && ($self$$2$$.$__descriptor$ = $descriptor$$1$$, $JSCompiler_StaticMethods_process$$($self$$2$$))
    }
  })
}
function $JSCompiler_StaticMethods_process$$($JSCompiler_StaticMethods_process$self$$) {
  0 !== $JSCompiler_StaticMethods_process$self$$.$__descriptor$ && $JSCompiler_StaticMethods_process$self$$.$__currentQuery$ === $JSCompiler_alias_NULL$$ && ($JSCompiler_StaticMethods_process$self$$.$__currentQuery$ = $JSCompiler_StaticMethods_process$self$$.$__queryQueue$.shift(), $JSCompiler_StaticMethods_process$self$$.$__currentQuery$ !== $JSCompiler_alias_NULL$$ && __pg.exec($JSCompiler_StaticMethods_process$self$$.$__descriptor$, $JSCompiler_StaticMethods_process$self$$.$__currentQuery$.$command$))
}
$pg$Connection$$.prototype.disconnect = function $$pg$Connection$$$$disconnect$() {
  0 !== this.$__descriptor$ && (__pg.disconnect(this.$__descriptor$), this.$__descriptor$ = 0)
};
module.exports = new $pg$Pool$$;

