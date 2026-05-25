import React, { useState } from 'react';

const steps = [
  {
    num: '01',
    title: 'Product to Ad',
    desc: 'Paste a product URL or upload images — Aevora pulls everything it needs automatically.',
    color: '#3b82f6',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'AI Script & Hooks',
    desc: 'Our AI writes platform-native scripts with attention-grabbing hooks for your target audience.',
    color: '#7c3aed',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2 6h6l-5 3.5 2 6L12 14l-5 3.5 2-6L4 8h6z"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Choose Style',
    desc: 'Select a visual style, voiceover tone, and ad format that matches your brand identity.',
    color: '#059669',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Generate & Export',
    desc: 'Get multiple ad variations ready to publish directly to TikTok, Meta, or YouTube.',
    color: '#e8622a',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
];

const ToolsAvailable = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ padding: '32px 32px 20px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#e8622a', background: '#fff4ef', padding: '3px 8px', borderRadius: 4,
            }}>Workflow</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.4px', lineHeight: 1.2 }}>
            Let's create your next{' '}
            <span style={{ color: '#e8622a' }}>winning ad.</span>
          </h1>
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, maxWidth: 260, textAlign: 'right', lineHeight: 1.5 }}>
          From product to published — in minutes.
        </p>
      </div>

      {/* Step cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'stretch', position: 'relative' }}>
            {/* Card */}
            <div
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: 1,
                background: hovered === i ? '#ffffff' : '#fefefe',
                border: `1px solid ${hovered === i ? step.color + '40' : '#ede9e0'}`,
                borderRadius: 10,
                padding: '18px 20px 20px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: hovered === i
                  ? `0 8px 28px rgba(99,102,241,0.22), 0 2px 8px rgba(99,102,241,0.14)`
                  : '0 4px 14px rgba(99,102,241,0.14), 0 1px 3px rgba(99,102,241,0.08)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent line on hover */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: step.color,
                borderRadius: '10px 10px 0 0',
                opacity: hovered === i ? 1 : 0,
                transition: 'opacity 0.18s ease',
              }} />

              {/* Step number + icon row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#cbd5e1',
                  letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums',
                }}>
                  STEP {step.num}
                </span>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: hovered === i ? step.color + '15' : '#f8fafc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: hovered === i ? step.color : '#94a3b8',
                  transition: 'all 0.18s ease',
                }}>
                  {step.icon}
                </div>
              </div>

              {/* Title */}
              <div style={{
                fontSize: 13.5, fontWeight: 600,
                color: hovered === i ? '#0f172a' : '#1e293b',
                marginBottom: 6, letterSpacing: '-0.1px',
                transition: 'color 0.18s',
              }}>
                {step.title}
              </div>

              {/* Description */}
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, fontWeight: 400 }}>
                {step.desc}
              </div>
            </div>

            {/* Connector arrow between cards */}
            {i < steps.length - 1 && (
              <div style={{
                width: 24, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsAvailable;
