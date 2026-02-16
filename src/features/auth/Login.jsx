import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(email, password);
    if (result.success) {
      // Redirect based on role
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/voter/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card glass animate-fade-in" style={{ maxWidth: '480px', width: '100%', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to your Secure Voting account</p>
        </div>

        {error && (
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--danger)'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn-premium" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '1rem' }}>
            <LogIn size={20} /> Sign In
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              ← Back to home
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Demo Credentials:</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <strong>Admin:</strong> admin@vortex.com / admin123<br />
            <strong>Voter:</strong> voter@vortex.com / voter123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
