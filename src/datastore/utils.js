// Datastore stuff
const {InvalidDatastoreKey} = require('./errors');
const {InvalidResourceId} = require('./errors');
const {UnexpectedDatastoreKind} = require('./errors');

const SEPARATOR = String.fromCharCode(30);
const INTPREFIX = String.fromCharCode(31);

function toResourceId(key) {
  /*
    Convert a ndb.Key() into a portable `str` resource id
    :param key: An instance of `ndb.Key`
  */
  //https://github.com/googleapis/nodejs-datastore/blob/master/samples/concepts.js

  // Ducktype check the key
  if (!key || !key.path) {
    throw new InvalidDatastoreKey('Argument Key must be an instance of Datastore Key');
  }

  // Validate that key is persisted - last val will be undefined
  if (key.path[key.path.length-1] === undefined) {
    throw new InvalidDatastoreKey('Key does not appear to be persisted to datastore. Received path: ' + key.path);
  }

  let bits = key.path.map((bit, i) => {
    if (i % 2 === 1) {
      if (typeof bit === 'number') {
        bit = INTPREFIX + bit.toString();
      }
      else if (typeof bit == 'string') {
        // TODO: This will convert "1234" to 1234, which...
        // node + google + 64 bit ints = chaos

        let maybeInt = Number(bit);
        if (maybeInt != NaN) {

          bit = INTPREFIX + bit.toString();
        }
      }
    }
    return bit;
  });

  let buff = Buffer.from(bits.join(SEPARATOR));
  let base64data = buff.toString('base64');
  return base64data.replace(new RegExp('=', 'g'), '');
};

function fromResourceId(datastoreClient, resource_id) {
  // Validate Datastore Client - ducktype...
  if (typeof datastoreClient.key != 'function') {
    throw new TypeError('First argumemnt should be an instance of DatastoreClient');
  }

  // Validate resourceId
  if (!resource_id || typeof resource_id != 'string' || resource_id === '') {
    throw new InvalidResourceId('Resource Ids must be an instance of str. Received:' + resource_id);
  }

  let buff = Buffer.from(resource_id, 'base64');
  let text = buff.toString('utf8');
  let bits = text.split(SEPARATOR);

  let path = bits.map((bit) => {
    if (bit[0] == INTPREFIX) {
      let intStr = bit.replace(INTPREFIX, '');
      // Note: This seems to be working with 16digit longs
      bit = Number(intStr);
    }
    return bit;
  });

  let key = datastoreClient.key(path);
  return key;
}

async function getEntityByResourceId(datastoreClient, expected_kind, resource_id) {
  // TODO: Better handling of errors

  if (!resource_id || typeof resource_id != 'string' || resource_id == '') {
    throw new InvalidResourceId('Resource Ids must be an instance of str. Received:' + resource_id);
  }

  let key = fromResourceId(datastoreClient, resource_id);
  if (key.kind != expected_kind) {
    throw new UnexpectedDatastoreKind('Expected key for kind ' + expected_kind + ' but found kind ' + key.kind + ' instead.');
  }

  let result = await datastoreClient.get(key);

  let [entity] = result;
  return entity;
}

module.exports = {
  toResourceId: toResourceId,
  fromResourceId: fromResourceId,
  getEntityByResourceId: getEntityByResourceId
};
