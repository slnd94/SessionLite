// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getCountryByIP } = require("../utils/ipUtils");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    //get user's country
    // if user is registered, grab from their user account else detect from their IP Address
    let userCountry;
    if (context.params.authenticated && context.params.user?.country ) {
      // get country from user account
      userCountry = context.params.user.country;
    } else {
      // get country from the IP address
      if (context.params?.headers?.client_ip) {
        userCountry = getCountryByIP(context.params.headers.client_ip);
      } else if (context.params?.headers && context.params.headers['x-forwarded-for']) {
        userCountry = getCountryByIP(context.params.headers["x-forwarded-for"].split(",")[0]);
      } else if (context.params?.headers && context.params.headers['x-real-ip']) {
        userCountry = getCountryByIP(context.params.headers['x-real-ip']);
      } else {
        // cannot detect from IP.  Use the default value from app settings.
        userCountry = {
          code: context.app.get("defaultUserCountryCode")
        };
      }
    }

    context.params.userCountry = userCountry;

    return context;
  };
};
