/* eslint-disable no-unused-vars */
const errors = require("@feathersjs/errors");
const errorMessages = require("../../utils/errorMessages");
const crypto = require("crypto");
const Serialize = require("php-serialize");
exports.PaddleWebhooks = class PaddleWebhooks {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;

    this.ksort = (obj) => {
      const keys = Object.keys(obj).sort();
      let sortedObj = {};
      for (let i in keys) {
        sortedObj[keys[i]] = obj[keys[i]];
      }
      return sortedObj;
    };

    this.validateWebhook = (jsonObj) => {
      try {
        // Grab p_signature
        const mySig = Buffer.from(jsonObj.p_signature, "base64");
        // Remove p_signature from object - not included in array of fields used in verification.
        delete jsonObj.p_signature;
        // Need to sort array by key in ascending order
        jsonObj = this.ksort(jsonObj);
        for (let property in jsonObj) {
          if (
            jsonObj.hasOwnProperty(property) &&
            typeof jsonObj[property] !== "string"
          ) {
            if (Array.isArray(jsonObj[property])) {
              // is it an array
              jsonObj[property] = jsonObj[property].toString();
            } else {
              //if its not an array and not a string, then it is a JSON obj
              jsonObj[property] = JSON.stringify(jsonObj[property]);
            }
          }
        }
        // Serialise remaining fields of jsonObj
        const serialized = Serialize.serialize(jsonObj);
        // verify the serialized array against the signature using SHA1 with your public key.
        const verifier = crypto.createVerify("sha1");
        verifier.update(serialized);
        verifier.end();
        console.log("🚀 ~ file: paddle-webhooks.class.js ~ line 51 ~ PaddleWebhooks ~ setup ~ verifier", verifier)

        console.log("🚀 ~ file: paddle-webhooks.class.js ~ line 69 ~ PaddleWebhooks ~ setup ~ mySig", mySig)
        const verification = verifier.verify(
          this.app.get("paddlePublicKey"),
          mySig
        );
        // Used in response if statement
        return verification;
      } catch (err) {
        console.log(
          "🚀 ~ file: paddle-webhooks.class.js ~ line 28 ~ PaddleWebhooks ~ setup ~ err",
          err
        );
        console.log(
          "🚀 ~ file: paddle-webhooks.class.js ~ line 28 ~ PaddleWebhooks ~ setup ~ err",
          err.message
        );
        return false;
      }
    };
  }

  async create(data, params) {
    if (this.validateWebhook(data)) {
      // get the user/tenant
      const users = await this.app.service("users").find({
        query: {
          email: data.email,
          $populate: [
            {
              path: "tenant",
            },
          ],
        },
      });

      if (users.total !== 1) {
        return Promise.reject(new errors.BadRequest("Issue with user account"));
      } else {
        const user = users.data[0];

        //get the plan
        const plans = await this.app.service("plans").find({
          query: {
            paddlePlanId: data.subscription_plan_id,
          },
        });

        if (plans.total !== 1) {
          return Promise.reject(
            new errors.BadRequest("Issue with specified plan")
          );
        } else {
          const plan = plans.data[0];

          // TODO: Once users are established add in the allowances check here

          // apply the specified plan to the tenant
          return await this.app
            .service("tenants")
            .patch(user.tenant._id, {
              plan: plan._id,
            })
            .then((res) => {
              return { success: true };
            });
        }
      }
    } else {
      return Promise.reject(new errors.Forbidden(errorMessages.forbidden));
    }

    return data;
  }
};
