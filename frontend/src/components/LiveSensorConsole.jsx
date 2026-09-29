import React from 'react';
import { Terminal, Radio, RefreshCw } from 'lucide-react';

export default function LiveSensorConsole({ logs, onRefresh }) {
  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
            <Terminal size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              📡 Live ESP32 Ultrasonic Sensor Telemetry Console
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Real-time HTTP POST stream from microcontrollers</p>
          </div>
        </div>

        <button onClick={onRefresh} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          <RefreshCw size={14} /> Refresh Logs
        </button>
      </div>

      {/* Terminal View Container */}
      <div style={{
        background: '#070a12',
        borderRadius: '12px',
        padding: '16px',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        fontSize: '0.82rem',
        maxHeight: '260px',
        overflowY: 'auto',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.8)'
      }}>
        {logs && logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={log._id || index} style={{ marginBottom: '6px', lineHeight: '1.4', display: 'flex', gap: '12px', opacity: Math.max(0.4, 1 - index * 0.03) }}>
              <span style={{ color: '#6b7280' }}>[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span style={{ color: '#06b6d4', fontWeight: 600 }}>[{log.sensorId || 'ESP32_SR04'}]</span>
              <span style={{ color: '#9ca3af' }}>Slot <strong style={{ color: '#fff' }}>{log.slotNumber}</strong>:</span>
              <span style={{ color: log.isOccupied ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                Dist: {log.distanceCm?.toFixed(1)} cm ({log.isOccupied ? 'OCCUPIED' : 'VACANT'})
              </span>
              <span style={{ color: '#4b5563', fontSize: '0.75rem' }}>(Thresh: {log.rawThreshold || 35}cm)</span>
            </div>
          ))
        ) : (
          <div style={{ color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>
            <Radio size={24} style={{ marginBottom: '8px', opacity: 0.5 }} /><br />
            Listening for incoming ESP32 sensor telemetry packets...
          </div>
        )}
      </div>

    </div>
  );
}
