import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';

const CastVote = () => {
  const { electionId } = useParams();
  const { elections, getCandidatesByElection, submitVote, hasUserVoted, hasVotedMap } = useData();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const election = elections.find((item) => item.id === electionId);
  const alreadyVoted = Boolean(hasVotedMap[electionId]);

  useEffect(() => {
    if (!electionId) {
      return;
    }
    getCandidatesByElection(electionId)
      .then((data) => setCandidates(data))
      .catch(() => setCandidates([]));
    hasUserVoted(electionId).catch(() => null);
  }, [electionId, getCandidatesByElection, hasUserVoted]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedCandidate) {
      return;
    }
    setStatus({ loading: true, error: '', success: '' });
    try {
      const receipt = await submitVote(electionId, selectedCandidate);
      await hasUserVoted(electionId);
      setStatus({ loading: false, error: '', success: `Vote recorded. Receipt: ${receipt.receiptId || 'N/A'}` });
    } catch (error) {
      setStatus({ loading: false, error: error.response?.data?.message || 'Failed to cast vote.', success: '' });
    }
  };

  return (
    <div className="stack">
      <div className="card stack">
        <h3>Cast vote</h3>
        {election && <div className="badge success">{election.name}</div>}
        {!election && <div className="badge warning">Election not found</div>}
      </div>

      <form className="card stack" onSubmit={handleSubmit}>
        <div className="field">
          <label>Candidate</label>
          <select value={selectedCandidate} onChange={(event) => setSelectedCandidate(event.target.value)} disabled={alreadyVoted}>
            <option value="">Select a candidate</option>
            {candidates.map((candidate) => (
              <option key={candidate.candidateId || candidate.id} value={candidate.candidateId || candidate.id}>
                {candidate.name} {candidate.party ? `- ${candidate.party}` : ''}
              </option>
            ))}
          </select>
        </div>
        {alreadyVoted && <div className="badge warning">You have already voted in this election.</div>}
        {status.error && <div className="badge danger">{status.error}</div>}
        {status.success && (
          <div className="status-panel">
            <div>
              <strong>Vote confirmed</strong>
              <div className="helper">{status.success}</div>
            </div>
          </div>
        )}
        <button className="button" type="submit" disabled={!selectedCandidate || alreadyVoted || status.loading}>
          {status.loading ? 'Submitting...' : 'Submit vote'}
        </button>
        <Link className="button secondary" to="/voter/verify">Verify receipt</Link>
      </form>
    </div>
  );
};

export default CastVote;
