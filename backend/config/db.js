const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/parksense';
  
  try {
    // Attempt Mongoose connection with 3 sec timeout
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected to: ${mongoose.connection.host}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Database Warning] Could not connect to local MongoDB (${err.message}).`);
    console.log(`[Database] Fallback Activated: Operating with high-performance In-Memory DB Mode.`);
  }
};

const getDbStatus = () => ({
  isMongoConnected,
  mode: isMongoConnected ? 'MongoDB' : 'InMemory (Fallback)'
});

module.exports = { connectDB, getDbStatus, isMongoConnected: () => isMongoConnected };
