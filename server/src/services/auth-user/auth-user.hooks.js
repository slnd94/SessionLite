const { authenticate } = require('@feathersjs/authentication').hooks;
const { protect } = require('@feathersjs/authentication-local').hooks;
const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');

module.exports = {
  before: {
    all: [ authenticate('jwt'), assignParamSysAdminUser() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      // Always must be the last hook
      protect('password')
    ],
    get: [
      // Always must be the last hook
      protect('password')
    ],
    create: [
      // Always must be the last hook
      protect('password')
    ],
    update: [
      // Always must be the last hook
      protect('password')
    ],
    patch: [
      // Always must be the last hook
      protect('password')
    ],
    remove: [
      // Always must be the last hook
      protect('password')
    ]
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
