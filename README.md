# gcloud_core_js
A set of helpers to work with Google Cloud as part of the [core](https://digibodies.github.io/core/) bundle of tools.

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
$ make test-env // runs datastore emualtor
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
