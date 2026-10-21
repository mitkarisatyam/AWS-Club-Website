const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const mongoose = require('mongoose');

// Helper to check MongoDB connection status
const isDbConnected = () => mongoose.connection.readyState === 1;

// POST /api/join - Register membership interest
router.post('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database service is currently unavailable. Please try again later.',
        code: 'DB_UNAVAILABLE'
      });
    }

    const {
      fullName,
      email,
      phone,
      prn,
      department,
      year,
      domain,
      subDomain,
      linkedin,
      github,
      motivation,
      skills
    } = req.body;

    // Server-side explicit validation
    const errors = [];
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long.');
    }
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email || !emailRegex.test(email.trim())) {
      errors.push('A valid email address is required.');
    }
    if (!prn || typeof prn !== 'string' || prn.trim().length === 0) {
      errors.push('Student PRN / ID is required.');
    }
    if (!department || typeof department !== 'string' || department.trim().length === 0) {
      errors.push('Department / Branch is required.');
    }
    if (!year || typeof year !== 'string' || year.trim().length === 0) {
      errors.push('Year of study is required.');
    }
    if (!domain || typeof domain !== 'string' || domain.trim().length === 0) {
      errors.push('Please choose a domain of interest.');
    }
    if (!motivation || typeof motivation !== 'string' || motivation.trim().length < 10) {
      errors.push('Please provide a motivation of at least 10 characters.');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Check for recent duplicate registration with same email or PRN
    const existing = await Registration.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { prn: prn.trim() }
      ]
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'A registration application with this email or PRN already exists in our database.',
        existingDomain: existing.domain
      });
    }

    // Create and save to MongoDB
    const registration = new Registration({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      prn: prn.trim(),
      department: department.trim(),
      year: year.trim(),
      domain: domain.trim(),
      subDomain: subDomain ? subDomain.trim() : '',
      linkedin: linkedin ? linkedin.trim() : '',
      github: github ? github.trim() : '',
      motivation: motivation.trim(),
      skills: skills ? skills.trim() : ''
    });

    const saved = await registration.save();

    return res.status(201).json({
      success: true,
      message: 'Your registration application has been successfully received and saved!',
      data: {
        id: saved._id,
        fullName: saved.fullName,
        email: saved.email,
        domain: saved.domain,
        createdAt: saved.createdAt
      }
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: messages
      });
    }

    console.error('[Registration Error]', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while processing your registration. Please try again later.'
    });
  }
});

// GET /api/join - Retrieve registration statistics or check status
router.get('/stats', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, error: 'Database disconnected' });
    }
    const count = await Registration.countDocuments();
    return res.json({ success: true, count });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
