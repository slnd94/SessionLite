/* eslint-disable no-unused-vars */
exports.TenantSessions = class TenantSessions {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const result = await this.app.service("sessions").find({
      query: {
        tenant: params.query.tenant,
        $skip: params.query.$skip,
        $limit: params.query.$limit,
      },
    });

    return {
      ...result,
      data: result.data.map((session) => {
        let endTime = new Date(session.start);
        endTime.setMinutes(session.start.getMinutes() + session.duration);
        return {
          ...session,
          end: endTime,
        };
      }),
    };
  }
};
