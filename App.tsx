import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Campaigns from './components/Campaigns';
import Contacts from './components/Contacts';
import Instances from './components/Instances';
import Billing from './components/Billing';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import GroupExtractor from './components/GroupExtractor';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/app" element={
        <ProtectedRoute>
          <Layout user={user!} />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="extractor" element={<GroupExtractor />} />
        <Route path="instances" element={<Instances />} />
        <Route path="billing" element={<Billing />} />
        <Route path="admin" element={<AdminPanel />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;