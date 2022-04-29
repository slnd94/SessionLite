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
      protect('password', 'sysAdmin', 'emailVerificationKey')
    ],
    get: [
      // Always must be the last hook
      protect('password', 'sysAdmin', 'emailVerificationKey')
    ],
    create: [
      // Always must be the last hook
      protect('password', 'sysAdmin', 'emailVerificationKey')
    ],
    update: [
      // Always must be the last hook
      protect('password', 'sysAdmin', 'emailVerificationKey')
    ],
    patch: [
      // Always must be the last hook
      protect('password', 'sysAdmin', 'emailVerificationKey')
    ],
    remove: [
      // Always must be the last hook
      protect('password', 'sysAdmin', 'emailVerificationKey')
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
