const { authenticate } = require('@feathersjs/authentication').hooks;
const assignParamSysAdminUser = require('../../hooks/assign-param-sys-admin-user');
const authorizeTenantAdmin = require('../../hooks/authorize-tenant-admin');
const { iff, isProvider, keep, disallow } = require('feathers-hooks-common');

const sendUserInviteEmail = require('../../hooks/send-user-invite-email');

module.exports = {
  before: {
    all: [ authenticate('jwt'), assignParamSysAdminUser() ],
    find: [
      iff(isProvider('external'), disallow()),
      authorizeTenantAdmin()
    ],
    get: [
      iff(isProvider('external'), disallow()),
      authorizeTenantAdmin()
    ],
    create: [
      iff(isProvider('external'), disallow()),
      authorizeTenantAdmin()
    ],
    update: [
      iff(isProvider('external'), disallow()),
      authorizeTenantAdmin()
    ],
    patch: [
      iff(isProvider('external'), disallow()),
      authorizeTenantAdmin()
    ],
    remove: [
      iff(isProvider('external'), disallow()),
      authorizeTenantAdmin()
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [sendUserInviteEmail()],
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
