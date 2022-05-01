const { authenticate } = require('@feathersjs/authentication').hooks;
const { protect } = require('@feathersjs/authentication-local').hooks;

const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');

const authorizeUserAdmin = require('../../hooks/authorize-user-admin');

const beforeCreateUserAccount = require('../../hooks/before-create-user-account');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [
      authenticate('jwt'), assignParamSysAdminUser(), authorizeUserAdmin()
    ],
    create: [
      (context) => {
        // this will retain our access to the unhashed pw,
        // so we can authenticate the user in the "after create" hook
        context.data.unhashedPassword = context.data.password;
      }, 
      beforeCreateUserAccount()
    ],
    update: [],
    patch: [
      authenticate('jwt'), assignParamSysAdminUser(), authorizeUserAdmin()
    ],
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
