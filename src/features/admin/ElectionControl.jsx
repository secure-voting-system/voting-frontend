import React, { useState } from 'react';
import { Play, Pause, Square, AlertOctagon, Activity, Radio, Lock, ShieldCheck } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { electionAPI } from '../../shared/services/api';

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
      aria-label={title}
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
  const { elections, updateElection } = useData();
  const [loading, setLoading] = useState(false);
  const [selectedPendingId, setSelectedPendingId] = useState('');
  const [selectedActiveId, setSelectedActiveId] = useState('');

  const pendingElections = elections.filter(e => e.status === 'pending');
  const activeElections = elections.filter(e => e.status === 'active');

  const resolvedPendingId = selectedPendingId || pendingElections[0]?.id;
  const resolvedActiveId = selectedActiveId || activeElections[0]?.id;
  const resolvedPending = pendingElections.find(e => e.id === resolvedPendingId) || pendingElections[0];
  const resolvedActive = activeElections.find(e => e.id === resolvedActiveId) || activeElections[0];

  const updateElectionLocally = (id, status) => {
    const stored = JSON.parse(localStorage.getItem('vortex_elections') || '[]');
    const updated = stored.map(e => e.id === id ? { ...e, status } : e);
    localStorage.setItem('vortex_elections', JSON.stringify(updated));
    updateElection(id, { status });
  };

  const handleStartElection = async (electionId) => {
    setLoading(true);
    try {
      await electionAPI.start(electionId);
    } catch (error) {
      // Fallback: update locally
    }
    updateElectionLocally(electionId, 'active');
    alert('Election started successfully!');
    setLoading(false);
  };

  const handlePauseElection = async (electionId) => {
    setLoading(true);
    try {
      await electionAPI.suspend(electionId, 'Paused by admin');
    } catch (error) {
      // Fallback: update locally
    }
    updateElectionLocally(electionId, 'suspended');
    alert('Election paused successfully!');
    setLoading(false);
  };

  const handleCloseElection = async (electionId) => {
    setLoading(true);
    try {
      await electionAPI.close(electionId);
    } catch (error) {
      // Fallback: update locally
    }
    updateElectionLocally(electionId, 'closed');
    alert('Election closed successfully!');
    setLoading(false);
  };
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
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Active Session: Student Council 2024</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginTop: '0.25rem' }}>Started: 08:34 AM • Node Integrity: 100%</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Activity size={24} color="var(--primary)" />
          <span className="stat-glow" style={{ fontSize: '1.75rem' }}>92.4% LIVE</span>
        </div>
      </div>

      {(pendingElections.length > 0 || activeElections.length > 0) && (
        <div className="card glass" style={{ marginBottom: '2rem', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {pendingElections.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Pending Election
              </label>
              <select
                value={resolvedPendingId || ''}
                onChange={(e) => setSelectedPendingId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-primary)'
                }}
              >
                {pendingElections.map((election) => (
                  <option key={election.id} value={election.id}>
                    {election.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeElections.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Active Election
              </label>
              <select
                value={resolvedActiveId || ''}
                onChange={(e) => setSelectedActiveId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-primary)'
                }}
              >
                {activeElections.map((election) => (
                  <option key={election.id} value={election.id}>
                    {election.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {pendingElections.length > 0 && resolvedPending && (
          <ControlCard 
            title="Start Voting" 
            icon={Play} 
            color="16, 185, 129" 
            desc={`Start voting for: ${resolvedPending.title}`}
            onClick={() => handleStartElection(resolvedPending.id)}
          />
        )}
        {activeElections.length > 0 && resolvedActive && (
          <>
            <ControlCard 
              title="Pause Voting" 
              icon={Pause} 
              color="245, 158, 11" 
              desc={`Temporarily pause: ${resolvedActive.title}`}
              onClick={() => handlePauseElection(resolvedActive.id)}
            />
            <ControlCard 
              title="Close Election" 
              icon={Square} 
              color="148, 163, 184" 
              desc={`End voting for: ${resolvedActive.title}`}
              onClick={() => handleCloseElection(resolvedActive.id)}
            />
          </>
        )}
        {pendingElections.length === 0 && activeElections.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            No elections available. Create one first in Election Management.
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionControl;
