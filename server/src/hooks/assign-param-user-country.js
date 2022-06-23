// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const geoip = require('geoip-lite');

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
      console.log("🚀 ~ file: assign-param-user-country.js ~ line 17 ~ context.params?.headers", context.params)
      // get country from the IP address
      if (context.params?.headers && context.params.headers['x-real-ip']) {
        const ip = context.params.headers['x-real-ip'];
        const geo = geoip.lookup(ip);
        userCountry = {
          code: geo.country
        }
      } else {
        // cannot detect from IP.  Default to US
        userCountry = {
          code: 'US',
          name: "United States"
        };
      }
    }

    context.params.userCountry = userCountry;

    return context;
  };
};
