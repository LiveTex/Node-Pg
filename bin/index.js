var __pg = require('./pg.node');

var events 		= require('events');
var querystring = require('querystring');
var util 		= require('util');
var pg = {};
pg.VERSION = "0.0.2";
pg.ResultTable;
pg.Pool = function() {
  var self = this;
  this.VERSION = pg.VERSION;
  this.__jointQueries = [];
  this.__jointCallbacks = [];
  this.__isDeffered = false;
  this.__defferingTime = 0;
  this.__execjointQuery = function() {
    var query = self.__jointQueries.join(";");
    var callbacks = self.__jointCallbacks.slice(0);
    __pg.exec(query, function(error) {
      var i = 0, l = callbacks.length;
      while(i < l) {
        callbacks[i](error);
        i += 1
      }
      callbacks.length = 0
    });
    self.__isDeffered = false;
    self.__jointQueries.length = 0;
    self.__jointCallbacks.length = 0
  }
};
pg.Pool.prototype.init = function(size, options, opt_defferingTime) {
  __pg.init(size, querystring.unescape(querystring.stringify(options, " ")), function(error) {
    console.log(error)
  });
  if(opt_defferingTime !== undefined) {
    this.__defferingTime = opt_defferingTime
  }
};
pg.Pool.prototype.exec = function(query, callback) {
  __pg.exec(query, callback)
};
pg.Pool.prototype.jointExec = function(query, callback) {
  this.__jointQueries.push(query);
  this.__jointCallbacks.push(callback);
  if(this.__isDeffered === false) {
    if(this.__defferingTime === 0) {
      process.nextTick(this.__execjointQuery)
    }else {
      setTimeout(this.__execjointQuery, this.__defferingTime)
    }
    this.__isDeffered = true
  }
};
pg.Pool.prototype.destroy = function() {
  __pg.destroy()
};

module.exports = new pg.Pool();
