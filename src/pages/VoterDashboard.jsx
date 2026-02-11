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
      <div className="card stack">
        <h3>Welcome, {user?.name || 'Voter'}</h3>
        <div className={`badge ${sseConnected ? 'success' : 'warning'}`}>
          {sseConnected ? 'Live updates connected' : 'Live updates offline'}
        </div>
      </div>

      <div className="grid cols-3">
        <div className="card stat">
          <span className="helper">Active elections</span>
          <div className="stat-value">{activeElections.length}</div>
        </div>
        <div className="card stat">
          <span className="helper">Upcoming</span>
          <div className="stat-value">{upcomingElections.length}</div>
        </div>
        <div className="card stat">
          <span className="helper">Votes cast</span>
          <div className="stat-value">{votedCount}</div>
        </div>
      </div>

      <div className="card stack">
        <div className="section-title">Active elections</div>
        {activeElections.length === 0 && (
          <div className="empty-state">No active elections right now.</div>
        )}
        {activeElections.map((election) => {
          const voted = Boolean(hasVotedMap[election.id]);
          return (
            <div key={election.id} className="card soft">
              <div className="stack">
                <div>
                  <h4>{election.name}</h4>
                  <p className="helper">{election.description || 'No description provided.'}</p>
                </div>
                <div className="grid cols-2">
                  <div className="badge success">{election.status}</div>
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
          <div className="section-title">Quick actions</div>
          <Link className="button" to="/voter/verify">Verify receipt</Link>
          <Link className="button secondary" to="/voter/results">View results</Link>
        </div>
        <div className="card stack">
          <div className="section-title">Latest receipt</div>
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
