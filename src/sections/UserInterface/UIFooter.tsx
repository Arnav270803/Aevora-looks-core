const stats = [
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    title: 'Save up to 90% time & cost',
    desc: 'No cameras, no crew, no hassle.',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    title: 'High-converting by design',
    desc: 'Hooks, CTAs & formats that perform.',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'On-brand every time',
    desc: 'Auto-apply your brand kit.',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    title: 'Made for performance',
    desc: 'Built for marketers who scale.',
  },
];

const UIFooter = () => (
  <div style={{
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
    padding: '16px 32px 28px', fontFamily: "'Inter', -apple-system, sans-serif",
  }}>
    {stats.map((s, i) => (
      <div key={i} style={{
        background: '#fff', borderRadius: 12, padding: '14px 16px',
        border: '1px solid #f0f0f0', display: 'flex', alignItems: 'flex-start', gap: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ marginTop: 2, flexShrink: 0 }}>{s.icon}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{s.title}</div>
          <div style={{ fontSize: 11.5, color: '#9ca3af' }}>{s.desc}</div>
        </div>
      </div>
    ))}
  </div>
);

export default UIFooter;
