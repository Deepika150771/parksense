import React, { useState } from 'react';
import { Car, Zap, ShieldAlert, ArrowDown, ArrowUp } from 'lucide-react';

export default function ParkingMap({ slots, onToggleOccupancy }) {
  const [selectedZone, setSelectedZone] = useState('ALL');

  // Group slots by Zone
  const zones = ['ALL', ...new Set(slots.map(s => s.zone || 'Zone A (Ground)'))];

  const filteredSlots = selectedZone === 'ALL' 
    ? slots 
    : slots.filter(s => s.zone === selectedZone);

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
            🗺️ Interactive Deck Map & Live Layout
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '2px 0 0 0' }}>Visual floor plan representation with ESP32 sensor state mapping</p>
        </div>

        {/* Zone Selector Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {zones.map(zone => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid var(--border-glass)',
                background: selectedZone === zone ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedZone === zone ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Deck Schematic Layout */}
      <div style={{
        background: 'rgba(11, 15, 25, 0.8)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px dashed rgba(255, 255, 255, 0.12)',
        position: 'relative'
      }}>
        
        {/* Drive Lane Legend */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: '#9ca3af',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
            <ArrowDown size={14} /> MAIN ENTRY GATE (North Entrance)
          </div>
          <div style={{ letterSpacing: '0.1em', fontWeight: 600, color: 'rgba(255, 255, 255, 0.3)' }}>
            ═════ VEHICLE DRIVEWAY LANE ═════
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}>
            MAIN EXIT GATE (South Gate) <ArrowUp size={14} />
          </div>
        </div>

        {/* Parking Bay Slot Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '16px'
        }}>
          {filteredSlots.map(slot => (
            <div
              key={slot._id || slot.slotNumber}
              onClick={() => onToggleOccupancy(slot._id || slot.slotNumber, !slot.isOccupied)}
              style={{
                background: slot.isOccupied 
                  ? 'linear-gradient(180deg, rgba(239, 68, 68, 0.25) 0%, rgba(18, 26, 43, 0.9) 100%)' 
                  : 'linear-gradient(180deg, rgba(16, 185, 129, 0.2) 0%, rgba(18, 26, 43, 0.9) 100%)',
                border: slot.isOccupied 
                  ? '2px solid rgba(239, 68, 68, 0.6)' 
                  : '2px solid rgba(16, 185, 129, 0.6)',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: slot.isOccupied ? '0 4px 15px rgba(239, 68, 68, 0.15)' : '0 4px 15px rgba(16, 185, 129, 0.15)'
              }}
              title={`Click to simulate ${slot.isOccupied ? 'exit' : 'parking'}`}
            >
              {/* EV Badge if applies */}
              {slot.type === 'EV Charging' && (
                <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                  <Zap size={12} color="#06b6d4" />
                </div>
              )}

              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                {slot.slotNumber}
              </div>

              {/* Vehicle / Car graphic */}
              <div style={{
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                margin: '8px 0'
              }}>
                {slot.isOccupied ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Car size={24} color="#ef4444" />
                    <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#f59e0b', marginTop: '2px' }}>
                      {slot.vehiclePlate || 'PARKED'}
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    EMPTY
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                {slot.distanceCm?.toFixed(0)} cm
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
