const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  slotId: { type: String, required: true },
  slotNumber: { type: String, required: true },
  distanceCm: { type: Number, required: true },
  isOccupied: { type: Boolean, required: true },
  rawThreshold: { type: Number, default: 35 },
  sensorId: { type: String, default: 'ESP32_SR04' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
