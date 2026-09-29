import React, { useState } from 'react';
import { 
  Car, 
  Zap, 
  UserCheck, 
  Crown, 
  Battery, 
  Ruler, 
  Clock, 
  Sliders,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function SlotCard({ slot, onToggleOccupancy, onUpdateDistance }) {
  const [showSlider, setShowSlider] = useState(false);
  const [tempDistance, setTempDistance] = useState(slot.distanceCm || 150);

  const isOccupied = slot.isOccupied;

  // Format elapsed time if occupied
  const getOccupiedTimeStr = (occupiedSince) => {
    if (!occupiedSince) return 'N/A';
    const mins = Math.max(1, Math.floor((new Date() - new Date(occupiedSince)) / 60000));
    if (mins < 60) return `${mins} mins`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  };

  // Icon based on slot type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'EV Charging':
        return <Zap size={14} color="#06b6d4" />;
      case 'Accessible':
        return <UserCheck size={14} color="#3b82f6" />;
      case 'VIP':
        return <Crown size={14} color="#f59e0b" />;
      default:
        return <Car size={14} color="#9ca3af" />;
    }
  };

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setTempDistance(val);
  };

  const handleSliderCommit = () => {
    onUpdateDistance(slot._id || slot.slotNumber, tempDistance);
    setShowSlider(false);
  };

  return (
    <div className={`slot-card ${isOccupied ? 'occupied' : 'available'}`}>
      
      {/* Top Bar: Slot ID & Status Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '0.02em' }}>
            {slot.slotNumber}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
            {getTypeIcon(slot.type)}
            <span>{slot.type}</span>
          </div>
        </div>

        <div className={`status-badge ${isOccupied ? 'occupied' : 'available'}`}>
          <span className="pulse-dot"></span>
          {isOccupied ? 'Occupied' : 'Available'}
        </div>
      </div>

      {/* Main Content Info */}
      <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '14px' }}>
        {isOccupied ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Vehicle Plate:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                {slot.vehiclePlate || 'KA-05-EV-4021'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> Duration:
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f3f4f6' }}>
                {getOccupiedTimeStr(slot.occupiedSince)}
              </span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0', color: '#10b981' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> Ready for Parking
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '2px 0 0 0' }}>Threshold: &lt; {slot.thresholdCm || 35} cm</p>
          </div>
        )}
      </div>

      {/* Telemetry Metrics: Distance (cm) & Sensor Battery */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Ruler size={14} color="#06b6d4" />
          <span>Dist: <strong style={{ color: '#06b6d4' }}>{slot.distanceCm?.toFixed(1)} cm</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Battery size={14} color={slot.batteryLevel < 20 ? '#ef4444' : '#10b981'} />
          <span>{slot.batteryLevel || 98}%</span>
        </div>
      </div>

      {/* Interactive Distance Slider (Optional) */}
      {showSlider && (
        <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px', borderRadius: '8px', marginBottom: '12px', border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
            <span>Simulate Sensor Reading:</span>
            <strong style={{ color: '#06b6d4' }}>{tempDistance.toFixed(1)} cm</strong>
          </div>
          <input 
            type="range" 
            min="5" 
            max="180" 
            value={tempDistance} 
            onChange={handleSliderChange}
            style={{ width: '100%', accentColor: '#06b6d4' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '6px' }}>
            <button onClick={() => setShowSlider(false)} style={{ padding: '2px 8px', fontSize: '0.75rem', background: 'transparent', color: '#9ca3af', border: 'none', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSliderCommit} style={{ padding: '2px 10px', fontSize: '0.75rem', background: '#06b6d4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Apply</button>
          </div>
        </div>
      )}

      {/* Card Action Footer */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => onToggleOccupancy(slot._id || slot.slotNumber, !isOccupied)}
          className={`btn ${isOccupied ? 'btn-secondary' : 'btn-primary'}`}
          style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}
        >
          {isOccupied ? (
            <> <XCircle size={14} /> Simulate Exit </>
          ) : (
            <> <CheckCircle size={14} /> Simulate Park </>
          )}
        </button>

        <button 
          onClick={() => setShowSlider(!showSlider)} 
          className="btn btn-secondary"
          style={{ padding: '8px', fontSize: '0.8rem' }}
          title="Adjust Ultrasonic Sensor Distance"
        >
          <Sliders size={14} />
        </button>
      </div>

    </div>
  );
}
