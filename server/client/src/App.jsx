import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './client/src/components/Layout/Layout';
import { AppStoreProvider } from './store/AppStore';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Discussions from './pages/Discussions';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Teams from './pages/Teams';
import Calendar from './pages/Calendar';
import Roles from './pages/Roles';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Sora:wght@300;400;500;600;700&display=swap');

  :root {
    color-scheme: light;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Sora', 'Segoe UI', sans-serif;
    font-size: 16px;
    background: radial-gradient(circle at top, #f7f3eb, #eef6f7 45%, #f3f7f4);
    color: #1b1f1d;
  }
`;

const theme = {
  colors: {
    background: 'transparent',
    surface: '#ffffff',
    surfaceAlt: '#f8f4ed',
    text: '#1b1f1d',
    textSecondary: '#5b6460',
    sidebar: '#ffffff',
    border: '#e6e0d6',
    header: 'rgba(255, 255, 255, 0.92)',
    inputBackground: '#ffffff',
    hover: '#f3ede4',
    primary: '#0f766e',
    primaryStrong: '#0b5f58',
    accent: '#f59e0b'
  }
};

export default function App() {
  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem('app_user') || 'null');
    } catch (error) {
      return null;
    }
  };

  const getUserRole = () => {
    const user = getCurrentUser();
    if (!user) return 'collaborateur';
    const role = `${user.role || user.roles || user.profil || ''}`.toLowerCase();
    if (!role) return 'collaborateur';
    if (role === 'admin') return 'administrateur';
    return role;
  };

  const isAuthenticated = () => Boolean(getCurrentUser());

  const RequireAuth = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const RequireRole = ({ allow, children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    const role = getUserRole();
    if (!allow.includes(role)) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppStoreProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route
              path="/teams"
              element={
                <RequireRole allow={['administrateur']}>
                  <Teams />
                </RequireRole>
              }
            />
            <Route path="/calendar" element={<Calendar />} />
            <Route
              path="/reports"
              element={
                <RequireRole allow={['administrateur']}>
                  <Reports />
                </RequireRole>
              }
            />
            <Route
              path="/roles"
              element={
                <RequireRole allow={['administrateur']}>
                  <Roles />
                </RequireRole>
              }
            />
          </Route>
        </Routes>
      </AppStoreProvider>
    </ThemeProvider>
  );
}
