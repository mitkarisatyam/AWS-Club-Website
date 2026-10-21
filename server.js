require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB, getDBStatus } = require('./server/config/db');
const Event = require('./server/models/Event');
const Feedback = require('./server/models/Feedback');
const { verifiedEvents, verifiedFeedback } = require('./server/seed');

const app = express();
const INITIAL_PORT = parseInt(process.env.PORT, 10) || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.path}`);
  }
  next();
});

// Serverless / Vercel DB auto-connect middleware
app.use('/api', async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
  } catch (err) {
    console.warn('[Serverless DB Middleware]', err.message);
  }
  next();
});

// Backend API Routes
app.use('/api/join', require('./server/routes/registrationRoutes'));
app.use('/api/feedback', require('./server/routes/feedbackRoutes'));
app.use('/api/events', require('./server/routes/eventRoutes'));

// Health & Status Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
  } catch (err) {
    console.warn('[Health DB]', err.message);
  }
  const dbStatus = getDBStatus();
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    club: 'AWS SBG VIT Pune',
    nodeVersion: process.version
  });
});

// Root homepage route
app.get('/', (req, res) => {
  const publicDir = path.join(process.cwd(), 'public');
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Standalone local static serving & clean page routes (handled by Vercel CDN in production)
if (!process.env.VERCEL) {
  const PUBLIC_DIR = path.join(__dirname, 'public');

  const pageMap = {
    '/': 'index.html',
    '/home': 'index.html',
    '/about': 'about.html',
    '/about.html': 'about.html',
    '/domains': 'domains.html',
    '/domains.html': 'domains.html',
    '/team': 'team.html',
    '/team.html': 'team.html',
    '/events': 'events.html',
    '/events.html': 'events.html',
    '/projects': 'projects.html',
    '/projects.html': 'projects.html',
    '/join': 'join.html',
    '/join.html': 'join.html',
    '/feedback': 'feedback.html',
    '/feedback.html': 'feedback.html'
  };

  Object.entries(pageMap).forEach(([route, file]) => {
    app.get(route, (req, res) => {
      const filePath = path.join(PUBLIC_DIR, file);
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).send(`Page ${file} not found.`);
      }
    });
  });

  app.use(express.static(PUBLIC_DIR, {
    extensions: ['html', 'htm'],
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.gltf')) {
        res.setHeader('Content-Type', 'model/gltf+json');
      } else if (filePath.endsWith('.glb')) {
        res.setHeader('Content-Type', 'model/gltf-binary');
      }
    }
  }));

  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, error: 'API route not found' });
    }
    res.status(404).sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });
} else {
  // On Vercel, any unmatched /api route returns 404 JSON
  app.use('/api', (req, res) => {
    res.status(404).json({ success: false, error: 'API route not found' });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Auto-seed initial events and feedback if MongoDB is connected and collection is empty
async function ensureInitialEvents() {
  try {
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      console.log('[Init] No events found in MongoDB. Seeding initial verified events...');
      await Event.insertMany(verifiedEvents);
      console.log(`[Init] Seeded ${verifiedEvents.length} verified events successfully!`);
    }

    const fbCount = await Feedback.countDocuments();
    if (fbCount === 0 && verifiedFeedback) {
      console.log('[Init] No feedback found in MongoDB. Seeding initial community feedback...');
      await Feedback.insertMany(verifiedFeedback);
      console.log(`[Init] Seeded ${verifiedFeedback.length} community feedback entries successfully!`);
    }
  } catch (err) {
    console.warn('[Init Warning] Could not auto-seed data:', err.message);
  }
}

// Start Server with port fallback
function startServer(port) {
  const server = app.listen(port, async () => {
    console.log(`====================================================`);
    console.log(`🚀 AWS SBG VIT Pune Server is live!`);
    console.log(`📍 Web URL: http://localhost:${port}/`);
    console.log(`📡 API Endpoints:`);
    console.log(`   - POST /api/join        (Join Us / Registration)`);
    console.log(`   - POST /api/feedback    (Visitor Feedback)`);
    console.log(`   - GET  /api/events      (MongoDB Events Query)`);
    console.log(`   - GET  /api/health      (Backend & DB Status)`);
    console.log(`====================================================`);

    // Connect to MongoDB
    const connected = await connectDB();
    if (connected) {
      await ensureInitialEvents();
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[Server Error]', err);
    }
  });
}

if (!process.env.VERCEL) {
  startServer(INITIAL_PORT);
} else {
  connectDB().then(connected => {
    if (connected) ensureInitialEvents();
  }).catch(err => {
    console.warn('[Vercel DB Init]', err.message);
  });
}

module.exports = app;
