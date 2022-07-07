const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, isProvider, keep, disallow } = require('feathers-hooks-common');
const authenticateUserStanding = require('../../hooks/authenticate-user-standing');

const keepFieldsExternal = [
  '_id',
  'name'
]

module.exports = {
  before: {
    all: [],
    find: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt'), authenticateUserStanding()
    ],
    get: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt'), authenticateUserStanding()
    ],
    create: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt'), authenticateUserStanding()
    ],
    update: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt'), authenticateUserStanding()
    ],
    patch: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt'), authenticateUserStanding()
    ],
    remove: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt'), authenticateUserStanding()
    ]
  },

  after: {
    all: [],
    find: [
      // if the call is from external source, only keep the allowed fields
      iff(isProvider('external'), keep(...keepFieldsExternal))
    ],
    get: [
      // if the call is from external source, only keep the allowed fields
      iff(isProvider('external'), keep(...keepFieldsExternal))
    ],
    create: [
      // if the call is from external source, only keep the allowed fields
      iff(isProvider('external'), keep(...keepFieldsExternal))
    ],
    update: [
      // if the call is from external source, only keep the allowed fields
      iff(isProvider('external'), keep(...keepFieldsExternal))
    ],
    patch: [
      // if the call is from external source, only keep the allowed fields
      iff(isProvider('external'), keep(...keepFieldsExternal))
    ],
    remove: [
      // if the call is from external source, only keep the allowed fields
      iff(isProvider('external'), keep(...keepFieldsExternal))
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
