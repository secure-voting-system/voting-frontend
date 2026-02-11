import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const AuditorDashboard = () => {
  const { elections } = useData();

  return (
    <div className="stack">
      <div className="card stack">
        <h3>Auditor workspace</h3>
      </div>

      <div className="grid cols-2">
        <div className="card stack">
          <div className="section-title">Tracked elections</div>
          <p className="helper">{elections.length} elections on record.</p>
          <Link className="button" to="/auditor/logs">View audit logs</Link>
        </div>
        <div className="card stack">
          <div className="section-title">Verification</div>
          <Link className="button secondary" to="/voter/verify">Verify receipt</Link>
        </div>
      </div>
    </div>
  );
};

export default AuditorDashboard;
