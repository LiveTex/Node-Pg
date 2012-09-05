


/**
 * @constructor
 */
pg.Pool = function() {
  var self = this;

  /**
   * @type {!Array.<string>}
   */
  this.__jointQueries = [];

  /**
   * @type {!Array.<function(Error)>}
   */
  this.__jointCallbacks = [];

  /**
   * @type {boolean}
   */
  this.__isDeffered = false;

  /**
   * @type {number}
   */
  this.__defferingTime = 0;

  /**
   * @type {function()}
   */
  this.__execjointQuery = function() {
    var query = self.__jointQueries.join(';');
    var callbacks = self.__jointCallbacks.slice(0);

    __pg.exec(query, function(error) {
      var i = 0,
          l = callbacks.length;

      while (i < l) {
        callbacks[i](error);

        i += 1;
      }

      callbacks.length = 0;
    });

    self.__isDeffered = false;
    self.__jointQueries.length = 0;
    self.__jointCallbacks.length = 0;
  };
};


/**
 * @param {number} size Размер пула.
 * @param {!Object} options Настройки соединения с базой.
 * @param {number=} opt_defferingTime Время накобления выполняюзих запросов.
 */
pg.Pool.prototype.init = function(size, options, opt_defferingTime) {
  __pg.init(size, querystring.unescape(querystring.stringify(options, ' ')),
      function(error) {
        console.log(error);
      }
  );

  if (opt_defferingTime !== undefined) {
    this.__defferingTime = opt_defferingTime;
  }
};


/**
 * @param {string} query Запрос.
 * @param {function(Error, pg.ResultTable)} callback Обработчик результата.
 */
pg.Pool.prototype.exec = function(query, callback) {
  __pg.exec(query, callback);
};


/**
 * @param {string} query Запрос.
 * @param {function(Error)} callback Обработчик результата.
 */
pg.Pool.prototype.jointExec = function(query, callback) {
  this.__jointQueries.push(query);
  this.__jointCallbacks.push(callback);

  if (this.__isDeffered === false) {
    if (this.__defferingTime === 0) {
      process.nextTick(this.__execjointQuery);
    } else {
      setTimeout(this.__execjointQuery, this.__defferingTime);
    }

    this.__isDeffered = true;
  }
};


/**
 * Разрушение пула.
 */
pg.Pool.prototype.destroy = function() {
  __pg.destroy();
};

