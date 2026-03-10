import React, { useState } from 'react';
import { useData } from '../../shared/context/DataContext';
import { Search, Filter, Hash } from 'lucide-react';

const VoteExplorer = () => {
  const { elections, getAllVotes } = useData();
  const allVotes = getAllVotes();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterElection, setFilterElection] = useState('');

  const filteredVotes = allVotes.filter(vote => {
    const matchesSearch = vote.receiptId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesElection = filterElection ? vote.electionId === filterElection : true;
    return matchesSearch && matchesElection;
  });

  return (
    <div style={{ maxWidth: '1200px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Search size={32} color="#ec4899" /> Global Vote Explorer</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Browse and verify anonymized ballot records across all elections</p>
      </header>

      <div className="card glass">
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by Receipt ID (e.g. VOTE-1234...)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 2.8rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.02)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div style={{ flex: '0 0 250px', position: 'relative' }}>
            <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <select
              value={filterElection}
              onChange={(e) => setFilterElection(e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 2.8rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.02)',
                color: 'var(--text-primary)',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="" style={{ background: '#0f172a' }}>All Elections</option>
              {elections.map(e => <option key={e.id} value={e.id} style={{ background: '#0f172a' }}>{e.title}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Election ID</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVotes.length > 0 ? (
                filteredVotes.map((vote) => (
                  <tr key={vote.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Hash size={14} /> {vote.receiptId}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{vote.electionId}</td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(vote.timestamp).toLocaleString()}</td>
                    <td><span className="badge-active">Verified</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                    No matching votes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
            Showing {filteredVotes.length} of {allVotes.length} total records
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteExplorer;
