import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import ThemeToggle from '../../shared/components/ThemeToggle';
import {
    ShieldCheck,
    BarChart3,
    Activity,
    LogOut
} from 'lucide-react';

const AuditorLayout = ({ children }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const links = [
        { title: 'Audit Panel', path: '/auditor/dashboard', icon: ShieldCheck },
        { title: 'Results', path: '/auditor/results', icon: BarChart3 },
        { title: 'System Monitor', path: '/auditor/monitor', icon: Activity },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="layout-root">
            <aside className="nav-sidebar glass animate-fade-in">
                <div style={{ padding: '0 1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Secure Voting</h2>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600 }}>Auditor Console</span>
                    </div>
                    <ThemeToggle />
                </div>

                <nav style={{ flex: 1 }}>
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        >
                            <link.icon size={20} />
                            <span style={{ fontWeight: 600 }}>{link.title}</span>
                        </NavLink>
                    ))}
                </nav>

                <button onClick={handleLogout} className="sidebar-item" style={{ marginTop: 'auto', border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                    <LogOut size={20} />
                    <span style={{ fontWeight: 600 }}>Logout</span>
                </button>
            </aside>
            <main className="main-view animate-fade-in">
                {children}
            </main>
        </div>
    );
};

export default AuditorLayout;
