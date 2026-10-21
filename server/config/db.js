const mongoose = require('mongoose');

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aws_sbg_vit';
  
  if (!cachedPromise) {
    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    }).then(conn => {
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);
      return true;
    }).catch(error => {
      cachedPromise = null;
      console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${error.message}`);
      return false;
    });
  }

  try {
    await cachedPromise;
  } catch (err) {
    cachedPromise = null;
  }

  return mongoose.connection.readyState === 1;
};

const getDBStatus = () => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  return {
    state: mongoose.connection.readyState,
    isConnected: mongoose.connection.readyState === 1,
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null
  };
};

module.exports = { connectDB, getDBStatus };
