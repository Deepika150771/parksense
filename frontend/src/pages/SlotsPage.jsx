import React, { useState } from 'react';
import SlotCard from '../components/SlotCard';
import { Search, Plus, Filter, RefreshCw } from 'lucide-react';

export default function SlotsPage({ slots, onToggleOccupancy, onUpdateDistance, onCreateSlot, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Slot Form State
  const [newSlotNumber, setNewSlotNumber] = useState('');
  const [newZone, setNewZone] = useState('Zone A (Ground)');
  const [newType, setNewType] = useState('Standard');
  const [newThreshold, setNewThreshold] = useState(35);

  const filteredSlots = slots.filter(s => {
    const matchesSearch = s.slotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || s.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'OCCUPIED' && s.isOccupied) || 
      (statusFilter === 'AVAILABLE' && !s.isOccupied);

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newSlotNumber) return;
    onCreateSlot({
      slotNumber: newSlotNumber.toUpperCase(),
      zone: newZone,
      type: newType,
      thresholdCm: parseFloat(newThreshold)
    });
    setShowAddModal(false);
    setNewSlotNumber('');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
            🅿️ Parking Slot Sensor Nodes Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '2px 0 0 0' }}>
            Monitor real-time ultrasonic distance readings, distance thresholds, and occupancy states
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onRefresh} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <RefreshCw size={14} /> Refresh Nodes
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            <Plus size={16} /> Add Parking Slot
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search slot number (e.g., A-01)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>

        {/* Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Type:</span>
          {['ALL', 'Standard', 'EV Charging', 'Accessible', 'VIP'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: '1px solid var(--border-glass)',
                background: typeFilter === t ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                color: typeFilter === t ? '#06b6d4' : '#9ca3af',
                cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Status:</span>
          {['ALL', 'AVAILABLE', 'OCCUPIED'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: '1px solid var(--border-glass)',
                background: statusFilter === s 
                  ? (s === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.25)' : (s === 'OCCUPIED' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(6, 182, 212, 0.25)')) 
                  : 'rgba(255, 255, 255, 0.03)',
                color: statusFilter === s 
                  ? (s === 'AVAILABLE' ? '#10b981' : (s === 'OCCUPIED' ? '#ef4444' : '#06b6d4')) 
                  : '#9ca3af',
                cursor: 'pointer'
              }}
            >
              {s}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Slots */}
      <div className="slots-grid">
        {filteredSlots.length > 0 ? (
          filteredSlots.map(slot => (
            <SlotCard 
              key={slot._id || slot.slotNumber} 
              slot={slot} 
              onToggleOccupancy={onToggleOccupancy} 
              onUpdateDistance={onUpdateDistance}
            />
          ))
        ) : (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
            No parking slots match the selected search & filter criteria.
          </div>
        )}
      </div>

      {/* Add Slot Modal Dialog */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>
              ➕ Register New Parking Slot Node
            </h3>

            <form onSubmit={handleAddSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>Slot Identifier / Number</label>
                <input 
                  type="text" 
                  value={newSlotNumber} 
                  onChange={(e) => setNewSlotNumber(e.target.value)} 
                  placeholder="e.g. D-01" 
                  className="form-input"
                  required 
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>Deck Zone / Floor</label>
                <select value={newZone} onChange={(e) => setNewZone(e.target.value)} className="form-input">
                  <option value="Zone A (Ground)">Zone A (Ground)</option>
                  <option value="Zone B (Level 1)">Zone B (Level 1)</option>
                  <option value="Zone C (Reserved/VIP)">Zone C (Reserved/VIP)</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>Slot Type</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value)} className="form-input">
                  <option value="Standard">Standard</option>
                  <option value="EV Charging">EV Charging</option>
                  <option value="Accessible">Accessible</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>Sensor Threshold Distance (cm)</label>
                <input 
                  type="number" 
                  value={newThreshold} 
                  onChange={(e) => setNewThreshold(e.target.value)} 
                  className="form-input"
                  min="10" max="100"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Slot Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
