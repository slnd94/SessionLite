/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
const errorMessages = require('../../utils/errorMessages');

const bcrypt = require('bcryptjs');

exports.UserAccounts = class UserAccounts {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async create (data, params) {
    console.log("🚀 ~ file: user-accounts.class.js ~ line 17 ~ UserAccounts ~ create ~ data", data)
    if(data.invite) {
      // ensure the invite was created for the specified tenant
      // get the invite
      const invite = await this.app.service('user-invites').get(data.invite);
      if (!invite || invite.tenant.toString() !== data.tenant.toString()) {
        // mismatched tenant and invite
        return Promise.reject(new errors.BadRequest(errorMessages.badRequest));
      }
    }

    return this.app.service('users')
      .create(data)
      .then(async result => {
        // delete the invite if it existed
        if(data.invite) {
          await this.app.service('user-invites').remove(data.invite);
        }

        // send welcome/verification email to user
        this.app.service('emails-sendinblue')
          .create({
            templateId: this.app.get('welcomeVerificationEmailTemplate'),
            destination: data.email,
            data: {  
              appLogoUrl: `${this.app.get('appWebBaseUrl')}/images/siteLogoSmall.png`,
              appPrimaryColor: this.app.get('appPrimaryColor'),
              appName: this.app.get('appName'),
              emailVerificationUrl: `${this.app.get('appWebBaseUrl')}/user/verification/email/${data.verification.emailVerificationKey}`,
              privacyPolicyUrl: this.app.get('privacyPolicyUrl')
            }
          });

        // authenticate the user so we can send them an access token
        return this.app.service('authentication').create({...data, strategy: 'local'}).then(res => {
          return {
            user: res.user,
            accessToken: res.accessToken
          };
        });
      });
  }

  async patch (id, data, params) {
    if(await bcrypt.compare(data.currentPassword, params.user.password)) {
      // correct current password supplied.  Allow the update.
      // reinforce the only fields we want updated
      data = {
        password: data.newPassword
      };

      return this.app.service('users')
        .patch(id, data)
        .then(result => {
          // return only the user id
          return { _id: result._id };
        });
    } else {
      // wrong current password supplied
      return Promise.reject(new errors.NotAuthenticated(errorMessages.invalidCurrentPassword));
    }
  }
};
