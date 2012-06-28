var __pg = require('./pg.node');

var events 		= require('events');
var querystring = require('querystring');
var util 		= require('util');
var pg = {};
pg.ResultTable;
pg.Pool = function() {
  this.__connectionInfo = "";
  this.__maxSize = 0;
  this.__queryQueue = new pg.QueryQueue;
  this.__connections = []
};
pg.Pool.prototype.init = function(size, options) {
  this.__connectionInfo = decodeURI(querystring.stringify(options, " "));
  this.__maxSize = size
};
pg.Pool.prototype.getPoolSize = function() {
  return this.__connections.length
};
pg.Pool.prototype.getQueueSize = function() {
  return this.__queryQueue.length
};
pg.Pool.prototype.exec = function(query, opt_callback) {
  this.__queryQueue.push(new pg.Query(query, opt_callback));
  var i = 0, l = this.__connections.length;
  while(i < l) {
    this.__connections[i].process();
    i++
  }
  if(this.__queryQueue.length > 0 && this.__maxSize > l) {
    this.__spawnConnection()
  }
};
pg.Pool.prototype.destroy = function() {
  while(this.__connections.length > 0) {
    this.__connections.shift().disconnect()
  }
};
pg.Pool.prototype.__spawnConnection = function() {
  var self = this;
  var connection = new pg.Connection(this.__queryQueue, this.__connectionInfo, function(connection, error) {
    var index = self.__connections.indexOf(connection);
    if(index !== -1) {
      self.__connections.splice(index, 1)
    }
    if(error !== null) {
      console.error("[ERROR]: Postgres connection error:", error.message)
    }
  });
  this.__connections.push(connection)
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
  this.__origin.next = this.__origin;
  this.length = 0
};
pg.QueryQueue.prototype.push = function(query) {
  var tail = this.__origin.next;
  tail.prev = query;
  query.next = tail;
  this.__origin.next = query;
  query.prev = this.__origin;
  this.length++
};
pg.QueryQueue.prototype.shift = function() {
  if(this.__origin.prev !== this.__origin) {
    var head = this.__origin.prev;
    head.prev.next = this.__origin;
    this.__origin.prev = head.prev;
    head.next = null;
    head.prev = null;
    this.length--;
    return head
  }
  return null
};
pg.Connection = function(queryQueue, options, breakCallback) {
  var self = this;
  this.__queryQueue = queryQueue;
  this.__currentQuery = null;
  this.__breakCallback = breakCallback;
  this.__disconnectTimeout = -1;
  this.__descriptor = __pg.connect(options, function(broken, task, err, res) {
    if(broken) {
      if(self.__descriptor !== 0) {
        self.__descriptor = 0;
        self.__breakCallback(self, err)
      }
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
        self.process()
      }
    }
  })
};
pg.Connection.prototype.process = function() {
  if(this.__descriptor !== 0 && this.__currentQuery === null) {
    this.__currentQuery = this.__queryQueue.shift();
    if(this.__currentQuery !== null) {
      this.__stopDisconnectTimeout();
      __pg.exec(this.__descriptor, this.__currentQuery.command)
    }else {
      this.__startDisconnectTimeout()
    }
  }
};
pg.Connection.prototype.disconnect = function() {
  if(this.__descriptor !== 0) {
    __pg.disconnect(this.__descriptor);
    this.__descriptor = 0;
    this.__breakCallback(this, null)
  }
};
pg.Connection.prototype.__startDisconnectTimeout = function() {
  if(this.__disconnectTimeout === -1) {
    var self = this;
    this.__disconnectTimeout = setTimeout(function() {
      self.disconnect();
      self.__disconnectTimeout = -1
    }, 1E3)
  }
};
pg.Connection.prototype.__stopDisconnectTimeout = function() {
  if(this.__disconnectTimeout !== -1) {
    clearTimeout(this.__disconnectTimeout);
    this.__disconnectTimeout = -1
  }
};
module.exports = new pg.Pool;

