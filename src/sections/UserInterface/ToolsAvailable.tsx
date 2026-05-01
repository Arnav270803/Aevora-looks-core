const steps = [
  {
    title: 'Product to Ad',
    desc: 'Add your product link or upload images',
    bg: '#eff6ff', color: '#3b82f6',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  },
  {
    title: 'AI Script & Hooks',
    desc: 'Generate high-converting scripts instantly',
    bg: '#fdf4ff', color: '#a855f7',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2 6h6l-5 3.5 2 6L12 14l-5 3.5 2-6L4 8h6z"/></svg>,
  },
  {
    title: 'Choose Style',
    desc: 'Pick an ad style, voice and visuals',
    bg: '#f0fdf4', color: '#22c55e',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>,
  },
  {
    title: 'Generate & Export',
    desc: 'Get your ad variations ready to publish',
    bg: '#fff7ed', color: '#f97316',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  },
];

const ToolsAvailable = () => (
  <div style={{ padding: '28px 32px 16px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
      Let's create your next{' '}
      <span style={{ color: '#e8622a' }}>winning ad.</span>
    </h1>
    <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px', fontWeight: 400 }}>
      Turn your product into high-converting video ads in just a few clicks.
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {steps.map((step, i) => (
        <div key={i} style={{
          background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12,
          padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: step.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: step.color, flexShrink: 0,
          }}>
            {step.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{step.title}</div>
            <div style={{ fontSize: 11.5, color: '#9ca3af', lineHeight: 1.4 }}>{step.desc}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      ))}
    </div>
  </div>
);

export default ToolsAvailable;
