/* eslint-disable no-unused-vars */
const crypto = require('node:crypto');

exports.FileAuth = class FileAuth {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;

    this.generatePolicy = ({term, call, handle}) => {    
      // set up the expiry date
      let expiryDateObj = new Date();
      // add a day
      switch(term) {
        case "1m":
          expiryDateObj.setMinutes(expiryDateObj.getMinutes() + 1);
          break;
        case "5m":
          expiryDateObj.setMinutes(expiryDateObj.getMinutes() + 5);
          break;
        case "1h":
          expiryDateObj.setHours(expiryDateObj.getHours() + 1);
          break;
        case "1d":
          expiryDateObj.setDate(expiryDateObj.getDate() + 1);
          break;
      }
      // convert to UNIX timestamp:
      const expiryDateTimestamp = Math.floor(expiryDateObj.getTime() / 1000);

      // create the policy
      const policy = {
        expiry: expiryDateTimestamp,
        call,
        ...(handle ? {handle} : {})
      };

      // encode the policy
      let encPolicy = new Buffer.from(JSON.stringify(policy)).toString("base64");

      // encode the signature
      const signature = crypto.createHmac('sha256', this.app.get("fileStackAppSecret")).update(encPolicy).digest('hex');

      return {
        policy: encPolicy,
        signature
      }
    }
  }

  async find (params) {
    let returnObj = {}

    if(!params.provider) {
      // this is an internal call, looking for auth policy on a specific action
      returnObj = this.generatePolicy({
        term: "1m",
        call: params.query.call,
        ...(params.query.handle ? {handle: params.query.handle} : {})
      })
    } else {
      // external call
      returnObj = {
        ...returnObj,
        viewTenantLogo: this.generatePolicy({ term: "5m", call: ["read", "convert"] })
      }

      if(params.tenantAdminUser) {
        returnObj = {
          ...returnObj,
          uploadTenantLogo: this.generatePolicy({ term: "5m", call: ["pick", "store", "convert"] })
        }
      }
    }

    return returnObj;
  }
};
