// Tests around the singleton client
const {Datastore} = require('@google-cloud/datastore');
const SingletonClient = require('../../src/datastore/singletonClient');

test('that two instances of stock Datastore client are separate objects', () => {
  // This is a sanity check to ensure we need a singleton approach
  const client1 = new Datastore();
  const client2 = new Datastore();

  expect(client1).toEqual(client2); // Equal in value
  expect(client1).not.toBe(client2); // but different objects
});

test('two clients with no arguments are same instance', () => {
  const client1 = new SingletonClient();
  const client2 = new SingletonClient();
  const instance = SingletonClient.getInstance();

  expect(client1).toEqual(client2); // Equal in value
  expect(client1).toBe(client2); // but same object
  expect(instance).toBe(client1); // and also getInstance returns same object
});

test('stock datastore and singleton datastore produce equivalent keys', () => {
  const singletonClient = new SingletonClient();
  const stockClient = new Datastore();

  let key = singletonClient.key(['UserEntity', 1]);
  let key1 = stockClient.key(['UserEntity', 1]);

  expect(key).toEqual(key1);
});

test('stock datastore and singleton datastore produce same fetch results', async () => {
  const singletonClient = new SingletonClient();
  const stockClient = new Datastore();

  // Note: This test will interact with datastore unless we have the emulator running
  let key = stockClient.key(['UserEntity', 1]);

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
    await stockClient.save(user);
  } catch(err) {
    throw new Error('Unable to connect to datastore. Is the emulatoor running (`make test-env`) and the `DATASTORE_EMULATOR_HOST` is correct in the Makefile? Original Error: ' + err.message);
  };

  const result1 = await stockClient.get(key);
  const result2 = await singletonClient.get(key);

  expect(result1).toEqual(result2);
});
