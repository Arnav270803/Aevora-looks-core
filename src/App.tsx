import React from 'react';
import { useEffect } from 'react';
import { useAuth } from './auth/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import UserInterface from './pages/UserInterface';

const LoadingScreen = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom, #f3f6ff 0%, #fafbff 62%, #ffffff 100%)',
      backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.35) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: '#185fa5',
      fontSize: 13,
      fontWeight: 800,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    }}
  >
    Loading workspace
  </div>
);

const RedirectToLogin = () => {
  useEffect(() => {
    const next = encodeURIComponent(window.location.pathname);
    window.location.replace(`/login?next=${next}`);
  }, []);

  return <LoadingScreen />;
};

function App() {
  const path = window.location.pathname;
  const { status, isAuthenticated } = useAuth();

  if (path === '/app') {
    if (status === 'loading') {
      return <LoadingScreen />;
    }

    if (!isAuthenticated) {
      return <RedirectToLogin />;
    }

    return <UserInterface />;
  }

  if (path === '/login') {
    return <LoginPage />;
  }

  return <LandingPage />;
}

export default App;
