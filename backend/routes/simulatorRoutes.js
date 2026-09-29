const express = require('express');
const router = express.Router();
const { startTrafficSimulation, stopTrafficSimulation, getSimulationStatus } = require('../services/simulatorService');

router.get('/status', (req, res) => {
  res.json({ success: true, data: getSimulationStatus() });
});

router.post('/start', (req, res) => {
  const { intervalMs } = req.body;
  const result = startTrafficSimulation(req.app, intervalMs || 3500);
  res.json({ success: true, data: result });
});

router.post('/stop', (req, res) => {
  const result = stopTrafficSimulation();
  res.json({ success: true, data: result });
});

module.exports = router;
