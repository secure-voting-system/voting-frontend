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
        <p className="helper">Manage elections and candidates from one place.</p>
      </div>

      <div className="grid cols-3">
        <div className="card">
          <h3>Total elections</h3>
          <p className="helper">{elections.length}</p>
        </div>
        <div className="card">
          <h3>Active</h3>
          <p className="helper">{active.length}</p>
        </div>
        <div className="card">
          <h3>Upcoming</h3>
          <p className="helper">{pending.length}</p>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card stack">
          <h3>Elections</h3>
          <p className="helper">Create, start, pause, or close elections.</p>
          <Link className="button" to="/admin/elections">Go to elections</Link>
        </div>
        <div className="card stack">
          <h3>Candidates</h3>
          <p className="helper">Register and manage candidates by election.</p>
          <Link className="button" to="/admin/candidates">Manage candidates</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
