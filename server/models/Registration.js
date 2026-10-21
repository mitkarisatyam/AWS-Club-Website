const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter a valid email address'
    ]
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  prn: {
    type: String,
    required: [true, 'Student PRN / ID is required'],
    trim: true,
    maxlength: [30, 'PRN cannot exceed 30 characters']
  },
  department: {
    type: String,
    required: [true, 'Department / Branch is required'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Year of study is required'],
    enum: {
      values: ['First Year (FE)', 'Second Year (SE)', 'Third Year (TE)', 'Final Year (BE)'],
      message: 'Year must be FE, SE, TE, or BE'
    }
  },
  domain: {
    type: String,
    required: [true, 'Domain of interest is required'],
    enum: {
      values: [
        'Technical - Software Development',
        'Technical - Cloud Computing',
        'Technical - AI / Machine Learning',
        'Technical - Cybersecurity',
        'Technical - Competitive Programming',
        'Creative - Graphic & UI/UX Design',
        'Operations - Events & Community Management',
        'Media & Corporate Partnerships'
      ],
      message: 'Please select a valid domain from the club domains'
    }
  },
  subDomain: {
    type: String,
    trim: true,
    default: ''
  },
  linkedin: {
    type: String,
    trim: true,
    default: ''
  },
  github: {
    type: String,
    trim: true,
    default: ''
  },
  motivation: {
    type: String,
    required: [true, 'Please share your motivation for joining AWS SBG VIT Pune'],
    trim: true,
    minlength: [10, 'Motivation must be at least 10 characters long'],
    maxlength: [1500, 'Motivation cannot exceed 1500 characters']
  },
  skills: {
    type: String,
    trim: true,
    maxlength: [1000, 'Skills description cannot exceed 1000 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Accepted', 'Contacted'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Registration', registrationSchema);
