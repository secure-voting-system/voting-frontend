import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    voterId: '',
    password: '',
    confirmPassword: '',
    role: 'VOTER',
    adminSecret: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const result = await register({
      name: form.name,
      email: form.email,
      voterId: form.voterId,
      password: form.password,
      role: form.role,
      adminSecret: form.adminSecret || undefined,
    });
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate('/login');
  };

  return (
    <div className="auth-layout">
      <form className="card auth-card stack" onSubmit={handleSubmit}>
        <div>
          <h2>Create account</h2>
          <p className="helper">Register as voter, admin, authority, or auditor.</p>
        </div>
        <div className="field">
          <label>Full name</label>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </div>
        <div className="field">
          <label>Voter ID</label>
          <input value={form.voterId} onChange={(event) => setForm({ ...form, voterId: event.target.value })} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </div>
        <div className="field">
          <label>Confirm password</label>
          <input type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required />
        </div>
        <div className="field">
          <label>Role</label>
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="VOTER">Voter</option>
            <option value="ADMIN">Admin</option>
            <option value="AUTHORITY">Authority</option>
            <option value="AUDITOR">Auditor</option>
          </select>
        </div>
        {form.role !== 'VOTER' && (
          <div className="field">
            <label>Admin secret</label>
            <input type="password" value={form.adminSecret} onChange={(event) => setForm({ ...form, adminSecret: event.target.value })} required />
          </div>
        )}
        {error && <div className="badge danger">{error}</div>}
        <button type="submit" className="button">Register</button>
        <Link className="button secondary" to="/login">Back to sign in</Link>
        <Link className="helper" to="/">Back to home</Link>
      </form>
    </div>
  );
};

export default Register;
