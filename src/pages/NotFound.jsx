import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="auth-layout">
    <div className="card auth-card stack">
      <h2>Page not found</h2>
      <p className="helper">The page you are looking for does not exist.</p>
      <Link className="button" to="/">Go home</Link>
      <Link className="button secondary" to="/login">Sign in</Link>
    </div>
  </div>
);

export default NotFound;
