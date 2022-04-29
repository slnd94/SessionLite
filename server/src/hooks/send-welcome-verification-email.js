// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    // send welcome/verification email to user
    context.app.service('emails')
      .create({
        template: context.app.get('welcomeVerificationEmailTemplate'),
        destination: context.data.email,
        data: {  
          appLogoUrl: `${context.app.get('appWebBaseUrl')}/images/siteLogoSmall.png`,
          appPrimaryColor: context.app.get('appPrimaryColor'),
          appName: context.app.get('appName'),
          emailVerificationUrl: `${context.app.get('appWebBaseUrl')}/verification/email/${context.data.emailVerificationKey}`,
          privacyPolicyUrl: context.app.get('privacyPolicyUrl')
        }
      });
    return context;
  };
};
