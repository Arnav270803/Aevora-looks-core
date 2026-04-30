import { useState } from 'react';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
    title: 'Studio-Quality Output',
    desc: '4K video ads with cinematic motion, professional color grading and synced SFX — no editing skills required.',
    accent: '#e8622a',
    bg: 'rgba(232,98,42,0.06)',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'AI Scene Generation',
    desc: 'Our AI understands your product and automatically crafts scenes that match your brand tone and campaign goal.',
    accent: '#185fa5',
    bg: 'rgba(24,95,165,0.06)',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Brand Style Lock',
    desc: 'Define your colors, fonts, and logo once. Every video Aevora generates stays locked to your brand identity.',
    accent: '#7c3aed',
    bg: 'rgba(124,58,237,0.06)',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: '10× Faster Production',
    desc: 'Go from product image to a publishable video ad in under 5 minutes — saving up to 90% of typical production cost.',
    accent: '#059669',
    bg: 'rgba(5,150,105,0.06)',
  },
];

const WhatMakesAevoraDifferent = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      style={{
        width: '100%',
        padding: '80px 40px 100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'transparent',
      }}
    >
      {/* Section label */}
      <span
        style={{
          display: 'inline-block',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: '#185fa5',
          fontFamily: "'Inter', -apple-system, sans-serif",
          marginBottom: 14,
        }}
      >
        Why Aevora
      </span>

      <h2
        style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: '#0d0d0d',
          textAlign: 'center',
          margin: '0 0 14px',
          maxWidth: 540,
        }}
      >
        What makes Aevora different
      </h2>

      <p
        style={{
          fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
          fontSize: '15.5px',
          fontWeight: 300,
          color: '#4b5563',
          lineHeight: 1.65,
          textAlign: 'center',
          maxWidth: 480,
          margin: '0 0 60px',
        }}
      >
        Purpose-built for performance marketers who need results — not a video editing degree.
      </p>

      {/* Feature grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          width: '100%',
          maxWidth: 1040,
        }}
      >
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === i ? '#fff' : 'rgba(255,255,255,0.60)',
              border: `1.5px solid ${hovered === i ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.06)'}`,
              borderRadius: 18,
              padding: '28px 26px',
              backdropFilter: 'blur(12px)',
              boxShadow: hovered === i
                ? '0 12px 40px rgba(0,0,0,0.09)'
                : '0 2px 12px rgba(0,0,0,0.04)',
              transform: hovered === i ? 'translateY(-3px)' : 'translateY(0)',
              transition: 'all 0.22s ease',
              cursor: 'default',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: f.bg,
                color: f.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 18,
              }}
            >
              {f.icon}
            </div>
            <h3
              style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: '15.5px',
                fontWeight: 600,
                color: '#111827',
                letterSpacing: '-0.02em',
                margin: '0 0 8px',
              }}
            >
              {f.title}
            </h3>
            <p
              style={{
                fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
                fontSize: '13.5px',
                fontWeight: 400,
                color: '#6b7280',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhatMakesAevoraDifferent;
