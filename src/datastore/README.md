# Datastore
This package provides some helpful tools to interact with
[Google Cloud Datastore](https://cloud.google.com/datastore/).

Core Features:
* A singleton Client
* Utilities to create opaque cross project keys

## A Singleton Client
### Motivation
There is a non-trivial overhead to creating an instance of the
datastore stock [DatastoreClient](https://github.com/googleapis/nodejs-datastore/blob/master/src/v1/datastore_client.js). Also, there is a slight memory overhead by creating many instances.

By introducing a [singleton approach](https://en.wikipedia.org/wiki/Singleton_pattern), we can ensure that we are sanely being memory efficient and also ensuring that we keeping integration tests, nice and fast.

### Proof of Concept
```
# Jest test
const DatastoreClient = require('gcloud_core/datastore/singletonClient');

test('ensure two clients with no arguments are same instance', () => {
  const client = new DatastoreClient(); // new
  const client2 = new DatastoreClient(); // new
  const instance = SingletonClient.getInstance(); // static call

  expect(client).toEqual(client2); // Equal in value
  expect(client).toBe(client2); // but also same object
  expect(instance).toBe(client1); // and also static getInstance returns same object
});
```

### General Usage
```
... todo


```
For more examples of working with Google Cloud Datastore, see the [quickstart](https://github.com/googleapis/nodejs-datastore/blob/master/samples/quickstart.js) and [concepts](https://github.com/googleapis/nodejs-datastore/blob/master/samples/concepts.js) samples.

### Caution
* We do not support creating simultaneous Clients with distinct configuration options.


## Portable Key String Representation
### Motivation
