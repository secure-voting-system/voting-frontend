import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VoterDashboard from './pages/VoterDashboard';
import CastVote from './pages/CastVote';
import ReceiptVerify from './pages/ReceiptVerify';
import Results from './pages/Results';
import AdminDashboard from './pages/AdminDashboard';
import Elections from './pages/Elections';
import Candidates from './pages/Candidates';
import AuditorDashboard from './pages/AuditorDashboard';
import AuditLogs from './pages/AuditLogs';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/voter"
              element={
                <ProtectedRoute roles={["VOTER", "ADMIN", "AUTHORITY", "AUDITOR"]}>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/voter/dashboard" replace />} />
              <Route path="dashboard" element={<VoterDashboard />} />
              <Route path="vote/:electionId" element={<CastVote />} />
              <Route path="verify" element={<ReceiptVerify />} />
              <Route path="results" element={<Results />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["ADMIN", "AUTHORITY"]}>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="elections" element={<Elections />} />
              <Route path="candidates" element={<Candidates />} />
            </Route>

            <Route
              path="/auditor"
              element={
                <ProtectedRoute roles={["AUDITOR", "ADMIN"]}>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<AuditorDashboard />} />
              <Route path="logs" element={<AuditLogs />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;


