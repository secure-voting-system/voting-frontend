import React from 'react';
import { Play, Pause, Square, AlertOctagon, Activity, Lock } from 'lucide-react';
import { useData } from '../context/DataContext';

const ControlCard = ({ title, icon: Icon, color, desc, danger, onClick }) => (
  <div className="card glass animate-fade-in" style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'center', 
    gap: '1.25rem',
    aspectRatio: '1 / 1',
    justifyContent: 'center',
    padding: '2rem'
  }}>
    <button 
      onClick={onClick}
      style={{ 
        padding: '1.5rem', 
        borderRadius: '1.5rem', 
        background: `rgba(${color}, 0.1)`, 
        color: `rgb(${color})`,
        border: `2px solid rgba(${color}, 0.3)`,
        boxShadow: `0 0 20px rgba(${color}, 0.2)`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '80px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = `0 0 30px rgba(${color}, 0.4)`;
        e.currentTarget.style.borderColor = `rgba(${color}, 0.6)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = `0 0 20px rgba(${color}, 0.2)`;
        e.currentTarget.style.borderColor = `rgba(${color}, 0.3)`;
      }}
    >
      <Icon size={40} />
    </button>
    
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{desc}</p>
    </div>
  </div>
);

const ElectionControl = () => {
  const { elections, startElection, closeElection, suspendElection, resumeElection } = useData();
  const activeElection = elections.find((election) => election.status === 'active');
  const pendingElection = elections.find((election) => election.status === 'pending');
  const suspendedElection = elections.find((election) => election.status === 'suspended');

  const targetElection = activeElection || pendingElection || suspendedElection;

  return (
    <div style={{ maxWidth: '1200px' }}>
      <header style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Command Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Execute master voting protocols and security audits</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nodes Online</span>
        </div>
      </header>

      <div className="card glass animate-fade-in" style={{ marginBottom: '2.5rem', padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <Lock size={32} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            {targetElection ? `Active Session: ${targetElection.name}` : 'No Active Session'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginTop: '0.25rem' }}>
            {targetElection ? `Status: ${targetElection.status}` : 'Start an election to activate controls'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Activity size={24} color="var(--primary)" />
          <span className="stat-glow" style={{ fontSize: '1.75rem' }}>92.4% LIVE</span>
        </div>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <ControlCard 
          title="Start Voting" 
          icon={Play} 
          color="16, 185, 129" 
          desc="Initialize secure voting shards and broadcast access keys to all verified voters."
          onClick={() => pendingElection && startElection(pendingElection.id)}
        />
        <ControlCard 
          title="Pause Cluster" 
          icon={Pause} 
          color="245, 158, 11" 
          desc="Temporarily suspend protocol submissions to perform elective security maintenance."
          onClick={() => activeElection && suspendElection(activeElection.id, 'Maintenance')}
        />
        <ControlCard 
          title="Archive Ballots" 
          icon={Square} 
          color="148, 163, 184" 
          desc="Cease activity and begin the decentralized tallying sequence. Final and irreversible."
          onClick={() => activeElection && closeElection(activeElection.id)}
        />
        <ControlCard 
          title="Resume Voting" 
          icon={AlertOctagon} 
          color="239, 68, 68" 
          desc="Resume a suspended election and restore voting access."
          danger
          onClick={() => suspendedElection && resumeElection(suspendedElection.id)}
        />
      </div>
    </div>
  );
};

export default ElectionControl;
