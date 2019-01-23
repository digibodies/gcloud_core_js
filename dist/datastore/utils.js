'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var getEntityByResourceId = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(datastoreClient, expected_kind, resource_id) {
    var _ref2, _ref3, entity;

    return regeneratorRuntime.wrap(function _callee$(_context) {
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
            _ref2 = _context.sent;
            _ref3 = _slicedToArray(_ref2, 1);
            entity = _ref3[0];
            return _context.abrupt('return', entity);

          case 11:
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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
    if (i % 2 === 1 && typeof bit === 'number') {
      bit = INTPREFIX + bit.toString();
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
      bit = Number(bit.replace(INTPREFIX, ''));
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