const express = require('express');
const router = express.Router();
const { getSessions, recordEntry, recordExit } = require('../controllers/sessionController');

router.get('/', getSessions);
router.post('/entry', recordEntry);
router.post('/exit', recordExit);

module.exports = router;
