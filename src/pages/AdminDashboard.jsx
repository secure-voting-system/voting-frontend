import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const AdminDashboard = () => {
  const { elections } = useData();
  const active = elections.filter((election) => election.status === 'active');
  const pending = elections.filter((election) => election.status === 'pending');

  return (
    <div className="stack">
      <div className="card stack">
        <h3>Admin overview</h3>
      </div>

      <div className="grid cols-3">
        <div className="card stat">
          <span className="helper">Total elections</span>
          <div className="stat-value">{elections.length}</div>
        </div>
        <div className="card stat">
          <span className="helper">Active</span>
          <div className="stat-value">{active.length}</div>
        </div>
        <div className="card stat">
          <span className="helper">Upcoming</span>
          <div className="stat-value">{pending.length}</div>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card stack">
          <div className="section-title">Elections</div>
          <Link className="button" to="/admin/elections">Go to elections</Link>
        </div>
        <div className="card stack">
          <div className="section-title">Candidates</div>
          <Link className="button" to="/admin/candidates">Manage candidates</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
