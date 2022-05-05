const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const amount = require('./amount.model');

module.exports = new Schema({
  product: { type : Schema.Types.ObjectId, ref: 'products', required: true },
  priceWhenAdded: { type: amount },
  savedForLater: { type : Boolean, default: false }
}, {
  timestamps: true
});