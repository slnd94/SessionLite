const { authenticate } = require('@feathersjs/authentication').hooks;
const { protect } = require('@feathersjs/authentication-local').hooks;
const authenticateUserStanding = require('../../hooks/authenticate-user-standing');
const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');
const authorizeTenantUser = require('../../hooks/authorize-tenant-user');
const authorizeUserAdmin = require('../../hooks/authorize-user-admin');

module.exports = {
  before: {
    all: [ authenticate('jwt'), authenticateUserStanding(), assignParamSysAdminUser() ],
    find: [authorizeTenantUser(), authorizeUserAdmin()],
    get: [],
    create: [],
    update: [],
    patch: [
      authorizeUserAdmin()
    ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
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
