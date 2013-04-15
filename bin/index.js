var __pg = require('./pg.node');

var qs 		= require('qs');
'use strict';var pg={};pg.VERSION="0.1.0";pg.ResultTable;pg.__PARAM_EXP=/\$([a-z0-9_]+)/ig;pg.escapeString=function(string){return"$$"+string.replace(/\$/g,"\\$").replace(/\0/ig,"")+"$$"};pg.escapeArray=function(array){var i=0,l=array.length;var result="";while(i<l){var item=array[i];if(item!==null&&item!==undefined)if(result.length===0)result=pg.escapeString(item.toString());else result+=","+pg.escapeString(item.toString());i+=1}return result};
pg.prepareQuery=function(query,params){function replacer(placeholder,name){if(params[name]instanceof Array)return pg.escapeArray(params[name]);else if(typeof params[name]==="string")return pg.escapeString(params[name]);else if(typeof params[name]==="number")return isFinite(params[name])?String(params[name]):"0";else if(typeof params[name]==="boolean")return String(params[name]);return"''"}return query.replace(pg.__PARAM_EXP,replacer)};
pg.init=function(size,options){__pg.init(size,qs.unescape(qs.stringify(options," ")),function(error){console.error(error)})};pg.exec=function(query,complete,cancel){__pg.exec(query,function(error,result){if(error.length>0)cancel(error);else complete(result)})};pg.execPrepared=function(query,params,complete,cancel){pg.exec(pg.prepareQuery(query,params),complete,cancel)};pg.destroy=function(){__pg.destroy()};
module.exports = pg;
