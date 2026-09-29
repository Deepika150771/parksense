import React from 'react';
import { 
  Grid, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  DollarSign, 
  Activity 
} from 'lucide-react';

export default function StatsOverview({ stats }) {
  const totalSlots = stats?.totalSlots || 0;
  const availableSlots = stats?.availableSlots || 0;
  const occupiedSlots = stats?.occupiedSlots || 0;
  const occupancyRate = stats?.occupancyRate || 0;
  const totalRevenue = stats?.totalRevenue || 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
      
      {/* Total Slots Card */}
      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper stat-icon-cyan">
          <Grid size={24} />
        </div>
        <div>
          <div className="stat-value">{totalSlots}</div>
          <div className="stat-label">Total Parking Slots</div>
        </div>
      </div>

      {/* Available Slots Card (Green) */}
      <div className="glass-card stat-card" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div className="stat-icon-wrapper stat-icon-emerald">
          <CheckCircle size={24} />
        </div>
        <div>
          <div className="stat-value" style={{ color: '#10b981' }}>{availableSlots}</div>
          <div className="stat-label">Available Slots</div>
        </div>
      </div>

      {/* Occupied Slots Card (Red) */}
      <div className="glass-card stat-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
        <div className="stat-icon-wrapper stat-icon-rose">
          <XCircle size={24} />
        </div>
        <div>
          <div className="stat-value" style={{ color: '#ef4444' }}>{occupiedSlots}</div>
          <div className="stat-label">Occupied Slots</div>
        </div>
      </div>

      {/* Occupancy Rate % Card */}
      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper stat-icon-indigo">
          <TrendingUp size={24} />
        </div>
        <div>
          <div className="stat-value" style={{ color: '#6366f1' }}>{occupancyRate}%</div>
          <div className="stat-label">Occupancy Rate</div>
        </div>
      </div>

    </div>
  );
}
