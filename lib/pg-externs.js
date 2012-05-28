


/**
 * Имя нативной части модуля.
 * 
 * @namespace 
 */
var __pg = {};


/**
 * Соединение с базой данных.
 * 
 * @see http://www.postgresql.org/docs/9.0/static/libpq-connect.html
 * @param {string} optionsString Строка настроек подключенимя.
 * @param {function(Error, ?number)} callback Обработчик подключения. Первый
 * 		  аргумент обработчика - ошибка подключения, второй аргумент -
 * 		  дескриптор подключения.
 */
__pg.connect = function(optionsString, callback) {};


/**
 * Запрос в базу данных.
 * 
 * @param {number} connection Дескриптор подключения.
 * @param {string} query Строка запроса в базу.
 * @param {function(Error, Array.<!Object.<string, string>>)} callback Обработчик
 * 		  результата запроса. Первый агрумент - ошибка запроса, второй - 
 * 		  результат запроса.
 */
__pg.exec = function(connection, query, callback) {};


/**
 * Проверка занятости подключения. ПОдключения является занятым в том случае, 
 * если обрабатывается запрос. 
 * 
 * В случае если в качестве дескриптора передан недуопустимый агрумент в 
 * результате проверки возвращается <code>false</code>.
 * 
 * @param {number} connection Дескриптор подключения.
 * @return {boolean} Результат проверки. 
 */
__pg.isBusy = function(connection) {};


/**
 * Проверка работоспособности подключения.
 * 
 * @param {number} connection Дескриптор подключения.
 * @return {boolean} Результат проверки. 
 */
__pg.isValid = function(connection) {};


/**
 * Закрытие подключения.
 * 
 * @param {number} connection Дескриптор подключения.
 */
__pg.disconnect = function(connection) {};
