// Datastore helpers
const {toResourceId, fromResourceId, getEntityByResourceId} = require('./key_utils');
const singletonClient = require('./singletonClient');

module.exports = {
  Client: singletonClient,
  toResourceId: toResourceId,
  fromResourceId: fromResourceId,
  getEntityByResourceId: getEntityByResourceId,

  get_resource_id_from_key: toResourceId,
  get_key_from_resource_id: fromResourceId,
  get_entity_by_resource_id: getEntityByResourceId
};