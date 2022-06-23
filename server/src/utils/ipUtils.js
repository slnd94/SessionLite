const geoip = require("geoip-lite");

module.exports = {
  getCountryByIP: (ip) => {
    const geo = geoip.lookup(ip);
    return {
      code: geo.country,
    };
  },
};
