import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Voter Pages
import VoterDashboard from './pages/VoterDashboard';
import VotingPage from './pages/VotingPage';
import Results from './pages/Results';

// Admin Pages
import Dashboard from './pages/Dashboard';
import ElectionManagement from './pages/ElectionManagement';
import CandidateManagement from './pages/CandidateManagement';
import VoterApproval from './pages/VoterApproval';
import ElectionControl from './pages/ElectionControl';

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
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <Results />
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


