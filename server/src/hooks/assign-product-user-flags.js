// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (context.params.user) {
      // set authUserAdmin
      if(context.params.sysAdminUser) {
        context.result.authUserAdmin = true;
      }
  
      // set authUserPurchased
      if(context.params.user.purchasedProducts
        && context.params.user.purchasedProducts.find(x => x.toString() === context.id.toString())) {
        context.result.authUserPurchased = true;
      }
  
      // set inUserCart
      if(context.params.user.cart
        && context.params.user.cart.find(x => x.product && x.product.toString() === context.id.toString())) {
        context.result.inUserCart = true;
      }
    }

    return context;
  };
};
