const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/feedback - Retrieve approved / recent community feedback
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const { connectDB } = require('../config/db');
      await connectDB();
    }

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database service is currently unavailable. Please try again later.',
        code: 'DB_UNAVAILABLE'
      });
    }

    const limit = parseInt(req.query.limit, 10) || 12;
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name category rating subject message createdAt');

    return res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (err) {
    console.error('[Feedback GET Error]', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve feedback from database.'
    });
  }
});

// POST /api/feedback - Submit visitor feedback
router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const { connectDB } = require('../config/db');
      await connectDB();
    }

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database service is currently unavailable. Please try again later.',
        code: 'DB_UNAVAILABLE'
      });
    }

    const { name, email, category, rating, subject, message } = req.body;

    // Server-side explicit validation
    const errors = [];
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long.');
    }
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email || !emailRegex.test(email.trim())) {
      errors.push('A valid email address is required.');
    }
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      errors.push('Feedback category is required.');
    }
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      errors.push('Rating must be a whole number between 1 and 5 stars.');
    }
    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      errors.push('Subject must be at least 3 characters long.');
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.push('Feedback message must be at least 10 characters long.');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    const feedback = new Feedback({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category: category.trim(),
      rating: numRating,
      subject: subject.trim(),
      message: message.trim()
    });

    const saved = await feedback.save();

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been successfully submitted.',
      data: {
        id: saved._id,
        name: saved.name,
        category: saved.category,
        rating: saved.rating,
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

    console.error('[Feedback Error]', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while recording your feedback. Please try again later.'
    });
  }
});

module.exports = router;
