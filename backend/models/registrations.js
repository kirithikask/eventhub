const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  // Example fields, change/remove as per your requirements:
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', registrationSchema);

