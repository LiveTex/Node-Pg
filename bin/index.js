var __pg = require('./pg.node');

var events 		= require('events');
var querystring = require('querystring');
var util 		= require('util');
var pg = {};
pg.ResultTable;
pg.Pool = function() {
  this.__queryQueue = new pg.QueryQueue;
  this.__connections = []
};
pg.Pool.prototype["init"] = function(size, options, opt_breakCallback) {
  var info = decodeURI(querystring.stringify(options, " "));
  var self = this;
  var breakHandler = function(connection, error) {
    var index = self.__connections.indexOf(connection);
    if(index !== -1) {
      self.__connections[index] = new pg.Connection(self.__queryQueue, info, breakHandler)
    }
    if(opt_breakCallback !== undefined) {
      opt_breakCallback(error)
    }
  };
  while(this.__connections.length < size) {
    this.__connections.push(new pg.Connection(this.__queryQueue, info, breakHandler))
  }
};
pg.Pool.prototype["exec"] = function(query, opt_callback) {
  this.__queryQueue.push(new pg.Query(query, opt_callback));
  var i = 0, l = this.__connections.length;
  while(i < l) {
    this.__connections[i].process();
    i++
  }
};
pg.Pool.prototype["destroy"] = function() {
  while(this.__connections.length > 0) {
    this.__connections.shift().disconnect()
  }
};
pg.Query = function(command, opt_callback) {
  this.command = command;
  this.callback = null;
  this.next = null;
  this.prev = null;
  if(opt_callback !== undefined) {
    this.callback = opt_callback
  }
};
pg.QueryQueue = function() {
  this.__origin = new pg.Query("");
  this.__origin.prev = this.__origin;
  this.__origin.next = this.__origin
};
pg.QueryQueue.prototype.push = function(query) {
  var tail = this.__origin.next;
  tail.prev = query;
  query.next = tail;
  this.__origin.next = query;
  query.prev = this.__origin
};
pg.QueryQueue.prototype.shift = function() {
  if(this.__origin.prev !== this.__origin) {
    var head = this.__origin.prev;
    head.prev.next = this.__origin;
    this.__origin.prev = head.prev;
    head.next = null;
    head.prev = null;
    return head
  }
  return null
};
pg.Connection = function(queryQueue, options, breakCallback) {
  this.__queryQueue = queryQueue;
  this.__currentQuery = null;
  this.__descriptor = 0;
  var self = this;
  var descriptor = __pg.connect(options, function(broken, task, err, res) {
    if(broken) {
      self.__descriptor = 0;
      breakCallback(self, err)
    }
    if(task === 1) {
      var query = self.__currentQuery;
		self.__currentQuery = null;
      self.process();
      process.nextTick(function() {
        if(query !== null) {
          query.callback(err, res);
          query.callback = null
        }
      })
    }else {
      if(task === 0 && !broken) {
        self.__descriptor = descriptor;
        self.process()
      }
    }
  })
};
pg.Connection.prototype.process = function() {
  if(this.__descriptor !== 0 && this.__currentQuery === null) {
    this.__currentQuery = this.__queryQueue.shift();
    if(this.__currentQuery !== null) {
      __pg.exec(this.__descriptor, this.__currentQuery.command)
    }
  }
};
pg.Connection.prototype.disconnect = function() {
  if(this.__descriptor !== 0) {
    __pg.disconnect(this.__descriptor);
    this.__descriptor = 0
  }
};
module.exports = new pg.Pool;

