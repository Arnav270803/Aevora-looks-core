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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #fffdf9 0%, #f3f7ff 42%, #ffffff 100%)', position: 'relative', overflowX: 'hidden' }}>
      {/* Page texture for sections after the hero */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.36,
          backgroundImage: `
            radial-gradient(circle, rgba(86, 121, 192, 0.26) 1px, transparent 1px)
          `,
          backgroundSize: '22px 22px',
          backgroundPosition: '0 0',
          zIndex: 0
        }}
      />
      
      {/* Subtle radial glow overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 62% 12%, rgba(240, 90, 42, 0.08) 0%, transparent 34%)',
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
