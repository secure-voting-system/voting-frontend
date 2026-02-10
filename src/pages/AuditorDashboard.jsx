import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const AuditorDashboard = () => {
  const { elections } = useData();

  return (
    <div className="stack">
      <div className="card stack">
        <h3>Auditor workspace</h3>
        <p className="helper">Review election activity and verify audit trails.</p>
      </div>

      <div className="grid cols-2">
        <div className="card stack">
          <h3>Tracked elections</h3>
          <p className="helper">{elections.length} elections on record.</p>
          <Link className="button" to="/auditor/logs">View audit logs</Link>
        </div>
        <div className="card stack">
          <h3>Verification</h3>
          <p className="helper">Cross-check blockchain receipts with system records.</p>
          <Link className="button secondary" to="/voter/verify">Verify receipt</Link>
        </div>
      </div>
    </div>
  );
};

export default AuditorDashboard;
