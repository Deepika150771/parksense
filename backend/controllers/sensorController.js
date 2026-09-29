const SensorReading = require('../models/SensorReading');
const ParkingSlot = require('../models/ParkingSlot');
const ParkingSession = require('../models/ParkingSession');
const memoryDb = require('../services/memoryDb');
const { isMongoConnected } = require('../config/db');

// Handle incoming HTTP POST reading from ESP32 microcontroller or UI simulator
const recordReading = async (req, res) => {
  try {
    const { slotId, distanceCm, sensorId, batteryLevel, vehiclePlate } = req.body;

    if (!slotId || distanceCm === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: slotId and distanceCm are required.'
      });
    }

    const numericDistance = parseFloat(distanceCm);

    if (isMongoConnected()) {
      const slot = await ParkingSlot.findOne({
        $or: [{ _id: slotId }, { slotNumber: slotId }]
      });

      if (!slot) {
        return res.status(404).json({ success: false, message: `Slot '${slotId}' not found.` });
      }

      const threshold = slot.thresholdCm || 35;
      const isOccupied = numericDistance < threshold;
      const wasOccupied = slot.isOccupied;

      // 1. Save sensor reading log
      const newReading = await SensorReading.create({
        slotId: slot._id,
        slotNumber: slot.slotNumber,
        distanceCm: numericDistance,
        isOccupied,
        rawThreshold: threshold,
        sensorId: sensorId || `ESP32_${slot.slotNumber}`
      });

      // 2. Handle session changes if state toggled
      if (wasOccupied !== isOccupied) {
        if (isOccupied) {
          // Entry
          const plate = vehiclePlate || `ESP32-AUTO-${Math.floor(1000 + Math.random() * 9000)}`;
          await ParkingSession.create({
            slotId: slot._id,
            slotNumber: slot.slotNumber,
            vehiclePlate: plate,
            entryTime: new Date(),
            status: 'ACTIVE'
          });

          slot.isOccupied = true;
          slot.vehiclePlate = plate;
          slot.occupiedSince = new Date();
        } else {
          // Exit
          const activeSession = await ParkingSession.findOne({
            slotId: slot._id,
            status: 'ACTIVE'
          });

          if (activeSession) {
            const exitTime = new Date();
            const durationMs = exitTime - new Date(activeSession.entryTime);
            const durationMinutes = Math.max(1, Math.round(durationMs / 60000));
            const fee = Math.ceil(durationMinutes / 60) * activeSession.hourlyRate;

            activeSession.exitTime = exitTime;
            activeSession.durationMinutes = durationMinutes;
            activeSession.status = 'COMPLETED';
            activeSession.fee = fee;
            await activeSession.save();
          }

          slot.isOccupied = false;
          slot.vehiclePlate = null;
          slot.occupiedSince = null;
        }
      }

      slot.distanceCm = numericDistance;
      if (batteryLevel !== undefined) slot.batteryLevel = batteryLevel;
      slot.lastUpdated = new Date();
      await slot.save();

      // Emit live updates
      const io = req.app.get('io');
      if (io) {
        io.emit('sensor:reading', newReading);
        io.emit('slot:updated', slot);
      }

      return res.status(200).json({
        success: true,
        data: {
          slotNumber: slot.slotNumber,
          isOccupied: slot.isOccupied,
          distanceCm: slot.distanceCm,
          thresholdCm: slot.thresholdCm,
          reading: newReading
        }
      });
    } else {
      // In-Memory Mode
      const result = memoryDb.recordSensorReading({
        slotId,
        distanceCm: numericDistance,
        sensorId,
        batteryLevel,
        vehiclePlate
      });

      if (!result) {
        return res.status(404).json({ success: false, message: `Slot '${slotId}' not found.` });
      }

      const io = req.app.get('io');
      if (io) {
        io.emit('sensor:reading', result.reading);
        io.emit('slot:updated', result.slot);
        io.emit('stats:updated', memoryDb.getStats());
      }

      return res.status(200).json({
        success: true,
        data: {
          slotNumber: result.slot.slotNumber,
          isOccupied: result.slot.isOccupied,
          distanceCm: result.slot.distanceCm,
          thresholdCm: result.slot.thresholdCm,
          reading: result.reading
        }
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get recent sensor reading logs
const getSensorLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;

    if (isMongoConnected()) {
      const logs = await SensorReading.find().sort({ timestamp: -1 }).limit(limit);
      return res.json({ success: true, count: logs.length, data: logs });
    } else {
      const logs = memoryDb.getReadings(limit);
      return res.json({ success: true, count: logs.length, data: logs });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  recordReading,
  getSensorLogs
};
