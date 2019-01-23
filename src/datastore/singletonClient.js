// Wrapper to the datastore Client to provide a singleton
// https://github.com/googleapis/nodejs-datastore/issues/263#issuecomment-452171338
const {Datastore} = require('@google-cloud/datastore');

let instance = null;

class SingletonClient {
  constructor (options) {
    if (!instance) {
      instance = new Datastore(options);
    }
    return instance;
  }

  static getInstance() {
    return instance;
  }
}

module.exports = SingletonClient;
