


/**
 * Имя модуля по-умолчанию.
 * 
 * @namespace 
 */
var pg = {};


/**
 * Соединение с базой данных.
 * 
 * @see http://www.postgresql.org/docs/9.0/static/libpq-connect.html
 * @param {string} optionsString Строка настроек подключенимя.
 * @param {function(Error, ?number)} Обработчик подключения. Первый аргумент 
 * 		  обработчика - ошибка подключения, второй аргумент - дескриптор 
 * 		  подключения.
 */
pg.connect = function(optionsString, callback) {};


/**
 * Запрос в базу данных.
 * 
 * @param {number} connection Дескриптор подключения.
 * @param {string} query Строка запроса в базу.
 * @param {function(Error, Array.<!Object.<string, string>>)} Обработчик 
 * 		  результата запроса. Первый агрумент - ошибка запроса, второй - 
 * 		  результат запроса.
 */
pg.exec = function(connection, query, callback) {};


/**
 * Проверка занятости подключения. ПОдключения является занятым в том случае, 
 * если обрабатывается запрос. 
 * 
 * В случае если в качестве дескриптора передан недуопустимый агрумент в 
 * результате проверки возвращается <code>false</code>.
 * 
 * @param {number} Дескриптор подключения.
 * @return {boolean} Результат проверки. 
 */
pg.isBusy = function(connection) {};


/**
 * Закрытие подключения.
 * 
 * @param {number} Дескриптор подключения.
 */
pg.disconnect = function(connection) {};
