const { authenticate } = require('@feathersjs/authentication').hooks;
const authenticateUserStanding = require('../../hooks/authenticate-user-standing');
const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');
const authorizeTenantUser = require('../../hooks/authorize-tenant-user');

module.exports = {
  before: {
    all: [ authenticate('jwt'), authenticateUserStanding(), assignParamSysAdminUser() ],
    find: [authorizeTenantUser()],
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
