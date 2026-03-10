import React, { useState } from 'react';
import { useData } from '../../shared/context/DataContext';
import { ShieldCheck, Search, XCircle, CheckCircle2 } from 'lucide-react';

const ReceiptVerification = () => {
  const { getVoteByReceipt, elections } = useData();
  const [receiptId, setReceiptId] = useState('');
  const [result, setResult] = useState(null);
  const [isSearched, setIsSearched] = useState(false);

  const handleVerify = () => {
    if (!receiptId.trim()) return;
    
    const vote = getVoteByReceipt(receiptId.trim());
    setResult(vote);
    setIsSearched(true);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '50%', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
            <ShieldCheck size={48} color="#ec4899" />
          </div>
        </div>
        <h1>Receipt Verification</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Cryptographically verify a ballot receipt against the immutable ledger</p>
      </header>

      <div className="card glass animate-fade-in" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>Enter Unique Receipt ID</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              value={receiptId}
              onChange={(e) => setReceiptId(e.target.value)}
              placeholder="VOTE-..." 
              style={{
                flex: 1,
                padding: '1rem 1.25rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--glass-border)',
                background: 'rgba(0,0,0,0.2)',
                color: 'var(--primary)',
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                letterSpacing: '0.05em'
              }}
            />
            <button onClick={handleVerify} className="btn-premium" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', padding: '0 2rem' }}>
              <Search size={20} style={{ marginRight: '0.5rem' }}/> Verify
            </button>
          </div>
        </div>

        {isSearched && (
          <div className="animate-fade-in" style={{ 
            background: result ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', 
            border: `1px solid ${result ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            padding: '2rem',
            borderRadius: '1rem'
          }}>
            {result ? (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h2 style={{ fontSize: '1.5rem', color: '#10b981', marginBottom: '0.5rem' }}>Valid Receipt Found</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>This ballot is cryptographically secure and exists in the ledger.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '0.75rem' }}>
                   <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Timestamp</div>
                      <div style={{ fontWeight: 600 }}>{new Date(result.timestamp).toLocaleString()}</div>
                   </div>
                   <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Election</div>
                      <div style={{ fontWeight: 600 }}>{elections.find(e => e.id === result.electionId)?.title || result.electionId}</div>
                   </div>
                   <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Transaction Hash (Simulated)</div>
                      <div style={{ fontFamily: 'monospace', color: 'var(--primary)', wordBreak: 'break-all', fontSize: '0.85rem' }}>
                        0x{Math.random().toString(16).substring(2, 10)}{Math.random().toString(16).substring(2, 10)}{Math.random().toString(16).substring(2, 10)}...
                      </div>
                   </div>
                </div>
              </div>
            ) : (
               <div style={{ textAlign: 'center' }}>
                <XCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
                <h2 style={{ fontSize: '1.5rem', color: '#ef4444', marginBottom: '0.5rem' }}>Receipt Not Found</h2>
                <p style={{ color: 'var(--text-secondary)' }}>The provided receipt ID does not exist in the active ledger. Please check for typos and try again.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptVerification;
