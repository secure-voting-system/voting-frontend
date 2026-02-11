import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';

const Candidates = () => {
  const { elections, getCandidatesByElection, createCandidate } = useData();
  const [selectedElection, setSelectedElection] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ candidateId: '', name: '', party: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  useEffect(() => {
    if (!selectedElection && elections.length) {
      setSelectedElection(elections[0].id);
    }
  }, [elections, selectedElection]);

  useEffect(() => {
    if (!selectedElection) {
      return;
    }
    getCandidatesByElection(selectedElection)
      .then((data) => setCandidates(data || []))
      .catch(() => setCandidates([]));
  }, [selectedElection, getCandidatesByElection]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedElection) {
      return;
    }
    setStatus({ loading: true, error: '', success: '' });
    try {
      await createCandidate({
        electionId: selectedElection,
        candidateId: form.candidateId,
        name: form.name,
        party: form.party,
      });
      setForm({ candidateId: '', name: '', party: '' });
      const updated = await getCandidatesByElection(selectedElection);
      setCandidates(updated || []);
      setStatus({ loading: false, error: '', success: 'Candidate added.' });
    } catch (error) {
      setStatus({ loading: false, error: error.response?.data?.message || 'Failed to add candidate.', success: '' });
    }
  };

  return (
    <div className="stack">
      <div className="card stack">
        <div className="section-title">Register candidate</div>
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
        <form className="stack" onSubmit={handleSubmit}>
          <div className="grid cols-2">
            <div className="field">
              <label>Candidate ID</label>
              <input value={form.candidateId} onChange={(event) => setForm({ ...form, candidateId: event.target.value })} required />
            </div>
            <div className="field">
              <label>Name</label>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </div>
          </div>
          <div className="field">
            <label>Party</label>
            <input value={form.party} onChange={(event) => setForm({ ...form, party: event.target.value })} required />
          </div>
          {status.error && <div className="badge danger">{status.error}</div>}
          {status.success && <div className="badge success">{status.success}</div>}
          <button className="button" type="submit" disabled={status.loading}>
            {status.loading ? 'Saving...' : 'Add candidate'}
          </button>
        </form>
      </div>

      <div className="card stack">
        <div className="section-title">Candidate list</div>
        {candidates.length === 0 && <div className="empty-state">No candidates registered yet.</div>}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Party</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.candidateId || candidate.id}>
                  <td>{candidate.candidateId || candidate.id}</td>
                  <td>{candidate.name}</td>
                  <td>{candidate.party || 'Independent'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
