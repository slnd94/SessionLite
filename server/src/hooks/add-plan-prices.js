// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { api } = require("../utils/api");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    if(context.method === 'get') {

      const plan = context.result;
      const paddleResponse = await api({
        method: "get",
        url: `${context.app.get("paddleApiBaseUrl")}/prices\?product_ids=${plan.paddlePlanId}\&customer_country=${context.params.userCountry.code}`,
      });
      const paddleProduct = paddleResponse.data.response.products.find(
        (product) => product.product_id === plan.paddlePlanId && product
      );

      context.result = {
        ...context.result,
        subscription: {
          ...paddleProduct.subscription,
          currency: paddleProduct.currency
        }
      }

    } else if (context.method === 'find') {
      const plans = context.result.data;

      // cancatenated string of planIds example "28237,383763,29272,29280"
      const planIds = plans.map((plan) => plan.paddlePlanId).join();
      const paddleResponse = await api({
        method: "get",
        url: `${context.app.get("paddleApiBaseUrl")}/prices\?product_ids=${planIds}\&customer_country=${context.params.userCountry.code}`,
      });
      const paddleProducts = paddleResponse.data.response.products;

      context.result.data = plans.map((plan) => {
        const product = paddleProducts.find(
          (product) => product.product_id === plan.paddlePlanId && product
        );
        return {
          ...(product
            ? {
                subscription: {
                  ...product.subscription,
                  currency: product.currency
                }
              }
            : {}),
          ...plan,
        };
      });
    }



    return context;
  };
};
