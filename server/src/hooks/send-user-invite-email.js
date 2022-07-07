// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    // get the tenant name
    const tenant = context.result.tenant ? await context.app.service('tenants').get(context.result.tenant) : {};

    // send invitation email to user
    context.app.service('emails-sendinblue')
    .create({
      templateId: context.app.get(context.result.type === "team" ? "invitationTeamEmailTemplate" : "invitationClientEmailTemplate"),
      destination: context.result.email,
      data: {
        appName: context.app.get('appName'),
        tenantName: tenant.name,
        registrationUrl: `${context.app.get('appWebBaseUrl')}/auth/signup?invite=${context.result._id}&tenant=${tenant._id}`,
        privacyPolicyUrl: context.app.get('privacyPolicyUrl')
      }
    });
    return context;
  };
};
