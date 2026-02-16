import React from 'react';
import { Users, Vote, Activity, Server, ArrowUpRight } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="card animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
      <div style={{ padding: '0.6rem', borderRadius: '0.75rem', background: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
        <Icon size={20} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>
        {trend} <ArrowUpRight size={14} />
      </div>
    </div>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{title}</p>
    <div className="stat-glow">{value}</div>
  </div>
);

const Dashboard = () => {
  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'Votes Cast',
        data: [12, 45, 150, 420, 680, 850, 920],
        borderColor: '#06b6d4', // Cyan
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#000',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Active Nodes',
        data: [50, 52, 55, 60, 58, 62, 65],
        borderColor: '#8b5cf6', // Violet
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#000',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8', // Slate-400
          font: {
            family: "'Outfit', sans-serif",
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(6, 182, 212, 0.2)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            family: "'Outfit', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            family: "'Outfit', sans-serif",
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1>Network Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '-0.5rem' }}>Comprehensive overview of decentralized voting nodes</p>
      </header>
      
      <div className="grid-cols-4">
        <StatCard title="Active Elections" value="03" icon={Vote} color="6, 182, 212" trend="+2" /> {/* Cyan */}
        <StatCard title="Total Voters" value="12,458" icon={Users} color="16, 185, 129" trend="+1.2k" /> {/* Emerald */}
        <StatCard title="Participation" value="68.4%" icon={Activity} color="139, 92, 246" trend="+5.4%" /> {/* Violet */}
        <StatCard title="Nodes Online" value="Active" icon={Server} color="236, 72, 153" trend="100%" /> {/* Pink */}
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Live Voting Activity</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <span className="badge-active" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>LIVE</span>
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
             <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Administrative Tasks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn-premium" style={{ width: '100%', justifyContent: 'center' }}>Issue New Election</button>
            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>Voter Verification</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>14 pending requests</p>
              </div>
              <button style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', border: 'none', background: 'none', cursor: 'pointer' }}>View All</button>
            </div>
            
             <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>System Logs</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>No alerts</p>
              </div>
              <button style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', border: 'none', background: 'none', cursor: 'pointer' }}>Check</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
