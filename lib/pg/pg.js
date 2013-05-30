

/**
 * Основная область имен модуля.
 *
 * @namespace
 */
var pg = {};


/**
 * @const
 * @type {string}
 */
pg.VERSION = '1.0.2';


/**
 * @typedef {Array.<!Object.<string, (number|string|boolean|null)>>}
 */
pg.ResultTable;


/**
 * @type {!RegExp}
 */
pg.__PARAM_EXP = /\$([a-z0-9_]+)/ig;


/**
 * @param {string} string Исходная строка.
 * @return {string} Экранированная строка.
 */
pg.escapeString = function(string) {
  return '$$' + string.replace(/\$/g, '\\$').replace(/\0/ig, '') + '$$';
};


/**
 * @param {!Array} array Массив строк.
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
 * @param {string} query Запрос.
 * @param {!Object} params Параметры запроса.
 * @return {string} Готовый запрос.
 */
pg.prepareQuery = function(query, params) {

  /**
   * @param {string} placeholder Полное сторка совпадения.
   * @param {string} name Имя параметра.
   * @return {string} Сторка замены.
   */
  function replacer(placeholder, name) {

    if (params[name] instanceof Array) {
      return pg.escapeArray(params[name]);
    } else if (typeof params[name] === 'string') {
      return pg.escapeString(params[name]);
    } else if (typeof params[name] === 'number') {
      return isFinite(params[name]) ? String(params[name]) : '0';
    } else if (typeof params[name] === 'boolean') {
      return String(params[name]);
    }

    return '\'\'';
  }

  return query.replace(pg.__PARAM_EXP, replacer);
};


/**
 * @param {number} size Размер пула.
 * @param {!Object} options Настройки соединения с базой.
 */
pg.init = function(size, options) {
  __pg.init(
      size, util.unescape(util.encodeFormData(options, ' ')), function(error) {
        console.error(error);
      });
};


/**
 * @param {string} query Запрос.
 * @param {function(!pg.ResultTable)} complete Обработчик результата.
 * @param {function(string, number=)} cancel Обработчик ошибки.
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
 * @param {string} query Запрос.
 * @param {!Object} params Параметры запроса.
 * @param {function(!pg.ResultTable)} complete Обработчик результата.
 * @param {function(string, number=)} cancel Обработчик ошибки.
 */
pg.execPrepared = function(query, params, complete, cancel) {
  pg.exec(pg.prepareQuery(query, params), complete, cancel);
};


/**
 * Разрушение пула.
 */
pg.destroy = function() {
  __pg.destroy();
};

