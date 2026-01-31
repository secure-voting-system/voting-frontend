import { useState, useEffect } from 'react';
import axios from 'axios';

function CastVote() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/votes/elections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setElections(response.data);
    } catch (err) {
      setError('Failed to fetch elections');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/votes/cast`,
        {
          electionId: selectedElection,
          candidateId: selectedCandidate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Vote cast successfully!');
      setSelectedElection('');
      setSelectedCandidate('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote');
    }
  };

  const currentElection = elections.find((e) => e.id === selectedElection);

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h1>Cast Your Vote</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Election</label>
          <select
            value={selectedElection}
            onChange={(e) => setSelectedElection(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          >
            <option value="">-- Select Election --</option>
            {elections.map((election) => (
              <option key={election.id} value={election.id}>
                {election.name}
              </option>
            ))}
          </select>
        </div>

        {currentElection && (
          <div className="form-group">
            <label>Select Candidate</label>
            <select
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            >
              <option value="">-- Select Candidate --</option>
              {currentElection.candidates?.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name} - {candidate.party}
                </option>
              ))}
            </select>
          </div>
        )}

        {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <button type="submit" disabled={!selectedElection || !selectedCandidate}>
          Cast Vote
        </button>
      </form>

      <div style={{ marginTop: '30px', padding: '20px', background: '#fff3cd', borderRadius: '4px' }}>
        <strong>Important:</strong> Your vote is anonymous and cannot be changed once submitted.
      </div>
    </div>
  );
}

export default CastVote;
