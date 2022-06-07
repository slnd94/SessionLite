const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, isProvider, keep, disallow } = require('feathers-hooks-common');

const keepFieldsExternal = [
  '_id',
  'name'
]

module.exports = {
  before: {
    all: [  ],
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
