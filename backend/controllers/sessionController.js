const ParkingSession = require('../models/ParkingSession');
const ParkingSlot = require('../models/ParkingSlot');
const memoryDb = require('../services/memoryDb');
const { isMongoConnected } = require('../config/db');

// List parking sessions with optional status filter (ACTIVE or COMPLETED)
const getSessions = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;

    if (isMongoConnected()) {
      let filter = {};
      if (status) filter.status = status.toUpperCase();

      const sessions = await ParkingSession.find(filter)
        .sort({ entryTime: -1 })
        .limit(parseInt(limit));

      return res.json({ success: true, count: sessions.length, data: sessions });
    } else {
      let sessions = memoryDb.getSessions(parseInt(limit));
      if (status) {
        sessions = sessions.filter(s => s.status === status.toUpperCase());
      }
      return res.json({ success: true, count: sessions.length, data: sessions });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Manual Vehicle Entry Record
const recordEntry = async (req, res) => {
  try {
    const { slotNumber, vehiclePlate } = req.body;

    if (!slotNumber || !vehiclePlate) {
      return res.status(400).json({
        success: false,
        message: 'slotNumber and vehiclePlate are required.'
      });
    }

    if (isMongoConnected()) {
      const slot = await ParkingSlot.findOne({ slotNumber });
      if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
      if (slot.isOccupied) return res.status(400).json({ success: false, message: 'Slot is already occupied' });

      const session = await ParkingSession.create({
        slotId: slot._id,
        slotNumber: slot.slotNumber,
        vehiclePlate: vehiclePlate.toUpperCase(),
        entryTime: new Date(),
        status: 'ACTIVE'
      });

      slot.isOccupied = true;
      slot.distanceCm = 15.0;
      slot.vehiclePlate = vehiclePlate.toUpperCase();
      slot.occupiedSince = session.entryTime;
      slot.lastUpdated = new Date();
      await slot.save();

      const io = req.app.get('io');
      if (io) {
        io.emit('session:created', session);
        io.emit('slot:updated', slot);
      }

      return res.status(201).json({ success: true, data: session, slot });
    } else {
      const slot = memoryDb.getSlotById(slotNumber);
      if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
      if (slot.isOccupied) return res.status(400).json({ success: false, message: 'Slot is already occupied' });

      memoryDb.updateSlot(slot._id, {
        isOccupied: true,
        distanceCm: 15.0,
        vehiclePlate: vehiclePlate.toUpperCase()
      });

      const activeSession = memoryDb.sessions.find(s => s.slotId === slot._id && s.status === 'ACTIVE');

      const io = req.app.get('io');
      if (io) {
        io.emit('session:created', activeSession);
        io.emit('slot:updated', memoryDb.getSlotById(slot._id));
        io.emit('stats:updated', memoryDb.getStats());
      }

      return res.status(201).json({ success: true, data: activeSession, slot: memoryDb.getSlotById(slot._id) });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Manual Vehicle Exit Record
const recordExit = async (req, res) => {
  try {
    const { slotNumber } = req.body;

    if (!slotNumber) {
      return res.status(400).json({ success: false, message: 'slotNumber is required.' });
    }

    if (isMongoConnected()) {
      const slot = await ParkingSlot.findOne({ slotNumber });
      if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });

      const session = await ParkingSession.findOne({ slotId: slot._id, status: 'ACTIVE' });
      if (!session) return res.status(404).json({ success: false, message: 'No active session found for this slot' });

      const exitTime = new Date();
      const durationMs = exitTime - new Date(session.entryTime);
      const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
      const fee = Math.ceil(durationMinutes / 60) * session.hourlyRate;

      session.exitTime = exitTime;
      session.durationMinutes = durationMinutes;
      session.status = 'COMPLETED';
      session.fee = fee;
      await session.save();

      slot.isOccupied = false;
      slot.distanceCm = 150.0;
      slot.vehiclePlate = null;
      slot.occupiedSince = null;
      slot.lastUpdated = new Date();
      await slot.save();

      const io = req.app.get('io');
      if (io) {
        io.emit('session:completed', session);
        io.emit('slot:updated', slot);
      }

      return res.json({ success: true, data: session, slot });
    } else {
      const slot = memoryDb.getSlotById(slotNumber);
      if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });

      const activeSession = memoryDb.sessions.find(s => s.slotId === slot._id && s.status === 'ACTIVE');

      memoryDb.updateSlot(slot._id, {
        isOccupied: false,
        distanceCm: 150.0
      });

      const io = req.app.get('io');
      if (io) {
        io.emit('session:completed', activeSession);
        io.emit('slot:updated', memoryDb.getSlotById(slot._id));
        io.emit('stats:updated', memoryDb.getStats());
      }

      return res.json({ success: true, data: activeSession, slot: memoryDb.getSlotById(slot._id) });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getSessions,
  recordEntry,
  recordExit
};
