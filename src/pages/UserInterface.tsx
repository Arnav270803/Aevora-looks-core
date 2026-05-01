import React from 'react';
import {
  UserHorizontalNavigation,
  UIHeroNavbar,
  ToolsAvailable,
  AdCreationSection,
  UIFooter,
} from '../sections/UserInterface';

const UserInterface = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <UserHorizontalNavigation />

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto',
        background: '#ffffff',
        backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.35) 1.5px, transparent 1.5px)',
        backgroundSize: '20px 20px',
      }}>
        <UIHeroNavbar />
        <main style={{ flex: 1 }}>
          <ToolsAvailable />
          <AdCreationSection />
          <UIFooter />
        </main>
      </div>
    </div>
  );
};

export default UserInterface;
