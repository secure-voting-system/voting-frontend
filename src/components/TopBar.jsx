import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

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

const TopBar = ({ path }) => {
  const { user } = useAuth();
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
      <div>
        <h2>{title}</h2>
        <p className="helper">Signed in as {user?.email}</p>
      </div>
      <div className="badge info">Role: {user?.role || 'User'}</div>
    </div>
  );
};

export default TopBar;
