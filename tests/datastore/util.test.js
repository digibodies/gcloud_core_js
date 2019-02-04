// Tests for datastore utils

const {InvalidDatastoreKey} = require('../../src/datastore/errors');
const {InvalidResourceId} = require('../../src/datastore/errors');
const {UnexpectedDatastoreKind} = require('../../src/datastore/errors');
const {Datastore} = require('@google-cloud/datastore');
const ds = require('../../src/datastore/utils');
const dsClient = new Datastore();

describe('Get Resource Id From Key', () => {
  test('Should resolve datastore key with string keyname', () => {
    let key = dsClient.key(['UserEntity', 'does_not_exist']);
    expect(ds.toResourceId(key)).toEqual('VXNlckVudGl0eR4fZG9lc19ub3RfZXhpc3Q');
    // TODO: 'VXNlckVudGl0eR5kb2VzX25vdF9leGlzdA' ???
  });

  test('Should resolve datastore key with large id', () => {
    // The importance of this test is to ensure that the autoid policy is handled correctly
    let key = dsClient.key(['Event', 5691902590451712]);
    expect(ds.toResourceId(key)).toBe('RXZlbnQeHzU2OTE5MDI1OTA0NTE3MTI');
  });

  test('Should resolve key with small id', () => {
    let key = dsClient.key(['UserEntity', 1]);
    expect(ds.toResourceId(key)).toEqual('VXNlckVudGl0eR4fMQ');
  });

  test('Should throw on invalid key type', () => {
    // null
    expect(() => {
      ds.toResourceId(null);
    }).toThrow(InvalidDatastoreKey);

    // object w/o path prop
    expect(() => {
      ds.toResourceId({});
    }).toThrow(InvalidDatastoreKey);

  });

  test('Should throw on odd number of pairs', () => {
    expect(() => {
      ds.toResourceId(dsClient.key(['SomeKind', 1234, 'SubKind']));
    }).toThrow(InvalidDatastoreKey);
  });
});

describe('Get Datastore Key From Resource Id', () => {
  test('Should encode key with string keyname', () => {
    let key1 = dsClient.key(['UserEntity', 'does_not_exist']);
    expect(ds.fromResourceId(dsClient, 'VXNlckVudGl0eR5kb2VzX25vdF9leGlzdA')).toEqual(key1);

    let key2 = dsClient.key(['Venue', 'gamut']);
    expect(ds.fromResourceId(dsClient, 'VmVudWUeZ2FtdXQ')).toEqual(key2);
  });

  test('Should resolve from key with small id', () => {
    let key1 = dsClient.key(['UserEntity', 1]);
    expect(ds.fromResourceId(dsClient, 'VXNlckVudGl0eR4fMQ')).toEqual(key1);
  });

  test('Should resolve from key with 16 digit auto id policy', () => {
    // The importance of this test is to ensure that the autoid policy is handled correctly

    let key = dsClient.key(['Event', 5691902590451712]);
    expect(key.path[1]).toEqual(5691902590451712);

    let result = ds.fromResourceId(dsClient, 'RXZlbnQeHzU2OTE5MDI1OTA0NTE3MTI');
    expect(result).toEqual(key);
    expect(result.path[1]).toEqual(5691902590451712);
  });

  test('Should throw on invalid resource id type', () => {
    // resource id null
    expect(() => {
      ds.fromResourceId(dsClient, null);
    }).toThrow(InvalidResourceId);

    // resource id empty string
    expect(() => {
      ds.fromResourceId(dsClient, '');
    }).toThrow(InvalidResourceId);

    // resource id  int
    expect(() => {
      ds.fromResourceId(dsClient, 612);
    }).toThrow(InvalidResourceId);
  });

  // client doesn't appear to be DatastoreClient instance
  test('Should throw on invalid resource id type', () => {
    expect(() => {
      ds.fromResourceId('', 'RXZlbnQeHzU2OTE5MDI1OTA0NTE3MTI');
    }).toThrow(TypeError);
  });

  // TODO: Add Test for when key pairs are not even
});

describe('Resource ID Serialization and Deserialization', () => {
  test('should work as expected end to end.', async () => {
    // Note this is the test in the README

    let key = dsClient.key(['UserEntity', 5691912590451712]);

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
      await dsClient.save(user);
    } catch(err) {
      throw new Error('Unable to connect to datastore emulator. Is it running (`make test-env`) and the `DATASTORE_EMULATOR_HOST` is correct in the Makefile? Original Error: ' + err.message);
    };

    // Encode from raw key
    let resourceId = ds.toResourceId(key);
    expect(resourceId).toEqual('VXNlckVudGl0eR4fNTY5MTkxMjU5MDQ1MTcxMg');

    // Encode from entity's key
    let [entity] = await dsClient.get(key);
    expect(ds.toResourceId(entity[dsClient.KEY])).toEqual('VXNlckVudGl0eR4fNTY5MTkxMjU5MDQ1MTcxMg');

    // Decode into datastore key
    let key2 = ds.fromResourceId(dsClient, 'VXNlckVudGl0eR4fNTY5MTkxMjU5MDQ1MTcxMg');
    expect(key2.path).toEqual(['UserEntity', 5691912590451712]);
  });
});


describe('Get Datastore Entity by resource_id', () => {
  test('should resolve in base case', async () => {
    // TODO: This is an integration tests.

    // Setup Test with `long` key id
    let key = dsClient.key(['UserEntity', 5691912590451712]);

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
      await dsClient.save(user);
    } catch(err) {
      throw new Error('Unable to connect to datastore emulator. Is it running (`make test-env`) and the `DATASTORE_EMULATOR_HOST` is correct in the Makefile? Original Error: ' + err.message);
    };

    // Convert entity to resource id
    let resource_id = ds.toResourceId(key);
    expect(resource_id).toEqual('VXNlckVudGl0eR4fNTY5MTkxMjU5MDQ1MTcxMg');

    // Get Entity by resource id
    let result = await ds.getEntityByResourceId(dsClient, 'UserEntity', resource_id);

    // Check Results
    expect(result.username).toEqual('ricksanchez');

    // Finally check the id against what was pulled from datastore...
    expect(ds.toResourceId(result[dsClient.KEY])).toBe('VXNlckVudGl0eR4fNTY5MTkxMjU5MDQ1MTcxMg');
  });

  test('should throw error with invalid kind', async () => {
    try {
      await ds.getEntityByResourceId(dsClient, 'UserEntity', 'RXZlbnQeHzU2OTE5MDI1OTA0NTE3MTI');
      expect.fail('Call unexpectedly passed');
    } catch (e) {
      // Note: we could use .toThrow but we can't check msg and type...
      expect(e).toBeInstanceOf(UnexpectedDatastoreKind);
      expect(e.message).toEqual('Expected key for kind UserEntity but found kind Event instead.');
    }
  });
});

/*
test('get entity by resource id success', async () => {
  let resource_id = 'T3JnYW5pemF0aW9uRW50aXR5Hh81NjUyNzg2MzEwMDIxMTIw';
  let result = await ds.getEntityByResourceId(dsClient, 'OrganizationEntity', resource_id);
  console.log(result); // undefined...
});

test('XXget entity by resource id success', async () => {
  // Python generated
  let resource_id = 'T3JnYW5pemF0aW9uRW50aXR5Hh81NjUyNzg2MzEwMDIxMTIw';
  let result = await ds.getEntityByResourceId(dsClient, 'OrganizationEntity', resource_id);
  console.log(result); // undefined...
  console.log(ds.toResourceId(result[dsClient.KEY]))


  console.log('........................');

  // Node Generated
  let resource_id1 = 'T3JnYW5pemF0aW9uRW50aXR5HjU2NTI3ODYzMTAwMjExMjA';
  let result1 = await ds.getEntityByResourceId(dsClient, 'OrganizationEntity', resource_id1);
  console.log(result1); // undefined...
});
*/



/*
test('resource id with incorrect padding errors', () => {
  let key1 = dsClient.key(['UserEntity', 1]);
  expect(ds.fromResourceId(dsClient, 'VXNlckVudGl0eR5k3')).toEqual(key1);
});
*/


/*

    def test_incorrect_padding(self):
        with self.assertRaises(InvalidIdException):
            get_key_from_resource_id('VXNlckVudGl0eR5k3')
*/



/*
   def test_odd_params(self):
       dsClient = Client()

       # Single - this is a valid key prior to being persisted
       key = dsClient.key('UserEntity')
       with self.assertRaises(InvalidKeyException):
           get_resource_id_from_key(key)

       # Triple - this is a valid key prior to being persisted
       key = dsClient.key('UserEntity', 1, 'Child')
       with self.assertRaises(InvalidKeyException):
           raise Exception(get_resource_id_from_key(key))


*/
