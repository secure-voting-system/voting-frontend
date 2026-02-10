import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (!result.success) {
      setError(result.error);
      return;
    }
    const role = result.user.role?.toUpperCase();
    if (role === 'ADMIN' || role === 'AUTHORITY') {
      navigate('/admin/dashboard');
      return;
    }
    if (role === 'AUDITOR') {
      navigate('/auditor');
      return;
    }
    navigate('/voter/dashboard');
  };

  return (
    <div className="auth-layout">
      <form className="card auth-card stack" onSubmit={handleSubmit}>
        <div className="stack">
          <h2>Sign in</h2>
          <p className="helper">Use your registered email to access the system.</p>
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </div>
        {error && <div className="badge danger">{error}</div>}
        <button type="submit" className="button">Sign in</button>
        <Link className="button secondary" to="/register">Create account</Link>
        <Link className="helper" to="/">Back to home</Link>
      </form>
    </div>
  );
};

export default Login;
