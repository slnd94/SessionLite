const { authenticate } = require('@feathersjs/authentication').hooks;
const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');
const authorizeClientAdmin = require('../../hooks/authorize-client-admin');

module.exports = {
  before: {
    all: [ authenticate('jwt'), assignParamSysAdminUser() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [authorizeClientAdmin()],
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
