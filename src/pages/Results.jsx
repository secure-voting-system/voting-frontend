import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';

const Results = () => {
  const { elections, getResults, getCandidatesByElection } = useData();
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [tally, setTally] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: '' });

  useEffect(() => {
    if (!selectedElectionId && elections.length) {
      setSelectedElectionId(elections[0].id);
    }
  }, [elections, selectedElectionId]);

  useEffect(() => {
    if (!selectedElectionId) {
      return;
    }
    setStatus({ loading: true, error: '' });
    Promise.all([
      getResults(selectedElectionId),
      getCandidatesByElection(selectedElectionId),
    ])
      .then(([resultsData, candidateData]) => {
        setTally(resultsData);
        setCandidates(candidateData || []);
        setStatus({ loading: false, error: '' });
      })
      .catch(() => {
        setStatus({ loading: false, error: 'Failed to fetch results.' });
      });
  }, [selectedElectionId, getResults, getCandidatesByElection]);

  const totalVotes = tally?.totalVotes || 0;

  return (
    <div className="stack">
      <div className="card stack">
        <h3>Election results</h3>
        <div className="field">
          <label>Select election</label>
          <select value={selectedElectionId} onChange={(event) => setSelectedElectionId(event.target.value)}>
            {elections.map((election) => (
              <option key={election.id} value={election.id}>
                {election.name}
              </option>
            ))}
          </select>
        </div>
        {status.loading && <div className="badge warning">Loading results...</div>}
        {status.error && <div className="badge danger">{status.error}</div>}
      </div>

      <div className="card stack">
        <div className="section-title">Totals</div>
        <p className="helper">Total votes: {totalVotes}</p>
        {status.loading && (
          <div className="stack">
            <div className="skeleton w-40" />
            <div className="skeleton block" />
          </div>
        )}
        {!status.loading && Object.keys(tally?.candidateVotes || {}).length === 0 && (
          <div className="empty-state">No results are available for this election yet.</div>
        )}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Party</th>
                <th>Votes</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tally?.candidateVotes || {}).map(([candidateId, votes]) => {
                const candidate = candidates.find((item) => item.candidateId === candidateId || item.id === candidateId);
                const percent = totalVotes ? ((votes / totalVotes) * 100).toFixed(2) : '0.00';
                return (
                  <tr key={candidateId}>
                    <td>{candidate?.name || candidateId}</td>
                    <td>{candidate?.party || 'Independent'}</td>
                    <td>{votes}</td>
                    <td>{percent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Results;
