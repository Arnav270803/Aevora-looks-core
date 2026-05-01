import { useState } from 'react';

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const PLATFORMS = ['TikTok', 'Meta', 'YouTube'];

const AdCreationSection = () => {
  const [platform, setPlatform] = useState('TikTok');
  const [goal, setGoal] = useState('Conversions');
  const [adLength, setAdLength] = useState('15 Seconds');
  const [audience, setAudience] = useState('');
  const [productUrl, setProductUrl] = useState('');

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '9px 32px 9px 10px', borderRadius: 8,
    border: '1px solid #e5e7eb', fontSize: 13, color: '#374151',
    background: '#fff', outline: 'none', appearance: 'none' as const,
    cursor: 'pointer', boxSizing: 'border-box', fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6,
  };

  return (
    <div style={{ padding: '16px 32px 28px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

        {/* ── Col 1: Create a new ad ── */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 18px' }}>Create a new ad</h3>

          <label style={labelStyle}>Product Link</label>
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <input
              value={productUrl}
              onChange={e => setProductUrl(e.target.value)}
              placeholder="Paste your product URL (Amazon, Shopify, any store)"
              style={{
                width: '100%', padding: '9px 36px 9px 10px', borderRadius: 8,
                border: '1px solid #e5e7eb', fontSize: 12.5, color: '#374151',
                background: '#fafafa', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
            <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </span>
          </div>

          <div style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', margin: '4px 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
            or
            <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
          </div>

          <label style={labelStyle}>Upload Product Images</label>
          <div style={{
            border: '2px dashed #e5e7eb', borderRadius: 10, padding: '28px 16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 8, background: '#fafafa', cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#93c5fd'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb'; }}
          >
            <div style={{ color: '#93c5fd' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: '#374151', textAlign: 'center', lineHeight: 1.5 }}>
              Drag & drop images here<br />or click to upload
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>JPG, PNG, WebP up to 20MB</div>
          </div>
        </div>

        {/* ── Col 2: Ad Settings ── */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 18px' }}>Ad Settings</h3>

          <label style={labelStyle}>Platform</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => setPlatform(p)} style={{
                flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 12.5, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
                border: platform === p ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                background: platform === p ? '#eff6ff' : '#fff',
                color: platform === p ? '#2563eb' : '#6b7280',
                transition: 'all 0.15s',
              }}>
                {p}
              </button>
            ))}
          </div>

          <label style={labelStyle}>Goal</label>
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <select value={goal} onChange={e => setGoal(e.target.value)} style={selectStyle}>
              <option>Conversions</option>
              <option>Brand Awareness</option>
              <option>Traffic</option>
              <option>Engagement</option>
            </select>
            <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}><ChevronDown /></span>
          </div>

          <label style={labelStyle}>Ad Length</label>
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <select value={adLength} onChange={e => setAdLength(e.target.value)} style={selectStyle}>
              <option>15 Seconds</option>
              <option>30 Seconds</option>
              <option>60 Seconds</option>
            </select>
            <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}><ChevronDown /></span>
          </div>

          <label style={labelStyle}>
            Audience{' '}
            <span style={{ color: '#9ca3af', fontWeight: 400 }}>(Optional)</span>
          </label>
          <input
            value={audience}
            onChange={e => setAudience(e.target.value)}
            placeholder="e.g. Women 18–35, Skincare interest"
            style={{
              width: '100%', padding: '9px 10px', borderRadius: 8, marginBottom: 20,
              border: '1px solid #e5e7eb', fontSize: 13, color: '#374151',
              background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />

          <button style={{
            width: '100%', padding: '12px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 14px rgba(59,130,246,0.35)', fontFamily: 'inherit',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(59,130,246,0.45)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(59,130,246,0.35)'; }}
          >
            Generate Ad Variations
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>
        </div>

        {/* ── Col 3: Preview ── */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 14px' }}>Preview</h3>
          <div style={{
            borderRadius: 12, overflow: 'hidden', background: '#f8fafc',
            border: '1px solid #e5e7eb', aspectRatio: '9/16', maxHeight: 240,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8, position: 'relative',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#9ca3af" stroke="none">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>Preview will appear here</span>
          </div>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '14px 0 0', lineHeight: 1.6 }}>
            We'll generate multiple ad variations with hooks, visuals and calls-to-action optimized for your platform.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdCreationSection;
