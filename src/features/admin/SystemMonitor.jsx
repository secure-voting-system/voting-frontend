import React, { useState, useEffect } from 'react';
import { useData } from '../../shared/context/DataContext';
import { Server, ShieldCheck, Activity, Database, CheckCircle2, Lock } from 'lucide-react';

const SystemMonitor = () => {
  const { elections, getAllVotes } = useData();
  const [tps, setTps] = useState(0);
  const [blockHeight, setBlockHeight] = useState(839210);

  // Simulate network activity
  useEffect(() => {
    const interval = setInterval(() => {
      setTps(Math.floor(Math.random() * 45) + 5); // 5-50 TPS
      if (Math.random() > 0.7) {
        setBlockHeight(prev => prev + 1);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { id: 'ap-south-1a', location: 'Mumbai, IN', latency: '12ms', status: 'optimal' },
    { id: 'us-east-1c', location: 'N. Virginia, US', latency: '45ms', status: 'optimal' },
    { id: 'eu-west-2b', location: 'London, UK', latency: '38ms', status: 'optimal' },
    { id: 'ap-northeast-1', location: 'Tokyo, JP', latency: '62ms', status: 'optimal' },
    { id: 'sa-east-1', location: 'São Paulo, BR', latency: '115ms', status: 'warning' },
    { id: 'af-south-1', location: 'Cape Town, ZA', latency: '88ms', status: 'optimal' },
    { id: 'au-syd-1', location: 'Sydney, AU', latency: '140ms', status: 'warning' }
  ];

  return (
    <div style={{ maxWidth: '1200px' }}>
      <header style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Server size={32} color="var(--primary)" /> System Monitor</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Global consensus network health and performance metrics</p>
      </header>

      {/* Hero Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card glass animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1) 0%, transparent 70%)' }}></div>
          <Activity size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Network Throughput</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span className="stat-glow" style={{ fontSize: '3.5rem', lineHeight: 1 }}>{tps}</span>
            <span style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 700 }}>TPS</span>
          </div>
        </div>

        <div className="card glass animate-fade-in" style={{ animationDelay: '0.1s', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)' }}></div>
          <Database size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Block Height</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span className="stat-glow" style={{ fontSize: '3.5rem', lineHeight: 1, color: '#10b981', background: 'none', WebkitTextFillColor: '#10b981' }}>#{blockHeight.toLocaleString()}</span>
          </div>
        </div>

        <div className="card glass animate-fade-in" style={{ animationDelay: '0.2s', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.1) 0%, transparent 70%)' }}></div>
          <ShieldCheck size={32} color="#ec4899" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Total Ledger Size</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span className="stat-glow" style={{ fontSize: '3.5rem', lineHeight: 1, color: '#ec4899', background: 'none', WebkitTextFillColor: '#ec4899' }}>{getAllVotes().length + 1042}</span>
            <span style={{ fontSize: '1.2rem', color: '#ec4899', fontWeight: 700 }}>Tx</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        {/* Node Map / List */}
        <div className="card glass animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Active Node Topology</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
               <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>CONSENSUS: 100%</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {nodes.map(node => (
              <div key={node.id} style={{ 
                padding: '1.25rem', 
                borderRadius: '1rem', 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{node.id}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{node.location}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    color: node.status === 'optimal' ? '#10b981' : '#f59e0b',
                    marginBottom: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    justifyContent: 'flex-end'
                  }}>
                    {node.status === 'optimal' && <CheckCircle2 size={12} />}
                    {node.status.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--primary)' }}>{node.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Summary */}
        <div className="card glass animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} color="var(--primary)" />
            Security Posture
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
               <span style={{ color: 'var(--text-secondary)' }}>Encryption</span>
               <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#10b981' }}>AES-256-GCM</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
               <span style={{ color: 'var(--text-secondary)' }}>Ledger Protocol</span>
               <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>Vortex V3.1</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
               <span style={{ color: 'var(--text-secondary)' }}>Last Audit</span>
               <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>12 mins ago</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ color: 'var(--text-secondary)' }}>Failed Verification</span>
               <span style={{ fontWeight: 700, color: '#10b981' }}>0 events</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemMonitor;
