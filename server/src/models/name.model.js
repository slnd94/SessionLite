const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
  prefix: { type: String },
  given: { type: String, required: true },
  middle: { type: String },
  family: { type: String, required: true }
});