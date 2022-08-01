/* eslint-disable no-unused-vars */
const errors = require("@feathersjs/errors");
const { tenantPlanEligibility } = require("../../utils/planUtils");
exports.TenantUserInvites = class TenantUserInvites {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    // assign the search term on email if provided
    if (params.query.search) {
      params.query["email"] = { $regex: new RegExp(params.query.search, "i") };
    }
    delete params.query.search;

    // enforce only the fields we want to be able to query on
    params.query = {
      tenant: params.query.tenant,
      $skip: params.query.$skip,
      $limit: params.query.$limit,
      ...(params.query.email ? { email: params.query.email } : {}),
      ...(params.query.type ? { type: params.query.type } : {}),
    };

    const invites = await this.app.service("user-invites").find({
      query: {
        ...params.query,
        $select: {
          _id: 1,
          email: 1,
          tenant: 1,
        },
      },
    });

    return invites;
  }

  async patch(id, data, params) {
    if (data.inviteEmailAddresses) {
      if (!data.type || !(data.type === "team" || data.type === "client")) {
        return Promise.reject(new errors.BadRequest("invalid invite"));
      } else {
        const distinctInvitedEmails = [...new Set(data.inviteEmailAddresses)];
        const unusedDistinctEmailAddresses = [];
        await Promise.all(
          distinctInvitedEmails.map(async (emailAddress) => {
            // check to see if this email has already been used
            const existingInvites = await this.app
              .service("user-invites")
              .find({
                query: {
                  email: emailAddress,
                  tenant: id,
                },
              });

            if (existingInvites.total === 0) {
              const existingUsers = await this.app.service("users").find({
                query: {
                  email: emailAddress,
                },
              });

              if (existingUsers.total === 0) {
                unusedDistinctEmailAddresses.push(emailAddress);
              }
            }
          })
        );

        // get the current plan and usage
        const currentPlan = await this.app.service("tenant-plans").get(id);
        const currentUsage = await this.app.service("tenant-usage").get(id);

        const requestedUsage = {
          users: {
            ...currentUsage.users,
            ...(data.type === "client"
              ? {
                  client: {
                    ...currentUsage.users.client,
                    invites:
                      currentUsage.users.client.invites +
                      unusedDistinctEmailAddresses.length,
                    total:
                      currentUsage.users.client.total +
                      unusedDistinctEmailAddresses.length,
                  },
                }
              : {
                  team: {
                    ...currentUsage.users.team,
                    invites:
                      currentUsage.users.team.invites +
                      unusedDistinctEmailAddresses.length,
                    total:
                      currentUsage.users.team.total +
                      unusedDistinctEmailAddresses.length,
                  },
                }),
            ...{
              total: {
                ...currentUsage.users.total,
                invites:
                  currentUsage.users.total.invites +
                  unusedDistinctEmailAddresses.length,
                total:
                  currentUsage.users.total.total +
                  unusedDistinctEmailAddresses.length,
              },
            },
          },
        };

        const planEligibility = tenantPlanEligibility({
          plan: currentPlan,
          usage: requestedUsage,
        });
        if (planEligibility.eligible) {
          await Promise.all(
            unusedDistinctEmailAddresses.map(async (emailAddress) => {
              try {
                await this.app.service("user-invites").create({
                  tenant: id,
                  type: data.type,
                  email: emailAddress,
                });
              } catch (err) {
                console.log(
                  "🚀 ~ file: tenant-users.class.js ~ line 50 ~ TenantUser ~ patch ~ err",
                  err
                );
              }
            })
          );
          return { success: true };
        } else {
          // tenant not eligible to invite user(s) under their current plan/usage
          return Promise.reject(new errors.BadRequest("plan allowances exceeded", { requestedUsage }));
        }
      }
    } else if (data.resendInvite) {
      // ensure the invite belongs to this tenant
      const invite = await this.app
        .service("user-invites")
        .get(data.resendInvite, {
          query: {
            $select: {
              tenant: 1,
              email: 1,
              type: 1,
            },
          },
        });
      if (invite?.tenant._id.toString() === id.toString()) {
        // get the tenant
        const tenant = await this.app.service("tenants").get(id, {
          query: {
            $select: {
              name: 1,
            },
          },
        });
        if (tenant) {
          // resend the invite
          // send invitation email to user
          this.app.service("emails-sendinblue").create({
            templateId: this.app.get(
              invite?.type === "team"
                ? "invitationTeamEmailTemplate"
                : "invitationClientEmailTemplate"
            ),
            destination: invite.email,
            data: {
              appName: this.app.get("appName"),
              tenantName: tenant.name,
              registrationUrl: `${this.app.get(
                "appWebBaseUrl"
              )}/auth/signup?invite=${invite._id}&tenant=${tenant._id}`,
              privacyPolicyUrl: this.app.get("privacyPolicyUrl"),
            },
          });
          return { success: true };
        }
      } else {
        return Promise.reject(new errors.BadRequest("invalid invite"));
      }
    } else if (data.revokeInvite) {
      // ensure the invite belongs to this tenant
      const invite = await this.app
        .service("user-invites")
        .get(data.revokeInvite, {
          query: {
            $select: {
              tenant: 1,
              email: 1,
            },
          },
        });
      if (invite?.tenant._id.toString() === id.toString()) {
        // get the tenant
        const tenant = await this.app.service("tenants").get(id, {
          query: {
            $select: {
              _id: 1,
            },
          },
        });
        if (tenant) {
          // revoke (remove) the invite
          await this.app.service("user-invites").remove(data.revokeInvite);
          return { success: true };
        }
      } else {
        return Promise.reject(new errors.BadRequest("invalid invite"));
      }
    }
  }
};
