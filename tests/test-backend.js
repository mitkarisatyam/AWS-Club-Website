const http = require('http');

async function testBackend() {
  console.log('[Test] Starting backend and API verification...');

  // 1. Verify models and schemas
  try {
    const Registration = require('../server/models/Registration');
    const Feedback = require('../server/models/Feedback');
    const Event = require('../server/models/Event');
    console.log('✓ Mongoose models (Registration, Feedback, Event) loaded successfully.');

    // Test Registration validation (empty document should fail)
    const emptyReg = new Registration({});
    let regErr = null;
    try { await emptyReg.validate(); } catch (e) { regErr = e; }
    if (regErr && regErr.errors['fullName'] && regErr.errors['email']) {
      console.log('✓ Registration server-side validation rules correctly enforced.');
    } else {
      console.error('✗ Registration validation unexpected result:', regErr);
    }

    // Test Feedback validation (empty document should fail)
    const emptyFb = new Feedback({});
    let fbErr = null;
    try { await emptyFb.validate(); } catch (e) { fbErr = e; }
    if (fbErr && fbErr.errors['name'] && fbErr.errors['message']) {
      console.log('✓ Feedback server-side validation rules correctly enforced.');
    } else {
      console.error('✗ Feedback validation unexpected result:', fbErr);
    }

    // Test Event validation
    const emptyEvt = new Event({});
    let evtErr = null;
    try { await emptyEvt.validate(); } catch (e) { evtErr = e; }
    if (evtErr && evtErr.errors['title']) {
      console.log('✓ Event server-side validation rules correctly enforced.');
    } else {
      console.error('✗ Event validation unexpected result:', evtErr);
    }
  } catch (err) {
    console.error('✗ Model verification error:', err);
  }

  // 2. Test verified events array
  const { verifiedEvents } = require('../server/seed');
  if (Array.isArray(verifiedEvents) && verifiedEvents.length >= 2) {
    console.log(`✓ Verified events seed dataset has ${verifiedEvents.length} events (Upcoming & Past).`);
  } else {
    console.error('✗ Verified events dataset check failed.');
  }

  console.log('[Test] Verification completed.');
}

testBackend();
