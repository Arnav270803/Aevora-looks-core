const UIHeroNavbar = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 32px', background: '#ffffff', borderBottom: '1px solid #f0f0f0',
    fontFamily: "'Inter', -apple-system, sans-serif",
  }}>
    <span style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 400 }}>Good morning, Alex 👋</span>
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
