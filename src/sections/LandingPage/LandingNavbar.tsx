import React from 'react';

const LandingNavbar = () => {
  return (
    <div style={{ width: '100%' }}>
      <nav
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: 'transparent',
          padding: '0 40px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Left Side: Logo & Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/logo.svg" alt="Aevora Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <span style={{ 
              fontSize: '17px', 
              fontWeight: 700, 
              color: '#1a1a1a', 
              letterSpacing: '-0.5px',
              lineHeight: 1
            }}>
              Ae<span style={{ color: '#FF6B35' }}>vora</span>
            </span>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            {['Solutions', 'Resources', 'Pricing'].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#374151',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  letterSpacing: '-0.1px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = '#185fa5';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color = '#374151';
                }}
              >
                {link}
                {(link === 'Solutions' || link === 'Resources') && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Right Side: CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              color: '#374151',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 14px',
              transition: 'color 0.2s ease',
              letterSpacing: '-0.1px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#185fa5';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#374151';
            }}
          >
            Login
          </button>

          <button
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
              color: '#374151',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              padding: '9px 18px',
              borderRadius: '8px',
              transition: 'background 0.2s ease, border-color 0.2s ease',
              letterSpacing: '-0.1px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#eff6ff';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#93c5fd';
              (e.currentTarget as HTMLButtonElement).style.color = '#185fa5';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb';
              (e.currentTarget as HTMLButtonElement).style.color = '#374151';
            }}
          >
            Book Demo
          </button>

          <button
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, #FF6B35 0%, #E85A20 100%)',
              border: 'none',
              cursor: 'pointer',
              padding: '9px 18px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(232,90,32,0.25)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              letterSpacing: '-0.1px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(232,90,32,0.35)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(232,90,32,0.25)';
            }}
          >
            Get Started →
          </button>
        </div>
      </nav>
    </div>
  );
};

export default LandingNavbar;
