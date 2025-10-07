const express = require('express');
const router = express.Router();
const Registration = require('../models/registrations');

router.post('/', async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    res.status(201).json({ message: 'Registration successful', registration });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const registrations = await Registration.find();
  res.json(registrations);
});

module.exports = router;
