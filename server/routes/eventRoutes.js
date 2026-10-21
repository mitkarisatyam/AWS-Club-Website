const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const mongoose = require('mongoose');
const { verifiedEvents } = require('../seed');

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/events - Retrieve community events
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;

    if (!isDbConnected()) {
      let data = verifiedEvents;
      if (type && ['Upcoming', 'Past'].includes(type)) {
        data = verifiedEvents.filter(e => e.type === type);
      }
      return res.json({
        success: true,
        count: data.length,
        data: data
      });
    }

    const filter = {};
    if (type && ['Upcoming', 'Past'].includes(type)) {
      filter.type = type;
    }

    const events = await Event.find(filter).sort({ order: 1, createdAt: -1 });

    return res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    console.error('[Events Retrieval Error]', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve events from database.',
      details: err.message
    });
  }
});

// GET /api/events/:id - Get single event
router.get('/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, error: 'Database service unavailable' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    return res.json({ success: true, data: event });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/events - Add new event
router.post('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, error: 'Database service unavailable' });
    }

    const {
      title,
      tagline,
      type,
      category,
      date,
      time,
      venue,
      description,
      highlights,
      speakers,
      tags,
      status,
      registrationUrl,
      order
    } = req.body;

    if (!title || !type || !category || !date || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title, type (Upcoming/Past), category, date, and description are required.'
      });
    }

    const newEvent = new Event({
      title: title.trim(),
      tagline: tagline ? tagline.trim() : '',
      type,
      category: category.trim(),
      date: date.trim(),
      time: time ? time.trim() : 'TBA',
      venue: venue ? venue.trim() : 'VIT Pune',
      description: description.trim(),
      highlights: Array.isArray(highlights) ? highlights : [],
      speakers: Array.isArray(speakers) ? speakers : [],
      tags: Array.isArray(tags) ? tags : [],
      status: status || (type === 'Past' ? 'Completed' : 'Upcoming'),
      registrationUrl: registrationUrl || '/join.html',
      order: typeof order === 'number' ? order : 0
    });

    const saved = await newEvent.save();
    return res.status(201).json({
      success: true,
      message: 'Event successfully created',
      data: saved
    });
  } catch (err) {
    console.error('[Event Creation Error]', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create event',
      details: err.message
    });
  }
});

module.exports = router;
