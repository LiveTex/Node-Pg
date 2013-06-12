var querystring = require('querystring'); var __pg = require('./pg.node');  'use strict';var pg = {};
pg.VERSION = "1.0.0";
pg.Row;
pg.Table;
pg.ResultHandler;
pg.ErrorHandler;
pg.PreparedValue;
pg.PreparedParams;
pg.__PARAM_EXP = /\$([a-z0-9_]+)/ig;
pg.escapeString = function(string) {
  return"$$" + string.replace(/\$/g, "\\$").replace(/\0/ig, "") + "$$"
};
pg.escapeArray = function(array) {
  var i = 0, l = array.length;
  var result = "";
  while(i < l) {
    var item = array[i];
    if(item !== null && item !== undefined) {
      if(result.length === 0) {
        result = pg.escapeString(item.toString())
      }else {
        result += "," + pg.escapeString(item.toString())
      }
    }
    i += 1
  }
  return result
};
pg.init = function(size, options, opt_errorHandler) {
  var errorHandler = console.error;
  if(opt_errorHandler !== undefined) {
    errorHandler = opt_errorHandler
  }
  __pg.init(size, querystring.unescape(querystring.stringify(options, " ")), errorHandler)
};
pg.exec = function(query, complete, cancel) {
  __pg.exec(query, function(error, result) {
    if(error.length > 0) {
      cancel(error)
    }else {
      complete(result)
    }
  })
};
pg.execPrepared = function(query, params, complete, cancel) {
  pg.exec(pg.prepareQuery(query, params), complete, cancel)
};
pg.prepareQuery = function(query, params) {
  function replacer(placeholder, name) {
    var param = params[name];
    if(param instanceof Array) {
      return pg.escapeArray(param)
    }else {
      if(typeof param === "string") {
        return pg.escapeString(param)
      }else {
        if(typeof param === "number") {
          return isFinite(param) ? String(param) : "0"
        }else {
          if(typeof param === "boolean") {
            return String(param)
          }
        }
      }
    }
    return"''"
  }
  return query.replace(pg.__PARAM_EXP, replacer)
};
pg.destroy = function() {
  __pg.destroy()
};
  module.exports = pg;
