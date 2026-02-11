import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, ShieldCheck, ClipboardList, BarChart3, Users } from 'lucide-react';

const Sidebar = ({ collapsed }) => {
  const { user, logout, isAdmin, isAuthority, isAuditor } = useAuth();
  const role = user?.role?.toUpperCase() || 'VOTER';
  const initials = user?.name ? user.name.split(' ').map((part) => part[0]).join('').slice(0, 2) : 'SV';

  const voterLinks = [
    { label: 'Dashboard', to: '/voter/dashboard', icon: Home },
    { label: 'Verify Receipt', to: '/voter/verify', icon: ShieldCheck },
    { label: 'Results', to: '/voter/results', icon: BarChart3 },
  ];

  const adminLinks = [
    { label: 'Admin Home', to: '/admin/dashboard', icon: Home },
    { label: 'Elections', to: '/admin/elections', icon: ClipboardList },
    { label: 'Candidates', to: '/admin/candidates', icon: Users },
  ];

  const auditorLinks = [
    { label: 'Audit Home', to: '/auditor', icon: Home },
    { label: 'Audit Logs', to: '/auditor/logs', icon: ClipboardList },
  ];

  const links = isAuditor ? auditorLinks : (isAdmin || isAuthority ? adminLinks : voterLinks);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-mark">SV</div>
        {!collapsed && (
          <div className="brand-title">
            <h1>Secure Vote</h1>
            <span>{role} Portal</span>
          </div>
        )}
      </div>

      <div className="sidebar-user">
        <div className="avatar">{initials}</div>
        {!collapsed && (
          <div className="stack stack-tight">
            <strong>{user?.name || 'User'}</strong>
            <span className="helper">{user?.email}</span>
          </div>
        )}
      </div>

      <nav className="nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {Icon && <Icon size={20} strokeWidth={2} />}
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="button secondary" onClick={logout}>
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
