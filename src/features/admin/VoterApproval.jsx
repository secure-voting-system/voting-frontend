import React from 'react';
import { Check, X, ShieldCheck, Fingerprint, Eye, MoreVertical } from 'lucide-react';

import { useData } from '../../shared/context/DataContext';

const VoterApproval = () => {
  const { pendingVoters, approveVoter, rejectVoter } = useData();

  return (
    <div style={{ maxWidth: '1000px' }}>
      <header style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Verification Queue</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Authenticate digital identities and biometrics</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {pendingVoters.length === 0 ? (
          <div className="card glass" style={{ padding: '4rem', textAlign: 'center' }}>
            <ShieldCheck size={64} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>All Caught Up</h3>
            <p style={{ color: 'var(--text-secondary)' }}>No pending voter verifications</p>
          </div>
        ) : (
          pendingVoters.map((voter, index) => (
            <div key={voter.id} className="card glass animate-fade-in" style={{ animationDelay: `${index * 0.1}s`, display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <Fingerprint size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{voter.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{voter.info}</p>
                  </div>
                </div>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><MoreVertical size={24} /></button>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                  <ShieldCheck size={18} color="var(--primary)" style={{ filter: 'drop-shadow(0 0 5px var(--primary-glow))' }} /> {voter.security}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>HASH: 0x8F2..</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => rejectVoter(voter.id)}
                  style={{ flex: 1, padding: '0.9rem', borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: '0.3s' }}
                >
                  <X size={20} /> Reject
                </button>
                <button 
                  onClick={() => approveVoter(voter.id)}
                  className="btn-premium" 
                  style={{ flex: 2, justifyContent: 'center', fontSize: '1rem', height: 'auto', padding: '0.9rem' }}
                >
                  <Check size={20} /> Authenticate
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VoterApproval;
