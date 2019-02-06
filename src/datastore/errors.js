// Our Datastore Exception Types

// Transpiling hack: see: https://medium.com/@xpl/javascript-deriving-from-error-properly-8d2f8f315801
class InvalidDatastoreKey extends Error {
  constructor (message) {
    super (message);
    this.constructor = InvalidDatastoreKey;
    this.__proto__   = InvalidDatastoreKey.prototype;
    this.message     = message;
  }
}

class InvalidResourceId extends Error {
  constructor (message) {
    super (message);
    this.constructor = InvalidResourceId;
    this.__proto__   = InvalidResourceId.prototype;
    this.message     = message;
  }
}

class UnexpectedDatastoreKind extends Error {
  constructor (message) {
    super (message);
    this.constructor = UnexpectedDatastoreKind;
    this.__proto__   = UnexpectedDatastoreKind.prototype;
    this.message     = message;
  }
}

module.exports = {
  InvalidDatastoreKey,
  InvalidResourceId,
  UnexpectedDatastoreKind
};
