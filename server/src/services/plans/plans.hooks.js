const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff } = require('feathers-hooks-common');
const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');
const authorizeSysAdmin = require('../../hooks/authorize-sys-admin');

const addPlanPrices = require('../../hooks/add-plan-prices');

const assignParamUserCountry = require('../../hooks/assign-param-user-country');

module.exports = {
  before: {
    all: [],
    find: [assignParamUserCountry()],
    get: [
      iff(context => (context.params.headers && context.params.headers.authorization), authenticate('jwt')),
      assignParamSysAdminUser()
    ],
    create: [ authenticate('jwt'), assignParamSysAdminUser(), authorizeSysAdmin() ],
    update: [ authenticate('jwt'), assignParamSysAdminUser(), authorizeSysAdmin() ],
    patch: [ authenticate('jwt'), assignParamSysAdminUser(), authorizeSysAdmin() ],
    remove: [ authenticate('jwt'), assignParamSysAdminUser(), authorizeSysAdmin() ]
  },

  after: {
    all: [],
    find: [addPlanPrices()],
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
