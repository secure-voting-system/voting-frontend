import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ThemeToggle from '../components/ThemeToggle';
import { Vote, CheckCircle2, Clock, XCircle, Search, Receipt, LogOut } from 'lucide-react';

const VoterDashboard = () => {
  const { user, logout } = useAuth();
  const { elections, getUserVotes, hasUserVoted, getVoteByReceipt } = useData();
  const [receiptSearch, setReceiptSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const userVotes = getUserVotes(user.id);

  const handleReceiptSearch = () => {
    const vote = getVoteByReceipt(receiptSearch);
    setSearchResult(vote || 'not_found');
  };

  const getElectionStatus = (election) => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'closed';
    return 'active';
  };

  const activeElections = elections.filter(e => getElectionStatus(e) === 'active');
  const upcomingElections = elections.filter(e => getElectionStatus(e) === 'upcoming');
  const closedElections = elections.filter(e => getElectionStatus(e) === 'closed');

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1>Voter Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Welcome back, {user.name}!</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ThemeToggle />
            <button onClick={logout} className="sidebar-item" style={{ margin: 0, padding: '0.75rem 1.5rem' }}>
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="card glass animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '1rem', 
                background: 'rgba(99, 102, 241, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}>
                <Vote size={28} color="var(--primary)" />
              </div>
              <div>
                <div className="stat-glow" style={{ fontSize: '2rem' }}>{activeElections.length}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Active Elections</div>
              </div>
            </div>
          </div>

          <div className="card glass animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '1rem', 
                background: 'rgba(16, 185, 129, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <CheckCircle2 size={28} color="var(--success)" />
              </div>
              <div>
                <div className="stat-glow" style={{ fontSize: '2rem' }}>{userVotes.length}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Votes Cast</div>
              </div>
            </div>
          </div>

          <div className="card glass animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '1rem', 
                background: 'rgba(245, 158, 11, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <Clock size={28} color="var(--warning)" />
              </div>
              <div>
                <div className="stat-glow" style={{ fontSize: '2rem' }}>{upcomingElections.length}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Upcoming</div>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Lookup */}
        <div className="card glass animate-fade-in" style={{ marginBottom: '3rem', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Receipt size={24} /> Receipt Lookup
          </h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={receiptSearch}
              onChange={(e) => setReceiptSearch(e.target.value)}
              placeholder="Enter receipt ID (e.g., VOTE-2024-XXXXX)"
              style={{
                flex: 1,
                padding: '0.875rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
            />
            <button onClick={handleReceiptSearch} className="btn-premium">
              <Search size={20} /> Search
            </button>
          </div>
          {searchResult && (
            <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '0.75rem', background: searchResult === 'not_found' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${searchResult === 'not_found' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}` }}>
              {searchResult === 'not_found' ? (
                <p style={{ color: 'var(--danger)' }}>Receipt not found</p>
              ) : (
                <div>
                  <p style={{ color: 'var(--success)', fontWeight: 600 }}>Vote Verified</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Receipt ID: {searchResult.receiptId}<br />
                    Timestamp: {new Date(searchResult.timestamp).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Elections */}
        {activeElections.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Active Elections</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {activeElections.map((election, index) => {
                const voted = hasUserVoted(user.id, election.id);
                return (
                  <div key={election.id} className="card glass animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{election.title}</h3>
                        <span className={voted ? 'badge-active' : 'badge-pending'}>
                          {voted ? 'Voted' : 'Pending'}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                        {election.description}
                      </p>
                    </div>

                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Turnout</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{Math.round((election.votedCount / election.totalVoters) * 100)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${(election.votedCount / election.totalVoters) * 100}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--accent))', borderRadius: '999px' }}></div>
                      </div>
                    </div>

                    <Link to={`/voter/vote/${election.id}`}>
                      <button className={voted ? 'sidebar-item' : 'btn-premium'} style={{ width: '100%', justifyContent: 'center', margin: 0 }} disabled={voted}>
                        {voted ? <><CheckCircle2 size={20} /> Already Voted</> : <><Vote size={20} /> Cast Vote</>}
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Voting History */}
        {userVotes.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Voting History</h2>
            <div className="card glass">
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Election</th>
                    <th>Receipt ID</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userVotes.map((vote) => {
                    const election = elections.find(e => e.id === vote.electionId);
                    return (
                      <tr key={vote.id}>
                        <td style={{ fontWeight: 600 }}>{election?.title || 'Unknown'}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{vote.receiptId}</td>
                        <td>{new Date(vote.timestamp).toLocaleDateString()}</td>
                        <td><span className="badge-active">Verified</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeElections.length === 0 && userVotes.length === 0 && (
          <div className="card glass" style={{ padding: '4rem', textAlign: 'center' }}>
            <XCircle size={64} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Active Elections</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Check back later for upcoming elections</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoterDashboard;
