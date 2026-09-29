const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'ParkSense Central Deck' },
  code: { type: String, required: true, default: 'PSC-MAIN' },
  location: { type: String, default: 'Tech District Plaza, Gate 3' },
  totalSlots: { type: Number, default: 12 },
  hourlyRate: { type: Number, default: 5.0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ParkingLot', parkingLotSchema);
