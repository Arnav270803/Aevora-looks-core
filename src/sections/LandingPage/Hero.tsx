import { useEffect, useRef, useState } from 'react';

type Screen = 'sm' | 'md' | 'lg' | 'xl';

function getScreen(w: number): Screen {
  if (w < 480) return 'sm';
  if (w < 768) return 'md';
  if (w < 1200) return 'lg';
  return 'xl';
}

// ─── TYPE SCALE ──────────────────────────────────────────────────
const FONT_SIZE: Record<Screen, string> = {
  sm: '38px',
  md: '50px',
  lg: '68px',
  xl: '82px',
};

const LINE_HEIGHT: Record<Screen, number> = {
  sm: 1.10,
  md: 1.06,
  lg: 1.02,
  xl: 1.00,
};

const MAX_WIDTH: Record<Screen, number> = {
  sm: 420,
  md: 600,
  lg: 900,
  xl: 1040,
};

const SUBTITLE_SIZE: Record<Screen, string> = {
  sm: '14px',
  md: '15px',
  lg: '16.5px',
  xl: '17.5px',
};

// ─── ANIMATED UNDERLINE (now used on "Aevora" headline word) ─────
function AnimatedUnderline({
  children,
  signed,
  screen,
}: {
  children: React.ReactNode;
  signed: boolean;
  screen: Screen;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (ref.current) setW(ref.current.getBoundingClientRect().width);
    };
    measure();
    const id = setTimeout(measure, 200);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(id);
      window.removeEventListener('resize', measure);
    };
  }, [screen]);

  const h = 22;
  const strokeW = screen === 'sm' ? 2 : screen === 'md' ? 2.4 : 2.8;
  const bottom = screen === 'sm' ? -8 : screen === 'md' ? -11 : -15;

  const pathD = w > 0
    ? `M4,${h * 0.58} C${w * 0.14},${h * 0.22} ${w * 0.38},${h * 0.80} ${w * 0.58},${h * 0.42} S${w * 0.86},${h * 0.16} ${w - 4},${h * 0.52}`
    : '';
  const pathLen = Math.round(w * 1.18);

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}>
      {children}
      {w > 0 && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${w} ${h}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            left: 0,
            bottom,
            width: w,
            height: h,
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          {/* Soft shadow trace */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(232,98,42,0.13)"
            strokeWidth={strokeW + 3}
            strokeLinecap="round"
          />
          {/* Main stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#e8622a"
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: pathLen,
              strokeDashoffset: signed ? 0 : pathLen,
              transition: signed
                ? 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
                : 'none',
            }}
          />
        </svg>
      )}
    </span>
  );
}

// ─── NOISE TEXTURE ───────────────────────────────────────────────
function NoiseOverlay() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.025,
        mixBlendMode: 'multiply',
      }}
    >
      <filter id="noise-hero">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise-hero)" />
    </svg>
  );
}

// ─── DECORATIVE DOT GRID ──────────────────────────────────────────
function DecorativeGrid() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        right: '-8%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '55%',
        maxWidth: 560,
        height: '130%',
        opacity: 0.038,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {Array.from({ length: 18 }, (_, row) =>
        Array.from({ length: 18 }, (_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * 34 + 3}
            cy={row * 34 + 3}
            r="1.5"
            fill="#111"
          />
        ))
      )}
    </svg>
  );
}

// ─── BRAND MARK ───────────────────────────────────────────────────
function BrandMark({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.7s ease 0.04s, transform 0.7s ease 0.04s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 42,
      }}
    >
      {/* Brand name */}
      <span
        style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: '0.22em',
          color: '#1a1a1a',
          textTransform: 'uppercase',
        }}
      >
        Aevora
      </span>

      {/* Separator */}
      <span
        style={{
          display: 'inline-block',
          width: 3,
          height: 3,
          borderRadius: '50%',
          background: '#e8622a',
          flexShrink: 0,
        }}
      />

      {/* Status pill */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '4px 13px',
          borderRadius: 999,
          border: '1px solid rgba(55,138,221,0.20)',
          background: 'rgba(230,241,251,0.55)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#185fa5',
            boxShadow: '0 0 0 2.5px rgba(24,95,165,0.18)',
          }}
        />
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 500,
            letterSpacing: '0.08em',
            color: '#185fa5',
            textTransform: 'uppercase',
            fontFamily: "'DM Sans', -apple-system, 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          Open Beta
        </span>
      </span>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────
const Hero = () => {
  const [visible, setVisible] = useState(false);
  const [signed, setSigned] = useState(false);
  const [screen, setScreen] = useState<Screen>('lg');
  const [primaryHover, setPrimaryHover] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    const s = setTimeout(() => setSigned(true), 900);
    const onResize = () => setScreen(getScreen(window.innerWidth));
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(t);
      clearTimeout(s);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const fade = (delay: number, yOffset = 18): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0px)' : `translateY(${yOffset}px)`,
    transition: `opacity 0.72s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.72s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  const isSmall = screen === 'sm';
  const isMd = screen === 'md';

  return (
    <section
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: isSmall
          ? '4px 22px 16px'
          : isMd
          ? '4px 32px 20px'
          : screen === 'lg'
          ? '4px 48px 24px'
          : '4px 56px 28px',
        minHeight: isSmall ? 'auto' : '100vh',
        background: 'transparent',
      }}
    >


      {/* ── Blue center glow ─────────── */}
      <div
        style={{
          position: 'absolute',
          top: '28%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isSmall ? 300 : 680,
          height: isSmall ? 180 : 420,
          background: 'radial-gradient(ellipse, rgba(55,138,221,0.12) 0%, rgba(55,138,221,0.05) 55%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Blue ambient — top right ──────────── */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -80,
          width: isSmall ? 240 : 520,
          height: isSmall ? 240 : 520,
          background: 'radial-gradient(ellipse at top right, rgba(24,95,165,0.09) 0%, rgba(55,138,221,0.04) 45%, transparent 72%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Blue ambient — bottom left ────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: -40,
          left: -60,
          width: isSmall ? 180 : 340,
          height: isSmall ? 180 : 340,
          background: 'radial-gradient(ellipse at bottom left, rgba(55,138,221,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Blue side line accents ────────────── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 80,
          width: 2,
          height: 120,
          background: 'linear-gradient(180deg, transparent, rgba(55,138,221,0.28), transparent)',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 120,
          width: 2,
          height: 90,
          background: 'linear-gradient(180deg, transparent, rgba(55,138,221,0.22), transparent)',
          zIndex: 2,
        }}
      />

      {/* ── Decorative dot grid ───────────────── */}
      {!isSmall && <DecorativeGrid />}

      {/* ── Noise grain ──────────────────────── */}
      <NoiseOverlay />



      {/* ── Main content ─────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: MAX_WIDTH[screen],
        }}
      >
        {/* Brand mark */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BrandMark visible={visible} />
        </div>

        {/* ── Headline ────────────────────────── */}
        <h1
          style={{
            ...fade(0.10),
            fontFamily: "'Cormorant Garamond', 'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: FONT_SIZE[screen],
            lineHeight: LINE_HEIGHT[screen],
            letterSpacing: '-0.025em',
            color: '#0d0d0d',
            margin: `0 0 ${isSmall ? 22 : 30}px`,
          }}
        >
          {/* Line 1 */}
          <span style={{ display: 'block' }}>
            <AnimatedUnderline signed={signed} screen={screen}>
              <em style={{ fontStyle: 'italic', color: '#1a1a1a' }}>Engineered</em>
            </AnimatedUnderline>
            {' '}
            <span style={{ color: '#e8622a' }}>Video Ads</span>
          </span>

          {/* Line 2 */}
          <span style={{ display: 'block' }}>
            for{' '}
            <span style={{ color: '#185fa5', fontStyle: 'italic' }}>
              Any Brand,
            </span>
            {' '}
            <span
              style={{
                fontWeight: 400,
                color: '#999',
                fontSize: `calc(${FONT_SIZE[screen]} * 0.88)`,
              }}
            >
              in minutes.
            </span>
          </span>
        </h1>

        {/* ── Subtitle ──────────────────────── */}
        <p
          style={{
            ...fade(0.22),
            fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 300,
            fontSize: SUBTITLE_SIZE[screen],
            lineHeight: 1.76,
            color: '#6b7280',
            maxWidth: isSmall ? 330 : isMd ? 450 : 580,
            margin: `0 auto ${isSmall ? 32 : 48}px`,
            letterSpacing: '0.005em',
          }}
        >
          From your product to studio-quality video ads—built for TikTok, Meta, and YouTube, without the time and cost of production.
        </p>

        {/* ── Single CTA ──────────────────────── */}
        <div
          style={{
            ...fade(0.32),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <button
              onMouseEnter={() => setPrimaryHover(true)}
              onMouseLeave={() => setPrimaryHover(false)}
              style={{
                fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 500,
                fontSize: isSmall ? 13.5 : 14,
                letterSpacing: '0.01em',
                color: '#fff',
                background: primaryHover ? '#d4521e' : '#e8622a',
                border: 'none',
                borderRadius: 9,
                padding: isSmall ? '13px 30px' : '14px 36px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                width: isSmall ? '100%' : 'auto',
                boxShadow: primaryHover
                  ? '0 6px 26px rgba(232,98,42,0.42), 0 2px 6px rgba(0,0,0,0.10)'
                  : '0 3px 16px rgba(232,98,42,0.30), 0 1px 3px rgba(0,0,0,0.08)',
                transform: primaryHover ? 'translateY(-1px)' : 'translateY(0)',
                transition: 'background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
              }}
            >
              Start for free
            </button>
            <span
              style={{
                fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
                fontSize: 12,
                fontWeight: 400,
                color: '#9ca3af',
                letterSpacing: '0.01em',
              }}
            >
              No credit card required
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom rule ──────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.07) 30%, rgba(0,0,0,0.07) 70%, transparent 100%)',
          zIndex: 2,
        }}
      />
    </section>
  );
};

export default Hero;