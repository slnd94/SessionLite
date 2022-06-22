// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
var geoip = require('geoip-lite');

// var ip = "207.97.227.239";
// var geo = geoip.lookup(ip);

// console.log(geo);

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
  console.log("🚀 ~ file: assign-param-user-country.js ~ line 13 ~ context", context)
    //get user's country
    // if user is registered, grab from their user account else detect from their IP Address
    let userCountry;
    if (context.params.authenticated && context.params.user?.country ) {
      // grab country from user account
      // TODO: detect user country from user account
    } else {
      // get country from the IP address
      // TODO: detect user country from user IP
    }

    // TEMP: default to 'CA'
    userCountry = {
      code: 'CA',
      name: "Canada"
    };

    context.params.userCountry = userCountry;

    return context;
  };
};
