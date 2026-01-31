import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#007bff',
      padding: '15px 20px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Secure Voting System
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {token ? (
          <>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link to="/cast-vote" style={{ color: 'white', textDecoration: 'none' }}>
              Vote
            </Link>
            <Link to="/results" style={{ color: 'white', textDecoration: 'none' }}>
              Results
            </Link>
            <span>{user.name}</span>
            <button
              onClick={handleLogout}
              style={{ background: '#dc3545', border: 'none' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
