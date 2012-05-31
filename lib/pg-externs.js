


/**
 * Нативная часть модуля.
 * 
 * @namespace 
 */
var __pg = {};


/**
 * Соединение с базой данных.
 *
 * ВНИМАНИЕ! При выводе дескриптора подключения в консоль, возможна ошибка
 * сегментирования!
 * 
 * @see http://www.postgresql.org/docs/9.0/static/libpq-connect.html
 * @param {string} optionsString Строка настроек подключенимя.
 * @param {function(boolean, number, Error, Array.<!Object.<string, string>>)} callback Обработчик подключения.
 * @return {number}  Дескриптор подключения.
 */
__pg.connect = function(optionsString, callback) {};


/**
 * Запрос в базу данных.
 * 
 * @param {number} connection Дескриптор подключения.
 * @param {string} query Строка запроса в базу.
 */
__pg.exec = function(connection, query) {};


/**
 * Закрытие подключения.
 * 
 * @param {number} connection Дескриптор подключения.
 */
__pg.disconnect = function(connection) {};
