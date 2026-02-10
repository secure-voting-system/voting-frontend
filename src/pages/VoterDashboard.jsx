import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const VoterDashboard = () => {
  const { user } = useAuth();
  const { elections, hasUserVoted, hasVotedMap, lastReceipt, sseConnected } = useData();

  useEffect(() => {
    if (!elections.length) {
      return;
    }
    elections.forEach((election) => {
      hasUserVoted(election.id).catch(() => null);
    });
  }, [elections, hasUserVoted]);

  const activeElections = elections.filter((election) => election.status === 'active');
  const upcomingElections = elections.filter((election) => election.status === 'pending');
  const votedCount = Object.values(hasVotedMap).filter(Boolean).length;

  return (
    <div className="stack">
      <div className="card">
        <h3>Welcome, {user?.name || 'Voter'}</h3>
        <p className="helper">You can vote in active elections and verify receipts at any time.</p>
        <div className={`badge ${sseConnected ? 'success' : 'warning'}`}>
          {sseConnected ? 'Live updates connected' : 'Live updates offline'}
        </div>
      </div>

      <div className="grid cols-3">
        <div className="card">
          <h3>Active elections</h3>
          <p className="helper">{activeElections.length} running now</p>
        </div>
        <div className="card">
          <h3>Upcoming</h3>
          <p className="helper">{upcomingElections.length} scheduled</p>
        </div>
        <div className="card">
          <h3>Votes cast</h3>
          <p className="helper">{votedCount} confirmed</p>
        </div>
      </div>

      <div className="card stack">
        <h3>Active elections</h3>
        {activeElections.length === 0 && <p className="helper">No active elections right now.</p>}
        {activeElections.map((election) => {
          const voted = Boolean(hasVotedMap[election.id]);
          return (
            <div key={election.id} className="card" style={{ background: 'var(--surface-2)' }}>
              <div className="stack">
                <div>
                  <h4>{election.name}</h4>
                  <p className="helper">{election.description || 'No description provided.'}</p>
                </div>
                <div className="grid cols-2">
                  <div>
                    <div className="badge success">{election.status}</div>
                  </div>
                  <div className="helper">Total votes: {election.totalVotes || 0}</div>
                </div>
                {voted ? (
                  <button className="button secondary" disabled>Already voted</button>
                ) : (
                  <Link to={`/voter/vote/${election.id}`} className="button">
                    Cast vote
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid cols-2">
        <div className="card stack">
          <h3>Quick actions</h3>
          <Link className="button" to="/voter/verify">Verify receipt</Link>
          <Link className="button secondary" to="/voter/results">View results</Link>
        </div>
        <div className="card stack">
          <h3>Latest receipt</h3>
          {lastReceipt ? (
            <div className="stack">
              <div className="helper">Receipt ID</div>
              <strong>{lastReceipt.receiptId}</strong>
              {lastReceipt.timestamp && (
                <div className="helper">{new Date(lastReceipt.timestamp * 1000).toLocaleString()}</div>
              )}
            </div>
          ) : (
            <p className="helper">No receipt yet. Cast a vote to receive one.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;
