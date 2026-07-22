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
import AutoAdmin from './components/AutoAdmin';
import Cloacker from './components/Cloacker';
import LandingPage from './components/LandingPage';
import Templates from './components/Templates';
import AdminTemplates from './components/AdminTemplates';
import MentoradosNeto from './components/MentoradosNeto';
import Apis from './components/Apis';
import CartaRastreavel from './components/CartaRastreavel';
import Ingressos from './components/Ingressos';
import Communities from './components/Communities';
import TikTokAds from './components/TikTokAds';
import GringoApp from './components/GringoApp';
import ApiCassino from './components/ApiCassino';
import DesbanWpp from './components/DesbanWpp';
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
        <Route path="communities" element={<Communities />} />
        <Route path="extractor" element={<GroupExtractor />} />
        <Route path="auto-admin" element={<AutoAdmin />} />
        <Route path="cloacker" element={<Cloacker />} />
        <Route path="instances" element={<Instances />} />
        <Route path="templates" element={<Templates />} />
        <Route path="billing" element={<Billing />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="admin-templates" element={<AdminTemplates />} />
        <Route path="mentorados-neto" element={<MentoradosNeto />} />
        <Route path="apis" element={<Apis />} />
        <Route path="carta-rastreavel" element={<CartaRastreavel />} />
        <Route path="ingressos" element={<Ingressos />} />
        <Route path="tiktok-ads" element={<TikTokAds />} />
        <Route path="gringo-app" element={<GringoApp />} />
        <Route path="api-cassino" element={<ApiCassino />} />
        <Route path="desban-wpp" element={<DesbanWpp />} />
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