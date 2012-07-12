var __pg = require('./pg.node');

var events 		= require('events');
var querystring = require('querystring');
var util 		= require('util');
var pg = {};
pg.ResultTable;
pg.Pool = function() {
};
pg.Pool.prototype.init = function(size, options) {
  __pg.init(size, querystring.stringify(options, " "), function(error) {
    console.log(error)
  })
};
pg.Pool.prototype.exec = function(query, callback) {
  __pg.exec(query, callback)
};
pg.Pool.prototype.destroy = function() {
  __pg.destroy()
};
module.exports = new pg.Pool;

