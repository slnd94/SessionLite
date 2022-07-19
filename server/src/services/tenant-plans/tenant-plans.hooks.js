const { authenticate } = require('@feathersjs/authentication').hooks;
const authenticateUserStanding = require('../../hooks/authenticate-user-standing');
const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');
const authorizeTenantAdmin = require('../../hooks/authorize-tenant-admin');

module.exports = {
  before: {
    all: [ authenticate('jwt'), authenticateUserStanding(), assignParamSysAdminUser() ],
    find: [],
    get: [authorizeTenantAdmin()],
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
