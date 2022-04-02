const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const authenticateUserOnSignup = require('../../hooks/authenticate-user-on-signup');

const beforeCreateUsers = require('../../hooks/before-create-users');

const protectUserSysAdminWrite = require('../../hooks/protect-user-sys-admin-write');

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [(context) => {
      // this will retain our access to the unhashed pw,
      // so we can authenticate the user in the "after create" hook
      context.data.unhashedPassword = context.data.password;
    }, hashPassword('password'), beforeCreateUsers(), protectUserSysAdminWrite()],
    update: [ hashPassword('password'),  authenticate('jwt'), protectUserSysAdminWrite() ],
    patch: [ hashPassword('password'),  authenticate('jwt'), protectUserSysAdminWrite() ],
    remove: [ authenticate('jwt'), protectUserSysAdminWrite() ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      // protect('password')
    ],
    find: [
      // Always must be the last hook
      protect('password', 'sysAdmin')
    ],
    get: [
      // Always must be the last hook
      protect('password', 'sysAdmin')
    ],
    create: [
      authenticateUserOnSignup(),
      // Always must be the last hook
      protect('password', 'sysAdmin')
    ],
    update: [
      // Always must be the last hook
      protect('password', 'sysAdmin')
    ],
    patch: [
      // Always must be the last hook
      protect('password', 'sysAdmin')
    ],
    remove: [
      // Always must be the last hook
      protect('password', 'sysAdmin')
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
