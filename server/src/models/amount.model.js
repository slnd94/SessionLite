const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
  figure: { type: Number, required: true },
  currencyCode: { type: String, required: true, default: 'CAD' }
});