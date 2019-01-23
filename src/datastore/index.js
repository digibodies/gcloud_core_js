// Datastore helpers
const {toResourceId, fromResourceId} = require('./key_utils');
const singletonClient = require('./singletonClient');

module.exports = {
  Client: singletonClient,
  toResourceId: toResourceId,
  fromResourceId:fromResourceId,
  get_resource_id_from_key: toResourceId,
  get_key_from_resource_id: fromResourceId,
};
