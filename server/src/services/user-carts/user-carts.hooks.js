const { authenticate } = require('@feathersjs/authentication').hooks;
const authenticateUserStanding = require('../../hooks/authenticate-user-standing');

const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');
const authorizeUserAdmin = require('../../hooks/authorize-user-admin');

module.exports = {
  before: {
    all: [ authenticate('jwt'), authenticateUserStanding(), assignParamSysAdminUser() ],
    find: [],
    get: [
      authorizeUserAdmin()
    ],
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
