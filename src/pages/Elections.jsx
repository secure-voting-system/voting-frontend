import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const Elections = () => {
  const { elections, createElection, startElection, closeElection, suspendElection, resumeElection } = useData();
  const [form, setForm] = useState({ name: '', description: '', startTime: '', endTime: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleCreate = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      const payload = {
        name: form.name,
        description: form.description,
        startTime: Math.floor(new Date(form.startTime).getTime() / 1000),
        endTime: Math.floor(new Date(form.endTime).getTime() / 1000),
      };
      await createElection(payload);
      setForm({ name: '', description: '', startTime: '', endTime: '' });
      setStatus({ loading: false, error: '', success: 'Election created.' });
    } catch (error) {
      setStatus({ loading: false, error: error.response?.data?.message || 'Failed to create election.', success: '' });
    }
  };

  const handleSuspend = async (id) => {
    const reason = window.prompt('Reason for suspension');
    if (!reason) {
      return;
    }
    await suspendElection(id, reason);
  };

  return (
    <div className="stack">
      <div className="card stack">
        <h3>Create election</h3>
        <form className="stack" onSubmit={handleCreate}>
          <div className="field">
            <label>Election name</label>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
          </div>
          <div className="grid cols-2">
            <div className="field">
              <label>Start time</label>
              <input type="datetime-local" value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} required />
            </div>
            <div className="field">
              <label>End time</label>
              <input type="datetime-local" value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} required />
            </div>
          </div>
          {status.error && <div className="badge danger">{status.error}</div>}
          {status.success && <div className="badge success">{status.success}</div>}
          <button className="button" type="submit" disabled={status.loading}>
            {status.loading ? 'Creating...' : 'Create election'}
          </button>
        </form>
      </div>

      <div className="card stack">
        <h3>Existing elections</h3>
        {elections.length === 0 && <p className="helper">No elections created yet.</p>}
        {elections.map((election) => (
          <div key={election.id} className="card" style={{ background: 'var(--surface-2)' }}>
            <div className="stack">
              <div>
                <h4>{election.name}</h4>
                <p className="helper">{election.description}</p>
              </div>
              <div className="grid cols-2">
                <div className={`badge ${election.status === 'active' ? 'success' : 'warning'}`}>{election.status}</div>
                <div className="helper">Votes: {election.totalVotes || 0}</div>
              </div>
              <div className="grid cols-3">
                <button className="button secondary" type="button" onClick={() => startElection(election.id)}>Start</button>
                <button className="button secondary" type="button" onClick={() => closeElection(election.id)}>Close</button>
                {election.status === 'suspended' ? (
                  <button className="button" type="button" onClick={() => resumeElection(election.id)}>Resume</button>
                ) : (
                  <button className="button" type="button" onClick={() => handleSuspend(election.id)}>Suspend</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Elections;
