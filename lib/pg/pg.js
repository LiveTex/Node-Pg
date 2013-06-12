

/**
 * Module namespace.
 *
 * @namespace
 */
var pg = {};


/**
 * Library version.
 *
 * @type {string}
 */
pg.VERSION = '1.0.0';


/**
 * Table result row definition.
 *
 * @see pg.Table
 * @typedef {Object.<string, (number|string|boolean|null)>}
 */
pg.Row;


/**
 * Definition.of query result table.
 *
 * @typedef {Array.<!pg.Row>}
 */
pg.Table;


/**
 * Definition of function type to handle query execution result.
 *
 * Function argument - query result table.
 *
 * @see pg.Table
 * @typedef {?function(pg.Table)}
 */
pg.ResultHandler;


/**
 * Definition of function type to handle errors.
 *
 * Function arguments are error message string and optional error code.
 *
 * @typedef {?function(string, number=)}
 */
pg.ErrorHandler;


/**
 * Definition of value types for insertion to prepared query.
 *
 * @typedef {?(number|string|boolean)}
 */
pg.PreparedValue;


/**
 * Definition of data object for query preparation.
 *
 * @see pg.PreparedValue
 * @typedef {Object.<string, (!pg.PreparedValue|!Array.<!pg.PreparedValue>)>}
 */
pg.PreparedParams;


/**
 * @type {!RegExp}
 */
pg.__PARAM_EXP = /\$([a-z0-9_]+)/ig;


/**
 * Escape strings in sql queries.
 *
 * For string escape we use
 * <a href="http://goo.gl/X43TE">dollar-quoting</a>.
 *
 * @param {string} string Original string.
 * @return {string} Escaped string.
 */
pg.escapeString = function(string) {
  return '$$' + string.replace(/\$/g, '\\$').replace(/\0/ig, '') + '$$';
};


/**
 * Escape array of values.
 *
 * Array is casted to string of escaped elements divided by comma.
 *
 * @see pg.escapeString
 * @param {!Array.<!pg.PreparedValue>} array Array of values.
 * @return {string} Escaped strings divided by comma.
 */
pg.escapeArray = function(array) {
  var i = 0,
      l = array.length;

  var result = '';

  while (i < l) {
    var item = array[i];
    if (item !== null && item !== undefined) {

      if (result.length === 0) {
        result = pg.escapeString(item.toString());
      } else {
        result += ',' + pg.escapeString(item.toString());
      }

    }

    i += 1;
  }

  return result;
};


/**
 * Создание пула соединений с базой.
 *
 * @see pg.ErrorHandler
 * @see console.error
 * @param {number} size Размер пула - количество соединений с базой.
 * @param {!Object} options Настройки соединения с базой. В качестве настроек
 *    принимается объект с ключами соответсующими описанным в
 *    <a href="http://goo.gl/eqPw4">документации</a>.
 * @param {!pg.ErrorHandler=} opt_errorHandler Обработчик ошибок подключения.
 *    По умолчанию обработчиком подключения является метод
 *    <pre>console.error</pre>.
 */
pg.init = function(size, options, opt_errorHandler) {
  var errorHandler = console.error;
  if (opt_errorHandler !== undefined) {
    errorHandler = opt_errorHandler;
  }

  __pg.init(size, querystring.unescape(
      querystring.stringify(options, ' ')), errorHandler);
};


/**
 * Выполнение SQL-запроса.
 *
 * @see pg.ResultHandler
 * @see pg.ErrorHandler
 * @param {string} query Строка SQL-запроса.
 * @param {!pg.ResultHandler} complete Обработчик успешного результата.
 * @param {!pg.ErrorHandler} cancel Обработчик ошибки обработки запроса.
 */
pg.exec = function(query, complete, cancel) {
  __pg.exec(query, function(error, result) {
    if (error.length > 0) {
      cancel(error);
    } else {
      complete(result);
    }
  });
};


/**
 * Выполнение подготовленного запроса.
 *
 * Подготовленным запросом является запрос вида
 * <pre>SELECT $value1 AS value1, $value2 AS value2</pre>, где
 * <pre>$value1</pre> и <pre>$value2</pre> являются placeholder'ами для
 * параметров объекта данных <pre>value1</pre> и <pre>value2</pre>
 * соответственно.
 *
 * @see pg.prepareQuery
 * @param {string} query Строка SQL-запроса.
 * @param {!pg.PreparedParams} params Объект данных параметров запроса.
 * @param {!pg.ResultHandler} complete Обработчик успешного результата.
 * @param {!pg.ErrorHandler} cancel Обработчик ошибки обработки запроса.
 */
pg.execPrepared = function(query, params, complete, cancel) {
  pg.exec(pg.prepareQuery(query, params), complete, cancel);
};


/**
 * Подготовка готового SQL-запроса.
 *
 * @param {string} query Строка подготовленного SQL-запроса.
 * @param {!pg.PreparedParams} params Объект данных параметров запроса.
 * @return {string} Готовый запрос.
 */
pg.prepareQuery = function(query, params) {

  /**
   * @param {string} placeholder Полное сторка совпадения.
   * @param {string} name Имя параметра.
   * @return {string} Сторка замены.
   */
  function replacer(placeholder, name) {
    var param = params[name];

    if (param instanceof Array) {
      return pg.escapeArray(param);
    } else if (typeof param === 'string') {
      return pg.escapeString(param);
    } else if (typeof param === 'number') {
      return isFinite(param) ? String(param) : '0';
    } else if (typeof param === 'boolean') {
      return String(param);
    }

    return '\'\'';
  }

  return query.replace(pg.__PARAM_EXP, replacer);
};


/**
 * Разрушение пула соединений.
 */
pg.destroy = function() {
  __pg.destroy();
};

