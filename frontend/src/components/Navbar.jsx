import React from 'react';
import { 
  Car, 
  LayoutDashboard, 
  History, 
  Cpu, 
  Activity, 
  Play, 
  Square,
  Database,
  Radio
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isSimulating, onToggleSimulation, dbStatus }) {
  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '16px 28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
          }}>
            <Car size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ParkSense <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)' }}>IoT v1.0</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Smart Ultrasonic Parking Management System</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('slots')} 
            className={`btn ${activeTab === 'slots' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Car size={16} /> Slots Monitor
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <History size={16} /> Parking History
          </button>
          <button 
            onClick={() => setActiveTab('hardware')} 
            className={`btn ${activeTab === 'hardware' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Cpu size={16} /> ESP32 Hardware
          </button>
        </nav>

        {/* Status Badges & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* DB Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.04)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Database size={14} color="#06b6d4" />
            <span style={{ color: '#9ca3af' }}>DB:</span>
            <span style={{ color: '#f3f4f6', fontWeight: 600 }}>{dbStatus?.mode || 'InMemory'}</span>
          </div>

          {/* Realtime WS Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <Radio size={14} color="#10b981" />
            <span style={{ color: '#10b981', fontWeight: 600 }}>ESP32 Stream Active</span>
          </div>

          {/* Traffic Simulation Toggle Button */}
          <button 
            onClick={onToggleSimulation} 
            className={`btn ${isSimulating ? 'btn-danger' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
            title="Toggle background vehicle traffic simulation"
          >
            {isSimulating ? (
              <> <Square size={14} /> Stop Traffic Sim </>
            ) : (
              <> <Play size={14} /> Auto Sensor Sim </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
