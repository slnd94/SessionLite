// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    // console.log("🚀 ~ file: send-welcome-verification-email.js ~ line 7 ~ context", context)
    // send welcome/verification email to user
    context.app.service('emails')
      .create({
        template: context.app.get('welcomeVerificationEmailTemplate'),
        destination: context.data.email,
        data: {                  
          user: {
            name: context.data.name
          },
          saleItems: [].map(item => ({
            imageUrl: `${item.product.images.thumbnail}`,
            title: item.product.title,
            creator: item.product.creators[0],
            pricePaid: 'hi'
          })),
          pricePaid: { 
            subtotal: 'hi',
            taxes: [],
            total: 'hi'
          }
        }
      });
    return context;
  };
};
