const { authenticate } = require('@feathersjs/authentication').hooks;
const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');
const { iff } = require('feathers-hooks-common');

const assignParamClientAdminUser = require('../../hooks/assign-param-client-admin-user');

module.exports = {
  before: {
    all: [],
    find: [
      iff(context => (context.params.headers && context.params.headers.authorization), authenticate('jwt')),
      assignParamSysAdminUser(),
      assignParamClientAdminUser()
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
