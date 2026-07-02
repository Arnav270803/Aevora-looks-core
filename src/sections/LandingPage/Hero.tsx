import React, { useEffect, useState } from 'react';

const fontStack = "'Inter', 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

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

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  copy: string;
  tone: string;
};

type FormatProps = {
  label: string;
  ratio: string;
  active?: boolean;
};

type ShotProps = {
  tone: string;
  label?: string;
};

const PlayIcon = ({ dark = false }: { dark?: boolean }) => (
  <span
    style={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      display: 'inline-grid',
      placeItems: 'center',
      background: dark ? 'rgba(7,18,39,0.76)' : 'rgba(255,255,255,0.88)',
      color: dark ? '#ffffff' : '#183057',
      boxShadow: '0 10px 24px rgba(10,25,51,0.16)',
      flexShrink: 0,
    }}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  </span>
);

const SparkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.7 5.2L19 10l-5.3 1.8L12 17l-1.7-5.2L5 10l5.3-1.8L12 3z" />
    <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />
  </svg>
);

const MiniIcon = ({ children, background }: { children: React.ReactNode; background: string }) => (
  <span
    style={{
      width: 42,
      height: 42,
      borderRadius: 13,
      display: 'inline-grid',
      placeItems: 'center',
      background,
      color: '#f05a2a',
      border: '1px solid rgba(255,255,255,0.7)',
      boxShadow: '0 12px 26px rgba(15,28,58,0.08)',
      flexShrink: 0,
    }}
  >
    {children}
  </span>
);

const FeatureCard = ({ icon, title, copy, tone }: FeatureCardProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      minWidth: 0,
    }}
  >
    <MiniIcon background={tone}>{icon}</MiniIcon>
    <div style={{ minWidth: 0 }}>
      <div style={{ color: '#07152f', fontSize: 13, fontWeight: 820, letterSpacing: '-0.02em', marginBottom: 3 }}>
        {title}
      </div>
      <div style={{ color: '#76849a', fontSize: 11.5, fontWeight: 560, lineHeight: 1.35 }}>
        {copy}
      </div>
    </div>
  </div>
);

const FormatTile = ({ label, ratio, active = false }: FormatProps) => (
  <div
    style={{
      minHeight: 72,
      borderRadius: 12,
      border: `1px solid ${active ? 'rgba(240,90,42,0.72)' : 'rgba(255,255,255,0.12)'}`,
      background: active ? 'rgba(240,90,42,0.18)' : 'rgba(255,255,255,0.055)',
      display: 'grid',
      placeItems: 'center',
      gap: 3,
      color: active ? '#ffd9c9' : '#aab7cc',
      fontSize: 10.5,
      fontWeight: 760,
    }}
  >
    <span
      style={{
        width: ratio === '9:16' ? 20 : ratio === '1:1' ? 24 : 30,
        height: ratio === '9:16' ? 34 : ratio === '1:1' ? 24 : 18,
        borderRadius: 4,
        border: '1.5px solid currentColor',
        display: 'block',
      }}
    />
    <span>{label}</span>
  </div>
);

const ShotThumb = ({ tone, label }: ShotProps) => (
  <div
    style={{
      minHeight: 76,
      borderRadius: 12,
      background: tone,
      border: '1px solid rgba(255,255,255,0.16)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <span
      style={{
        position: 'absolute',
        left: 10,
        bottom: 9,
        color: '#ffffff',
        fontSize: 9.5,
        fontWeight: 820,
        textShadow: '0 1px 10px rgba(0,0,0,0.52)',
      }}
    >
      {label}
    </span>
  </div>
);

const AdCard = ({
  title,
  subtitle,
  tone,
  align = 'left',
  dark = false,
}: {
  title: string;
  subtitle: string;
  tone: string;
  align?: 'left' | 'right';
  dark?: boolean;
}) => (
  <div
    style={{
      minHeight: 265,
      borderRadius: 18,
      padding: 18,
      boxSizing: 'border-box',
      background: tone,
      border: '1px solid rgba(255,255,255,0.18)',
      boxShadow: '0 22px 60px rgba(3,13,31,0.28)',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: dark ? '#f9fbff' : '#192138',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: dark
          ? 'radial-gradient(circle at 56% 44%, rgba(255,255,255,0.1), transparent 34%)'
          : 'radial-gradient(circle at 62% 42%, rgba(255,255,255,0.62), transparent 36%)',
        pointerEvents: 'none',
      }}
    />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ fontFamily: "'Georgia', serif", fontSize: 25, lineHeight: 1.02, fontWeight: 700, letterSpacing: '-0.03em' }}>
        {title}
      </div>
    </div>
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
      <span style={{ maxWidth: 112, fontSize: 11, lineHeight: 1.32, fontWeight: 700, opacity: 0.8, textAlign: align }}>
        {subtitle}
      </span>
      <PlayIcon dark={dark} />
    </div>
  </div>
);

const ScriptPanel = () => (
  <div
    style={{
      minHeight: 265,
      borderRadius: 18,
      padding: 18,
      boxSizing: 'border-box',
      background: 'linear-gradient(150deg, rgba(31,47,79,0.94), rgba(10,20,43,0.96))',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 22px 60px rgba(3,13,31,0.3)',
      color: '#eaf0fb',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, fontSize: 13, fontWeight: 820 }}>
      <span>Script</span>
      <SparkIcon />
    </div>
    {[
      ['Tone', 'Brutal calm'],
      ['Hook', "If it looks average, they scroll."],
      ['Benefit', 'Premium variants from one brief.'],
      ['CTA', 'Make the ad they notice.'],
    ].map(([label, value]) => (
      <div key={label} style={{ marginBottom: 12 }}>
        <div style={{ color: '#8e9cb5', fontSize: 10.5, fontWeight: 760, marginBottom: 4 }}>{label}</div>
        <div
          style={{
            borderRadius: 10,
            background: label === 'Tone' ? 'rgba(255,255,255,0.07)' : 'transparent',
            padding: label === 'Tone' ? '7px 9px' : 0,
            color: '#f6f8fc',
            fontSize: 11.5,
            lineHeight: 1.35,
            fontWeight: 620,
          }}
        >
          {value}
        </div>
      </div>
    ))}
  </div>
);

const TimelinePanel = () => (
  <div
    style={{
      gridColumn: 'span 3',
      minHeight: 176,
      borderRadius: 19,
      padding: 17,
      boxSizing: 'border-box',
      background: 'linear-gradient(145deg, rgba(20,35,66,0.96), rgba(7,17,38,0.98))',
      border: '1px solid rgba(255,255,255,0.13)',
      boxShadow: '0 24px 70px rgba(3,13,31,0.3)',
      color: '#eef5ff',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 820 }}>Timeline</div>
      <div style={{ fontSize: 12, color: '#cbd6e8', fontWeight: 760 }}>16s</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.08fr 0.92fr 1fr', gap: 5, marginBottom: 18 }}>
      {['Hook', 'Proof', 'Product', 'CTA'].map((scene, index) => (
        <div
          key={scene}
          style={{
            height: 28,
            borderRadius: 7,
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            fontSize: 10.5,
            fontWeight: 820,
            background: index === 3
              ? 'linear-gradient(135deg, #f05a2a, #ff8d4f)'
              : index === 0
                ? 'linear-gradient(135deg, #775cf2, #594cf0)'
                : 'linear-gradient(135deg, #3367f2, #2449cc)',
          }}
        >
          {scene}
        </div>
      ))}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <PlayIcon dark />
      <div
        style={{
          flex: 1,
          height: 39,
          borderRadius: 10,
          overflow: 'hidden',
          background: 'linear-gradient(90deg, rgba(118,194,55,0.24), rgba(170,220,60,0.48), rgba(118,194,55,0.2))',
          position: 'relative',
        }}
      >
        {Array.from({ length: 42 }, (_, index) => (
          <span
            key={index}
            style={{
              position: 'absolute',
              left: `${index * 2.45}%`,
              top: `${12 + (index % 5) * 4}%`,
              width: '1.3%',
              height: `${28 + (index % 6) * 8}%`,
              borderRadius: 99,
              background: 'rgba(192,242,64,0.82)',
              transform: 'translateY(-50%)',
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const RenderPanel = () => (
  <div
    style={{
      minHeight: 158,
      borderRadius: 18,
      padding: 16,
      background: 'linear-gradient(145deg, rgba(18,32,60,0.96), rgba(8,18,40,0.98))',
      border: '1px solid rgba(255,255,255,0.12)',
      color: '#eaf1fb',
      boxShadow: '0 20px 54px rgba(3,13,31,0.24)',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ fontSize: 13, fontWeight: 820, marginBottom: 14 }}>Render status</div>
    {[
      ['Story Ad', 'Ready', '#93d35c'],
      ['Feed Ad', 'Rendering', '#79a7ff'],
      ['Shorts Ad', 'Queued', '#8792a8'],
    ].map(([name, status, color]) => (
      <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }}>
        <span style={{ fontSize: 11.5, color: '#d9e2ef', fontWeight: 720 }}>{name}</span>
        <span style={{ color, fontSize: 10.5, fontWeight: 820 }}>{status}</span>
      </div>
    ))}
  </div>
);

const CompactStudioPreview = ({ visible, viewport }: { visible: boolean; viewport: Viewport }) => {
  const isPhone = viewport === 'phone';

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
        width: '100%',
        maxWidth: isPhone ? 430 : 720,
        margin: isPhone ? '8px auto 0' : '18px auto 0',
        borderRadius: isPhone ? 24 : 30,
        padding: isPhone ? 12 : 16,
        boxSizing: 'border-box',
        background: 'linear-gradient(145deg, rgba(12,27,55,0.96), rgba(8,20,44,0.98))',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 28px 72px rgba(12,29,58,0.22)',
        color: '#eff5ff',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isPhone ? '1fr 1fr' : '1.1fr 1fr 1fr',
          gap: isPhone ? 9 : 12,
          marginBottom: isPhone ? 10 : 12,
        }}
      >
        <div
          style={{
            minHeight: isPhone ? 160 : 190,
            borderRadius: 18,
            padding: 15,
            background: 'linear-gradient(150deg, rgba(34,51,84,0.98), rgba(10,20,43,0.98))',
            border: '1px solid rgba(255,255,255,0.12)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 820, marginBottom: 18 }}>
            <span>Script</span>
            <SparkIcon />
          </div>
          <div style={{ color: '#9ca9bd', fontSize: 10.5, fontWeight: 760, marginBottom: 5 }}>Hook</div>
          <div style={{ fontSize: isPhone ? 16 : 18, lineHeight: 1.05, fontWeight: 850, letterSpacing: '-0.04em' }}>
            If it looks average, they scroll.
          </div>
        </div>
        <div
          style={{
            minHeight: isPhone ? 160 : 190,
            borderRadius: 18,
            padding: 16,
            background: 'linear-gradient(160deg, #edf3fb 0%, #c3cee0 52%, #f7efe8 100%)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#18223a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontFamily: "'Georgia', serif", fontSize: isPhone ? 22 : 25, lineHeight: 1, fontWeight: 700 }}>
            Glow with intent
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
            <span style={{ fontSize: 10.5, lineHeight: 1.35, fontWeight: 760, opacity: 0.76 }}>Clean skincare scenes.</span>
            <PlayIcon />
          </div>
        </div>
        <div
          style={{
            minHeight: isPhone ? 124 : 190,
            gridColumn: isPhone ? 'span 2' : 'auto',
            borderRadius: 18,
            padding: 16,
            background: 'linear-gradient(160deg, #f7ecdd 0%, #dcb88f 58%, #f4f0e8 100%)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#18223a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontFamily: "'Georgia', serif", fontSize: isPhone ? 24 : 28, lineHeight: 1, fontWeight: 700 }}>
            Stop the scroll.
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
            <span style={{ fontSize: 10.5, lineHeight: 1.35, fontWeight: 760, opacity: 0.76 }}>Built to be noticed.</span>
            <PlayIcon />
          </div>
        </div>
      </div>
      <div
        style={{
          borderRadius: 18,
          padding: isPhone ? 13 : 15,
          background: 'rgba(255,255,255,0.055)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 13, fontSize: 12, fontWeight: 820 }}>
          <span>Timeline</span>
          <span style={{ color: '#c9d5e8' }}>16s</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr 0.9fr', gap: 5, marginBottom: 13 }}>
          {['Hook', 'Proof', 'Product', 'CTA'].map((scene, index) => (
            <div
              key={scene}
              style={{
                height: isPhone ? 24 : 28,
                borderRadius: 7,
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontSize: 10,
                fontWeight: 820,
                background: index === 3
                  ? 'linear-gradient(135deg, #f05a2a, #ff8d4f)'
                  : 'linear-gradient(135deg, #3367f2, #2449cc)',
              }}
            >
              {scene}
            </div>
          ))}
        </div>
        <div
          style={{
            height: isPhone ? 30 : 36,
            borderRadius: 10,
            background: 'linear-gradient(90deg, rgba(118,194,55,0.22), rgba(176,224,64,0.48), rgba(118,194,55,0.2))',
          }}
        />
      </div>
    </div>
  );
};

const StudioCollage = ({ visible, viewport }: { visible: boolean; viewport: Viewport }) => {
  const isLaptop = viewport === 'laptop';
  const isWide = viewport === 'wide';
  const width = isLaptop ? 'min(50vw, 710px)' : isWide ? 'min(42vw, 980px)' : 'min(52vw, 990px)';
  const minWidth = isLaptop ? 620 : 820;
  const translateX = isLaptop ? -6 : isWide ? 0 : 74;
  const visibleTranslateY = isLaptop ? 18 : isWide ? 34 : 36;
  const hiddenTranslateY = visibleTranslateY + 24;

  return (
    <div
      style={{
        position: 'relative',
        width,
        minWidth,
        transform: visible
          ? `perspective(1200px) translateX(${translateX}px) translateY(${visibleTranslateY}px) rotateY(-6deg) rotateZ(-2deg)`
          : `perspective(1200px) translateX(${translateX}px) translateY(${hiddenTranslateY}px) rotateY(-6deg) rotateZ(-2deg)`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.9s ease 0.18s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.18s',
        transformOrigin: 'center left',
      }}
    >
    <div
      style={{
        position: 'absolute',
        inset: '-8% -8% -10% -8%',
        background: 'radial-gradient(circle at 52% 55%, rgba(23,52,99,0.72), transparent 62%)',
        filter: 'blur(8px)',
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '0.98fr 1fr 1fr 1fr 1fr 1fr',
        gridAutoRows: 'minmax(150px, auto)',
        gap: 10,
      }}
    >
      <ScriptPanel />
      <AdCard
        title="Glow with intent"
        subtitle="Clean skincare scenes."
        tone="linear-gradient(160deg, #eef3fb 0%, #bfcce0 48%, #f6efe8 100%)"
      />
      <AdCard
        title="Don't blend in."
        subtitle="Premium product proof."
        dark
        tone="linear-gradient(160deg, #0b1324 0%, #213455 54%, #0a101e 100%)"
      />
      <AdCard
        title="Stop the scroll."
        subtitle="Built to be noticed."
        tone="linear-gradient(160deg, #f7ecdd 0%, #dcb88f 58%, #f4f0e8 100%)"
      />
      <AdCard
        title="Move with purpose."
        subtitle="Energy that supports you."
        dark
        tone="linear-gradient(160deg, #a8674f 0%, #1a2542 62%, #081225 100%)"
      />
      <AdCard
        title="Finance made easy."
        subtitle="Track less. Live more."
        dark
        tone="linear-gradient(160deg, #cab2d9 0%, #5e6d9f 44%, #121a34 100%)"
      />

      <div
        style={{
          gridColumn: 'span 2',
          minHeight: 168,
          borderRadius: 18,
          padding: 16,
          boxSizing: 'border-box',
          background: 'linear-gradient(145deg, rgba(18,32,60,0.97), rgba(8,18,40,0.98))',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 20px 54px rgba(3,13,31,0.24)',
          color: '#eaf1fb',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 820, marginBottom: 12 }}>Shots</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) 72px', gap: 9 }}>
          <ShotThumb label="Hero" tone="linear-gradient(145deg, #e7ddd4, #9aabc5)" />
          <ShotThumb label="Face" tone="linear-gradient(145deg, #1a2848, #d59d7c)" />
          <ShotThumb label="Detail" tone="linear-gradient(145deg, #f6eadc, #bd9676)" />
          <ShotThumb label="Pack" tone="linear-gradient(145deg, #0e1729, #2b3f64)" />
          <div
            style={{
              border: '1px dashed rgba(255,255,255,0.22)',
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center',
              color: '#b8c5d9',
              fontSize: 11,
              fontWeight: 760,
              textAlign: 'center',
            }}
          >
            + Add shot
          </div>
        </div>
      </div>
      <div style={{ gridColumn: 'span 4' }}>
        <TimelinePanel />
      </div>

      <div
        style={{
          gridColumn: 'span 2',
          minHeight: 170,
          borderRadius: 18,
          padding: 16,
          background: 'linear-gradient(145deg, rgba(18,32,60,0.96), rgba(8,18,40,0.98))',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#eaf1fb',
          boxShadow: '0 20px 54px rgba(3,13,31,0.24)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 820, marginBottom: 13 }}>Formats</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 9 }}>
          <FormatTile label="9:16" ratio="9:16" active />
          <FormatTile label="1:1" ratio="1:1" />
          <FormatTile label="4:5" ratio="9:16" />
          <FormatTile label="16:9" ratio="16:9" />
        </div>
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <RenderPanel />
      </div>
      <div
        style={{
          gridColumn: 'span 2',
          minHeight: 170,
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.14)',
          background: 'linear-gradient(145deg, #f8e4d8, #f6f1ea 50%, #20395f)',
          boxShadow: '0 20px 54px rgba(3,13,31,0.24)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 42% 48%, rgba(255,255,255,0.72), transparent 30%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <PlayIcon />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 13,
            height: 5,
            borderRadius: 99,
            background: 'rgba(10,20,43,0.34)',
            overflow: 'hidden',
          }}
        >
          <span style={{ display: 'block', width: '38%', height: '100%', background: '#ffffff' }} />
        </div>
      </div>
    </div>
    </div>
  );
};

const Hero = () => {
  const [visible, setVisible] = useState(false);
  const [primaryHover, setPrimaryHover] = useState(false);
  const viewport = useViewport();

  const isPhone = viewport === 'phone';
  const isTablet = viewport === 'tablet';
  const isCompact = isPhone || isTablet;
  const isLaptop = viewport === 'laptop';
  const isWide = viewport === 'wide';

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.74s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.74s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <section
      style={{
        position: 'relative',
        minHeight: isCompact ? 'auto' : 'calc(100vh - 104px)',
        overflow: 'hidden',
        padding: isPhone
          ? '24px 18px 52px'
          : isTablet
            ? '30px 30px 58px'
            : isLaptop
              ? '34px 38px 52px'
              : isWide
                ? '42px clamp(90px, 6vw, 160px) 62px'
                : '34px clamp(22px, 5.4vw, 116px) 46px',
        boxSizing: 'border-box',
        fontFamily: fontStack,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 12% 82%, rgba(255,143,86,0.22), transparent 28%),
            radial-gradient(circle at 66% 18%, rgba(90,125,190,0.22), transparent 34%),
            ${isCompact
              ? 'linear-gradient(145deg, #fffdf9 0%, #f7f9fe 54%, #e5edf8 100%)'
              : 'linear-gradient(106deg, #fffdf9 0%, #f4f7fd 38%, #d6e0f2 52%, #183055 78%, #081833 100%)'}
          `,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.32,
          backgroundImage: 'radial-gradient(circle, rgba(86,121,192,0.56) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'linear-gradient(90deg, black 0%, black 52%, transparent 84%)',
          WebkitMaskImage: 'linear-gradient(90deg, black 0%, black 52%, transparent 84%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-8%',
          top: '10%',
          width: '58%',
          height: '88%',
          border: '1px solid rgba(240,90,42,0.14)',
          borderRadius: '50%',
          transform: 'rotate(-16deg)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 1720,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isCompact
            ? 'minmax(0, 1fr)'
            : isLaptop
              ? 'minmax(360px, 0.8fr) minmax(650px, 1.2fr)'
              : 'minmax(430px, 0.82fr) minmax(760px, 1.18fr)',
          gap: isCompact ? 30 : 'clamp(28px, 3.2vw, 56px)',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            maxWidth: isCompact ? 760 : 650,
            minWidth: 0,
            paddingTop: isPhone ? 30 : isTablet ? 46 : isLaptop ? 60 : 96,
            margin: isCompact ? '0 auto' : 0,
            textAlign: isCompact ? 'center' : 'left',
          }}
        >
          <div
            style={{
              ...fade(0.02),
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '7px 12px 7px 9px',
              borderRadius: 999,
              border: '1px solid rgba(14,29,57,0.1)',
              background: 'rgba(255,255,255,0.62)',
              color: '#748198',
              boxShadow: '0 10px 30px rgba(15,28,58,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
              marginBottom: isPhone ? 24 : 32,
              backdropFilter: 'blur(16px)',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 12px',
                borderRadius: 999,
                background: 'rgba(255,239,232,0.9)',
                color: '#f05a2a',
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <SparkIcon />
              Open Beta
            </span>
            {!isPhone && <span style={{ fontSize: 13.5, fontWeight: 700 }}>AI ad studio for brands that move fast</span>}
          </div>

          <h1
            style={{
              ...fade(0.1),
              margin: isPhone ? '0 0 20px' : '0 0 24px',
              color: '#07152f',
              fontSize: isPhone
                ? 'clamp(44px, 13vw, 62px)'
                : isTablet
                  ? 'clamp(58px, 9vw, 76px)'
                  : isLaptop
                    ? 'clamp(62px, 5.8vw, 78px)'
                    : isWide
                      ? 'clamp(84px, 3.9vw, 102px)'
                      : 'clamp(72px, 5vw, 92px)',
              lineHeight: isPhone ? 0.98 : 0.95,
              letterSpacing: isPhone ? '-0.052em' : '-0.058em',
              fontWeight: isCompact ? 760 : 740,
              maxWidth: isCompact ? 760 : 700,
            }}
          >
            Ads people{' '}
            <br />
            don't{' '}
            <span
              style={{
                color: '#f05a2a',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              skip.
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 8,
                  right: 4,
                  bottom: 2,
                  height: 8,
                  borderRadius: 999,
                  background: 'rgba(240,90,42,0.2)',
                  zIndex: -1,
                }}
              />
            </span>
          </h1>

          <p
            style={{
              ...fade(0.18),
              margin: '0 0 34px',
              maxWidth: isCompact ? 620 : 520,
              color: '#607087',
              fontSize: isPhone ? 16.5 : 18.5,
              lineHeight: isPhone ? 1.48 : 1.55,
              letterSpacing: '-0.018em',
              fontWeight: 590,
              marginInline: isCompact ? 'auto' : 0,
            }}
          >
            Turn one product brief into premium video ads built to stop the scroll.
          </p>

          <div
            style={{
              ...fade(0.26),
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
              justifyContent: isCompact ? 'center' : 'flex-start',
              marginBottom: 30,
            }}
          >
            <button
              type="button"
              onClick={() => { window.location.href = '/login'; }}
              onMouseEnter={() => setPrimaryHover(true)}
              onMouseLeave={() => setPrimaryHover(false)}
              style={{
                border: '1px solid rgba(240,90,42,0.34)',
                borderRadius: 10,
                padding: 0,
                minWidth: isPhone ? 224 : 235,
                height: isPhone ? 58 : 64,
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: isPhone ? '52px 1fr' : '58px 1fr',
                alignItems: 'stretch',
                background: primaryHover
                  ? 'linear-gradient(135deg, #315f9f, #214476)'
                  : 'linear-gradient(135deg, #f05a2a, #ff7540)',
                color: '#ffffff',
                boxShadow: primaryHover
                  ? '0 20px 42px rgba(31,68,118,0.28)'
                  : '0 18px 38px rgba(240,90,42,0.26)',
                transform: primaryHover ? 'translateY(-1px)' : 'translateY(0)',
                transition: 'background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
                fontFamily: 'inherit',
              }}
            >
              <span
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  background: 'rgba(255,255,255,0.16)',
                  borderRight: '1px solid rgba(255,255,255,0.18)',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </span>
              <span style={{ display: 'grid', placeItems: 'center', fontSize: isPhone ? 15.5 : 16.5, fontWeight: 820, letterSpacing: '-0.02em' }}>
                Make my first ad
              </span>
            </button>

            <button
              type="button"
              style={{
                height: 56,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                border: 'none',
                borderBottom: '1px solid rgba(7,21,47,0.42)',
                background: 'transparent',
                color: '#07152f',
                padding: '0 2px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 15.5,
                fontWeight: 800,
                letterSpacing: '-0.03em',
              }}
            >
              See the workflow
              <span style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid rgba(7,21,47,0.42)', display: 'grid', placeItems: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </div>

          <div
            style={{
              ...fade(0.34),
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCompact ? 'center' : 'flex-start',
              gap: 18,
              color: '#7c8a9f',
              fontSize: 13,
              fontWeight: 720,
              marginBottom: 34,
            }}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#7c8a9f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            For D2C brands, agencies, and performance teams
          </div>

          <div
            style={{
              ...fade(0.42),
              display: 'grid',
              gridTemplateColumns: isPhone ? '1fr' : 'repeat(3, minmax(0, 1fr))',
              gap: isPhone ? 16 : 22,
              maxWidth: 650,
              marginInline: isCompact ? 'auto' : 0,
              textAlign: 'left',
            }}
          >
            <FeatureCard
              icon={<SparkIcon />}
              title="Scroll-stopping hooks"
              copy="Say the sharp thing first."
              tone="rgba(255,239,232,0.86)"
            />
            <FeatureCard
              icon={
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h8l-1 8 11-13h-8l0-7z" />
                </svg>
              }
              title="Fast creative testing"
              copy="Launch more. Learn faster."
              tone="rgba(231,238,255,0.9)"
            />
            <FeatureCard
              icon={
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              }
              title="Brand-safe scripts"
              copy="Punchy, not off-brand."
              tone="rgba(238,232,255,0.92)"
            />
          </div>
        </div>

        <div style={{ minWidth: 0, justifySelf: isCompact ? 'center' : 'end', width: isCompact ? '100%' : 'auto' }}>
          {isCompact ? (
            <CompactStudioPreview visible={visible} viewport={viewport} />
          ) : (
            <StudioCollage visible={visible} viewport={viewport} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
