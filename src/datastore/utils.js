// Datastore stuff
const SEPARATOR = String.fromCharCode(30);
const INTPREFIX = String.fromCharCode(31);

function toResourceId(key) {
  /*
    Convert a ndb.Key() into a portable `str` resource id
    :param key: An instance of `ndb.Key`
  */
  //https://github.com/googleapis/nodejs-datastore/blob/master/samples/concepts.js

  let bits = key.path.map((bit, i) => {
    if (i % 2 === 1 && typeof bit === 'number') {
      bit = INTPREFIX + bit.toString();
    }
    return bit;
  });

  let buff = Buffer.from(bits.join(SEPARATOR));
  let base64data = buff.toString('base64');
  return base64data.replace(new RegExp('=', 'g'), '');
};

function fromResourceId(datastoreClient, resource_id) {
  let buff = Buffer.from(resource_id, 'base64');
  let text = buff.toString('utf8');
  let bits = text.split(SEPARATOR);

  let path = bits.map((bit) => {
    if (bit[0] == INTPREFIX) {
      bit = Number(bit.replace(INTPREFIX, ''));
    }
    return bit;
  });

  let key = datastoreClient.key(path);
  return key;
}

async function getEntityByResourceId(datastoreClient, expected_kind, resource_id) {
  // TODO: Better handling of errors

  if (!resource_id || typeof resource_id != 'string' || resource_id == '') {
    throw TypeError('Resource Ids must be an instance of str. Received:' + resource_id);
  }

  key = fromResourceId(datastoreClient, resource_id);
  if (key.kind != expected_kind) {
    throw Error('Expected key for kind ' + expected_kind + ' but found kind ' + key.kind + ' instead.');
  }

  let [entity] = await datastoreClient.get(key);
  return entity;
}

module.exports = {
  toResourceId: toResourceId,
  fromResourceId: fromResourceId,
  getEntityByResourceId: getEntityByResourceId
};
