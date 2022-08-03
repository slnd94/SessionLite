const { authenticate } = require("@feathersjs/authentication").hooks;
const assignParamSysAdminUser = require("../../hooks/assign-param-sys-admin-user");
const { iff } = require("feathers-hooks-common");

const authenticateUserStanding = require("../../hooks/authenticate-user-standing");
const assignParamTenantAdminUser = require("../../hooks/assign-param-tenant-admin-user");

module.exports = {
  before: {
    all: [],
    find: [
      iff(
        (context) =>
          context.params.headers && context.params.headers.authorization,
        authenticate("jwt"),
        authenticateUserStanding()
      ),
      assignParamSysAdminUser(),
      assignParamTenantAdminUser(),
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
