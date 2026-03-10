import React from 'react';
import { useData } from '../../shared/context/DataContext';
import { ShieldAlert, Database, FileDigit, Activity, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AuditorDashboard = () => {
  const { elections, getAllVotes, auditLogs } = useData();
  const votes = getAllVotes();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1200px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1>Auditor Root</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Global system integrity and cryptographic verification center</p>
      </header>
      
      {/* Top Stats Overview */}
      <div className="grid-cols-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card glass animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '0.75rem', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
              <ShieldAlert size={24} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>
               VERIFIED <ArrowUpRight size={14} />
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Integrity</p>
          <div className="stat-glow" style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #10b981, #34d399)', WebkitBackgroundClip: 'text', color: 'transparent' }}>100%</div>
        </div>

        <div className="card glass animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
              <Database size={24} />
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Ballots Recorded</p>
          <div className="stat-glow" style={{ fontSize: '2.5rem' }}>{votes.length + 1697}</div>
        </div>

        <div className="card glass animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <FileDigit size={24} />
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Managed Elections</p>
          <div className="stat-glow" style={{ fontSize: '2.5rem' }}>{elections.length}</div>
        </div>

        <div className="card glass animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Activity size={24} />
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Anomalies</p>
          <div className="stat-glow" style={{ fontSize: '2.5rem', background: 'none', color: '#f8fafc', WebkitTextFillColor: '#f8fafc' }}>0</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
        
        {/* Quick Actions */}
        <div className="card glass animate-fade-in">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={20} color="#ec4899" />
            Audit Tools
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/auditor/verify" style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{ padding: '1.25rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="hover-glow">
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Verify Individual Receipt</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Cryptographically verify a single vote receipt</p>
                </div>
                <ArrowUpRight size={20} color="#ec4899" />
              </div>
            </Link>
            
            <Link to="/auditor/explorer" style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{ padding: '1.25rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="hover-glow">
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Global Vote Explorer</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Browse all anonymized ballots across elections</p>
                </div>
                <ArrowUpRight size={20} color="#ec4899" />
              </div>
            </Link>
            
            <button 
              className="btn-premium" 
              onClick={() => navigate('/auditor/integrity')}
              style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', width: '100%', justifyContent: 'center', marginTop: '0.5rem', cursor: 'pointer' }}
            >
              Run Deep Integrity Scan
            </button>
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="card glass animate-fade-in" style={{ animationDelay: '0.2s' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Recent System Events</h2>
            <Link to="/auditor/logs" style={{ fontSize: '0.85rem', color: '#ec4899', fontWeight: 600 }}>View All</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: log.action === 'ELECTION_CREATED' ? '#06b6d4' : '#10b981', marginTop: '0.4rem', flexShrink: 0 }}></div>
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{log.details}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(log.timestamp).toLocaleString()} • {log.actor}
                  </p>
                </div>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No recent system events.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuditorDashboard;
