/* eslint-disable no-unused-vars */
const errors = require("@feathersjs/errors");
const errorMessages = require("../../utils/errorMessages");
const { api } = require("../../utils/api");

exports.TenantPlans = class TenantPlans {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async patch(id, data, params) {
    // limit based on allowed fields and only those supplied
    data = {
      ...(data.plan ? { plan: data.plan } : {}),
    };

    if (data.plan) {
      // updating the plan.

      // Get the requested plan
      const requestedPlan = await this.app.service("plans").get(data.plan);

      if (!requestedPlan?._id === data.plan) {
        // could not find a plan with the requested id.  Return bad request
        return Promise.reject(new errors.BadRequest("Invalid plan requested"));
      } else {
        // Check to see this is a plan the user can apply to this tenant
        // This endpoint if the user wants to change the plan WITHOUT CHECKOUT
        // (it is intended for assigning a free plan to the tenant)
        // Does the specified plan required checkout?
        if (requestedPlan.requiresCheckout) {
          // This plan requires checkout, cannot apply it through this endpoint.  Return bad request
          return Promise.reject(
            new errors.BadRequest("Requested plan requires checkout")
          );
        } else {
          // Get the tenant
          const tenant = await this.app.service("tenants").get(id);
          const currentPlan = tenant.plan;
          if (
            currentPlan &&
            requestedPlan._id.toString() === currentPlan.toString()
          ) {
            return { success: true };
          }

          // check to see if the tenant adheres to the requestedPlan allowances
          // TODO: Once users are established add in the allowances check here

          return this.app
            .service("tenants")
            .patch(id, {plan: data.plan})
            .then((res) => {
              return { success: true };
            });
        }
      }
    }
  }
};
