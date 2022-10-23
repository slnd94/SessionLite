// sessions-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'sessions';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    tenant: { type : Schema.Types.ObjectId, ref: 'tenants', required: true },
    name: { type: String, required: false },
    description: { type: String, required: false },
    start: { type: Date, required: true },
    duration: { type: Number, required: true },  // duration in minutes
    participants: {
      team: [{ type: Schema.Types.ObjectId, ref: 'users' }],
      clients: [{ type: Schema.Types.ObjectId, ref: 'users' }]
    },
    allowances: {
      users: {
        clients: {
          min: { type: Number, required: true, default: -1 },
          max: { type: Number, required: true, default: -1 }
        },
        team: {
          min: { type: Number, required: true, default: -1 },
          max: { type: Number, required: true, default: -1 }
        },
        total: {
          min: { type: Number, required: true, default: -1 },
          max: { type: Number, required: true, default: -1 }
        }
      }
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
