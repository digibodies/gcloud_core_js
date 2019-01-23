const {Datastore} = require('@google-cloud/datastore');
const ds = require('../../src/datastore/utils');

const client = new Datastore();

test('datastore key with keyname encodes', () => {
  let key = client.key(['UserEntity', 'does_not_exist']);
  expect(ds.toResourceId(key)).toEqual('VXNlckVudGl0eR5kb2VzX25vdF9leGlzdA');
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

  let key2 = client.key(['Event', 5691902590451712]);
  expect(ds.fromResourceId(client, 'RXZlbnQeHzU2OTE5MDI1OTA0NTE3MTI')).toEqual(key2);
});

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



test('get entity by resource id success', async () => {
  // Setup Test
  let key = client.key(['UserEntity', 1]);

  // Prepares the new entity
  const user = {
    key: key,
    data: {
      username: 'ricksanchez',
      given_name: 'Rick',
      last_name: 'Sanchez',
    },
  };

  try {
    await client.save(user);
  } catch(err) {
    throw new Error('Unable to connect to datastore emulator. Is it running (`make test-env`) and the `DATASTORE_EMULATOR_HOST` is correct in the Makefile? Original Error: ' + err.message);
  };

  let resource_id = ds.toResourceId(key);

  // Run Code to test
  let result = await ds.getEntityByResourceId(client, 'UserEntity', resource_id);

  // Check Results
  expect(result.username).toEqual('ricksanchez');
});
