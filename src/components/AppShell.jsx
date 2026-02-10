import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppShell = () => {
  const location = useLocation();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <TopBar path={location.pathname} />
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
