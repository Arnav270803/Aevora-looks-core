import React from 'react';
import LandingPage from './pages/LandingPage';
import UserInterface from './pages/UserInterface';

function App() {
  const path = window.location.pathname;

  if (path === '/app') {
    return <UserInterface />;
  }

  return <LandingPage />;
}

export default App;
