import React, { useState } from 'react';
import { useData } from '../../shared/context/DataContext';
import { History, Filter } from 'lucide-react';

const AuditLogs = () => {
  const { auditLogs } = useData();
  const [filterType, setFilterType] = useState('ALL');

  const filteredLogs = filterType === 'ALL' 
    ? auditLogs 
    : auditLogs.filter(log => log.action === filterType);

  const getActionColor = (action) => {
    switch(action) {
      case 'ELECTION_CREATED': return '#06b6d4'; // cyan
      case 'VOTE_CAST': return '#10b981'; // emerald
      default: return '#8b5cf6'; // violet
    }
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><History size={32} color="#ec4899" /> System Audit Logs</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Immutable record of all critical system events</p>
      </header>

      <div className="card glass">
         {/* Filters */}
         <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
          <Filter size={18} color="var(--text-secondary)" />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             {['ALL', 'ELECTION_CREATED', 'VOTE_CAST'].map(type => (
               <button 
                  key={type}
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '999px',
                    border: `1px solid ${filterType === type ? 'var(--primary)' : 'var(--glass-border)'}`,
                    background: filterType === type ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                    color: filterType === type ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: '0.2s'
                  }}
               >
                 {type.replace('_', ' ')}
               </button>
             ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ paddingLeft: '2rem', borderLeft: '2px solid rgba(255,255,255,0.05)', position: 'relative' }}>
           {filteredLogs.length > 0 ? (
             filteredLogs.map((log, index) => (
               <div key={log.id} className="animate-fade-in" style={{ position: 'relative', marginBottom: '2rem', animationDelay: `${index * 0.05}s` }}>
                 <div style={{ 
                    position: 'absolute', 
                    left: '-2rem', 
                    top: '0', 
                    transform: 'translate(-50%, 20%)',
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: getActionColor(log.action),
                    boxShadow: `0 0 10px ${getActionColor(log.action)}`
                 }}></div>
                 
                 <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '1rem', padding: '1.25rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                     <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{log.details}</h3>
                     <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0.2rem 0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem' }}>
                       {log.action}
                     </span>
                   </div>
                   
                   <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                     <div><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</div>
                     <div><strong>Actor:</strong> {log.actor}</div>
                     <div><strong>Ref:</strong> <span style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{log.entityId}</span></div>
                   </div>
                 </div>
               </div>
             ))
           ) : (
             <p style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>No logs found for this filter.</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
