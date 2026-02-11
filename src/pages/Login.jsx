import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, PageWrapper, Section } from '../components/Layout';

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
    <PageWrapper className="page-full">
      <Container className="container-narrow">
        <Section className="section-center">
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
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <div className="badge danger">{error}</div>}
            <button type="submit" className="button">Sign in</button>
            <Link className="button secondary" to="/register">Create account</Link>
            <Link className="helper" to="/">Back to home</Link>
          </form>
        </Section>
      </Container>
    </PageWrapper>
  );
};

export default Login;
