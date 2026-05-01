import { useState } from 'react';

const TABS = ['Create', 'Edit', 'Collaborate', 'Translate', 'Publish'];

const ProductDemoAndSteps = () => {
  const [activeTab, setActiveTab] = useState('Create');
  const [muted, setMuted] = useState(true);

  return (
    <section
      style={{
        width: '100%',
        padding: '0px 40px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'transparent',
      }}
    >
      {/* Outer card — gradient background */}
      <div
        style={{
          width: '100%',
          maxWidth: 1100,
          borderRadius: 28,
          background: 'linear-gradient(135deg, #c7d7f5 0%, #b8c8f0 30%, #a5b8ee 60%, #9baee8 100%)',
          padding: '28px 28px 28px',
          boxShadow: '0 24px 64px rgba(99,120,220,0.18), 0 4px 16px rgba(0,0,0,0.08)',
          position: 'relative',
        }}
      >
        {/* Tab bar row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            position: 'relative',
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'rgba(255,255,255,0.18)',
              borderRadius: 999,
              padding: '5px 6px',
            }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isActive ? '#2d4fc4' : 'rgba(255,255,255,0.85)',
                    background: isActive ? '#fff' : 'transparent',
                    border: isActive ? '1.5px solid rgba(45,79,196,0.25)' : '1.5px solid transparent',
                    borderRadius: 999,
                    padding: '8px 22px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Mute button — top right */}
          <button
            onClick={() => setMuted(!muted)}
            style={{
              position: 'absolute',
              right: 0,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#2d4fc4',
              border: '2.5px solid rgba(255,255,255,0.35)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(45,79,196,0.35)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            {muted ? (
              /* muted icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ) : (
              /* unmuted icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Inner white window */}
        <div
          style={{
            background: '#fff',
            borderRadius: 18,
            padding: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          }}
        >
          {/* Video / image frame */}
          <div
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: 12,
              overflow: 'hidden',
              border: '2px solid rgba(99,149,230,0.35)',
              background: '#000',
            }}
          >
            <video
              src="/DRINK COMMERCIAL - Daniel Schiffer style.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDemoAndSteps;
