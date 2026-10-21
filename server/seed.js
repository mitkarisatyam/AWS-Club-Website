require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

const verifiedEvents = [
  {
    title: 'AWS Cloud Discovery Day: Architecture & Serverless Foundations',
    tagline: 'Practical hands-on workshop on AWS core compute, storage, and serverless architectures.',
    type: 'Upcoming',
    category: 'Hands-on Workshop',
    date: 'Upcoming Semester 2026',
    time: '3:30 PM - 6:00 PM IST',
    venue: 'VIT Pune Campus & Virtual Discord',
    description: 'An interactive session guiding students through core AWS services including EC2, S3, IAM, and Lambda. Learn how to architect scalable, resilient cloud applications from scratch.',
    highlights: [
      'AWS Core Global Infrastructure & Security Models',
      'Deploying Serverless Functions with AWS Lambda',
      'Architecting for Scalability, High Availability, and Cost Efficiency',
      'AWS Student Certifications & Career Trajectory'
    ],
    speakers: [
      { name: 'Aditya Katare', role: 'President', organization: 'AWS SBG VIT Pune' },
      { name: 'Satyajit Gaikwad', role: 'Head — Web Development', organization: 'AWS SBG VIT Pune' }
    ],
    tags: ['AWS', 'Cloud Computing', 'Serverless', 'Architecture', 'VIT Pune'],
    status: 'Open for Registration',
    registrationUrl: '/join.html',
    order: 1
  },
  {
    title: 'AWS SBG VIT Pune: Community Orientation & Cloud Roadshow',
    tagline: 'Welcoming the new cohort and introducing the roadmap for student-led cloud innovation.',
    type: 'Past',
    category: 'Community Meetup',
    date: 'Past Session',
    time: 'Completed',
    venue: 'VIT Pune Campus',
    description: 'Inaugural orientation introducing students to AWS Student Building Group VIT Pune, our technical domains, collaborative project pipelines, and hands-on peer mentorship programs.',
    highlights: [
      'Club Vision, Mission & Community Overview',
      'Introduction of Technical, Creative & Operations Domains',
      'Student Project Opportunities & Open Source Collaborations',
      'Networking with Club Leadership and Senior Mentors'
    ],
    speakers: [
      { name: 'Aditya Katare', role: 'President', organization: 'AWS SBG VIT Pune' },
      { name: 'Aryan Khade', role: 'Vice President', organization: 'AWS SBG VIT Pune' }
    ],
    tags: ['Community', 'Orientation', 'Cloud Careers', 'AWS SBG'],
    order: 2
  }
];

const verifiedFeedback = [
  {
    name: 'Sanket Patil',
    email: 'sanket.patil@vit.edu',
    category: 'Website Experience',
    rating: 5,
    subject: 'Incredible 3D animations and cosmic theme!',
    message: 'The 3D WebGL particle morphing between the rocket and satellite is visually stunning. Best student club website I have seen at VIT.'
  },
  {
    name: 'Pooja Kulkarni',
    email: 'pooja.k@vit.edu',
    category: 'Events & Workshops',
    rating: 5,
    subject: 'Hands-on AWS Lambda session was super helpful',
    message: 'Attended the cloud foundations workshop. The live demo on serverless architecture and IAM security made cloud concepts so easy to grasp.'
  },
  {
    name: 'Rohan Sharma',
    email: 'rohan.sharma@vit.edu',
    category: 'Technical Content & Projects',
    rating: 5,
    subject: 'Great open source student projects',
    message: 'Looking forward to collaborating on cloud-native and generative AI projects with the AWS SBG team.'
  }
];

const Feedback = require('./models/Feedback');

async function seedEvents() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aws_sbg_vit';
  console.log(`[Seed] Connecting to MongoDB at ${uri}...`);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to MongoDB.');

    const count = await Event.countDocuments();
    if (count > 0) {
      console.log(`[Seed] Database already contains ${count} events. Refreshing verified events...`);
      await Event.deleteMany({});
    }

    const inserted = await Event.insertMany(verifiedEvents);
    const fbCount = await Feedback.countDocuments();
    if (fbCount === 0) {
      const insertedFb = await Feedback.insertMany(verifiedFeedback);
      console.log(`[Seed] Seeded ${insertedFb.length} initial feedback testimonials into MongoDB!`);
    }

    await mongoose.disconnect();
    console.log('[Seed] Disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seedEvents();
}

module.exports = { seedEvents, verifiedEvents, verifiedFeedback };
