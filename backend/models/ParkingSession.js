const mongoose = require('mongoose');

const parkingSessionSchema = new mongoose.Schema({
  slotId: { type: String, required: true },
  slotNumber: { type: String, required: true },
  vehiclePlate: { type: String, required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date, default: null },
  durationMinutes: { type: Number, default: 0 },
  status: { type: String, enum: ['ACTIVE', 'COMPLETED'], default: 'ACTIVE' },
  fee: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 5.0 }
});

module.exports = mongoose.model('ParkingSession', parkingSessionSchema);
