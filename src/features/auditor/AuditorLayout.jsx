import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import ThemeToggle from '../../shared/components/ThemeToggle';
import { 
  LayoutDashboard, 
  Search, 
  ShieldCheck, 
  History, 
  Server, 
  LogOut
} from 'lucide-react';

const AuditorLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { title: 'Dashboard', path: '/auditor/dashboard', icon: LayoutDashboard },
    { title: 'Vote Explorer', path: '/auditor/explorer', icon: Search },
    { title: 'Receipt Verify', path: '/auditor/verify', icon: ShieldCheck },
    { title: 'Audit Logs', path: '/auditor/logs', icon: History },
    { title: 'Integrity', path: '/auditor/integrity', icon: Server },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout-root">
      <aside className="nav-sidebar glass animate-fade-in" style={{ borderRight: '1px solid rgba(236, 72, 153, 0.3)' }}>
        <div style={{ padding: '0 1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Audit Trail</h2>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600 }}>Integrity Node</span>
          </div>
          <ThemeToggle />
        </div>

        <nav style={{ flex: 1 }}>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(90deg, rgba(236, 72, 153, 0.15), transparent)',
                color: '#ec4899',
                borderLeftColor: '#ec4899'
              } : {}}
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
        <Outlet />
      </main>
    </div>
  );
};

export default AuditorLayout;
