const { authenticate } = require('@feathersjs/authentication').hooks;
const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');
const authorizeTenantAdmin = require('../../hooks/authorize-tenant-admin');

module.exports = {
  before: {
    all: [ authenticate('jwt'), assignParamSysAdminUser() ],
    find: [authorizeTenantAdmin()],
    get: [],
    create: [],
    update: [],
    patch: [authorizeTenantAdmin()],
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
