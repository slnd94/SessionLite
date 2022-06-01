const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const amount = require('./amount.model');

module.exports = new Schema({
  sale: { type : Schema.Types.ObjectId, ref: 'sales', required: true },
  pricePaid: { type: amount, required: true }
}); 