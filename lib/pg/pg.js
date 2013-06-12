

/**
 * Основная область имен модуля.
 *
 * @namespace
 */
var pg = {};


/**
 * Версия библиотеки.
 *
 * @type {string}
 */
pg.VERSION = '1.0.0';


/**
 * Объявление типа строки таблицы результата запроса.
 *
 * @see pg.Table
 * @typedef {Object.<string, (number|string|boolean|null)>}
 */
pg.Row;


/**
 * Объявление типа таблицы результата запроса.
 *
 * @typedef {Array.<!pg.Row>}
 */
pg.Table;


/**
 * Объявление типа функции обработчика результата выполнения запроса.
 *
 * Аргументом функции является таблица результата.
 *
 * @see pg.Table
 * @typedef {?function(pg.Table)}
 */
pg.ResultHandler;


/**
 * Объявление типа функции обработчика ошибки запроса.
 *
 * Аргументами функции являются строка сообщения об ошибки и код ошибки,
 * который может отсутствовать.
 *
 * @typedef {?function(string, number=)}
 */
pg.ErrorHandler;


/**
 * Объявление типа значения для вставки в подготовленный запрос.
 *
 * @typedef {?(number|string|boolean)}
 */
pg.PreparedValue;


/**
 * Объявление типа объекта данных для подготовки запроса.
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
 * Экранирование строки в SQL-запросе.
 *
 * В качестве способа экранирования используется
 * <a href="http://goo.gl/X43TE">dollar-quoting</a>.
 *
 * @param {string} string Исходная строка.
 * @return {string} Экранированная строка.
 */
pg.escapeString = function(string) {
  return '$$' + string.replace(/\$/g, '\\$').replace(/\0/ig, '') + '$$';
};


/**
 * Экранирование массива значений.
 *
 * Массив приводится к строке экранированных элементов разделенных запятыми.
 *
 * @see pg.escapeString
 * @param {!Array.<!pg.PreparedValue>} array Массив значений.
 * @return {string} Массив экранированных строк через запятую.
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
 * Connections pool initialization.
 *
 * @see pg.ErrorHandler
 * @see console.error
 * @param {number} size Pool size - pool connections count.
 * @param {!Object} options Connection options. В качестве настроек
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
 * SQL-query executing.
 *
 * @see pg.ResultHandler
 * @see pg.ErrorHandler
 * @param {string} query SQL-query string.
 * @param {!pg.ResultHandler} complete Success result handler.
 * @param {!pg.ErrorHandler} cancel Execution error handler.
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
 * Prepared SQL-query executing.
 *
 * Подготовленным запросом является запрос вида
 * <pre>SELECT $value1 AS value1, $value2 AS value2</pre>, где
 * <pre>$value1</pre> и <pre>$value2</pre> являются placeholder'ами для
 * параметров объекта данных <pre>value1</pre> и <pre>value2</pre>
 * соответственно.
 *
 * @see pg.prepareQuery
 * @param {string} query Prepared SQL-query string.
 * @param {!pg.PreparedParams} params Data object for query preparation.
 * @param {!pg.ResultHandler} complete Success result handler.
 * @param {!pg.ErrorHandler} cancel Execution error handler.
 */
pg.execPrepared = function(query, params, complete, cancel) {
  pg.exec(pg.prepareQuery(query, params), complete, cancel);
};


/**
 * Prepare ready-to-use SQL-query.
 *
 * @param {string} query Prepared SQL-query string.
 * @param {!pg.PreparedParams} params Data object for query preparation.
 * @return {string} Ready-to-use SQL-query.
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
 * Connection pool destroying.
 */
pg.destroy = function() {
  __pg.destroy();
};

