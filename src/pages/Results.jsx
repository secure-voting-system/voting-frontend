import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { elections, getResults, getCandidatesByElection } = useData();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const resultsData = await Promise.all(
        elections.map(async (election) => {
          const tally = await getResults(election.id);
          const candidates = await getCandidatesByElection(election.id);
          return { election, tally, candidates };
        })
      );
      setResults(resultsData);
    } catch (err) {
      setError('Failed to fetch results');
    } finally {
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
        results.map(({ election, tally, candidates }) => (
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
            <p>Total Votes: {tally?.totalVotes ?? 0}</p>

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
                {Object.entries(tally?.candidateVotes || {}).map(([candidateId, votes]) => {
                  const candidate = candidates.find((item) => item.candidateId === candidateId);
                  const totalVotes = tally?.totalVotes || 0;
                  const percent = totalVotes ? ((votes / totalVotes) * 100).toFixed(2) : '0.00';
                  return (
                    <tr key={candidateId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{candidate?.name || candidateId}</td>
                      <td style={{ padding: '10px' }}>{candidate?.party || 'Independent'}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>{votes}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        {percent}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default Results;
