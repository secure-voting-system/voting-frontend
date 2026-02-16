import React, { useState, useEffect } from 'react';
import { useData } from '../../shared/context/DataContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { BarChart3, Trophy, Users, TrendingUp, RefreshCw, ChevronDown } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ResultsDashboard = () => {
    const { elections, candidates, votes } = useData();
    const [selectedElection, setSelectedElection] = useState('');
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-select first election
    useEffect(() => {
        if (elections.length > 0 && !selectedElection) {
            setSelectedElection(elections[0].id);
        }
    }, [elections, selectedElection]);

    // Live updates - refresh every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date());
            setIsRefreshing(true);
            setTimeout(() => setIsRefreshing(false), 500);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const election = elections.find(e => e.id === selectedElection);
    const electionCandidates = candidates.filter(c => c.electionId === selectedElection);
    const electionVotes = votes.filter(v => v.electionId === selectedElection);
    const totalVotes = electionCandidates.reduce((sum, c) => sum + (c.votes || 0), 0);
    const maxVotes = Math.max(...electionCandidates.map(c => c.votes || 0), 1);
    const winner = electionCandidates.length > 0
        ? electionCandidates.reduce((a, b) => (a.votes || 0) > (b.votes || 0) ? a : b)
        : null;

    const barColors = [
        'rgba(6, 182, 212, 0.85)',
        'rgba(139, 92, 246, 0.85)',
        'rgba(16, 185, 129, 0.85)',
        'rgba(236, 72, 153, 0.85)',
        'rgba(245, 158, 11, 0.85)',
        'rgba(59, 130, 246, 0.85)',
    ];

    const barBorders = [
        '#06b6d4', '#8b5cf6', '#10b981', '#ec4899', '#f59e0b', '#3b82f6',
    ];

    const chartData = {
        labels: electionCandidates.map(c => c.name),
        datasets: [
            {
                label: 'Votes',
                data: electionCandidates.map(c => c.votes || 0),
                backgroundColor: electionCandidates.map((_, i) => barColors[i % barColors.length]),
                borderColor: electionCandidates.map((_, i) => barBorders[i % barBorders.length]),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(6, 182, 212, 0.3)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label: (ctx) => {
                        const pct = totalVotes > 0 ? ((ctx.raw / totalVotes) * 100).toFixed(1) : 0;
                        return `${ctx.raw} votes (${pct}%)`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(148, 163, 184, 0.08)', drawBorder: false },
                ticks: { color: '#94a3b8', font: { family: "'Outfit', sans-serif", weight: 600 } },
            },
            y: {
                grid: { color: 'rgba(148, 163, 184, 0.08)', drawBorder: false },
                ticks: { color: '#64748b', font: { family: "'Outfit', sans-serif" } },
                beginAtZero: true,
            },
        },
    };

    const doughnutData = {
        labels: electionCandidates.map(c => c.name),
        datasets: [
            {
                data: electionCandidates.map(c => c.votes || 0),
                backgroundColor: barColors.slice(0, electionCandidates.length),
                borderColor: 'rgba(0, 0, 0, 0.3)',
                borderWidth: 2,
                hoverOffset: 8,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    font: { family: "'Outfit', sans-serif", size: 12, weight: 500 },
                    padding: 16,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(6, 182, 212, 0.3)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 10,
            },
        },
    };

    const turnout = election ? ((election.votedCount || totalVotes) / Math.max(election.totalVoters || 1, 1) * 100).toFixed(1) : 0;

    return (
        <div style={{ maxWidth: '1200px' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1>Election Results</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '-0.5rem' }}>
                        Real-time vote counts and analytics
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <RefreshCw size={14} className={isRefreshing ? '' : ''} style={{ animation: isRefreshing ? 'spin 0.5s linear' : 'none' }} />
                        <span>Updated {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={selectedElection}
                            onChange={(e) => setSelectedElection(e.target.value)}
                            style={{
                                padding: '0.6rem 2.5rem 0.6rem 1rem',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--glass-border)',
                                background: 'var(--glass-bg)',
                                color: 'var(--text-primary)',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                fontFamily: "'Outfit', sans-serif",
                                cursor: 'pointer',
                                appearance: 'none',
                                minWidth: '220px',
                            }}
                        >
                            {elections.map(e => (
                                <option key={e.id} value={e.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                                    {e.title}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
                    </div>
                </div>
            </header>

            {/* Stats Row */}
            <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
                <div className="card glass animate-fade-in">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(6, 182, 212, 0.1)' }}>
                            <BarChart3 size={20} color="#06b6d4" />
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Total Votes</span>
                    </div>
                    <div className="stat-glow">{totalVotes.toLocaleString()}</div>
                </div>

                <div className="card glass animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(16, 185, 129, 0.1)' }}>
                            <Users size={20} color="#10b981" />
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Turnout</span>
                    </div>
                    <div className="stat-glow">{turnout}%</div>
                </div>

                <div className="card glass animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(139, 92, 246, 0.1)' }}>
                            <TrendingUp size={20} color="#8b5cf6" />
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Candidates</span>
                    </div>
                    <div className="stat-glow">{electionCandidates.length}</div>
                </div>

                <div className="card glass animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(236, 72, 153, 0.1)' }}>
                            <Trophy size={20} color="#ec4899" />
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Leading</span>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {winner ? winner.name : '—'}
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card glass" style={{ height: '420px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Vote Distribution</h2>
                        <span className="badge-active" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                            {election?.status === 'active' ? '● LIVE' : election?.status?.toUpperCase() || 'N/A'}
                        </span>
                    </div>
                    <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
                        {electionCandidates.length > 0 ? (
                            <Bar data={chartData} options={chartOptions} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                                No candidates registered for this election
                            </div>
                        )}
                    </div>
                </div>

                <div className="card glass" style={{ height: '420px', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0' }}>Vote Share</h2>
                    <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
                        {electionCandidates.length > 0 ? (
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                                No data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Candidate Results Table */}
            <div className="card glass">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Candidate Rankings</h2>
                {electionCandidates.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Candidate</th>
                                <th>Role</th>
                                <th>Votes</th>
                                <th>Share</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...electionCandidates]
                                .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                                .map((candidate, index) => {
                                    const pct = totalVotes > 0 ? ((candidate.votes || 0) / totalVotes * 100).toFixed(1) : 0;
                                    const isWinner = index === 0 && (candidate.votes || 0) > 0;
                                    return (
                                        <tr key={candidate.id}>
                                            <td>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 800, fontSize: '0.875rem',
                                                    background: isWinner ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'rgba(148, 163, 184, 0.1)',
                                                    color: isWinner ? 'white' : 'var(--text-secondary)',
                                                    boxShadow: isWinner ? '0 0 15px rgba(6, 182, 212, 0.4)' : 'none',
                                                }}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <span style={{ fontWeight: 700 }}>{candidate.name}</span>
                                                    {isWinner && (
                                                        <span style={{
                                                            padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem',
                                                            fontWeight: 700, background: 'rgba(6, 182, 212, 0.15)',
                                                            color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)',
                                                        }}>
                                                            ★ LEADING
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{candidate.role || '—'}</td>
                                            <td style={{ fontWeight: 700 }}>{(candidate.votes || 0).toLocaleString()}</td>
                                            <td style={{ fontWeight: 600, color: barBorders[index % barBorders.length] }}>{pct}%</td>
                                            <td style={{ width: '200px' }}>
                                                <div style={{
                                                    width: '100%', height: '8px', borderRadius: '999px',
                                                    background: 'rgba(148, 163, 184, 0.1)', overflow: 'hidden',
                                                }}>
                                                    <div style={{
                                                        width: `${(candidate.votes || 0) / maxVotes * 100}%`,
                                                        height: '100%', borderRadius: '999px',
                                                        background: `linear-gradient(90deg, ${barBorders[index % barBorders.length]}, ${barColors[index % barColors.length]})`,
                                                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    }} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        <BarChart3 size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p>No candidates registered for this election yet.</p>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default ResultsDashboard;
