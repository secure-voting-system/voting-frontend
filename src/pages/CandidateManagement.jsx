import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { UserPlus, GripVertical, CheckCircle2, X } from 'lucide-react';

const CandidateCard = ({ candidate }) => (
  <div className="card glass animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem' }}>
    <GripVertical size={20} style={{ color: 'var(--text-secondary)', cursor: 'grab' }} />
    <div style={{ 
      width: '64px', 
      height: '64px', 
      borderRadius: '1rem', 
      background: 'rgba(255,255,255,0.03)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: '1px solid var(--glass-border)',
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)'
    }}>
      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
        {candidate.name.charAt(0)}
      </span>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{candidate.name}</h4>
        <CheckCircle2 size={18} color="var(--primary)" style={{ filter: 'drop-shadow(0 0 5px var(--primary-glow))' }} />
      </div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{candidate.party || 'Independent'}</p>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>ID: {candidate.candidateId || candidate.id}</p>
    </div>
  </div>
);

const CandidateManagement = () => {
  const { elections, createCandidate, getCandidatesByElection } = useData();
  const [candidates, setCandidates] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    candidateId: '',
    name: '',
    party: '',
    electionId: '',
  });

  useEffect(() => {
    const loadCandidates = async () => {
      if (!selectedElectionId) {
        setCandidates([]);
        return;
      }
      const data = await getCandidatesByElection(selectedElectionId);
      setCandidates(data);
    };
    loadCandidates();
  }, [selectedElectionId, getCandidatesByElection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      electionId: formData.electionId || selectedElectionId,
      candidateId: formData.candidateId || `candidate-${Date.now()}`,
    };
    await createCandidate(payload);
    setShowModal(false);
    setFormData({
      candidateId: '',
      name: '',
      party: '',
      electionId: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Candidate Manifest</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Audit and manage active candidate profiles</p>
        </div>
        <button className="btn-premium" onClick={() => setShowModal(true)}>
          <UserPlus size={20} /> Add Candidate
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
          Filter by Election
        </label>
        <select
          value={selectedElectionId}
          onChange={(e) => setSelectedElectionId(e.target.value)}
          style={{
            width: '100%',
            padding: '0.875rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--glass-border)',
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--text-primary)',
            fontSize: '1rem'
          }}
        >
          <option value="" style={{ background: '#1f2937', color: 'white' }}>Select an election</option>
          {elections.map(election => (
            <option key={election.id} value={election.id} style={{ background: '#1f2937', color: 'white' }}>{election.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {candidates.length === 0 ? (
          <div className="card glass" style={{ padding: '4rem', textAlign: 'center' }}>
            <UserPlus size={64} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Candidates Yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Click "Add Candidate" to create your first candidate profile</p>
          </div>
        ) : (
          candidates.map((candidate) => (
            <CandidateCard 
              key={candidate.candidateId || candidate.id} 
              candidate={candidate}
            />
          ))
        )}
      </div>

      {/* Create Candidate Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div className="card glass animate-fade-in" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem', position: 'relative' }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid var(--glass-border)',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ marginBottom: '2rem' }}>Add New Candidate</h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  Candidate ID (Optional)
                </label>
                <input
                  type="text"
                  name="candidateId"
                  value={formData.candidateId}
                  onChange={handleChange}
                  placeholder="candidate-001"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  Candidate Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., John Doe"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  Party
                </label>
                <input
                  type="text"
                  name="party"
                  value={formData.party}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Progressive Party"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  Election
                </label>
                <select
                  name="electionId"
                  value={formData.electionId || selectedElectionId}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                >
                  <option value="" style={{ background: '#1f2937', color: 'white' }}>Select an election</option>
                  {elections.map(election => (
                    <option key={election.id} value={election.id} style={{ background: '#1f2937', color: 'white' }}>{election.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="sidebar-item"
                  style={{ flex: 1, margin: 0, padding: '1rem', justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-premium"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <UserPlus size={20} /> Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagement;
