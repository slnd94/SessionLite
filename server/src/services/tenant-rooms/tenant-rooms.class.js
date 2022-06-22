/* eslint-disable no-unused-vars */
exports.TenantRooms = class TenantRooms {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async find (params) {    
    return await this.app.service('rooms').find({
      query: {
        tenant: params.query.tenant,
        $skip: params.query.$skip,
        $limit: params.query.$limit
      }
    });
  }

  // async get (id, params) {
  //   return {
  //     id, text: `A new message with ID: ${id}!`
  //   };
  // }

  // async create (data, params) {
  //   if (Array.isArray(data)) {
  //     return Promise.all(data.map(current => this.create(current, params)));
  //   }

  //   return data;
  // }

  // async update (id, data, params) {
  //   return data;
  // }

  // async patch (id, data, params) {
  //   return data;
  // }

  // async remove (id, params) {
  //   return { id };
  // }
};
