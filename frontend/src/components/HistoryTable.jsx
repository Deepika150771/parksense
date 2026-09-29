import React, { useState } from 'react';
import { History, Clock, DollarSign, Search, Filter } from 'lucide-react';

export default function HistoryTable({ sessions, onRecordManualEntry, onRecordManualExit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Manual Entry Form state
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [slotNumberInput, setSlotNumberInput] = useState('A-01');
  const [plateInput, setPlateInput] = useState('');

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = (s.slotNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.vehiclePlate || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleManualEntrySubmit = (e) => {
    e.preventDefault();
    if (!slotNumberInput || !plateInput) return;
    onRecordManualEntry({ slotNumber: slotNumberInput, vehiclePlate: plateInput });
    setShowEntryModal(false);
    setPlateInput('');
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      
      {/* Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={20} color="#06b6d4" /> Parking History & Vehicle Entry/Exit Records
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '2px 0 0 0' }}>Comprehensive audit log of all parking sessions, duration, and calculated fees</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowEntryModal(true)} 
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            + Register Manual Vehicle Entry
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by Slot (e.g. A-01) or Vehicle Plate..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'ACTIVE', 'COMPLETED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid var(--border-glass)',
                background: statusFilter === st ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: statusFilter === st ? '#06b6d4' : '#9ca3af',
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="custom-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Slot #</th>
              <th>Vehicle Plate</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Duration</th>
              <th>Fee ($)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <tr key={session._id}>
                  <td style={{ fontFamily: 'monospace', color: '#9ca3af', fontSize: '0.8rem' }}>
                    {session._id ? session._id.substring(0, 10) : 'SESS-01'}
                  </td>
                  <td>
                    <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{session.slotNumber}</strong>
                  </td>
                  <td>
                    <span style={{ 
                      fontFamily: 'monospace', 
                      fontWeight: 700, 
                      color: '#f59e0b', 
                      background: 'rgba(245, 158, 11, 0.1)', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      border: '1px solid rgba(245, 158, 11, 0.3)' 
                    }}>
                      {session.vehiclePlate}
                    </span>
                  </td>
                  <td style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                    {new Date(session.entryTime).toLocaleString()}
                  </td>
                  <td style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                    {session.exitTime ? new Date(session.exitTime).toLocaleString() : '—'}
                  </td>
                  <td style={{ color: '#f3f4f6' }}>
                    {session.status === 'ACTIVE' 
                      ? 'In Progress...' 
                      : `${session.durationMinutes || 1} mins`}
                  </td>
                  <td style={{ fontWeight: 700, color: '#10b981' }}>
                    ${session.status === 'ACTIVE' ? '0.00' : (session.fee || 5.0).toFixed(2)}
                  </td>
                  <td>
                    <span className={`status-badge ${session.status === 'ACTIVE' ? 'occupied' : 'available'}`}>
                      {session.status}
                    </span>
                  </td>
                  <td>
                    {session.status === 'ACTIVE' && (
                      <button 
                        onClick={() => onRecordManualExit(session.slotNumber)}
                        className="btn btn-danger"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        Checkout / Exit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                  No parking sessions found matching filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Entry Modal Dialog */}
      {showEntryModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>
              🚗 Register Manual Vehicle Entry
            </h3>

            <form onSubmit={handleManualEntrySubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>Slot Number</label>
                <input 
                  type="text" 
                  value={slotNumberInput}
                  onChange={(e) => setSlotNumberInput(e.target.value.toUpperCase())}
                  placeholder="e.g. A-01, B-02"
                  className="form-input"
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>Vehicle License Plate</label>
                <input 
                  type="text" 
                  value={plateInput}
                  onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                  placeholder="e.g. KA-05-EV-9900"
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowEntryModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
