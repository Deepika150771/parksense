const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: { type: String, required: true, unique: true },
  lotId: { type: String, default: 'lot_001' },
  zone: { type: String, default: 'Zone A (Ground)' },
  floor: { type: Number, default: 1 },
  type: { type: String, enum: ['Standard', 'EV Charging', 'Accessible', 'VIP'], default: 'Standard' },
  isOccupied: { type: Boolean, default: false },
  distanceCm: { type: Number, default: 150.0 },
  thresholdCm: { type: Number, default: 35.0 },
  batteryLevel: { type: Number, default: 100 },
  vehiclePlate: { type: String, default: null },
  occupiedSince: { type: Date, default: null },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
