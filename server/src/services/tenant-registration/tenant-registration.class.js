/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
const errorMessages = require('../../utils/errorMessages');

exports.TenantRegistration = class TenantRegistration {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async create (data, params) {
    console.log("🚀 ~ file: tenant-registration.class.js ~ line 15 ~ TenantRegistration ~ create ~ data", data)
    try {
      // see if the user already exists
      const existingUsers = await this.app.service('users').find({
        query: {
          email: data.account.email
        }
      });

      if(existingUsers.total !== 0) {
        return Promise.reject(new errors.BadRequest("User account already exists"));
      } else {
        // create the tenant
        const djfndjfh = {
          name: data.businessName,
          ...(data.tentativePlan ? { tentativePlan: data.tentativePlan } : {})
        };
        console.log("🚀 ~ file: tenant-registration.class.js ~ line 32 ~ TenantRegistration ~ create ~ djfndjfh", djfndjfh)
        const tenant = await this.app.service('tenants').create({
          name: data.businessName,
          ...(data.tentativePlan ? { tentativePlan: data.tentativePlan } : {})
        });

        if(!tenant._id) {
          // couldn't create the tenant.  Return bad request
          return Promise.reject(new errors.BadRequest("could not create the tenant"));
        } else {
          // create the user account
          const userAccount = await this.app.service('user-accounts').create({
            ...data.account,
            type: 'team',
            tenant: tenant._id
          });

          if(!userAccount?.user?._id) {
            // couldn't create the user account.  Return bad request
            return Promise.reject(new errors.BadRequest("could not create the user account"));
          } else {
            // assign the user to the tenant admin users
            await this.app.service('tenants').patch(tenant._id, {
              createdByUser: userAccount.user._id,
              adminUsers: [userAccount.user._id]
            });

            return {
              tenant: {
                _id: tenant._id,
                name: tenant.name
              },
              accessToken: userAccount.accessToken
            }
          }
        }
      }
    }
    catch(err) {
      console.log("🚀 ~ file: tenant-registration.class.js ~ line 63 ~ TenantRegistration ~ create ~ err", err)
    }    
  }
};
