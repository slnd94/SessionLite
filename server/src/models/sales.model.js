// sales-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const amount = require('./amount.model');

module.exports = function (app) {
  const modelName = 'sales';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    user: { type : Schema.Types.ObjectId, ref: 'users', required: true },
    pricePaid: {
      subtotal: { type: amount, required: true },
      taxes: [{
        tax: { type: String, required: true },
        rate: { type: Number, required: true },
        amount: { type: amount, required: true }
      }],
      total: { type: amount, required: true }
    },
    saleProducts: [{
      product: { type : Schema.Types.ObjectId, ref: 'products', required: true },
      pricePaid: { type: amount, required: true }
    }]
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
