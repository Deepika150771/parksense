const sensorController = require('../controllers/sensorController');

let simulationTimer = null;
let isSimulationActive = false;

const samplePlates = [
  'KA-01-AB-1234', 'MH-12-PQ-9988', 'DL-03-CC-4040', 'TS-07-EV-2024',
  'HR-26-XX-7711', 'GJ-01-ZZ-5500', 'TN-09-BK-3322', 'UP-16-DD-9090'
];

const startTrafficSimulation = (app, intervalMs = 4000) => {
  if (isSimulationActive) return { active: true, message: 'Simulation already running' };

  isSimulationActive = true;
  console.log('[Simulator] Traffic Simulation Engine started.');

  simulationTimer = setInterval(async () => {
    try {
      const memoryDb = require('./memoryDb');
      const slots = memoryDb.getAllSlots();
      if (!slots || slots.length === 0) return;

      // Pick random slot
      const randomSlot = slots[Math.floor(Math.random() * slots.length)];
      const isCurrentlyOccupied = randomSlot.isOccupied;

      // Flip state
      let newDistance;
      let vehiclePlate = null;

      if (isCurrentlyOccupied) {
        // Car leaving -> distance becomes 140 - 180 cm
        newDistance = Math.floor(130 + Math.random() * 50);
      } else {
        // Car entering -> distance becomes 10 - 25 cm
        newDistance = Math.floor(10 + Math.random() * 18);
        vehiclePlate = samplePlates[Math.floor(Math.random() * samplePlates.length)];
      }

      // Mock request/response for sensor controller
      const mockReq = {
        body: {
          slotId: randomSlot._id,
          distanceCm: newDistance,
          sensorId: `SIM_ESP32_${randomSlot.slotNumber}`,
          batteryLevel: Math.floor(88 + Math.random() * 12),
          vehiclePlate
        },
        app
      };

      const mockRes = {
        status: () => mockRes,
        json: () => mockRes
      };

      await sensorController.recordReading(mockReq, mockRes);
    } catch (err) {
      console.error('[Simulator Error]', err.message);
    }
  }, intervalMs);

  return { active: true, message: 'Traffic simulation started successfully' };
};

const stopTrafficSimulation = () => {
  if (simulationTimer) {
    clearInterval(simulationTimer);
    simulationTimer = null;
  }
  isSimulationActive = false;
  console.log('[Simulator] Traffic Simulation Engine stopped.');
  return { active: false, message: 'Traffic simulation stopped' };
};

const getSimulationStatus = () => ({
  active: isSimulationActive
});

module.exports = {
  startTrafficSimulation,
  stopTrafficSimulation,
  getSimulationStatus
};
