// paymentIntents-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const amount = require('./amount.model');
const userCartEntry = require('./userCartEntry.model');

module.exports = function (app) {
  const modelName = 'paymentIntents';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    userId: { type : Schema.Types.ObjectId, ref: 'users', required: true },
    orderItems: [{ type: Object }],
    subtotal: { type: amount },
    taxes: [{
      tax: { type: String, required: true },
      rate: { type: Number, required: true },
      amount: { type: amount, required: true }
    }],
    total: { type: amount },
    stripePaymentIntentId: { type: String, trim: true, unique: true, required: true }
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
