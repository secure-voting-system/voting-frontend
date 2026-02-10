import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isAdmin, isAuthority, isAuditor } = useAuth();
  const role = user?.role?.toUpperCase() || 'VOTER';

  const voterLinks = [
    { label: 'Dashboard', to: '/voter/dashboard' },
    { label: 'Verify Receipt', to: '/voter/verify' },
    { label: 'Results', to: '/voter/results' },
  ];

  const adminLinks = [
    { label: 'Admin Home', to: '/admin/dashboard' },
    { label: 'Elections', to: '/admin/elections' },
    { label: 'Candidates', to: '/admin/candidates' },
  ];

  const auditorLinks = [
    { label: 'Audit Home', to: '/auditor' },
    { label: 'Audit Logs', to: '/auditor/logs' },
  ];

  const links = isAuditor ? auditorLinks : (isAdmin || isAuthority ? adminLinks : voterLinks);

  return (
    <aside className="sidebar">
      <div className="brand">
        <h1>Secure Vote</h1>
        <span>{role} Portal</span>
      </div>

      <div className="stack">
        <div className="card" style={{ background: 'var(--surface-2)' }}>
          <div className="stack">
            <strong>{user?.name || 'User'}</strong>
            <span className="helper">{user?.email}</span>
          </div>
        </div>
      </div>

      <nav className="nav">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="button secondary" onClick={logout}>
        Sign out
      </button>
    </aside>
  );
};

export default Sidebar;
