const express = require('express');
const router = express.Router();
const { recordReading, getSensorLogs } = require('../controllers/sensorController');

router.post('/reading', recordReading);
router.get('/logs', getSensorLogs);

module.exports = router;
