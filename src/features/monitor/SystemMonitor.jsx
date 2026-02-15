import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Activity, Server, Cpu, Wifi, WifiOff, ArrowUp, Clock, Zap, Box } from 'lucide-react';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler
);

const generateTPS = () => Math.floor(Math.random() * 80) + 20;

const SystemMonitor = () => {
    const [blockHeight, setBlockHeight] = useState(184729);
    const [tpsHistory, setTpsHistory] = useState(
        Array.from({ length: 20 }, () => generateTPS())
    );
    const [tpsLabels, setTpsLabels] = useState(
        Array.from({ length: 20 }, (_, i) => {
            const d = new Date();
            d.setSeconds(d.getSeconds() - (20 - i) * 3);
            return d.toLocaleTimeString();
        })
    );
    const [uptime, setUptime] = useState(0);
    const [currentTPS, setCurrentTPS] = useState(generateTPS());

    const peers = [
        { id: 'node-alpha-01', region: 'US-East', status: 'online', latency: '12ms', load: 34 },
        { id: 'node-beta-02', region: 'EU-West', status: 'online', latency: '28ms', load: 56 },
        { id: 'node-gamma-03', region: 'AP-South', status: 'online', latency: '45ms', load: 23 },
        { id: 'node-delta-04', region: 'US-West', status: 'online', latency: '8ms', load: 41 },
        { id: 'node-epsilon-05', region: 'EU-Central', status: 'offline', latency: '—', load: 0 },
        { id: 'node-zeta-06', region: 'AP-East', status: 'online', latency: '52ms', load: 67 },
    ];

    const onlinePeers = peers.filter(p => p.status === 'online').length;

    // Simulate live updates
    useEffect(() => {
        const interval = setInterval(() => {
            const newTPS = generateTPS();
            setCurrentTPS(newTPS);
            setBlockHeight(prev => prev + Math.floor(Math.random() * 3) + 1);
            setTpsHistory(prev => {
                const updated = [...prev.slice(1), newTPS];
                return updated;
            });
            setTpsLabels(prev => {
                const updated = [...prev.slice(1), new Date().toLocaleTimeString()];
                return updated;
            });
        }, 3000);

        const uptimeInterval = setInterval(() => {
            setUptime(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(uptimeInterval);
        };
    }, []);

    const formatUptime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const tpsChartData = {
        labels: tpsLabels,
        datasets: [
            {
                label: 'TPS',
                data: tpsHistory,
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: 'rgba(0,0,0,0.5)',
                pointBorderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 5,
                borderWidth: 2,
            },
        ],
    };

    const tpsChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(6, 182, 212, 0.3)',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: (ctx) => `${ctx.raw} tx/s`,
                },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(148, 163, 184, 0.06)', drawBorder: false },
                ticks: { color: '#64748b', font: { family: "'Outfit', sans-serif", size: 10 }, maxRotation: 0, maxTicksLimit: 8 },
            },
            y: {
                grid: { color: 'rgba(148, 163, 184, 0.06)', drawBorder: false },
                ticks: { color: '#64748b', font: { family: "'Outfit', sans-serif" } },
                suggestedMin: 0,
                suggestedMax: 120,
            },
        },
    };

    return (
        <div style={{ maxWidth: '1200px' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1>System Monitor</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '-0.5rem' }}>
                    Real-time blockchain network health and performance
                </p>
            </header>

            {/* Stats Row */}
            <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
                <div className="card glass animate-fade-in">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(6, 182, 212, 0.1)' }}>
                            <Box size={20} color="#06b6d4" />
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Block Height</span>
                    </div>
                    <div className="stat-glow" style={{ fontFamily: "'Outfit', monospace" }}>
                        #{blockHeight.toLocaleString()}
                    </div>
                </div>

                <div className="card glass animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(139, 92, 246, 0.1)' }}>
                            <Zap size={20} color="#8b5cf6" />
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Current TPS</span>
                    </div>
                    <div className="stat-glow">{currentTPS} tx/s</div>
                </div>

                <div className="card glass animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(16, 185, 129, 0.1)' }}>
                            <Server size={20} color="#10b981" />
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Peers Online</span>
                    </div>
                    <div className="stat-glow">{onlinePeers}/{peers.length}</div>
                </div>

                <div className="card glass animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(236, 72, 153, 0.1)' }}>
                            <Clock size={20} color="#ec4899" />
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Uptime</span>
                    </div>
                    <div style={{ fontFamily: "'Outfit', monospace", fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {formatUptime(uptime)}
                    </div>
                </div>
            </div>

            {/* TPS Chart + Network Health */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card glass" style={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Transactions Per Second</h2>
                        <span className="badge-active" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>● LIVE</span>
                    </div>
                    <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
                        <Line data={tpsChartData} options={tpsChartOptions} />
                    </div>
                </div>

                <div className="card glass" style={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0' }}>Network Health</h2>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            width: '120px', height: '120px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: `conic-gradient(#10b981 ${(onlinePeers / peers.length) * 360}deg, rgba(148, 163, 184, 0.1) 0deg)`,
                            position: 'relative',
                        }}>
                            <div style={{
                                width: '96px', height: '96px', borderRadius: '50%',
                                background: 'var(--glass-bg)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
                                    {Math.round((onlinePeers / peers.length) * 100)}%
                                </span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>HEALTHY</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                Consensus: <span style={{ color: '#10b981' }}>Active</span>
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                                Last block: {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Peer Status Table */}
            <div className="card glass">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Peer Nodes</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Node ID</th>
                            <th>Region</th>
                            <th>Status</th>
                            <th>Latency</th>
                            <th>CPU Load</th>
                        </tr>
                    </thead>
                    <tbody>
                        {peers.map(peer => (
                            <tr key={peer.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Cpu size={16} color="var(--text-secondary)" />
                                        <code style={{
                                            fontSize: '0.8rem', padding: '0.15rem 0.4rem',
                                            borderRadius: '0.25rem', background: 'rgba(6, 182, 212, 0.08)',
                                            color: '#06b6d4',
                                        }}>
                                            {peer.id}
                                        </code>
                                    </div>
                                </td>
                                <td style={{ fontWeight: 600 }}>{peer.region}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {peer.status === 'online' ? (
                                            <>
                                                <Wifi size={14} color="#10b981" />
                                                <span className="badge-active" style={{ fontSize: '0.7rem' }}>Online</span>
                                            </>
                                        ) : (
                                            <>
                                                <WifiOff size={14} color="#ef4444" />
                                                <span className="badge-urgent" style={{ fontSize: '0.7rem' }}>Offline</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{peer.latency}</td>
                                <td style={{ width: '180px' }}>
                                    {peer.status === 'online' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                flex: 1, height: '6px', borderRadius: '999px',
                                                background: 'rgba(148, 163, 184, 0.1)', overflow: 'hidden',
                                            }}>
                                                <div style={{
                                                    width: `${peer.load}%`, height: '100%', borderRadius: '999px',
                                                    background: peer.load > 60
                                                        ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                                                        : 'linear-gradient(90deg, #10b981, #06b6d4)',
                                                    transition: 'width 0.5s ease',
                                                }} />
                                            </div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', minWidth: '30px' }}>
                                                {peer.load}%
                                            </span>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SystemMonitor;
