import React from 'react';
import StatsOverview from '../components/StatsOverview';
import ParkingMap from '../components/ParkingMap';
import AnalyticsCharts from '../components/AnalyticsCharts';
import LiveSensorConsole from '../components/LiveSensorConsole';
import SlotCard from '../components/SlotCard';

export default function Dashboard({ 
  stats, 
  slots, 
  sensorLogs, 
  onToggleOccupancy, 
  onUpdateDistance, 
  onRefreshLogs 
}) {
  return (
    <div>
      {/* Top Level Summary Metrics */}
      <StatsOverview stats={stats} />

      {/* Main Layout: Deck Map & Analytics */}
      <ParkingMap slots={slots} onToggleOccupancy={onToggleOccupancy} />

      {/* Live Analytics Trends */}
      <AnalyticsCharts stats={stats} />

      {/* Quick Slot Grid Overview (First 6 Slots) */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
            ⚡ Live Slot Monitor Cards
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Showing {slots.length} active sensor nodes</span>
        </div>

        <div className="slots-grid">
          {slots.map(slot => (
            <SlotCard 
              key={slot._id || slot.slotNumber} 
              slot={slot} 
              onToggleOccupancy={onToggleOccupancy} 
              onUpdateDistance={onUpdateDistance}
            />
          ))}
        </div>
      </div>

      {/* Live ESP32 Sensor Console Log */}
      <LiveSensorConsole logs={sensorLogs} onRefresh={onRefreshLogs} />
    </div>
  );
}
