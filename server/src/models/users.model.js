// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const name = require('./name.model');
const userCartEntry = require('./userCartEntry.model');

module.exports = function (app) {
  const modelName = 'users';
  const mongooseClient = app.get('mongooseClient');
  const schema = new mongooseClient.Schema({
  
    email: { type: String, unique: true, lowercase: true },
    password: { type: String },  
    name: { type: name },
    locked: { type: Boolean, default: false },
    verification: {
      emailVerified: { type: Boolean, default: false },
      emailVerificationKey: { type: String, required: false },
      emailVerificationKeyExpiryDate: { type: Date, required: false }
    },    
    sysAdmin: { type: Boolean, default: false },
    cart: [{ type: userCartEntry }]
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
