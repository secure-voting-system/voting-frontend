import React, { useState } from 'react';
import { useData } from '../../shared/context/DataContext';
import { BarChart3, ChevronDown, Activity, Users, Award, RefreshCcw } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ThemeToggle from '../../shared/components/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResultsDashboard = () => {
  const { elections, getCandidatesByElection } = useData();
  
  // Default to first active or closed election, or just the first one
  const defaultElection = elections.find(e => e.status !== 'pending') || elections[0];
  const [selectedElectionId, setSelectedElectionId] = useState(defaultElection?.id || '');
  
  const navigate = useNavigate();

  const selectedElection = elections.find(e => e.id === selectedElectionId);
  const candidates = getCandidatesByElection(selectedElectionId);

  // Sort candidates by votes (descending)
  const sortedCandidates = [...candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  const chartData = {
    labels: sortedCandidates.map(c => c.name),
    datasets: [
      {
        label: 'Votes',
        data: sortedCandidates.map(c => c.votes || 0),
        backgroundColor: [
          'rgba(6, 182, 212, 0.8)',   // Cyan
          'rgba(139, 92, 246, 0.8)',  // Violet
          'rgba(16, 185, 129, 0.8)',  // Emerald
          'rgba(245, 158, 11, 0.8)',  // Amber
          'rgba(236, 72, 153, 0.8)'   // Pink
        ],
        borderColor: [
          'rgb(6, 182, 212)',
          'rgb(139, 92, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(236, 72, 153)'
        ],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(6, 182, 212, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.y} votes (${((context.parsed.y / (selectedElection?.votedCount || 1)) * 100).toFixed(1)}%)`
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: "'Outfit', sans-serif",
            size: 13,
            weight: 500
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            family: "'Outfit', sans-serif",
          },
          precision: 0
        },
        beginAtZero: true,
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <BarChart3 size={28} color="var(--primary)" />
              <h1 style={{ margin: 0 }}>Live Results</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>Real-time cryptographic tallying</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ThemeToggle />
            <button onClick={() => navigate(-1)} className="sidebar-item" style={{ margin: 0, padding: '0.75rem 1.5rem' }}>
               Back
            </button>
          </div>
        </div>

        {elections.length === 0 ? (
          <div className="card glass" style={{ padding: '4rem', textAlign: 'center' }}>
            <Activity size={64} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Elections Found</h2>
            <p style={{ color: 'var(--text-secondary)' }}>There are no active or closed elections to display results for.</p>
          </div>
        ) : (
          <>
            {/* Election Selector & Status */}
            <div className="card glass animate-fade-in" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Select Election
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={selectedElectionId} 
                    onChange={(e) => setSelectedElectionId(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '1rem 1.25rem', 
                      appearance: 'none', 
                      borderRadius: '1rem', 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid var(--glass-border)', 
                      color: 'var(--text-primary)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {elections.map(e => (
                      <option key={e.id} value={e.id} style={{ background: '#0f172a', color: 'white' }}>
                        {e.title} {e.status === 'active' ? '(Live)' : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={20} style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--primary)' }} />
                </div>
              </div>

              {selectedElection && (
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Status</div>
                    {selectedElection.status === 'active' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 1rem', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', animation: 'corePulse 2s infinite' }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>LIVE TALLY</span>
                      </div>
                    ) : (
                      <div className="badge-active" style={{ fontSize: '0.85rem' }}>CLOSED / FINAL</div>
                    )}
                  </div>
                  
                  <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }}></div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Votes</div>
                    <div className="stat-glow" style={{ fontSize: '1.5rem' }}>{selectedElection.votedCount}</div>
                  </div>
                  
                  <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }}></div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Turnout</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                      {Math.round((selectedElection.votedCount / selectedElection.totalVoters) * 100)}%
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            {selectedElection && (
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
                
                {/* Chart Section */}
                <div className="card glass animate-fade-in" style={{ animationDelay: '0.1s', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Activity size={20} color="var(--primary)" />
                      Vote Distribution
                    </h2>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <RefreshCcw size={14} /> Auto-updating
                    </button>
                  </div>
                  <div style={{ flex: 1, minHeight: '400px', position: 'relative' }}>
                    {sortedCandidates.length > 0 ? (
                      <Bar data={chartData} options={chartOptions} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        No candidates found for this election
                      </div>
                    )}
                  </div>
                </div>

                {/* Leaderboard Section */}
                <div className="card glass animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={20} color="var(--accent)" />
                    Leaderboard
                  </h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sortedCandidates.length > 0 ? (
                      sortedCandidates.map((candidate, index) => {
                        const percentage = selectedElection.votedCount > 0 
                          ? ((candidate.votes || 0) / selectedElection.votedCount) * 100 
                          : 0;
                          
                        return (
                          <div key={candidate.id} style={{ 
                            padding: '1rem', 
                            background: index === 0 ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.1), transparent)' : 'rgba(255,255,255,0.02)', 
                            borderRadius: '1rem',
                            border: index === 0 ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid var(--glass-border)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            {/* Background Progress Bar */}
                            <div style={{ 
                              position: 'absolute', 
                              left: 0, 
                              top: 0, 
                              bottom: 0, 
                              width: `${percentage}%`, 
                              background: index === 0 ? 'rgba(6, 182, 212, 0.05)' : 'rgba(255,255,255,0.02)',
                              zIndex: 0,
                              transition: 'width 1s ease-out'
                            }}></div>
                            
                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ 
                                width: '28px', 
                                height: '28px', 
                                borderRadius: '50%', 
                                background: index === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                color: index === 0 ? 'white' : 'var(--text-secondary)',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                boxShadow: index === 0 ? '0 0 10px var(--primary)' : 'none'
                              }}>
                                {index + 1}
                              </div>
                              
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: index === 0 ? 'var(--primary)' : 'var(--text-primary)' }}>
                                  {candidate.name}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                  {candidate.role}
                                </div>
                              </div>
                              
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{candidate.votes || 0}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  {percentage.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No candidate data available</p>
                    )}
                  </div>
                </div>
                
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;
