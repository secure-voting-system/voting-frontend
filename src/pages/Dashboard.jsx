import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <div style={{ marginBottom: '30px' }}>
          <h2>Welcome, {user.name}!</h2>
          <p>Role: {user.role}</p>
          <p>Voter ID: {user.voterId}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Cast Vote</h3>
          <p>Participate in active elections</p>
          <button onClick={() => navigate('/cast-vote')}>Vote Now</button>
        </div>

        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>View Results</h3>
          <p>See election results</p>
          <button onClick={() => navigate('/results')}>View Results</button>
        </div>

        {stats && (
          <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Statistics</h3>
            <p>Total Votes: {stats.totalVotes || 0}</p>
            <p>Active Elections: {stats.activeElections || 0}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
