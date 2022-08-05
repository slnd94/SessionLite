/* eslint-disable no-unused-vars */
const errors = require("@feathersjs/errors");
const errorMessages = require("../../utils/errorMessages");
const { verificationKey } = require("../../utils/userUtils");

exports.UserAccountPasswordReset = class UserAccountPasswordReset {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    if (data.email) {
      // see if the email address has a user account
      const existingUsers = await this.app.service("users").find({
        query: {
          email: data.email,
        },
      });

      if (existingUsers.total !== 1) {
        // can't find a singular user with this email
        return Promise.reject(new errors.BadRequest(errorMessages.badRequest));
      } else {
        const user = existingUsers.data[0];

        // set new reset key and send a fresh email to user

        // set the expiry date time
        const passwordResetKeyExpiryDate = new Date();
        passwordResetKeyExpiryDate.setMinutes(
          passwordResetKeyExpiryDate.getMinutes() +
            parseInt(this.app.get("passwordResetExpiryMinutes"))
        );
        const passwordResetData = {
          passwordResetKey: verificationKey(),
          passwordResetKeyExpiryDate,
        };
        return this.app
          .service("users")
          .patch(user._id, { passwordReset: passwordResetData })
          .then((res) => {
            // send welcome/verification email to user
            this.app.service("emails-sendinblue").create({
              templateId: this.app.get("passwordResetEmailTemplate"),
              destination: data.email,
              data: {
                appLogoUrl: `${this.app.get(
                  "appWebBaseUrl"
                )}/images/siteLogoSmall.png`,
                givenName: user.name?.given,
                appPrimaryColor: this.app.get("appPrimaryColor"),
                appName: this.app.get("appName"),
                passwordResetUrl: `${this.app.get(
                  "appWebBaseUrl"
                )}/auth/passwordreset/${passwordResetData.passwordResetKey}`,
                privacyPolicyUrl: this.app.get("privacyPolicyUrl"),
              },
            });
            return { passwordResetSetSuccess: true };
          });
      }
    } else {
      // no email supplied
      return Promise.reject(new errors.BadRequest(errorMessages.badRequest));
    }
  }

  async patch(id, data, params) {
    if (data.password) {
      // see if the email address has a user account
      const existingUsers = await this.app.service("users").find({
        query: {
          "passwordReset.passwordResetKey": id,
        },
      });

      if (existingUsers.total !== 1) {
        // can't find a singular user with this email
        return Promise.reject(new errors.BadRequest(errorMessages.badRequest));
      } else {
        const user = existingUsers.data[0];

        if (Date.now() < user.passwordReset.passwordResetKeyExpiryDate) {
          // valid password reset key
          // update the user password
          return this.app
            .service("users")
            .patch(user._id, { password: data.password })
            .then((result) => {
              // return only the user id
              return { passwordResetSuccess: true };
            });
        } else {
          // password rest key is expired
          return Promise.reject(new errors.BadRequest("key expired"));
        }
      }
    } else {
      // no password supplied
      return Promise.reject(new errors.BadRequest(errorMessages.badRequest));
    }
  }
};
