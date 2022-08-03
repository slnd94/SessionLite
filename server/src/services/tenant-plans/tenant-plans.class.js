/* eslint-disable no-unused-vars */
const errors = require("@feathersjs/errors");
const errorMessages = require("../../utils/errorMessages");
const { api } = require("../../utils/api");
const { tenantPlanEligibility } = require("../../utils/planUtils");

exports.TenantPlans = class TenantPlans {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;

    this.checkAllowance = ({ allowance, usage }) => {
      return !(allowance > -1 && usage > allowance);
    };
  }

  async get(id, params) {
    ////////////////
    // get the tenant's current plan
    ////////////////

    const tenant = await this.app.service("tenants").get(id, {
      query: {
        $select: {
          plan: 1,
        },
      },
    });

    return await this.app.service("plans").get(tenant.plan, params);
  }

  async patch(id, data, params) {
    // Get the tenant
    const tenant = await this.app.service("tenants").get(id);

    if (!tenant) {
      // could not find tenant with requested id.  Return bad request
      return Promise.reject(new errors.BadRequest("Invalid tenant"));
    } else {
      // limit based on allowed fields and only those supplied
      data = {
        ...(data.plan ? { plan: data.plan } : {}),
      };

      if (data.plan) {
        // updating the plan.

        // Get the requested plan
        const requestedPlan = await this.app.service("plans").get(data.plan, {
          excludePrices: true,
        });

        if (!requestedPlan?._id === data.plan) {
          // could not find a plan with the requested id.  Return bad request
          return Promise.reject(
            new errors.BadRequest("Invalid plan requested")
          );
        } else {
          // is the tenant's usage currently eligible for this plan?
          const eligibility = tenantPlanEligibility({
            plan: requestedPlan,
            usage: await this.app.service("tenant-usage").get(id),
          });
          if (eligibility.eligible) {
            // TODO: see if the requested plan is the same one already applied
            if (tenant.plan) {
              // updating the existing tenant plan
              // does the tenant have an existing paddle subscription?
              if (tenant.paddle?.subscriptionId) {
                if (requestedPlan.requiresCheckout) {
                  // updating to a paddle subscription
                  const paddleResponse = await api({
                    method: "post",
                    url: `${this.app.get(
                      "paddleSubscriptionApiBaseUrl"
                    )}/subscription/users/update`,
                    params: {
                      vendor_id: this.app.get("paddleVendorId"),
                      vendor_auth_code: this.app.get("paddleVendorAuthCode"),
                      subscription_id: tenant.paddle.subscriptionId,
                      plan_id: requestedPlan.paddle.productId,
                      prorate: true,
                      bill_immediately: true,
                    },
                  });
                  // tenant plan update will be handled in resulting webhook call
                } else {
                  // updating to a non-paddle plan
                  // cancel the existing paddle subscription
                  const paddleResponse = await api({
                    method: "post",
                    url: `${this.app.get(
                      "paddleSubscriptionApiBaseUrl"
                    )}/subscription/users_cancel`,
                    params: {
                      vendor_id: this.app.get("paddleVendorId"),
                      vendor_auth_code: this.app.get("paddleVendorAuthCode"),
                      subscription_id: tenant.paddle.subscriptionId,
                    },
                  });
                  if (
                    paddleResponse.status === 200 &&
                    paddleResponse?.data?.success
                  ) {
                    // paddle subscription successfully cancelled
                    // apply the new plan (no need for webhook)
                    return this.app
                      .service("tenants")
                      .patch(id, {
                        plan: data.plan,
                        paddle: {
                          // only keep the userId around for paddle
                          // omit the subscriptionId and planId
                          userId: tenant.paddle.userId,
                        },
                      })
                      .then((res) => {
                        return { success: true };
                      });
                  }
                }
              } else {
                // no existing paddle subscription
                if (requestedPlan.requiresCheckout) {
                  // this scenario would need to open a new paddle subscription
                  // checkout should be completed through the frontend and the update handled through the resulting webhook call
                  return Promise.reject(
                    new errors.BadRequest("Requested plan requires checkout")
                  );
                } else {
                  // updating a non-paddle tenant to a non-paddle plan
                  // just apply the new plan (don't need to involve paddle at all)
                  return this.app
                    .service("tenants")
                    .patch(id, { plan: data.plan })
                    .then((res) => {
                      return { success: true };
                    });
                }
              }
            } else {
              // applying tenant plan for the first time
              if (requestedPlan.requiresCheckout) {
                // we can only directly apply the plan if the tenant does not have an existing paddle subscription, and the requested plan does not require paddle checkout (like a free plan)
                // Because the tenant does not have a paddle subscription, and this plan requires checkout, cannot apply it through this endpoint.  Return bad request.
                // checkout should be completed through the frontend and the update handled through the resulting webhook call
                return Promise.reject(
                  new errors.BadRequest("Requested plan requires checkout")
                );
              } else {
                // Get the tenant
                const currentPlan = tenant.plan;
                if (
                  currentPlan &&
                  requestedPlan._id.toString() === currentPlan.toString()
                ) {
                  return { success: true };
                }

                return this.app
                  .service("tenants")
                  .patch(id, { plan: data.plan })
                  .then((res) => {
                    return { success: true };
                  });
              }
            }
          } else {
            // tenant not currently eligible per plan allowances
            return Promise.reject(
              new errors.BadRequest("Tenant not within plan allowances")
            );
          }
        }
      }
    }
  }
};
