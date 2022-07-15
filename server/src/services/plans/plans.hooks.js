const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff } = require('feathers-hooks-common');
const authenticateUserStanding = require('../../hooks/authenticate-user-standing');
const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');
const authorizeSysAdmin = require('../../hooks/authorize-sys-admin');

const addPlanPrices = require('../../hooks/add-plan-prices');

const assignParamUserCountry = require('../../hooks/assign-param-user-country');

module.exports = {
  before: {
    all: [],
    find: [assignParamUserCountry()],
    get: [
      iff(context => (context.params.headers && context.params.headers.authorization), authenticate('jwt'), authenticateUserStanding()),
      assignParamSysAdminUser(),
      assignParamUserCountry()
    ],
    create: [ authenticate('jwt'), authenticateUserStanding(), assignParamSysAdminUser(), authorizeSysAdmin() ],
    update: [ authenticate('jwt'), authenticateUserStanding(), assignParamSysAdminUser(), authorizeSysAdmin() ],
    patch: [ authenticate('jwt'), authenticateUserStanding(), assignParamSysAdminUser(), authorizeSysAdmin() ],
    remove: [ authenticate('jwt'), authenticateUserStanding(), assignParamSysAdminUser(), authorizeSysAdmin() ]
  },

  after: {
    all: [],
    find: [addPlanPrices()],
    get: [addPlanPrices()],
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
