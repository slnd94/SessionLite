// tenants-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'tenants';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    name: { type: String, required: true },
    logo: {
      handle: { type: String, required: false }
    },
    createdByUser: { type : Schema.Types.ObjectId, ref: 'users', required: false },
    adminUsers: [{ type : Schema.Types.ObjectId, ref: 'users', required: true }],
    plan: { type : Schema.Types.ObjectId, ref: 'plans', required: false },
    paddle: {
      subscriptionId: { type : Schema.Types.Number, required: false },
      planId: { type : Schema.Types.String, required: false },
      userId: { type : Schema.Types.Number, required: false }
    }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
  
};
