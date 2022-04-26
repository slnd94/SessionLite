const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const authenticateUserOnSignup = require('../../hooks/authenticate-user-on-signup');

const beforeCreateUsers = require('../../hooks/before-create-users');

const protectUserSysAdminWrite = require('../../hooks/protect-user-sys-admin-write');

const protectUserEmailVerified = require('../../hooks/protect-user-email-verified');

const protectUserEmailVerificationKey = require('../../hooks/protect-user-email-verification-key');

const authorizeUserAdmin = require('../../hooks/authorize-user-admin');

const sendWelcomeVerificationEmail = require('../../hooks/send-welcome-verification-email');

const assignUserEmailVerified = require('../../hooks/assign-user-email-verified');

const assignUserEmailVerificationKey = require('../../hooks/assign-user-email-verification-key');

module.exports = {
  before: {
    all: [],
    find: [
      authenticate('jwt'),
      authorizeUserAdmin()
    ],
    get: [
      authenticate('jwt'),
      authorizeUserAdmin()
    ],
    create: [
      (context) => {
        // this will retain our access to the unhashed pw,
        // so we can authenticate the user in the "after create" hook
        context.data.unhashedPassword = context.data.password;
      }, 
      hashPassword('password'), 
      beforeCreateUsers(), 
      protectUserEmailVerified(),
      protectUserEmailVerificationKey(),
      assignUserEmailVerified(), 
      assignUserEmailVerificationKey(),
      protectUserSysAdminWrite()
    ],
    update: [ 
      hashPassword('password'),  
      authenticate('jwt'), 
      protectUserSysAdminWrite(),
      protectUserEmailVerified(),
      protectUserEmailVerificationKey()
    ],
    patch: [
      hashPassword('password'),
      authenticate('jwt'),
      protectUserSysAdminWrite(),
      protectUserEmailVerified(),
      protectUserEmailVerificationKey(),
      authorizeUserAdmin()
    ],
    remove: [ 
      authenticate('jwt'),
      protectUserSysAdminWrite(),
      protectUserEmailVerified(),
      protectUserEmailVerificationKey()
    ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      // protect('password')
    ],
    find: [
      // Always must be the last hook
      protect('password', 'sysAdmin', 'emailVerificationKey')
    ],
    get: [
      // Always must be the last hook
      protect('password', 'sysAdmin', 'emailVerificationKey')
    ],
    create: [
      sendWelcomeVerificationEmail(),
      authenticateUserOnSignup(), 
      // Always must be the last hook
      protect('password', 'sysAdmin', 'emailVerificationKey')
    ],
    update: [
      // Always must be the last hook
      protect('password', 'sysAdmin', 'emailVerificationKey')
    ],
    patch: [
      // Always must be the last 
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
