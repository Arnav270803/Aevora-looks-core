const UIHeroNavbar = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '11px 32px', 
    background: 'rgba(255,255,255,0.92)', 
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #f0f0f0', 
    fontFamily: "'Inter', -apple-system, sans-serif",
    position: 'sticky', top: 0, zIndex: 20,
    backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.18) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  }}>
    {/* Premium search bar */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#f4f5f7', border: '1px solid #e9eaec', borderRadius: 10,
      padding: '8px 14px', width: 320, transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#c7d2fe'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 3px rgba(99,102,241,0.07)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e9eaec'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        placeholder="Search ads, templates, brand kits…"
        style={{
          border: 'none', background: 'transparent', outline: 'none',
          fontSize: 13, color: '#374151', width: '100%', fontFamily: 'inherit',
        }}
      />
      <kbd style={{
        fontSize: 10, color: '#9ca3af', background: '#e9eaec', borderRadius: 4,
        padding: '2px 6px', letterSpacing: '0.02em', flexShrink: 0,
      }}>⌘K</kbd>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button style={{
        display: 'flex', alignItems: 'center', gap: 7,
        background: '#e8622a', color: '#fff', border: 'none', borderRadius: 8,
        padding: '9px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(232,98,42,0.28)', fontFamily: 'inherit',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Create New Ad
      </button>
      <button style={{
        background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8,
        width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#6b7280',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </button>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', background: '#3b82f6',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
      }}>
        A
      </div>
    </div>
  </div>
);

export default UIHeroNavbar;
