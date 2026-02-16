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

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/elections"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <ElectionManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/candidates"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <CandidateManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/voters"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <VoterApproval />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/control"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <ElectionControl />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

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


