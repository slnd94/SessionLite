/* eslint-disable no-unused-vars */
const errors = require("@feathersjs/errors");
exports.TenantUsage = class TenantUsage {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;

    this.getTenantUserCounts = async (tenantId) => {
      // get the count of active team users
      const activeTeam = await this.app.service("tenant-users").find({
        query: {
          tenant: tenantId,
          type: "team",
          active: true,
          $skip: 0,
          $limit: 0,
        },
      });

      // get the count of active team user invites
      const teamInvites = await this.app.service("tenant-user-invites").find({
        query: {
          tenant: tenantId,
          type: "team",
          $skip: 0,
          $limit: 0,
        },
      });

      // get the count of active team users
      const activeClients = await this.app.service("tenant-users").find({
        query: {
          tenant: tenantId,
          type: "client",
          active: true,
          $skip: 0,
          $limit: 0,
        },
      });

      // get the count of active team user invites
      const clientInvites = await this.app.service("tenant-user-invites").find({
        query: {
          tenant: tenantId,
          type: "client",
          $skip: 0,
          $limit: 0,
        },
      });

      return {
        team: {
          active: activeTeam.total,
          invites: teamInvites.total,
          total: activeTeam.total + teamInvites.total,
        },
        client: {
          active: activeClients.total,
          invites: clientInvites.total,
          total: activeClients.total + clientInvites.total,
        },
        total: {
          active: activeTeam.total + activeClients.total,
          invites: teamInvites.total + clientInvites.total,
          total:
            activeTeam.total +
            teamInvites.total +
            activeClients.total +
            clientInvites.total,
        },
      };
    };
  }

  async get(id, params) {
    return {
      users: await this.getTenantUserCounts(id)
    };
  }
};
