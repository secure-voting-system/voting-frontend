import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Container, PageWrapper, Section } from './Layout';

const AppShell = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} />
      <main className="main">
        <PageWrapper>
          <Container>
            <TopBar path={location.pathname} onToggleSidebar={toggleSidebar} collapsed={collapsed} />
            <Section>
              <div className="page">
                <Outlet />
              </div>
            </Section>
          </Container>
        </PageWrapper>
      </main>
    </div>
  );
};

export default AppShell;
