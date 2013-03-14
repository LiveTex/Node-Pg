 

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
pg.VERSION = '0.1.0';

/**
 * @typedef {Array.<!Object.<string, (number|string|boolean|null)>>}
 */
pg.ResultTable;

/**
 * @param {string} string Исходная строка.
 * @return {string} Экранированная строка.
 */
pg.escapeString = function(string) {};

/**
 * @param {!Array} array Массив строк.
 * @return {string} Массив экранированных строк через запятую.
 */
pg.escapeArray = function(array) {};

/**
 * @param {string} query Запрос.
 * @param {!Object} params Параметры запроса.
 * @return {string} Готовый запрос.
 */
pg.prepareQuery = function(query, params) {};

/**
 * @param {number} size Размер пула.
 * @param {!Object} options Настройки соединения с базой.
 */
pg.init = function(size, options) {};

/**
 * @param {string} query Запрос.
 * @param {function(!pg.ResultTable)} complete Обработчик результата.
 * @param {function(string, number=)} cancel Обработчик ошибки.
 */
pg.exec = function(query, complete, cancel) {};

/**
 * @param {string} query Запрос.
 * @param {!Object} params Параметры запроса.
 * @param {function(!pg.ResultTable)} complete Обработчик результата.
 * @param {function(string, number=)} cancel Обработчик ошибки.
 */
pg.execPrepared = function(query, params, complete, cancel) {};

/**
 * Разрушение пула.
 */
pg.destroy = function() {};


