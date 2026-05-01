import React, { useState } from 'react';

const NavItem = ({
  label, icon, isActive, onClick,
}: {
  label: string; icon: React.ReactElement; isActive: boolean; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', border: 'none', borderRadius: 8, cursor: 'pointer',
      background: isActive ? '#fff7f4' : 'transparent',
      color: isActive ? '#e8622a' : '#6b7280',
      fontSize: 13.5, fontWeight: isActive ? 600 : 400,
      textAlign: 'left', marginBottom: 2, transition: 'all 0.15s', fontFamily: 'inherit',
    }}
    onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = '#185fa5'; } }}
    onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'; } }}
  >
    {icon}
    {label}
  </button>
);

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase', padding: '12px 8px 4px' }}>
    {children}
  </div>
);

const UserHorizontalNavigation = () => {
  const [active, setActive] = useState('Home');
  const nav = (label: string, icon: React.ReactElement) => (
    <NavItem key={label} label={label} icon={icon} isActive={active === label} onClick={() => setActive(label)} />
  );

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#ffffff',
      borderRight: '1px solid #f0f0f0', display: 'flex',
      flexDirection: 'column', fontFamily: "'Inter', -apple-system, sans-serif", flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src="/logo.svg" alt="Aevora" style={{ width: 30, height: 30, objectFit: 'contain' }} />
        <span style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.4px' }}>
          Ae<span style={{ color: '#e8622a' }}>vora</span>
        </span>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '0 8px', overflowY: 'auto' }}>
        {nav('Home', <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>)}

        <SectionLabel>Create</SectionLabel>
        {nav('Create Ad', <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>)}
        {nav('Templates', <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>)}

        <SectionLabel>Tools</SectionLabel>
        {nav('AI Assistant', <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}

        <SectionLabel>Library</SectionLabel>
        {nav('My Ads', <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>)}
        {nav('Brand Kit', <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L3 14.67V21h6.33l10.06-10.06a5.5 5.5 0 0 0 0-7.78z"/></svg>)}
      </div>

      {/* Bottom */}
      <div className="px-3 pb-5 pt-3 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-3 mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">Pro Plan</span>
            <span className="text-[10.5px] font-semibold text-orange-500 bg-orange-50 border border-orange-200 rounded px-2 py-0.5 cursor-pointer">
              Upgrade
            </span>
          </div>
          <div className="text-[11px] text-gray-400 mb-2">1/3 videos this month is done</div>
          <div className="bg-gray-200 rounded-full h-1">
            <div className="bg-orange-500 rounded-full h-1 w-1/3" />
          </div>
        </div>
        <button className="w-full flex items-center gap-2.5 px-1 py-2 border-none bg-transparent text-gray-400 rounded-lg cursor-pointer text-[13.5px] hover:text-blue-700 transition-colors" style={{ fontFamily: 'inherit' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Help & Support
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default UserHorizontalNavigation;
