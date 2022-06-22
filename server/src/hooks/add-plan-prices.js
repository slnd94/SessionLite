// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { api } = require("../utils/api");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
  // console.log("🚀 ~ file: add-plan-prices.js ~ line 7 ~ context", context.result.data)
    const plans = context.result.data;
    const planIds = plans.map(plan => plan.paddlePlanId).join();
    console.log("🚀 ~ file: add-plan-prices.js ~ line 11 ~ planIds", planIds)
    const prices = await api({
      method: "get",
      url: `${context.app.get('paddleApiBaseUrl')}/prices\?product_ids=${planIds}\&customer_country=${context.params.userCountryCode}`
    });
    console.log("🚀 ~ file: add-plan-prices.js ~ line 16 ~ prices")
    console.dir(prices.data, { depth: null })
    
    return context;
  };
};
