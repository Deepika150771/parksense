const ParkingSlot = require('../models/ParkingSlot');
const ParkingSession = require('../models/ParkingSession');
const memoryDb = require('../services/memoryDb');
const { isMongoConnected, getDbStatus } = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const slots = await ParkingSlot.find();
      const totalSlots = slots.length;
      const occupiedSlots = slots.filter(s => s.isOccupied).length;
      const availableSlots = totalSlots - occupiedSlots;
      const occupancyRate = totalSlots > 0 ? parseFloat(((occupiedSlots / totalSlots) * 100).toFixed(1)) : 0;

      const sessions = await ParkingSession.find();
      const activeSessionsCount = sessions.filter(s => s.status === 'ACTIVE').length;

      const totalRevenue = sessions
        .filter(s => s.status === 'COMPLETED')
        .reduce((acc, curr) => acc + (curr.fee || 0), 0);

      const byType = {
        Standard: { total: 0, occupied: 0 },
        'EV Charging': { total: 0, occupied: 0 },
        Accessible: { total: 0, occupied: 0 },
        VIP: { total: 0, occupied: 0 }
      };

      slots.forEach(s => {
        if (!byType[s.type]) byType[s.type] = { total: 0, occupied: 0 };
        byType[s.type].total++;
        if (s.isOccupied) byType[s.type].occupied++;
      });

      const recentActivity = sessions
        .sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime))
        .slice(0, 10);

      return res.json({
        success: true,
        dbStatus: getDbStatus(),
        data: {
          totalSlots,
          availableSlots,
          occupiedSlots,
          occupancyRate,
          totalRevenue,
          activeSessionsCount,
          completedToday: sessions.filter(s => s.status === 'COMPLETED').length,
          byType,
          recentActivity
        }
      });
    } else {
      const stats = memoryDb.getStats();
      return res.json({
        success: true,
        dbStatus: getDbStatus(),
        data: stats
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboardStats
};
