import React from 'react';
import {
  LandingNavbar,
  Hero,
  FAQ,
  WhatMakesAevoraDifferent,
  SubscriptionExperience,
  Tutorial,
  Footer,
  ProductDemoAndSteps
} from '../sections/LandingPage';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0f5ff 0%, #f3f6ff 50%, #fafbff 100%)', position: 'relative', overflowX: 'hidden' }}>
      {/* Dotted Grid Background with Royal Effect */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.85,
          backgroundImage: `
            radial-gradient(circle, rgba(99, 102, 241, 0.55) 1px, transparent 1px),
            radial-gradient(circle, rgba(139, 92, 246, 0.3) 0.6px, transparent 0.6px)
          `,
          backgroundSize: '18px 18px, 9px 9px',
          backgroundPosition: '0 0, 4.5px 4.5px',
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
          <Hero />
          <ProductDemoAndSteps />
          <WhatMakesAevoraDifferent />
          <Tutorial />
          <SubscriptionExperience />
          <FAQ />
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
