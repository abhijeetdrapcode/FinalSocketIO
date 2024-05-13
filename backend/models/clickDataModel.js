const mongoose = require('mongoose');

// Define MongoDB schema
const clickDataSchema = new mongoose.Schema({
  tag: String,
  text: String,
  id: String,
  ip: String,
  class: String,
  headers: Object,
  localStorageData: Object,
});

// Create MongoDB model
const ClickData = mongoose.model('ClickData', clickDataSchema);

module.exports = ClickData;