const {Datastore} = require('@google-cloud/datastore');
const ds = require('../../src/datastore/utils');

const client = new Datastore();

test('datastore key with keyname encodes', () => {
  let key = client.key(['UserEntity', 'does_not_exist']);
  expect(ds.toResourceId(key)).toEqual('VXNlckVudGl0eR4fZG9lc19ub3RfZXhpc3Q');
  // TODO: 'VXNlckVudGl0eR5kb2VzX25vdF9leGlzdA' ???
});

test('datastore key with keyname encodes real key', () => {
  let key = client.key(['Event', 5691902590451712]);
  expect(ds.toResourceId(key)).toBe('RXZlbnQeHzU2OTE5MDI1OTA0NTE3MTI');
});

test('datastore key with id encodes', () => {
  let key = client.key(['UserEntity', 1]);
  expect(ds.toResourceId(key)).toEqual('VXNlckVudGl0eR4fMQ');
});

test('resource id from key with keyname decodes', () => {
  let key1 = client.key(['UserEntity', 'does_not_exist']);
  expect(ds.fromResourceId(client, 'VXNlckVudGl0eR5kb2VzX25vdF9leGlzdA')).toEqual(key1);

  let key2 = client.key(['Venue', 'gamut']);
  expect(ds.fromResourceId(client, 'VmVudWUeZ2FtdXQ')).toEqual(key2);
});

test('resource id from key with id decodes', () => {
  let key1 = client.key(['UserEntity', 1]);
  expect(ds.fromResourceId(client, 'VXNlckVudGl0eR4fMQ')).toEqual(key1);
});

test('resource id from key with 16 digit auto id policy decodes', () => {
  // The importance of this test is to ensure that the autoid policy is handled correctly

  let key = client.key(['Event', 5691902590451712]);
  expect(key.path[1]).toEqual(5691902590451712);

  let result = ds.fromResourceId(client, 'RXZlbnQeHzU2OTE5MDI1OTA0NTE3MTI');
  expect(result).toEqual(key);
  expect(result.path[1]).toEqual(5691902590451712);
});


test('get entity by resource id success', async () => {
  // TODO: This is an integration tests

  // Setup Test with `long` key id
  let key = client.key(['UserEntity', 5691912590451712]);

  // Prepares the new entity
  const user = {
    key: key,
    data: {
      username: 'ricksanchez',
      given_name: 'RickX',
      last_name: 'Sanchez',
    },
  };

  // Save the entity
  try {
    await client.save(user);
  } catch(err) {
    throw new Error('Unable to connect to datastore emulator. Is it running (`make test-env`) and the `DATASTORE_EMULATOR_HOST` is correct in the Makefile? Original Error: ' + err.message);
  };

  // Convert entity to resource id
  let resource_id = ds.toResourceId(key);
  expect(resource_id).toEqual('VXNlckVudGl0eR4fNTY5MTkxMjU5MDQ1MTcxMg')

  // Get Entity by resource id
  let result = await ds.getEntityByResourceId(client, 'UserEntity', resource_id);

  // Check Results
  expect(result.username).toEqual('ricksanchez');

  // Finally check the id against what was pulled from datastore...
  expect(ds.toResourceId(result[client.KEY])).toBe('VXNlckVudGl0eR4fNTY5MTkxMjU5MDQ1MTcxMg');
});

/*
test('get entity by resource id success', async () => {
  let resource_id = 'T3JnYW5pemF0aW9uRW50aXR5Hh81NjUyNzg2MzEwMDIxMTIw';
  let result = await ds.getEntityByResourceId(client, 'OrganizationEntity', resource_id);
  console.log(result); // undefined...
});

test('XXget entity by resource id success', async () => {
  // Python generated
  let resource_id = 'T3JnYW5pemF0aW9uRW50aXR5Hh81NjUyNzg2MzEwMDIxMTIw';
  let result = await ds.getEntityByResourceId(client, 'OrganizationEntity', resource_id);
  console.log(result); // undefined...
  console.log(ds.toResourceId(result[client.KEY]))


  console.log('........................');

  // Node Generated
  let resource_id1 = 'T3JnYW5pemF0aW9uRW50aXR5HjU2NTI3ODYzMTAwMjExMjA';
  let result1 = await ds.getEntityByResourceId(client, 'OrganizationEntity', resource_id1);
  console.log(result1); // undefined...
});
*/



/*
test('resource id with incorrect padding errors', () => {
  let key1 = client.key(['UserEntity', 1]);
  expect(ds.fromResourceId(client, 'VXNlckVudGl0eR5k3')).toEqual(key1);
});
*/


/*

    def test_incorrect_padding(self):
        with self.assertRaises(InvalidIdException):
            get_key_from_resource_id('VXNlckVudGl0eR5k3')
*/



/*
   def test_odd_params(self):
       client = Client()

       # Single - this is a valid key prior to being persisted
       key = client.key('UserEntity')
       with self.assertRaises(InvalidKeyException):
           get_resource_id_from_key(key)

       # Triple - this is a valid key prior to being persisted
       key = client.key('UserEntity', 1, 'Child')
       with self.assertRaises(InvalidKeyException):
           raise Exception(get_resource_id_from_key(key))


*/
