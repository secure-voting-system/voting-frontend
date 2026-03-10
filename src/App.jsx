import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import { DataProvider } from './shared/context/DataContext';
import { ThemeProvider } from './shared/context/ThemeContext';
import ProtectedRoute from './features/auth/ProtectedRoute';
import AdminLayout from './features/admin/AdminLayout';

// Public Pages
import LandingPage from './features/public/LandingPage';
import Login from './features/auth/Login';
import Register from './features/auth/Register';

// Voter Pages
import VoterDashboard from './features/voter/VoterDashboard';
import VotingPage from './features/voting/VotingPage';

// Admin Pages
import Dashboard from './features/admin/Dashboard';
import ElectionManagement from './features/admin/ElectionManagement';
import CandidateManagement from './features/admin/CandidateManagement';
import VoterApproval from './features/admin/VoterApproval';
import ElectionControl from './features/admin/ElectionControl';
import SystemMonitor from './features/admin/SystemMonitor';

// Auditor Pages
import AuditorLayout from './features/auditor/AuditorLayout';
import AuditorDashboard from './features/auditor/AuditorDashboard';
import VoteExplorer from './features/auditor/VoteExplorer';
import ReceiptVerification from './features/auditor/ReceiptVerification';
import AuditLogs from './features/auditor/AuditLogs';
import IntegrityCheck from './features/auditor/IntegrityCheck';

// Results
import ResultsDashboard from './features/results/ResultsDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Voter Routes */}
            <Route
              path="/voter/dashboard"
              element={
                <ProtectedRoute>
                  <VoterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/voter/vote/:electionId"
              element={
                <ProtectedRoute>
                  <VotingPage />
                </ProtectedRoute>
              }
            />

            {/* Shared Routes (Authenticated users) */}
            <Route path="/results" element={
              <ProtectedRoute>
                <ResultsDashboard />
              </ProtectedRoute>
            } />

            {/* Auditor Routes */}
            <Route path="/auditor" element={
              <ProtectedRoute requireAuditor>
                <AuditorLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AuditorDashboard />} />
              <Route path="explorer" element={<VoteExplorer />} />
              <Route path="verify" element={<ReceiptVerification />} />
              <Route path="logs" element={<AuditLogs />} />
              <Route path="integrity" element={<IntegrityCheck />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="monitor" element={<SystemMonitor />} />
              <Route path="elections" element={<ElectionManagement />} />
              <Route path="candidates" element={<CandidateManagement />} />
              <Route path="voters" element={<VoterApproval />} />
              <Route path="control" element={<ElectionControl />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


