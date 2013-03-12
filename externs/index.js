 

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
 * @typedef {Array.<!Object.<string, string>>}
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
 * @param {function(Error, pg.ResultTable)} callback Обработчик результата.
 */
pg.exec = function(query, callback) {};

/**
 * @param {string} query Запрос.
 * @param {!Object} params Параметры запроса.
 * @param {function(Error, pg.ResultTable)} callback Обработчик результата.
 */
pg.execPrepared = function(query, params, callback) {};

/**
 * Разрушение пула.
 */
pg.destroy = function() {};


