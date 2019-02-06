"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Our Datastore Exception Types

// Transpiling hack: see: https://medium.com/@xpl/javascript-deriving-from-error-properly-8d2f8f315801
var InvalidDatastoreKey = function (_Error) {
  (0, _inherits3.default)(InvalidDatastoreKey, _Error);

  function InvalidDatastoreKey(message) {
    (0, _classCallCheck3.default)(this, InvalidDatastoreKey);

    var _this = (0, _possibleConstructorReturn3.default)(this, (InvalidDatastoreKey.__proto__ || Object.getPrototypeOf(InvalidDatastoreKey)).call(this, message));

    _this.constructor = InvalidDatastoreKey;
    _this.__proto__ = InvalidDatastoreKey.prototype;
    _this.message = message;
    return _this;
  }

  return InvalidDatastoreKey;
}(Error);

var InvalidResourceId = function (_Error2) {
  (0, _inherits3.default)(InvalidResourceId, _Error2);

  function InvalidResourceId(message) {
    (0, _classCallCheck3.default)(this, InvalidResourceId);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (InvalidResourceId.__proto__ || Object.getPrototypeOf(InvalidResourceId)).call(this, message));

    _this2.constructor = InvalidResourceId;
    _this2.__proto__ = InvalidResourceId.prototype;
    _this2.message = message;
    return _this2;
  }

  return InvalidResourceId;
}(Error);

var UnexpectedDatastoreKind = function (_Error3) {
  (0, _inherits3.default)(UnexpectedDatastoreKind, _Error3);

  function UnexpectedDatastoreKind(message) {
    (0, _classCallCheck3.default)(this, UnexpectedDatastoreKind);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (UnexpectedDatastoreKind.__proto__ || Object.getPrototypeOf(UnexpectedDatastoreKind)).call(this, message));

    _this3.constructor = UnexpectedDatastoreKind;
    _this3.__proto__ = UnexpectedDatastoreKind.prototype;
    _this3.message = message;
    return _this3;
  }

  return UnexpectedDatastoreKind;
}(Error);

module.exports = {
  InvalidDatastoreKey: InvalidDatastoreKey,
  InvalidResourceId: InvalidResourceId,
  UnexpectedDatastoreKind: UnexpectedDatastoreKind
};