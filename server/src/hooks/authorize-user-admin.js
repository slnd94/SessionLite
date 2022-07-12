// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require("@feathersjs/errors");
const errorMessages = require("../utils/errorMessages");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let idParam = null;
    switch (context.method) {
      case "get":
      case "patch":
      case "update":
      case "remove":
        idParam = context.id;
        break;
      case "find":
        idParam = context.params.query.user;
        break;
      case "create":
        idParam = context.data.user;
        break;
      default:
        idParam = null;
        break;
    }

    if (!idParam) {
      return Promise.reject(new errors.BadRequest(errorMessages.badRequest));
    }

    let auth = false;

    // authorize if:
    if (
      // it's an internal call
      !context.params.provider ||
      // or it's a "me" call
      idParam === "me" ||
      // or it's a sysAdmin user making the call
      context.params.sysAdminUser ||
      // or it's the subject user making the call
      (context.params.authenticated &&
        context.params.user._id.toString() === idParam.toString())
    ) {
      auth = true;
    }

    if (!auth) {
      // check to see if user is admin on the subject user's tenant
      if (context.params.authenticated && context.params.user?.tenant) {
        // get the subject user's tenant
        const subjectUser = await context.app.service("users").get(idParam, {
          query: {
            $select: {
              tenant: 1,
            },
            $populate: [
              {
                path: "tenant",
              },
            ],
          },
        });

        if (
          subjectUser?.tenant?.adminUsers.find(
            (x) => x.toString() === context.params.user._id.toString()
          )
        ) {
          auth = true;
          // reinforce the only fields we want a tenant admin to be able to affect
          if (context.data) {
            context.data = {
              active: context.data.active
            };
          }
        }
      }
    }

    if (auth) {
      return context;
    } else {
      return Promise.reject(new errors.Forbidden(errorMessages.forbidden));
    }
  };
};
