import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Vote, CheckCircle2, ArrowLeft, Download } from 'lucide-react';

const VotingPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { elections, getCandidatesByElection, submitVote, hasUserVoted } = useData();
  
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [voteReceipt, setVoteReceipt] = useState(null);

  const election = elections.find(e => e.id === electionId);
  const candidates = getCandidatesByElection(electionId);
  const alreadyVoted = hasUserVoted(user.id, electionId);

  if (!election) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2>Election Not Found</h2>
          <button onClick={() => navigate('/voter/dashboard')} className="btn-premium" style={{ marginTop: '1.5rem' }}>
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitVote = () => {
    if (!selectedCandidate) return;

    const result = submitVote(user.id, electionId, selectedCandidate);
    if (result.success) {
      setVoteReceipt(result.vote);
      setShowReceipt(true);
    }
  };

  if (showReceipt && voteReceipt) {
    const candidate = candidates.find(c => c.id === voteReceipt.candidateId);
    
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card glass animate-fade-in" style={{ maxWidth: '600px', width: '100%', padding: '3rem', textAlign: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'rgba(16, 185, 129, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 2rem',
            border: '2px solid rgba(16, 185, 129, 0.3)'
          }}>
            <CheckCircle2 size={48} color="var(--success)" />
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Vote Submitted!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Your vote has been securely recorded
          </p>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                Receipt ID
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--primary)' }}>
                {voteReceipt.receiptId}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Election</div>
                <div style={{ fontWeight: 600 }}>{election.title}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Candidate</div>
                <div style={{ fontWeight: 600 }}>{candidate?.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Timestamp</div>
                <div style={{ fontWeight: 600 }}>{new Date(voteReceipt.timestamp).toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Status</div>
                <div><span className="badge-active">Verified</span></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="sidebar-item" style={{ margin: 0, padding: '0.875rem 1.5rem' }}>
              <Download size={20} /> Download Receipt
            </button>
            <button onClick={() => navigate('/voter/dashboard')} className="btn-premium">
              Back to Dashboard
            </button>
          </div>

          <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Save your receipt ID to verify your vote later
          </p>
        </div>
      </div>
    );
  }

  if (alreadyVoted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card glass" style={{ maxWidth: '500px', padding: '3rem', textAlign: 'center' }}>
          <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Already Voted</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            You have already cast your vote in this election
          </p>
          <button onClick={() => navigate('/voter/dashboard')} className="btn-premium">
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button onClick={() => navigate('/voter/dashboard')} className="sidebar-item" style={{ margin: '0 0 2rem 0', padding: '0.75rem 1.25rem' }}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        {/* Election Header */}
        <div className="card glass animate-fade-in" style={{ marginBottom: '2.5rem', padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{election.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            {election.description}
          </p>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Ends: </span>
              <span style={{ fontWeight: 600 }}>{new Date(election.endDate).toLocaleString()}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Turnout: </span>
              <span style={{ fontWeight: 600 }}>{Math.round((election.votedCount / election.totalVoters) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Candidates */}
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Select Your Candidate</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {candidates.map((candidate, index) => (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate.id)}
              className="card glass animate-fade-in"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                border: selectedCandidate === candidate.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                background: selectedCandidate === candidate.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)',
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `2px solid ${selectedCandidate === candidate.id ? 'var(--primary)' : 'var(--glass-border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {selectedCandidate === candidate.id && (
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                  )}
                </div>

                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--glass-border)',
                  flexShrink: 0
                }}>
                  {candidate.photo ? (
                    <img src={candidate.photo} alt={candidate.name} style={{ width: '100%', height: '100%', borderRadius: '1rem', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {candidate.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{candidate.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{candidate.role}</p>
                  {candidate.bio && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>{candidate.bio}</p>
                  )}
                </div>

                {selectedCandidate === candidate.id && (
                  <CheckCircle2 size={32} color="var(--primary)" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitVote}
          disabled={!selectedCandidate}
          className="btn-premium"
          style={{
                width: '100%',
            justifyContent: 'center',
            fontSize: '1.1rem',
            padding: '1.25rem',
            opacity: selectedCandidate ? 1 : 0.5,
            cursor: selectedCandidate ? 'pointer' : 'not-allowed'
          }}
        >
          <Vote size={24} /> Submit Vote
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Your vote is anonymous and cannot be changed after submission
        </p>
      </div>
    </div>
  );
};

export default VotingPage;
