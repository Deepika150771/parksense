import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { TrendingUp, PieChart, BarChart3 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsCharts({ stats }) {
  // Peak Hours Occupancy Line Data (Simulated 24-hr curve based on current rate)
  const baseRate = stats?.occupancyRate || 40;
  const lineData = {
    labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
    datasets: [
      {
        label: 'Occupancy %',
        data: [
          Math.max(10, baseRate - 30),
          Math.min(95, baseRate + 20),
          Math.min(98, baseRate + 35),
          Math.min(90, baseRate + 25),
          Math.min(92, baseRate + 30),
          Math.min(85, baseRate + 15),
          Math.min(75, baseRate + 5),
          Math.max(20, baseRate - 15),
          Math.max(10, baseRate - 25)
        ],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#06b6d4'
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' }, min: 0, max: 100 }
    }
  };

  // Slot Types Distribution Doughnut Data
  const byType = stats?.byType || {};
  const doughnutData = {
    labels: ['Standard', 'EV Charging', 'Accessible', 'VIP'],
    datasets: [
      {
        data: [
          byType['Standard']?.total || 6,
          byType['EV Charging']?.total || 2,
          byType['Accessible']?.total || 2,
          byType['VIP']?.total || 2
        ],
        backgroundColor: ['#6366f1', '#06b6d4', '#3b82f6', '#f59e0b'],
        borderWidth: 0
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 11 } } }
    },
    cutout: '70%'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '24px' }}>
      
      {/* 1. Peak Hours Occupancy Line Chart */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <TrendingUp size={18} color="#06b6d4" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#fff' }}>
            Peak Hours Occupancy Trend
          </h3>
        </div>
        <div style={{ height: '220px' }}>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* 2. Slot Category Distribution Doughnut */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <PieChart size={18} color="#6366f1" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#fff' }}>
            Slot Category Distribution
          </h3>
        </div>
        <div style={{ height: '220px', position: 'relative' }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

    </div>
  );
}
