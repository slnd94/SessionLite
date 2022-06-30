// plans-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'plans';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    index: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    paddlePlanId: { type: Number, required: true },
    allowances: { 
      activeUsers: { type: Number, required: true }
    },
    tag: { type: String, required: false },
    recurringInterval: {
      type: Number,
      enum: ['day', 'week', 'month', 'year'],
      required: true
    },
    requiresCheckout: { type: Boolean, required: true }
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
