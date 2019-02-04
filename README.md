# gcloud_core_js
A set of helpers to work with Google Cloud as part of the [core](https://digibodies.github.io/core/) bundle of tools.

Usage
-------------
### Singleton Node v1 Datastore Client
We wrap the `@google-cloud/datastore` Datastore client so that it produces a singleton instance for better performance when it doesn't make sense to pass the client instance throughout the call stack.

```
const gcloud_core = require('gcloud_core');
const DatastoreClient = gcloud_core.datastore.Client;

// Creates a Singleton of Datastore Client
const dsClient = new DatastoreClient();

// Do normal Datastore v1 Node Client things
let key = dsClient.key(['Event', 12345]);
let [entity] = await dsClient.get(key);
See more at: https://github.com/googleapis/nodejs-datastore
```

### Serializing/Deserializing Datastore Keys for Portability
Datastore keys have the project id built into them and this can be terrible when working with multiple projects. We define our own serialization and deserialization methods so that these can be stored in tertiary databases as well as used in urls, etc.

```
let key = dsClient.key(['UserEntity', 5691912590451712]);

// Encode ResourceId from constructed key
let resourceId = ds.toResourceId(key);
expect(resourceId).toEqual('VXNlckVudGl0eR4fNTY5MTkxMjU5MDQ1MTcxMg');

// Encode from entity's key (assume entity with key is persisted)
let [entity] = await dsClient.get(key);
expect(ds.toResourceId(entity[dsClient.KEY])).toEqual('VXNlckVudGl0eR4fNTY5MTkxMjU5MDQ1MTcxMg');

// Decode into datastore key
let key2 = ds.fromResourceId(dsClient, 'VXNlckVudGl0eR4fNTY5MTkxMjU5MDQ1MTcxMg');
expect(key2.path).toEqual(['UserEntity', 5691912590451712]);
```
### Helpers

** getEntityByResourceId**

```
// Get entity by resourceId with expected kind validation
const resourceId = 'VXNlckVudGl0eR4fNTY5MTkxMjU5MDQ1MTcxMg'
let result = await ds.getEntityByResourceId(dsClient, 'UserEntity', resource_id);
```
With Kind validation:
```
// Get entity by resourceId with invalid kind
try {
  await ds.getEntityByResourceId(dsClient, 'Event', 'VXNlckVudGl0eR4fNTY5MTkxMjU5MDQ1MTcxMg');
  expect.fail('Call unexpectedly passed');
} catch (e) {
  expect(e.message).toEqual('Expected key for kind Event but found kind UserEntity instead.');
}
```


Installation
-------------
This library is not yet available as a npm package. For now, please install from github source.

#### v0.x
```
  "dependencies": {
    ...
    "gcloud_core": "https://github.com/digibodies/gcloud_core_js.git#v0.0.1",
    ...
}
```

### Local Development
We're working on the development docs, but for now these make commands should help.
```
// check out project
$ make install
$ make test-env // runs datastore emulator
$ make test // runs unit and integration tests
$ make build // build for release
```

### Running the Google Cloud Datastore Emulator
By default, the Datastore client will attempt to connect to the live datastore for your project-id on Google Cloud. This is not ideal for local development and testing. By default, the make commands above have environment variables established to make running against the locally installed emulator a snap for dev and testing.

To run the emulator, open a new terminal and run:
```
make test-env
```
If the domain/port logged out is different than *localhost:8081*, update the `DATASTORE_EMULATOR_HOST` variable in the Makefile.

#### Installing the Emulator
[See Google's Documentation](https://cloud.google.com/appengine/docs/standard/python/tools/migrate-cloud-datastore-emulator) for full instructions.

Quick install:
* Install [gcloud command line tools](https://cloud.google.com/sdk/install) if you have not already.
* Run `gcloud beta emulators datastore`. If you are prompted to install the Java 8 JDK, manually install it from [here](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html). Be sure to install the JDK and not the JRE.

#### Code Style
Please follow [these guidelines](https://github.com/felixge/node-style-guide) for writing node code. Yes, while this library was being converted from python, we broke several of these rules and are working to fix them.
