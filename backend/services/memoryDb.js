// In-memory data store as fallback when local MongoDB is not running

const initialParkingLot = {
  _id: 'lot_001',
  name: 'ParkSense Central Deck',
  code: 'PSC-MAIN',
  location: 'Tech District Plaza, Gate 3',
  totalSlots: 12,
  occupiedSlots: 4,
  hourlyRate: 5.0,
  createdAt: new Date().toISOString()
};

const initialSlots = [
  { _id: 'slot_A1', slotNumber: 'A-01', lotId: 'lot_001', zone: 'Zone A (Ground)', floor: 1, type: 'Standard', isOccupied: false, distanceCm: 145.2, thresholdCm: 35, batteryLevel: 98, lastUpdated: new Date().toISOString() },
  { _id: 'slot_A2', slotNumber: 'A-02', lotId: 'lot_001', zone: 'Zone A (Ground)', floor: 1, type: 'Standard', isOccupied: true, distanceCm: 18.5, thresholdCm: 35, batteryLevel: 95, vehiclePlate: 'KA-05-EV-4021', occupiedSince: new Date(Date.now() - 45 * 60000).toISOString(), lastUpdated: new Date().toISOString() },
  { _id: 'slot_A3', slotNumber: 'A-03', lotId: 'lot_001', zone: 'Zone A (Ground)', floor: 1, type: 'EV Charging', isOccupied: false, distanceCm: 152.0, thresholdCm: 35, batteryLevel: 100, lastUpdated: new Date().toISOString() },
  { _id: 'slot_A4', slotNumber: 'A-04', lotId: 'lot_001', zone: 'Zone A (Ground)', floor: 1, type: 'EV Charging', isOccupied: true, distanceCm: 12.4, thresholdCm: 35, batteryLevel: 92, vehiclePlate: 'MH-12-PQ-9911', occupiedSince: new Date(Date.now() - 120 * 60000).toISOString(), lastUpdated: new Date().toISOString() },
  { _id: 'slot_B1', slotNumber: 'B-01', lotId: 'lot_001', zone: 'Zone B (Level 1)', floor: 2, type: 'Standard', isOccupied: false, distanceCm: 160.5, thresholdCm: 35, batteryLevel: 97, lastUpdated: new Date().toISOString() },
  { _id: 'slot_B2', slotNumber: 'B-02', lotId: 'lot_001', zone: 'Zone B (Level 1)', floor: 2, type: 'Standard', isOccupied: true, distanceCm: 22.1, thresholdCm: 35, batteryLevel: 90, vehiclePlate: 'DL-01-AB-1234', occupiedSince: new Date(Date.now() - 15 * 60000).toISOString(), lastUpdated: new Date().toISOString() },
  { _id: 'slot_B3', slotNumber: 'B-03', lotId: 'lot_001', zone: 'Zone B (Level 1)', floor: 2, type: 'Accessible', isOccupied: false, distanceCm: 148.8, thresholdCm: 35, batteryLevel: 99, lastUpdated: new Date().toISOString() },
  { _id: 'slot_B4', slotNumber: 'B-04', lotId: 'lot_001', zone: 'Zone B (Level 1)', floor: 2, type: 'Accessible', isOccupied: false, distanceCm: 150.0, thresholdCm: 35, batteryLevel: 94, lastUpdated: new Date().toISOString() },
  { _id: 'slot_C1', slotNumber: 'C-01', lotId: 'lot_001', zone: 'Zone C (Reserved/VIP)', floor: 2, type: 'VIP', isOccupied: true, distanceCm: 15.0, thresholdCm: 35, batteryLevel: 96, vehiclePlate: 'TS-09-VIP-001', occupiedSince: new Date(Date.now() - 210 * 60000).toISOString(), lastUpdated: new Date().toISOString() },
  { _id: 'slot_C2', slotNumber: 'C-02', lotId: 'lot_001', zone: 'Zone C (Reserved/VIP)', floor: 2, type: 'VIP', isOccupied: false, distanceCm: 144.0, thresholdCm: 35, batteryLevel: 98, lastUpdated: new Date().toISOString() },
  { _id: 'slot_C3', slotNumber: 'C-03', lotId: 'lot_001', zone: 'Zone C (Reserved/VIP)', floor: 2, type: 'Standard', isOccupied: false, distanceCm: 155.0, thresholdCm: 35, batteryLevel: 93, lastUpdated: new Date().toISOString() },
  { _id: 'slot_C4', slotNumber: 'C-04', lotId: 'lot_001', zone: 'Zone C (Reserved/VIP)', floor: 2, type: 'Standard', isOccupied: false, distanceCm: 158.3, thresholdCm: 35, batteryLevel: 97, lastUpdated: new Date().toISOString() }
];

const initialSessions = [
  {
    _id: 'sess_101',
    slotId: 'slot_A2',
    slotNumber: 'A-02',
    vehiclePlate: 'KA-05-EV-4021',
    entryTime: new Date(Date.now() - 45 * 60000).toISOString(),
    exitTime: null,
    status: 'ACTIVE',
    fee: 0,
    hourlyRate: 5.0
  },
  {
    _id: 'sess_102',
    slotId: 'slot_A4',
    slotNumber: 'A-04',
    vehiclePlate: 'MH-12-PQ-9911',
    entryTime: new Date(Date.now() - 120 * 60000).toISOString(),
    exitTime: null,
    status: 'ACTIVE',
    fee: 0,
    hourlyRate: 5.0
  },
  {
    _id: 'sess_103',
    slotId: 'slot_B2',
    slotNumber: 'B-02',
    vehiclePlate: 'DL-01-AB-1234',
    entryTime: new Date(Date.now() - 15 * 60000).toISOString(),
    exitTime: null,
    status: 'ACTIVE',
    fee: 0,
    hourlyRate: 5.0
  },
  {
    _id: 'sess_104',
    slotId: 'slot_C1',
    slotNumber: 'C-01',
    vehiclePlate: 'TS-09-VIP-001',
    entryTime: new Date(Date.now() - 210 * 60000).toISOString(),
    exitTime: null,
    status: 'ACTIVE',
    fee: 0,
    hourlyRate: 5.0
  },
  {
    _id: 'sess_100',
    slotId: 'slot_A1',
    slotNumber: 'A-01',
    vehiclePlate: 'MH-04-AZ-8821',
    entryTime: new Date(Date.now() - 180 * 60000).toISOString(),
    exitTime: new Date(Date.now() - 60 * 60000).toISOString(),
    durationMinutes: 120,
    status: 'COMPLETED',
    fee: 10.0,
    hourlyRate: 5.0
  },
  {
    _id: 'sess_099',
    slotId: 'slot_B3',
    slotNumber: 'B-03',
    vehiclePlate: 'KA-01-MJ-5544',
    entryTime: new Date(Date.now() - 300 * 60000).toISOString(),
    exitTime: new Date(Date.now() - 180 * 60000).toISOString(),
    durationMinutes: 120,
    status: 'COMPLETED',
    fee: 10.0,
    hourlyRate: 5.0
  }
];

const initialSensorReadings = [
  {
    _id: 'read_1',
    slotId: 'slot_A1',
    slotNumber: 'A-01',
    distanceCm: 145.2,
    isOccupied: false,
    rawThreshold: 35,
    sensorId: 'ESP32_SR04_A1',
    timestamp: new Date(Date.now() - 30000).toISOString()
  },
  {
    _id: 'read_2',
    slotId: 'slot_A2',
    slotNumber: 'A-02',
    distanceCm: 18.5,
    isOccupied: true,
    rawThreshold: 35,
    sensorId: 'ESP32_SR04_A2',
    timestamp: new Date(Date.now() - 25000).toISOString()
  }
];

class MemoryStore {
  constructor() {
    this.lot = { ...initialParkingLot };
    this.slots = [...initialSlots];
    this.sessions = [...initialSessions];
    this.readings = [...initialSensorReadings];
  }

  getLot() {
    this.lot.occupiedSlots = this.slots.filter(s => s.isOccupied).length;
    this.lot.totalSlots = this.slots.length;
    return this.lot;
  }

  getAllSlots(filter = {}) {
    let result = [...this.slots];
    if (filter.zone) {
      result = result.filter(s => s.zone.toLowerCase().includes(filter.zone.toLowerCase()));
    }
    if (filter.status) {
      if (filter.status === 'occupied') result = result.filter(s => s.isOccupied);
      if (filter.status === 'available') result = result.filter(s => !s.isOccupied);
    }
    if (filter.type) {
      result = result.filter(s => s.type === filter.type);
    }
    return result;
  }

  getSlotById(id) {
    return this.slots.find(s => s._id === id || s.slotNumber === id);
  }

  updateSlot(id, data) {
    const index = this.slots.findIndex(s => s._id === id || s.slotNumber === id);
    if (index === -1) return null;

    const previousState = this.slots[index].isOccupied;
    this.slots[index] = {
      ...this.slots[index],
      ...data,
      lastUpdated: new Date().toISOString()
    };

    const currentSlot = this.slots[index];

    // Handle automated session creation/termination on state change
    if (previousState !== currentSlot.isOccupied) {
      if (currentSlot.isOccupied) {
        // Vehicle entered
        const newSession = {
          _id: 'sess_' + Date.now(),
          slotId: currentSlot._id,
          slotNumber: currentSlot.slotNumber,
          vehiclePlate: data.vehiclePlate || `VEH-${Math.floor(1000 + Math.random() * 9000)}`,
          entryTime: new Date().toISOString(),
          exitTime: null,
          status: 'ACTIVE',
          fee: 0,
          hourlyRate: this.lot.hourlyRate
        };
        this.sessions.unshift(newSession);
        currentSlot.occupiedSince = newSession.entryTime;
      } else {
        // Vehicle exited
        const activeSess = this.sessions.find(s => s.slotId === currentSlot._id && s.status === 'ACTIVE');
        if (activeSess) {
          const exitTime = new Date();
          const entryTime = new Date(activeSess.entryTime);
          const durationMinutes = Math.max(1, Math.round((exitTime - entryTime) / 60000));
          const fee = Math.ceil(durationMinutes / 60) * activeSess.hourlyRate;

          activeSess.exitTime = exitTime.toISOString();
          activeSess.durationMinutes = durationMinutes;
          activeSess.status = 'COMPLETED';
          activeSess.fee = fee;
        }
        currentSlot.vehiclePlate = null;
        currentSlot.occupiedSince = null;
      }
    }

    return currentSlot;
  }

  recordSensorReading(readingData) {
    const { slotId, distanceCm, sensorId, batteryLevel } = readingData;
    const slot = this.getSlotById(slotId);
    if (!slot) return null;

    const threshold = slot.thresholdCm || 35;
    const isOccupied = distanceCm < threshold;

    const newReading = {
      _id: 'read_' + Date.now(),
      slotId: slot._id,
      slotNumber: slot.slotNumber,
      distanceCm,
      isOccupied,
      rawThreshold: threshold,
      sensorId: sensorId || `ESP32_${slot.slotNumber}`,
      timestamp: new Date().toISOString()
    };

    this.readings.unshift(newReading);
    if (this.readings.length > 100) this.readings.pop(); // keep last 100

    // Update slot
    this.updateSlot(slot._id, {
      distanceCm,
      isOccupied,
      batteryLevel: batteryLevel !== undefined ? batteryLevel : slot.batteryLevel
    });

    return { reading: newReading, slot: this.getSlotById(slot._id) };
  }

  getSessions(limit = 50) {
    return this.sessions.slice(0, limit);
  }

  getReadings(limit = 20) {
    return this.readings.slice(0, limit);
  }

  getStats() {
    const totalSlots = this.slots.length;
    const occupiedSlots = this.slots.filter(s => s.isOccupied).length;
    const availableSlots = totalSlots - occupiedSlots;
    const occupancyRate = totalSlots > 0 ? ((occupiedSlots / totalSlots) * 100).toFixed(1) : 0;

    const totalRevenue = this.sessions
      .filter(s => s.status === 'COMPLETED')
      .reduce((sum, s) => sum + (s.fee || 0), 0);

    const activeSessionsCount = this.sessions.filter(s => s.status === 'ACTIVE').length;
    const completedToday = this.sessions.filter(s => s.status === 'COMPLETED').length;

    // Slot types breakdown
    const byType = {
      Standard: { total: 0, occupied: 0 },
      'EV Charging': { total: 0, occupied: 0 },
      Accessible: { total: 0, occupied: 0 },
      VIP: { total: 0, occupied: 0 }
    };

    this.slots.forEach(s => {
      if (!byType[s.type]) byType[s.type] = { total: 0, occupied: 0 };
      byType[s.type].total++;
      if (s.isOccupied) byType[s.type].occupied++;
    });

    return {
      lot: this.getLot(),
      totalSlots,
      availableSlots,
      occupiedSlots,
      occupancyRate: parseFloat(occupancyRate),
      totalRevenue,
      activeSessionsCount,
      completedToday,
      byType,
      recentActivity: this.sessions.slice(0, 10)
    };
  }
}

const memoryStoreInstance = new MemoryStore();
module.exports = memoryStoreInstance;
