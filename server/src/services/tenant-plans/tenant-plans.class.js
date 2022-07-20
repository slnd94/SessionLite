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

    this.getTenantUsage = async (tenantId) => {
      // get the count of active team users
      const team = await this.app.service("tenant-users").find({
        query: {
          tenant: tenantId,
          active: true,
          $skip: 0,
          $limit: 0,
        },
      });

      // get the count of active team user invites
      const teamInvites = await this.app.service("tenant-user-invites").find({
        query: {
          tenant: tenantId,
          $skip: 0,
          $limit: 0,
        },
      });

      return {
        users: {
          team: {
            active: team.total,
            invites: teamInvites.total,
            total: team.total + teamInvites.total,
          },
        },
      };
    };

    this.checkAllowance = ({ allowance, usage }) => {
      return !(allowance > -1 && usage > allowance);
    };

    this.tenantWithinPlanAllowances = async ({ plan, tenantUsage }) => {
      if (
        (plan.allowances?.users?.team?.active > -1 &&
          tenantUsage.users.team.active > plan.allowances.users.team.active) ||
        (plan.allowances?.users?.team?.invites > -1 &&
          tenantUsage.users.team.invites >
            plan.allowances.users.team.invites) ||
        (plan.allowances?.users?.team?.total > -1 &&
          tenantUsage.users.team.total > plan.allowances.users.team.total) ||
        (plan.allowances?.users?.client?.active > -1 &&
          tenantUsage.users.client.active >
            plan.allowances.users.client.active) ||
        (plan.allowances?.users?.client?.invites > -1 &&
          tenantUsage.users.client.invites >
            plan.allowances.users.client.invites) ||
        (plan.allowances?.users?.client?.total > -1 &&
          tenantUsage.users.client.total >
            plan.allowances.users.client.total) ||
        (plan.allowances?.users?.total?.active > -1 &&
          tenantUsage.users.total.active >
            plan.allowances.users.total.active) ||
        (plan.allowances?.users?.total?.invites > -1 &&
          tenantUsage.users.total.invites >
            plan.allowances.users.total.invites) ||
        (plan.allowances?.users?.total?.total > -1 &&
          tenantUsage.users.total.total > plan.allowances.users.total.total)
      ) {
        return false;
      } else {
        return true;
      }
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

    const plan = await this.app.service("plans").get(tenant.plan, params);
    
    return {
      ...plan,
      usage: await this.getTenantUsage(id),
    };
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
          // is the tenant currently eligible for this plan?
          // get the tenant's current allowance usage
          const tenantUsage = await this.getTenantUsage(id);
          if (
            await this.tenantWithinPlanAllowances({
              plan: requestedPlan,
              tenantUsage,
            })
          ) {
            // see if the requested plan is the same one already applied
            if (tenant.plan) {
              // updating the existing tenant plan
              // is the tenant currently eligible for this plan?
              // does the tenant have an existing paddle subscription?
              if (tenant.paddle?.subscriptionId) {
                // update paddle subscription
                // TODO
                const paddleResponse = await api({
                  method: "get",
                  url: `${this.app.get(
                    "paddleApiBaseUrl"
                  )}/subscription/users/update`,
                  params: {
                    vendor_id: this.app.get("paddleVendorId"),
                    vendor_auth_code: this.app.get("paddleVendorAuthCode"),
                    subscription_id: tenant.paddle.subscriptionId,
                    plan_id: requestedPlan.paddlePlanId,
                    prorate: true,
                    bill_immediately: true,
                  },
                });
              } else {
                // no existing paddle subscription
                // existing paddle user (ie have they have a subscription before?)
                if (tenant.paddle?.userId) {
                  // tenant has had a paddle subscription in the past but not currently on a paddle subscription
                  // TODO: how to handle?  will paddle have the payment method and we can just update?  Or does this require checkout?
                } else {
                  // tenant has never had a paddle subscription.
                  // TODO: this should require checkout on the frontend.
                }
              }
            } else {
              // applying tenant plan for the first time
              if (requestedPlan.requiresCheckout) {
                // Check to see this is a plan the user can apply to this tenant
                // This endpoint if the user wants to change the plan WITHOUT CHECKOUT
                // (it is intended for assigning a free plan to the tenant)
                // Does the specified plan required checkout?
                // This plan requires checkout, cannot apply it through this endpoint.  Return bad request
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

                // check to see if the tenant adheres to the requestedPlan allowances
                // TODO: Once users are established add in the allowances check here

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
