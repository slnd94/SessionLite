/* eslint-disable no-unused-vars */
exports.PlanWebhooks = class PlanWebhooks {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async create (data, params) {
    console.log("🚀 ~ file: plan-webhooks.class.js ~ line 12 ~ PlanWebhooks ~ create ~ data", data)

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
    console.log("🚀 ~ file: plan-webhooks.class.js ~ line 25 ~ PlanWebhooks ~ users ~ users", users)
    
    if(users.total !== 1) {
      console.log('here 100')
      return Promise.reject(new errors.BadRequest("Issue with user account"));
    } else {
      console.log('here 200')
      const user = users.data[0]; 
      console.log("🚀 ~ file: plan-webhooks.class.js ~ line 33 ~ PlanWebhooks ~ create ~ user", user)

      //get the plan
      const plans = await this.app.service('plans').find({
        query: {
          paddlePlanId: data.subscription_plan_id
        }
      });
      console.log("🚀 ~ file: plan-webhooks.class.js ~ line 40 ~ PlanWebhooks ~ plans ~ plans", plans)

      if(plans.total !== 1) {
        console.log('here 300')
        return Promise.reject(new errors.BadRequest("Issue with specified plan"));
      } else {
        console.log('here 400')
        const plan = plans.data[0];
        console.log("🚀 ~ file: plan-webhooks.class.js ~ line 49 ~ PlanWebhooks ~ create ~ plan", plan)

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
