import React, { useState } from 'react';
import { Cpu, Wifi, Check, Copy, AlertTriangle, ShieldCheck, Play } from 'lucide-react';

export default function HardwareConfigGuide() {
  const [copied, setCopied] = useState(false);
  const [serverIp, setServerIp] = useState('192.168.1.100');

  const fullEndpoint = `http://${serverIp}:5000/api/v1/sensors/reading`;

  const sampleJsonPayload = JSON.stringify({
    slotId: "A-01",
    sensorId: "ESP32_SR04_A01",
    distanceCm: 18.5,
    batteryLevel: 98
  }, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullEndpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
          <Cpu size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
            🛠️ ESP32 Microcontroller Hardware Integration Guide
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '2px 0 0 0' }}>Configure physical HC-SR04 ultrasonic sensor nodes to communicate with ParkSense Express API</p>
        </div>
      </div>

      {/* Grid of Instructions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        {/* 1. Endpoint Configuration Box */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#06b6d4', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wifi size={18} /> 1. Express API Endpoint URL
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '12px' }}>
            Enter your computer's Local WiFi IP address to generate the exact URL for your ESP32 code:
          </p>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Host Workstation Local IP:</label>
            <input 
              type="text" 
              value={serverIp} 
              onChange={(e) => setServerIp(e.target.value)}
              className="form-input"
              placeholder="e.g. 192.168.1.105"
            />
          </div>

          <div style={{ background: '#070a12', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <code style={{ fontSize: '0.8rem', color: '#10b981', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {fullEndpoint}
            </code>
            <button onClick={handleCopy} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* 2. Pinout Schematic Box */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#6366f1', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} /> 2. Hardware Wiring Pinout Table
          </h3>

          <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', color: '#f3f4f6' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', textAlign: 'left' }}>
                <th style={{ padding: '6px 0' }}>Component</th>
                <th>ESP32 Pin</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '6px 0', color: '#06b6d4', fontWeight: 600 }}>HC-SR04 TRIG</td>
                <td><code style={{ color: '#f59e0b' }}>GPIO 5</code></td>
                <td>Trigger pulse output</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '6px 0', color: '#06b6d4', fontWeight: 600 }}>HC-SR04 ECHO</td>
                <td><code style={{ color: '#f59e0b' }}>GPIO 18</code></td>
                <td>Echo pulse input</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '6px 0', color: '#10b981', fontWeight: 600 }}>Green LED</td>
                <td><code style={{ color: '#f59e0b' }}>GPIO 2</code></td>
                <td>Available Indicator</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '6px 0', color: '#ef4444', fontWeight: 600 }}>Red LED</td>
                <td><code style={{ color: '#f59e0b' }}>GPIO 4</code></td>
                <td>Occupied Indicator</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 0', color: '#a855f7', fontWeight: 600 }}>Piezo Buzzer</td>
                <td><code style={{ color: '#f59e0b' }}>GPIO 19</code></td>
                <td>Welcome / Exit Beep</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* Sample Payload preview */}
      <div style={{ background: '#070a12', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h4 style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '10px' }}>
          Expected HTTP POST JSON Body format:
        </h4>
        <pre style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '0.85rem', margin: 0 }}>
          {sampleJsonPayload}
        </pre>
      </div>

    </div>
  );
}
