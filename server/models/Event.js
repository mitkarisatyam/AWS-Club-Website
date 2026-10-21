const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    minlength: [3, 'Event title must be at least 3 characters']
  },
  tagline: {
    type: String,
    trim: true,
    default: ''
  },
  type: {
    type: String,
    required: [true, 'Event type is required (Upcoming or Past)'],
    enum: {
      values: ['Upcoming', 'Past'],
      message: 'Type must be either Upcoming or Past'
    }
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    trim: true,
    default: 'Workshop'
  },
  date: {
    type: String,
    required: [true, 'Event date is required'],
    trim: true
  },
  time: {
    type: String,
    trim: true,
    default: 'TBA'
  },
  venue: {
    type: String,
    trim: true,
    default: 'VIT Pune / Hybrid'
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  highlights: [{
    type: String,
    trim: true
  }],
  speakers: [{
    name: { type: String, trim: true },
    role: { type: String, trim: true },
    organization: { type: String, trim: true }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['Open for Registration', 'Upcoming', 'Completed'],
    default: 'Upcoming'
  },
  registrationUrl: {
    type: String,
    trim: true,
    default: '/join.html'
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
