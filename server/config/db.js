const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aws_sbg_vit';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn(`[MongoDB Tip] Ensure MONGODB_URI is configured in Vercel environment variables or local .env`);
    return false;
  }
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
