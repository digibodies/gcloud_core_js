'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getEntityByResourceId = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(datastoreClient, expected_kind, resource_id) {
    var key, result, _result, entity;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!resource_id || typeof resource_id != 'string' || resource_id == '')) {
              _context.next = 2;
              break;
            }

            throw TypeError('Resource Ids must be an instance of str. Received:' + resource_id);

          case 2:
            key = fromResourceId(datastoreClient, resource_id);

            if (!(key.kind != expected_kind)) {
              _context.next = 5;
              break;
            }

            throw Error('Expected key for kind ' + expected_kind + ' but found kind ' + key.kind + ' instead.');

          case 5:
            _context.next = 7;
            return datastoreClient.get(key);

          case 7:
            result = _context.sent;
            _result = (0, _slicedToArray3.default)(result, 1), entity = _result[0];
            return _context.abrupt('return', entity);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getEntityByResourceId(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Datastore stuff
var SEPARATOR = String.fromCharCode(30);
var INTPREFIX = String.fromCharCode(31);

function toResourceId(key) {
  /*
    Convert a ndb.Key() into a portable `str` resource id
    :param key: An instance of `ndb.Key`
  */
  //https://github.com/googleapis/nodejs-datastore/blob/master/samples/concepts.js

  var bits = key.path.map(function (bit, i) {
    if (i % 2 === 1) {
      if (typeof bit === 'number') {
        bit = INTPREFIX + bit.toString();
      } else if (typeof bit == 'string') {
        // TODO: This will convert "1234" to 1234, which...
        // node + google + 64 bit ints = chaos

        var maybeInt = Number(bit);
        if (maybeInt != NaN) {

          bit = INTPREFIX + bit.toString();
        }
      }
    }
    return bit;
  });

  var buff = Buffer.from(bits.join(SEPARATOR));
  var base64data = buff.toString('base64');
  return base64data.replace(new RegExp('=', 'g'), '');
};

function fromResourceId(datastoreClient, resource_id) {
  var buff = Buffer.from(resource_id, 'base64');
  var text = buff.toString('utf8');
  var bits = text.split(SEPARATOR);

  var path = bits.map(function (bit) {
    if (bit[0] == INTPREFIX) {
      var intStr = bit.replace(INTPREFIX, '');
      // Note: This seems to be working with 16digit longs
      bit = Number(intStr);
    }
    return bit;
  });

  var key = datastoreClient.key(path);
  return key;
}

module.exports = {
  toResourceId: toResourceId,
  fromResourceId: fromResourceId,
  getEntityByResourceId: getEntityByResourceId
};