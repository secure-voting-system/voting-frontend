import { useState, useEffect } from 'react';
import axios from 'axios';

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/results`);
      setResults(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch results');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading results...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h1>Election Results</h1>
      {results.length === 0 ? (
        <p>No results available yet.</p>
      ) : (
        results.map((election) => (
          <div
            key={election.id}
            style={{
              marginBottom: '30px',
              padding: '20px',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <h2>{election.name}</h2>
            <p>Status: {election.status}</p>
            <p>Total Votes: {election.totalVotes}</p>

            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Candidate</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Party</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Votes</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {election.candidates?.map((candidate) => (
                  <tr key={candidate.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{candidate.name}</td>
                    <td style={{ padding: '10px' }}>{candidate.party}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>{candidate.votes}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      {((candidate.votes / election.totalVotes) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default Results;
