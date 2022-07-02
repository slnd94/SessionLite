/* eslint-disable no-unused-vars */
exports.PlanWebhooks = class PlanWebhooks {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async create (data, params) {

    // get the user/tenant
    const users = await this.app.service('users').find({
      query: {
        email: data.email,
        $populate: [
          {
            path: 'tenant'
          }
        ]
      }
    });
    
    if(users.total !== 1) {
      return Promise.reject(new errors.BadRequest("Issue with user account"));
    } else {
      const user = users.data[0]; 

      //get the plan
      const plans = await this.app.service('plans').find({
        query: {
          paddlePlanId: data.subscription_plan_id
        }
      });

      if(plans.total !== 1) {
        return Promise.reject(new errors.BadRequest("Issue with specified plan"));
      } else {
        const plan = plans.data[0];
        
        // TODO: Once users are established add in the allowances check here

        // apply the specified plan to the tenant
        return await this.app.service('tenants')
        .patch(user.tenant._id, {
          plan: plan._id
        })
        .then(res => {
          return { success: true };
        });
      }
    }


    return data;
  }
};
