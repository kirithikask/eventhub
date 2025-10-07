const express = require('express');
const router = express.Router();
const Event = require('../models/events');

router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: 'Event created', event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

module.exports = router;
