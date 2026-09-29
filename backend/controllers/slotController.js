const ParkingSlot = require('../models/ParkingSlot');
const memoryDb = require('../services/memoryDb');
const { isMongoConnected } = require('../config/db');

// Get all slots with optional filtering
const getSlots = async (req, res) => {
  try {
    const { zone, status, type } = req.query;

    if (isMongoConnected()) {
      let filter = {};
      if (zone) filter.zone = new RegExp(zone, 'i');
      if (type) filter.type = type;
      if (status === 'occupied') filter.isOccupied = true;
      if (status === 'available') filter.isOccupied = false;

      const slots = await ParkingSlot.find(filter).sort({ slotNumber: 1 });
      return res.json({ success: true, count: slots.length, data: slots });
    } else {
      const slots = memoryDb.getAllSlots({ zone, status, type });
      return res.json({ success: true, count: slots.length, data: slots });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single slot details
const getSlotById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const slot = await ParkingSlot.findOne({ $or: [{ _id: id }, { slotNumber: id }] });
      if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
      return res.json({ success: true, data: slot });
    } else {
      const slot = memoryDb.getSlotById(id);
      if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
      return res.json({ success: true, data: slot });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create new parking slot
const createSlot = async (req, res) => {
  try {
    const { slotNumber, zone, floor, type, thresholdCm } = req.body;
    if (!slotNumber) {
      return res.status(400).json({ success: false, message: 'Slot number is required' });
    }

    if (isMongoConnected()) {
      const existing = await ParkingSlot.findOne({ slotNumber });
      if (existing) return res.status(400).json({ success: false, message: 'Slot number already exists' });

      const newSlot = await ParkingSlot.create({
        slotNumber,
        zone: zone || 'Zone A (Ground)',
        floor: floor || 1,
        type: type || 'Standard',
        thresholdCm: thresholdCm || 35
      });

      // Emit socket event if io available
      if (req.app.get('io')) {
        req.app.get('io').emit('slot:created', newSlot);
      }

      return res.status(201).json({ success: true, data: newSlot });
    } else {
      const newSlot = {
        _id: 'slot_' + Date.now(),
        slotNumber,
        lotId: 'lot_001',
        zone: zone || 'Zone A (Ground)',
        floor: floor || 1,
        type: type || 'Standard',
        isOccupied: false,
        distanceCm: 150.0,
        thresholdCm: thresholdCm || 35,
        batteryLevel: 100,
        lastUpdated: new Date().toISOString()
      };
      memoryDb.slots.push(newSlot);

      if (req.app.get('io')) {
        req.app.get('io').emit('slot:created', newSlot);
      }

      return res.status(201).json({ success: true, data: newSlot });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update slot occupancy / metadata
const updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let updatedSlot;
    if (isMongoConnected()) {
      updatedSlot = await ParkingSlot.findOneAndUpdate(
        { $or: [{ _id: id }, { slotNumber: id }] },
        { ...updateData, lastUpdated: new Date() },
        { new: true }
      );
    } else {
      updatedSlot = memoryDb.updateSlot(id, updateData);
    }

    if (!updatedSlot) return res.status(404).json({ success: false, message: 'Slot not found' });

    // Emit live WebSocket update
    if (req.app.get('io')) {
      req.app.get('io').emit('slot:updated', updatedSlot);
      req.app.get('io').emit('stats:updated', isMongoConnected() ? {} : memoryDb.getStats());
    }

    return res.json({ success: true, data: updatedSlot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete slot
const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      await ParkingSlot.findOneAndDelete({ $or: [{ _id: id }, { slotNumber: id }] });
    } else {
      const idx = memoryDb.slots.findIndex(s => s._id === id || s.slotNumber === id);
      if (idx !== -1) memoryDb.slots.splice(idx, 1);
    }

    if (req.app.get('io')) {
      req.app.get('io').emit('slot:deleted', { id });
    }

    return res.json({ success: true, message: 'Slot deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot
};
