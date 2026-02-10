import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { auditAPI } from '../services/api';

const AuditLogs = () => {
  const { elections } = useData();
  const [selectedElection, setSelectedElection] = useState('');
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: '' });

  useEffect(() => {
    if (!selectedElection && elections.length) {
      setSelectedElection(elections[0].id);
    }
  }, [elections, selectedElection]);

  useEffect(() => {
    if (!selectedElection) {
      return;
    }
    setStatus({ loading: true, error: '' });
    auditAPI.logs(selectedElection)
      .then((data) => {
        const items = Array.isArray(data) ? data : data.logs || [];
        setLogs(items);
        setStatus({ loading: false, error: '' });
      })
      .catch(() => {
        setStatus({ loading: false, error: 'Failed to load audit logs.' });
      });
  }, [selectedElection]);

  return (
    <div className="stack">
      <div className="card stack">
        <h3>Audit logs</h3>
        <div className="field">
          <label>Election</label>
          <select value={selectedElection} onChange={(event) => setSelectedElection(event.target.value)}>
            {elections.map((election) => (
              <option key={election.id} value={election.id}>
                {election.name}
              </option>
            ))}
          </select>
        </div>
        {status.loading && <div className="badge warning">Loading logs...</div>}
        {status.error && <div className="badge danger">{status.error}</div>}
      </div>

      <div className="card stack">
        <h3>Entries</h3>
        {logs.length === 0 && <p className="helper">No audit events found for this election.</p>}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Actor</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={`${log.id || log.txId || index}`}>
                  <td>{log.action || log.event || 'Event'}</td>
                  <td>{log.actor || log.userId || 'System'}</td>
                  <td>{log.timestamp ? new Date(log.timestamp * 1000).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
