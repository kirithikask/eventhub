const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  venue: { type: String, required: true },
  date: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' },
  type: { type: String, enum: ['own', 'other'], default: 'own' },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
