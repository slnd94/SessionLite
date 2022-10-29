/* eslint-disable no-unused-vars */
exports.UserSessions = class UserSessions {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const userQuery = {
      $or: [
        { "participants.team": params.query.user },
        { "participants.clients": params.query.user }
      ],
    };
    const result = await this.app.service("sessions").find({
      query: {
        tenant: params.query.tenant,
        ...userQuery,
        // user: params.query.user,
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
