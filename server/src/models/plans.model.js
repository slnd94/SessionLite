// plans-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "plans";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      index: { type: Number, required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      features: [{ type: String }],
      paddlePlanId: { type: Number, required: false },
      allowances: {
        users: {
          client: {
            active: { type: Number, required: true, default: -1 },
            invites: { type: Number, required: true, default: -1 },
            total: { type: Number, required: true, default: -1 }
          },
          team: {
            active: { type: Number, required: true, default: -1 },
            invites: { type: Number, required: true, default: -1 },
            total: { type: Number, required: true, default: -1 }
          },
          total: {
            active: { type: Number, required: true, default: -1 },
            invites: { type: Number, required: true, default: -1 },
            total: { type: Number, required: true, default: -1 }
          }
        },
      },
      tag: { type: String, required: false },
      recurringInterval: {
        type: String,
        enum: ["day", "week", "month", "year"],
        required: true,
      },
      requiresCheckout: { type: Boolean, required: true },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
