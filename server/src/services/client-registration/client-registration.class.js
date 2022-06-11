/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
const errorMessages = require('../../utils/errorMessages');

exports.ClientRegistration = class ClientRegistration {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async create (data, params) {
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
        // create the client
        const client = await this.app.service('clients').create({
          name: data.businessName
        });

        if(!client._id) {
          // couldn't create the client.  Return bad request
          return Promise.reject(new errors.BadRequest("could not create the client"));
        } else {
          // create the user account
          const userAccount = await this.app.service('user-accounts').create({
            ...data.account,
            client: client._id
          });

          if(!userAccount?.user?._id) {
            // couldn't create the user account.  Return bad request
            return Promise.reject(new errors.BadRequest("could not create the user account"));
          } else {
            // assign the user to the client admin users
            await this.app.service('clients').patch(client._id, {
              createdByUser: userAccount.user._id,
              adminUsers: [userAccount.user._id]
            });

            return {
              client: {
                _id: client._id,
                name: client.name
              },
              accessToken: userAccount.accessToken
            }
          }
        }
      }
    }
    catch(err) {
      console.log("🚀 ~ file: client-registration.class.js ~ line 63 ~ ClientRegistration ~ create ~ err", err)
    }    
  }
};
