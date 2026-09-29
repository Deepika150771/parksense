const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');
require('dotenv').config();

const { connectDB, getDbStatus } = require('./config/db');
const slotRoutes = require('./routes/slotRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const statsRoutes = require('./routes/statsRoutes');
const simulatorRoutes = require('./routes/simulatorRoutes');

const app = express();
const server = http.createServer(app);

// Connect DB (with fallback to in-memory)
connectDB();

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Attach Socket.io instance to Express App
app.set('io', io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ParkSense Smart Parking Management System API',
    timestamp: new Date().toISOString(),
    dbStatus: getDbStatus()
  });
});

// Mount Routes
app.use('/api/v1/slots', slotRoutes);
app.use('/api/v1/sensors', sensorRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/simulator', simulatorRoutes);

// Socket.io Realtime Events
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;

// Only start listening if run directly (not serverless export)
if (require.main === module || !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 ParkSense IoT Backend Server running on port ${PORT}`);
    console.log(`📡 WebSocket Gateway ready for live ESP32 & Web events`);
    console.log(`====================================================`);
  });
}

module.exports = app;
