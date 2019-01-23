'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Wrapper to the datastore Client to provide a singleton
// https://github.com/googleapis/nodejs-datastore/issues/263#issuecomment-452171338
var _require = require('@google-cloud/datastore'),
    Datastore = _require.Datastore;

var instance = null;

var SingletonClient = function () {
  function SingletonClient(options) {
    _classCallCheck(this, SingletonClient);

    if (!instance) {
      instance = new Datastore(options);
    }
    return instance;
  }

  _createClass(SingletonClient, null, [{
    key: 'getInstance',
    value: function getInstance() {
      return instance;
    }
  }]);

  return SingletonClient;
}();

module.exports = SingletonClient;