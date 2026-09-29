# 🅿️ ParkSense - IoT Smart Parking Management System

**ParkSense** is an enterprise-grade, full-stack IoT Smart Parking Management System powered by **Node.js, Express, MongoDB, React, Socket.io**, and **ESP32 Microcontrollers with HC-SR04 Ultrasonic Sensors**.

It provides automated vehicle detection, real-time slot occupancy tracking, dynamic tariff calculation, parking history audit logs, interactive deck map visualization, and a built-in automated sensor traffic simulator.

---

## 🚀 Key Features

- 🅿️ **Visual Parking Slot Cards**: High-contrast, dynamic glassmorphism UI with green status for available slots and glowing crimson status for occupied slots.
- 📡 **ESP32 & Ultrasonic Telemetry**: Real-time distance measurement in cm, distance threshold configuration, and hardware battery tracking.
- ⚡ **Real-Time WebSocket Sync**: Instant updates across all dashboard screens using Socket.io upon vehicle entry or departure.
- 📊 **Dashboard Analytics**: Real-time counter metrics (Total Slots, Available, Occupied, Occupancy Rate %), peak-hour occupancy trend lines, and slot category breakdowns (Standard, EV Charging, Accessible, VIP).
- 📜 **Parking History & Entry/Exit Logs**: Automatic timestamp logging, vehicle license plate tracking, duration calculation, and automated fee processing.
- 🗺️ **Interactive Deck Schematic**: Visual floor plan view grouped by Zone and Level.
- 🎮 **Automated Sensor Traffic Simulator**: Built-in simulator mode to test real-time slot flips and vehicle traffic without physical ESP32 hardware.
- 🛡️ **Dual Database Engine**: Native Mongoose MongoDB support with automatic fallback to high-performance In-Memory DB Mode if MongoDB is offline.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Chart.js, Lucide Icons, Socket.io Client, Vanilla CSS (Cyber Dark Glassmorphism) |
| **Backend** | Node.js, Express.js, Socket.io, Morgan, CORS |
| **Database** | MongoDB (Mongoose ORM) + Smart In-Memory Fallback Engine |
| **Hardware** | ESP32 Development Board (ESP-WROOM-32), HC-SR04 Ultrasonic Sensors, Status LEDs, Piezo Buzzer |
| **Firmware** | Arduino C++ Sketch (`esp32_parksense.ino`) with HTTP REST client & median sample filtering |

---

## 📐 System Architecture

```
                       ┌──────────────────────────────┐
                       │   ESP32 Microcontroller Node │
                       │  (HC-SR04 Ultrasonic Sensor) │
                       └──────────────┬───────────────┘
                                      │ HTTP POST (/api/v1/sensors/reading)
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                           ParkSense Express Backend                       │
│                                (Port 5001)                                │
├──────────────────────────────┬─────────────────────────────┬──────────────┤
│  REST API Controllers        │  Socket.io WebSocket Server │ Simulator    │
│  (Slots, Sensors, Sessions)  │  (slot:updated, telemetry)  │ Engine       │
└──────────────┬───────────────┴──────────────┬──────────────┴──────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐  ┌─────────────────────────────────────────┐
│ MongoDB / In-Memory Store    │  │           React Dashboard UI            │
│ (Slots, Sessions, Readings)  │  │   (Interactive Map, Stats & Console)    │
└──────────────────────────────┘  └─────────────────────────────────────────┘
```

---

## 🔌 ESP32 Hardware Circuit Wiring Table

| Component | ESP32 GPIO Pin | Description |
| :--- | :--- | :--- |
| **HC-SR04 VCC** | `5V` / `VIN` | Power Supply |
| **HC-SR04 GND** | `GND` | Ground Connection |
| **HC-SR04 TRIG** | `GPIO 5` | Ultrasonic Trigger Output Pin |
| **HC-SR04 ECHO** | `GPIO 18` | Ultrasonic Echo Input Pin |
| **Green LED** | `GPIO 2` | Available Status Visual Indicator |
| **Red LED** | `GPIO 4` | Occupied Status Visual Indicator |
| **Piezo Buzzer** | `GPIO 19` | Audio Alert Beep on Entry/Exit |

---

## 🌐 API Endpoint Specifications

### 1. Parking Slots API
- `GET /api/v1/slots` - Retrieve all parking slot nodes (supports `?zone=`, `?status=`, `?type=` query parameters).
- `GET /api/v1/slots/:id` - Fetch single slot detail by ID or slot number.
- `POST /api/v1/slots` - Register a new parking slot node.
- `PUT /api/v1/slots/:id` - Update slot occupancy status or threshold metadata.
- `DELETE /api/v1/slots/:id` - Delete parking slot.

### 2. Sensor Readings API
- `POST /api/v1/sensors/reading` - ESP32 hardware & simulator ingestion endpoint (`{ slotId, distanceCm, sensorId, batteryLevel }`).
- `GET /api/v1/sensors/logs` - Fetch recent ultrasonic sensor logs.

### 3. Parking Sessions API
- `GET /api/v1/sessions` - List parking session audit log (`?status=ACTIVE|COMPLETED`).
- `POST /api/v1/sessions/entry` - Register manual vehicle entry.
- `POST /api/v1/sessions/exit` - Register manual vehicle exit and calculate parking fee.

### 4. Dashboard Statistics API
- `GET /api/v1/stats/dashboard` - Get total slots, available count, occupied count, occupancy rate %, revenue, and type breakdown.

### 5. Simulator API
- `GET /api/v1/simulator/status` - Check if traffic simulator engine is active.
- `POST /api/v1/simulator/start` - Start background vehicle traffic generator.
- `POST /api/v1/simulator/stop` - Stop background simulation.

---

## 🚦 Quick Start & Execution Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (Optional: system auto-falls back to In-Memory DB mode if MongoDB is not running locally).

### 1. Start Express Backend
```bash
cd backend
npm install
npm start
```
*The Express server runs on `http://localhost:5001`.*

### 2. Start React Frontend
```bash
cd frontend
npm install
npm run dev
```
*The React app launches at `http://localhost:3000` with automatic API proxying.*

### 3. Flashing ESP32 Firmware
1. Open `firmware/esp32_parksense/esp32_parksense.ino` in Arduino IDE.
2. Update `WIFI_SSID`, `WIFI_PASSWORD`, and `SERVER_URL` (using your computer's local IP address, e.g. `http://192.168.1.100:5001/api/v1/sensors/reading`).
3. Select board **ESP32 Dev Module** and upload sketch.

---

## 📁 Project Structure

```
parksense/
├── backend/
│   ├── config/
│   │   └── db.js               # Database connection & fallback logic
│   ├── controllers/
│   │   ├── slotController.js   # Parking slot operations
│   │   ├── sensorController.js # ESP32 telemetry processing
│   │   ├── sessionController.js# Entry/Exit audit & billing
│   │   └── statsController.js  # Analytics calculations
│   ├── models/                 # Mongoose schemas (User, Slot, Session, Reading)
│   ├── routes/                 # Express API routes
│   ├── services/
│   │   ├── memoryDb.js         # High-performance In-Memory DB Store
│   │   └── simulatorService.js # Traffic simulation engine
│   ├── .env
│   ├── package.json
│   └── server.js               # Express & Socket.io server
├── frontend/
│   ├── src/
│   │   ├── components/         # SlotCard, StatsOverview, ParkingMap, Console
│   │   ├── pages/              # Dashboard, SlotsPage, HistoryPage, HardwarePage
│   │   ├── services/           # Axios API & Socket.io gateway
│   │   ├── App.jsx
│   │   ├── index.css           # Cyber Dark Glassmorphism CSS design system
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── firmware/
│   └── esp32_parksense/
│       └── esp32_parksense.ino # Arduino C++ firmware sketch for ESP32
└── README.md
```

---

## 📄 License
Distributed under the **MIT License**. Built with ❤️ for smart IoT automation.
