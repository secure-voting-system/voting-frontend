import React, { useMemo } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const titleMap = {
  '/voter/dashboard': 'Voter dashboard',
  '/voter/verify': 'Receipt verification',
  '/voter/results': 'Election results',
  '/admin/dashboard': 'Admin overview',
  '/admin/elections': 'Election management',
  '/admin/candidates': 'Candidate registry',
  '/auditor': 'Auditor workspace',
  '/auditor/logs': 'Audit logs',
};

const TopBar = ({ path, onToggleSidebar }) => {
  const { logout } = useAuth();
  const title = useMemo(() => {
    if (titleMap[path]) {
      return titleMap[path];
    }
    if (path.startsWith('/voter/vote/')) {
      return 'Cast vote';
    }
    return path.replace('/', ' ').trim() || 'Overview';
  }, [path]);

  return (
    <div className="topbar">
      <div className="topbar-title">
        <button type="button" className="button ghost" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Menu size={20} strokeWidth={2} />
        </button>
        <h2>{title}</h2>
      </div>
      <div className="topbar-actions">
        <ThemeToggle />
        <button type="button" className="button secondary" onClick={logout}>
          Sign out
        </button>
      </div>
    </div>
  );
};

export default TopBar;
