'use strict';

// Datastore helpers
var _require = require('./key_utils'),
    toResourceId = _require.toResourceId,
    fromResourceId = _require.fromResourceId,
    getEntityByResourceId = _require.getEntityByResourceId;

var singletonClient = require('./singletonClient');

module.exports = {
  Client: singletonClient,
  toResourceId: toResourceId,
  fromResourceId: fromResourceId,
  getEntityByResourceId: getEntityByResourceId,

  get_resource_id_from_key: toResourceId,
  get_key_from_resource_id: fromResourceId,
  get_entity_by_resource_id: getEntityByResourceId
};