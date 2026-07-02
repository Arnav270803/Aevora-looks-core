import React, { useEffect, useState } from 'react';

const navFont = "'Inter', 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

type Viewport = 'phone' | 'tablet' | 'laptop' | 'desktop' | 'wide';

const getViewport = (width: number): Viewport => {
  if (width < 640) return 'phone';
  if (width < 980) return 'tablet';
  if (width < 1440) return 'laptop';
  if (width < 2200) return 'desktop';
  return 'wide';
};

const useViewport = () => {
  const [viewport, setViewport] = useState<Viewport>(() => (
    typeof window === 'undefined' ? 'desktop' : getViewport(window.innerWidth)
  ));

  useEffect(() => {
    const handleResize = () => setViewport(getViewport(window.innerWidth));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};

const LandingNavbar = () => {
  const viewport = useViewport();
  const isPhone = viewport === 'phone';
  const isTablet = viewport === 'tablet';
  const isLaptop = viewport === 'laptop';
  const showLinks = !isPhone && !isTablet;
  const showDemo = !isPhone;

  const goLogin = () => {
    window.location.href = '/login';
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        padding: isPhone
          ? '14px 14px 0'
          : isTablet
            ? '18px 24px 0'
            : isLaptop
              ? '22px 36px 0'
              : '26px clamp(18px, 5vw, 108px) 0',
        boxSizing: 'border-box',
        pointerEvents: 'none',
      }}
    >
      <nav
        style={{
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: 1540,
          minHeight: isPhone ? 60 : isTablet ? 68 : 78,
          margin: '0 auto',
          padding: isPhone ? '9px 9px 9px 16px' : isTablet ? '10px 11px 10px 20px' : '11px 14px 11px 28px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: isPhone ? 10 : isLaptop ? 16 : 26,
          borderRadius: isPhone ? 22 : 28,
          border: '1px solid rgba(255,255,255,0.62)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.74), rgba(204,219,244,0.28))',
          boxShadow: '0 24px 70px rgba(15,28,58,0.12), inset 0 1px 0 rgba(255,255,255,0.88)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          fontFamily: navFont,
        }}
      >
        <button
          type="button"
          onClick={() => { window.location.href = '/'; }}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            flexShrink: 0,
            fontFamily: 'inherit',
          }}
        >
          <img src="/logo.svg" alt="Aevora Logo" style={{ width: isPhone ? 32 : 38, height: isPhone ? 32 : 38, objectFit: 'contain' }} />
          <span style={{ color: '#07152f', fontSize: isPhone ? 23 : 27, fontWeight: 800, letterSpacing: '-0.045em' }}>
            Aevora
          </span>
        </button>

        <div
          style={{
            display: showLinks ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isLaptop ? 34 : 'clamp(22px, 4vw, 64px)',
            flex: 1,
            minWidth: 0,
          }}
        >
          {[
            ['Platform', true],
            ['AI Studio', true],
            ['Resources', true],
            ['Pricing', false],
          ].map(([label, hasChevron]) => (
            <a
              key={label as string}
              href={label === 'Pricing' ? '#pricing' : '#features'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                color: '#13213b',
                textDecoration: 'none',
                fontSize: isLaptop ? 14.5 : 15.5,
                fontWeight: 650,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
              {hasChevron && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              )}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: isPhone ? 9 : 14, flexShrink: 0, marginLeft: showLinks ? 0 : 'auto' }}>
          <button
            type="button"
            style={{
              display: showDemo ? 'inline-block' : 'none',
              border: '1px solid rgba(255,255,255,0.54)',
              borderRadius: 13,
              background: 'linear-gradient(135deg, rgba(43,78,136,0.46), rgba(27,54,100,0.42))',
              color: '#ffffff',
              padding: isTablet ? '14px 20px' : '16px 25px',
              minWidth: isTablet ? 118 : 130,
              fontFamily: 'inherit',
              fontSize: isTablet ? 14 : 15,
              fontWeight: 760,
              cursor: 'pointer',
              boxShadow: '0 12px 30px rgba(15,35,75,0.12), inset 0 1px 0 rgba(255,255,255,0.32)',
            }}
          >
            Book Demo
          </button>

          <button
            type="button"
            onClick={goLogin}
            style={{
              overflow: 'hidden',
              border: '1px solid rgba(241,112,63,0.42)',
              borderRadius: 13,
              background: 'linear-gradient(135deg, #284f8f 0%, #173463 48%, #f05a2a 49%, #ff7a3d 100%)',
              color: '#ffffff',
              padding: 0,
              minWidth: isPhone ? 112 : isTablet ? 164 : isLaptop ? 164 : 182,
              height: isPhone ? 44 : 52,
              display: 'grid',
              gridTemplateColumns: isPhone ? '1fr 42px' : '1fr 54px',
              alignItems: 'stretch',
              fontFamily: 'inherit',
              fontSize: isPhone ? 13.5 : isTablet || isLaptop ? 14.5 : 15,
              fontWeight: 770,
              cursor: 'pointer',
              boxShadow: '0 16px 34px rgba(20,49,94,0.24), 0 10px 24px rgba(240,90,42,0.18)',
            }}
          >
            <span style={{ display: 'grid', placeItems: 'center' }}>{isPhone ? 'Start' : 'Start Creating'}</span>
            <span
              style={{
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, rgba(255,121,61,0.96), rgba(232,80,33,0.96))',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default LandingNavbar;
