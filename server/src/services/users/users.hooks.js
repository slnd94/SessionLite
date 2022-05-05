const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const { iff, isProvider, keep, disallow } = require('feathers-hooks-common');

const protectUserSysAdminWrite = require('../../hooks/protect-user-sys-admin-write');

const protectUserEmailWrite = require('../../hooks/protect-user-email-write');

const protectUserVerificationWrite = require('../../hooks/protect-user-verification-write');

const authorizeUserAdmin = require('../../hooks/authorize-user-admin');

const keepFieldsExternal = [
  '_id',
  'name.family',
  'name.given',
  'email',
  'verification.emailVerified',
  'locked'
]

module.exports = {
  before: {
    all: [
    ],
    find: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt'),
      authorizeUserAdmin()
    ],
    get: [
      authenticate('jwt'),
      authorizeUserAdmin()
    ],
    create: [
      iff(isProvider('external'), disallow()),
      hashPassword('password'),  
    ],
    update: [ 
      iff(isProvider('external'), disallow()),
      hashPassword('password'),  
      authenticate('jwt'), 
      protectUserSysAdminWrite(),
      protectUserVerificationWrite()
    ],
    patch: [
      iff(isProvider('external'), disallow()),
      hashPassword('password'),
      authenticate('jwt'),
      protectUserSysAdminWrite(),
      protectUserEmailWrite(),
      protectUserVerificationWrite(),
      authorizeUserAdmin()
    ],
    remove: [ 
      iff(isProvider('external'), disallow()),
      authenticate('jwt'),
      protectUserSysAdminWrite(),
      protectUserEmailWrite(),
      protectUserSysAdminWrite(),
      protectUserVerificationWrite()
    ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      // protect('password')
    ],
    find: [
      // if the call is from external source, only keep the allowed fields
      iff(isProvider('external'), keep(...keepFieldsExternal)),
      // protect password at all times
      // Always must be the last hook
      protect('password')
    ],
    get: [
      // if the call is from external source, only keep the allowed fields
      iff(isProvider('external'), keep(...keepFieldsExternal)),
      // protect password at all times
      // Always must be the last hook
      protect('password')
    ],
    create: [
      // if the call is from external source, only keep the allowed fields
      iff(isProvider('external'), keep(...keepFieldsExternal)),
      // protect password at all times
      // Always must be the last hook
      protect('password')
    ],
    update: [
      // if the call is from external source, only keep the allowed fields
      iff(isProvider('external'), keep(...keepFieldsExternal)),
      // protect password at all times
      // Always must be the last hook
      protect('password')
    ],
    patch: [
      // if the call is from external source, only keep the allowed fields
      iff(isProvider('external'), keep(...keepFieldsExternal)),
      // protect password at all times
      // Always must be the last hook
      protect('password')
    ],
    remove: [
      // if the call is from external source, only keep the allowed fields
      iff(isProvider('external'), keep(...keepFieldsExternal)),
      // protect password at all times
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
