const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Example fields, change as needed:
  password: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  role:     { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError and the ReferenceError:
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;

