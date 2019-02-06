'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Wrapper to the datastore Client to provide a singleton
// https://github.com/googleapis/nodejs-datastore/issues/263#issuecomment-452171338
var _require = require('@google-cloud/datastore'),
    Datastore = _require.Datastore;

var instance = null;

var SingletonClient = function () {
  function SingletonClient(options) {
    (0, _classCallCheck3.default)(this, SingletonClient);

    if (!instance) {
      instance = new Datastore(options);
    }
    return instance;
  }

  (0, _createClass3.default)(SingletonClient, null, [{
    key: 'getInstance',
    value: function getInstance() {
      return instance;
    }
  }]);
  return SingletonClient;
}();

module.exports = SingletonClient;