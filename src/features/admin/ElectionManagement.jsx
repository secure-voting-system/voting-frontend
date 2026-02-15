import React, { useState } from 'react';
import { useData } from '../../shared/context/DataContext';
import { Plus, Calendar, Clock, Edit3, Trash2, Search, X } from 'lucide-react';

const ElectionManagement = () => {
  const { elections, createElection, deleteElection } = useData();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    totalVoters: 100
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createElection(formData);
    setShowModal(false);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      totalVoters: 100
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getElectionStatus = (election) => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);
    
    if (now < start) return 'Upcoming';
    if (now > end) return 'Closed';
    return 'Active';
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1>Election Console</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Configure and broadcast voting protocols</p>
        </div>
        <button className="btn-premium" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Protocol
        </button>
      </div>

      <div className="card glass" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search protocols..." 
              style={{ 
                padding: '0.6rem 1rem 0.6rem 2.8rem', 
                borderRadius: '0.5rem', 
                border: '1px solid var(--glass-border)', 
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem', 
                width: '300px' 
              }}
            />
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Protocol Name</th>
                <th>Voting Window</th>
                <th>Total Voters</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((election) => (
                <tr key={election.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{election.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {election.description}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <Calendar size={14} color="var(--primary)" /> 
                        {new Date(election.startDate).toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={14} color="var(--accent)" /> 
                        {new Date(election.endDate).toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{election.totalVoters} voters</span>
                  </td>
                  <td>
                    <span className={`badge-${getElectionStatus(election) === 'Active' ? 'active' : 'pending'}`}>
                      {getElectionStatus(election)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        className="sidebar-item" 
                        style={{ margin: 0, padding: '0.5rem' }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteElection(election.id)}
                        style={{ 
                          padding: '0.5rem', 
                          borderRadius: '0.5rem', 
                          border: '1px solid rgba(239, 68, 68, 0.2)', 
                          background: 'rgba(239, 68, 68, 0.1)', 
                          cursor: 'pointer',
                          color: 'var(--danger)'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Election Modal */}
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

            <h2 style={{ marginBottom: '2rem' }}>Create New Election</h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  Election Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Student Council 2024"
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
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of the election"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
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
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
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
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  Total Voters
                </label>
                <input
                  type="number"
                  name="totalVoters"
                  value={formData.totalVoters}
                  onChange={handleChange}
                  required
                  min="1"
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
                  <Plus size={20} /> Create Election
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionManagement;
