/* eslint-disable no-unused-vars */
exports.TenantTemplates = class TenantTemplates {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async get(id, params) {
    // id should be the tenant id
    // the requested template id should be in params.query.template

    if (!params?.query?.template) {
      // No template id supplied.  Return bad request
      return Promise.reject(new errors.BadRequest("Invalid template"));
    }
    ////////////////
    // get the template
    ////////////////
    try {
      const template = await this.app
        .service("templates")
        .get(params.query.template);

      if (!template?._id === params.query.template) {
        // could not find a template with the requested id.  Return bad request
        return Promise.reject(
          new errors.BadRequest("Invalid template requested")
        );
      } else {
        if (!template.tenant.toString() === id.toString()) {
          // template belongs to a different tenant
          return Promise.reject(
            new errors.BadRequest("invalid template requested")
          );
        } else {
          return template;
        }
      }
    } catch (err) {
      console.log(
        "🚀 ~ file: tenant-templates.class.js ~ line 39 ~ TenantTemplates ~ patch ~ err",
        err
      );
      return { success: false };
    }
  }

  async find(params) {
    // assign the search term on name if provided
    const searchQuery = params.query.search
      ? {
          $or: [
            { name: { $regex: new RegExp(params.query.search, "i") } },
            { description: { $regex: new RegExp(params.query.search, "i") } },
          ],
        }
      : {};
    delete params.query.search;

    return await this.app.service("templates").find({
      query: {
        ...searchQuery,
        tenant: params.query.tenant,
        $skip: params.query.$skip,
        $limit: params.query.$limit,
      },
    });
  }

  async patch(id, data, params) {
    // Get the tenant
    const tenant = await this.app.service("tenants").get(id);

    if (!tenant) {
      // could not find tenant with requested id.  Return bad request
      return Promise.reject(new errors.BadRequest("Invalid tenant"));
    } else {
      if (data.addTemplate) {
        try {
          return await this.app.service("templates").create({
            tenant: id,
            name: data.addTemplate.name,
            ...(data.addTemplate.description
              ? { description: data.addTemplate.description }
              : {}),
          });
        } catch (err) {
          console.log(
            "🚀 ~ file: tenant-templates.class.js ~ line 39 ~ TenantTemplates ~ patch ~ err",
            err
          );
        }
      }

      if (data.updateTemplate) {
        try {
          // get the existing template
          const template = await this.app
            .service("templates")
            .get(data.updateTemplate.id);

          if (!template?._id === data.updateTemplate.id) {
            // could not find a template with the requested id.  Return bad request
            return Promise.reject(
              new errors.BadRequest("Invalid template requested")
            );
          } else {
            if (!template.tenant.toString() === id.toString()) {
              // template belongs to a different tenant
              return Promise.reject(new errors.BadRequest("invalid template"));
            } else {
              return this.app
                .service("templates")
                .patch(template._id, {
                  name: data.updateTemplate.name,
                  description: data.updateTemplate.description,
                })
                .then((res) => {
                  return { success: true };
                });
            }
          }
        } catch (err) {
          console.log(
            "🚀 ~ file: tenant-templates.class.js ~ line 39 ~ TenantTemplates ~ patch ~ err",
            err
          );
          return { success: false };
        }
      }
    }
  }
};
