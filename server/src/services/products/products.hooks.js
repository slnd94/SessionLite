const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff } = require('feathers-hooks-common');
const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');
const authorizeSysAdmin = require('../../hooks/authorize-sys-admin');

const assignProductUserFlags = require('../../hooks/assign-product-user-flags');

module.exports = {
  before: {
    all: [  ],
    find: [],
    get: [
      iff(context => (context.params.headers && context.params.headers.authorization), authenticate('jwt')),
      assignParamSysAdminUser()
    ],
    create: [ assignParamSysAdminUser(), authorizeSysAdmin() ],
    update: [ assignParamSysAdminUser(), authorizeSysAdmin() ],
    patch: [ assignParamSysAdminUser(), authorizeSysAdmin() ],
    remove: [ assignParamSysAdminUser(), authorizeSysAdmin() ]
  },

  after: {
    all: [],
    find: [],
    get: [assignProductUserFlags()],
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
