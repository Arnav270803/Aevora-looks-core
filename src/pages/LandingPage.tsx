import React from 'react';
import {
  LandingNavbar,
  Hero,
  FAQ,
  WhatMakesAevoraDifferent,
  SubscriptionExperience,
  Tutorial,
  Footer
} from '../sections/LandingPage';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0f5ff 0%, #f3f6ff 50%, #fafbff 100%)', position: 'relative' }}>
      {/* Dotted Grid Background with Royal Effect */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.6,
          backgroundImage: `
            radial-gradient(circle, rgba(99, 102, 241, 0.4) 0.8px, transparent 0.8px),
            radial-gradient(circle, rgba(139, 92, 246, 0.2) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '24px 24px, 12px 12px',
          backgroundPosition: '0 0, 6px 6px',
          zIndex: 0
        }}
      />
      
      {/* Subtle Radial Glow Overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
          zIndex: 1
        }}
      />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <LandingNavbar />
        <main>

        </main>
      </div>
    </div>
  );
};

export default LandingPage;
