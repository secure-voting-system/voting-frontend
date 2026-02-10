import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="auth-layout">
      <div className="card auth-card stack">
        <div>
          <h2>Secure Voting System</h2>
          <p className="helper">Transparent, verifiable elections with auditable results.</p>
        </div>
        <div className="stack">
          <div className="badge info">Blockchain verified • Live audit trails • Role-based access</div>
          <div className="helper">Built for voters, administrators, and auditors.</div>
        </div>
        <div className="stack">
          <Link className="button" to="/login">Sign in</Link>
          <Link className="button secondary" to="/register">Create account</Link>
        </div>
        <div className="helper">Need admin access? Register with your admin secret.</div>
      </div>
    </div>
  );
};

export default Landing;
