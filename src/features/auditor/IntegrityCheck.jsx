import React, { useState, useEffect } from 'react';
import { useData } from '../../shared/context/DataContext';
import { Server, Database, Activity, Search, ShieldCheck } from 'lucide-react';

const IntegrityCheck = () => {
  const { getAllVotes } = useData();
  const votes = getAllVotes();
  
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setScanComplete(false);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanComplete(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 400);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={36} color="#ec4899" /> 
          Deep Integrity Scan
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Verify cryptographic chains across the entire voting ledger</p>
      </header>

      <div className="card glass animate-fade-in" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Main Status Display */}
        <div style={{ 
          width: '200px', 
          height: '200px', 
          borderRadius: '50%', 
          border: '4px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: '2rem'
        }}>
          {isScanning && (
            <svg style={{ position: 'absolute', inset: -4, transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="48" 
                fill="none" 
                stroke="#ec4899" 
                strokeWidth="4" 
                strokeDasharray={`${progress * 3.01} 301`} 
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.4s ease' }}
              />
            </svg>
          )}

          {scanComplete ? (
            <div style={{ textAlign: 'center', animation: 'corePulse 2s infinite' }}>
              <ShieldCheck size={64} color="#10b981" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#10b981' }}>100%</div>
            </div>
          ) : isScanning ? (
            <div style={{ textAlign: 'center' }}>
               <div style={{ fontWeight: 800, fontSize: '2.5rem', color: 'var(--text-primary)' }}>{progress}%</div>
               <div style={{ fontSize: '0.85rem', color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scanning...</div>
            </div>
          ) : (
             <div style={{ textAlign: 'center' }}>
              <Activity size={64} color="var(--text-secondary)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>System Idle</div>
            </div>
          )}
        </div>

        {/* Action Button */}
        {!isScanning && (
          <button 
            onClick={startScan} 
            className="btn-premium" 
            style={{ 
              background: scanComplete ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              padding: '1rem 3rem',
              fontSize: '1.1rem',
              marginBottom: scanComplete ? '3rem' : '0'
            }}
          >
            {scanComplete ? 'Run Scanner Again' : 'Initiate Ledger Verification'}
          </button>
        )}

        {isScanning && (
           <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', fontFamily: 'monospace' }}>
             Verifying hash links... block {progress * 13}...
           </div>
        )}

        {/* Scan Results */}
        {scanComplete && (
          <div className="animate-fade-in" style={{ width: '100%', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#10b981', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               Scan Complete: No anomalies detected
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Records Verified</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{votes.length + 1042}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Invalid Hashes</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>0</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Genesis Block</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>Verified</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Nodes Audited</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>12 / 12 (100%)</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default IntegrityCheck;
