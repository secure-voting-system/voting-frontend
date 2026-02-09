import React from 'react';
import { Users, Vote, Activity, Server, ArrowUpRight } from 'lucide-react';

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
  return (
    <div style={{ maxWidth: '1200px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1>Network Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '-2rem' }}>Comprehensive overview of decentralized voting nodes</p>
      </header>
      
      <div className="grid-cols-4">
        <StatCard title="Active Elections" value="03" icon={Vote} color="79, 70, 229" trend="+2" />
        <StatCard title="Total Voters" value="12,458" icon={Users} color="16, 185, 129" trend="+1.2k" />
        <StatCard title="Participation" value="68.4%" icon={Activity} color="14, 165, 233" trend="+5.4%" />
        <StatCard title="Nodes Online" value="Active" icon={Server} color="139, 92, 246" trend="100%" />
      </div>

      <div style={{ marginTop: '2rem' }} className="grid-cols-2">
        <div className="card" style={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h2>Live Voting Activity</h2>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '0.75rem', border: '1px dashed var(--border)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Synchronizing participation data...</span>
          </div>
        </div>
        
        <div className="card">
          <h2>Administrative Tasks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn-premium" style={{ width: '100%', justifyContent: 'center' }}>Issue New Election</button>
            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Voter Verification</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>14 pending requests</p>
              </div>
              <button style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', border: 'none', background: 'none', cursor: 'pointer' }}>View All</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
