import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SlotsPage from './pages/SlotsPage';
import HistoryPage from './pages/HistoryPage';
import HardwarePage from './pages/HardwarePage';

import socket from './services/socket';
import { 
  getDashboardStats, 
  getSlots, 
  getSensorLogs, 
  getSessions, 
  updateSlot, 
  createSlot, 
  postSensorReading,
  recordEntry,
  recordExit,
  startTrafficSimulation,
  stopTrafficSimulation,
  getSimulatorStatus
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [slots, setSlots] = useState([]);
  const [sensorLogs, setSensorLogs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch
  const fetchAllData = async () => {
    try {
      const [statsRes, slotsRes, logsRes, sessRes, simRes] = await Promise.all([
        getDashboardStats(),
        getSlots(),
        getSensorLogs(30),
        getSessions({ limit: 50 }),
        getSimulatorStatus()
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
        setDbStatus(statsRes.data.dbStatus);
      }
      if (slotsRes.data.success) setSlots(slotsRes.data.data);
      if (logsRes.data.success) setSensorLogs(logsRes.data.data);
      if (sessRes.data.success) setSessions(sessRes.data.data);
      if (simRes.data.success) setIsSimulating(simRes.data.data.active);
    } catch (err) {
      console.error('[App Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Socket.io Real-time Event Listeners
    socket.on('slot:updated', (updatedSlot) => {
      setSlots(prevSlots => prevSlots.map(s => (s._id === updatedSlot._id || s.slotNumber === updatedSlot.slotNumber) ? updatedSlot : s));
      getDashboardStats().then(res => {
        if (res.data.success) setStats(res.data.data);
      });
    });

    socket.on('sensor:reading', (newReading) => {
      setSensorLogs(prev => [newReading, ...prev.slice(0, 29)]);
    });

    socket.on('session:created', (newSession) => {
      setSessions(prev => [newSession, ...prev]);
    });

    socket.on('session:completed', (updatedSession) => {
      setSessions(prev => prev.map(s => s._id === updatedSession._id ? updatedSession : s));
    });

    socket.on('stats:updated', (newStats) => {
      if (newStats && Object.keys(newStats).length > 0) {
        setStats(newStats);
      }
    });

    return () => {
      socket.off('slot:updated');
      socket.off('sensor:reading');
      socket.off('session:created');
      socket.off('session:completed');
      socket.off('stats:updated');
    };
  }, []);

  // Handlers
  const handleToggleOccupancy = async (slotId, targetOccupied) => {
    const slot = slots.find(s => s._id === slotId || s.slotNumber === slotId);
    if (!slot) return;

    const targetDistance = targetOccupied ? 15.0 : 150.0;
    try {
      await postSensorReading({
        slotId: slot._id || slot.slotNumber,
        distanceCm: targetDistance,
        sensorId: `UI_SIM_${slot.slotNumber}`
      });
      fetchAllData();
    } catch (err) {
      console.error('Failed to toggle occupancy:', err);
    }
  };

  const handleUpdateDistance = async (slotId, distanceCm) => {
    try {
      await postSensorReading({
        slotId,
        distanceCm,
        sensorId: `UI_SLIDER_${slotId}`
      });
      fetchAllData();
    } catch (err) {
      console.error('Failed to update distance:', err);
    }
  };

  const handleCreateSlot = async (slotData) => {
    try {
      const res = await createSlot(slotData);
      if (res.data.success) fetchAllData();
    } catch (err) {
      alert('Error creating slot: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRecordManualEntry = async (entryData) => {
    try {
      const res = await recordEntry(entryData);
      if (res.data.success) fetchAllData();
    } catch (err) {
      alert('Error recording entry: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRecordManualExit = async (slotNumber) => {
    try {
      const res = await recordExit({ slotNumber });
      if (res.data.success) fetchAllData();
    } catch (err) {
      alert('Error recording exit: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleSimulation = async () => {
    try {
      if (isSimulating) {
        await stopTrafficSimulation();
        setIsSimulating(false);
      } else {
        await startTrafficSimulation(3500);
        setIsSimulating(true);
      }
    } catch (err) {
      console.error('Failed to toggle simulation:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid rgba(6, 182, 212, 0.2)', borderTopColor: '#06b6d4', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#9ca3af', fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem' }}>Initializing ParkSense IoT Gateway...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-content">
        
        {/* Navigation Navbar */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isSimulating={isSimulating}
          onToggleSimulation={handleToggleSimulation}
          dbStatus={dbStatus}
        />

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            stats={stats}
            slots={slots}
            sensorLogs={sensorLogs}
            onToggleOccupancy={handleToggleOccupancy}
            onUpdateDistance={handleUpdateDistance}
            onRefreshLogs={fetchAllData}
          />
        )}

        {activeTab === 'slots' && (
          <SlotsPage 
            slots={slots}
            onToggleOccupancy={handleToggleOccupancy}
            onUpdateDistance={handleUpdateDistance}
            onCreateSlot={handleCreateSlot}
            onRefresh={fetchAllData}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage 
            sessions={sessions}
            onRecordManualEntry={handleRecordManualEntry}
            onRecordManualExit={handleRecordManualExit}
          />
        )}

        {activeTab === 'hardware' && (
          <HardwarePage />
        )}

      </div>
    </div>
  );
}
