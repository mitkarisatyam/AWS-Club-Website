const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Registration = require('../server/models/Registration');
const Feedback = require('../server/models/Feedback');
const Event = require('../server/models/Event');
const { verifiedEvents } = require('../server/seed');

async function testFullMongoDBFlow() {
  console.log('[E2E Test] Spinning up test MongoDB server instance...');
  let mongod;
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log(`[E2E Test] Test MongoDB server active at: ${uri}`);

    await mongoose.connect(uri);
    console.log('✓ Connected Mongoose to real MongoDB instance.');

    // 1. Test Event Model & Querying
    console.log('\n--- 1. Testing Event Model & DB Retrieval ---');
    const insertedEvents = await Event.insertMany(verifiedEvents);
    console.log(`✓ Seeded ${insertedEvents.length} verified events into MongoDB collection.`);

    const fetchedUpcoming = await Event.find({ type: 'Upcoming' });
    console.log(`✓ Queried ${fetchedUpcoming.length} upcoming events from MongoDB.`);
    const fetchedPast = await Event.find({ type: 'Past' });
    console.log(`✓ Queried ${fetchedPast.length} past events from MongoDB.`);

    // 2. Test Registration Model & Storage
    console.log('\n--- 2. Testing Registration Model & Storage ---');
    const newReg = new Registration({
      fullName: 'Test Candidate',
      email: 'candidate@vit.edu',
      prn: '12210099',
      department: 'Computer Engineering',
      year: 'Second Year (SE)',
      domain: 'Technical - Cloud Computing',
      motivation: 'Passionate about distributed systems, AWS Lambda, and building scalable cloud solutions.',
      skills: 'Python, Docker, JavaScript'
    });
    const savedReg = await newReg.save();
    console.log(`✓ Saved registration to MongoDB with _id: ${savedReg._id}`);
    
    const queriedReg = await Registration.findById(savedReg._id);
    if (queriedReg && queriedReg.email === 'candidate@vit.edu') {
      console.log('✓ Verified registration retrieval from MongoDB matched original data.');
    } else {
      throw new Error('Registration document verification failed.');
    }

    // 3. Test Feedback Model & Storage
    console.log('\n--- 3. Testing Feedback Model & Storage ---');
    const newFb = new Feedback({
      name: 'VIT Student Reviewer',
      email: 'reviewer@vit.edu',
      category: 'Events & Workshops',
      rating: 5,
      subject: 'Excellent AWS Bedrock Workshop',
      message: 'The hands-on practice with Generative AI and foundation models was very insightful.'
    });
    const savedFb = await newFb.save();
    console.log(`✓ Saved feedback to MongoDB with _id: ${savedFb._id}`);

    const queriedFb = await Feedback.findById(savedFb._id);
    if (queriedFb && queriedFb.rating === 5) {
      console.log('✓ Verified feedback document in MongoDB with rating 5.');
    } else {
      throw new Error('Feedback document verification failed.');
    }

    console.log('\n========================================');
    console.log('🎉 ALL MONGO DATABASE FLOW TESTS PASSED!');
    console.log('========================================');
  } catch (err) {
    console.error('✗ MongoDB flow test error:', err);
  } finally {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  }
}

testFullMongoDBFlow();
