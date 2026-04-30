import { useState } from 'react';

const FAQS = [
  {
    q: 'What is Aevora and how does it work?',
    a: 'Aevora is an AI-powered video ad creation platform. You upload a product image, choose a scene style and format, and Aevora generates a high-quality video ad with cinematic motion, sound effects, and music — all automatically.',
  },
  {
    q: 'Do I need video editing skills?',
    a: 'None whatsoever. Aevora handles everything from scene composition to timing and SFX. If you can upload an image and click a button, you can create studio-quality ads.',
  },
  {
    q: 'What output formats are supported?',
    a: 'Aevora exports in MP4 (H.264 / H.265) at up to 4K resolution. Common aspect ratios are supported: 16:9 for YouTube/web, 9:16 for Reels/TikTok, and 1:1 for feed posts.',
  },
  {
    q: 'Can I use my own brand assets?',
    a: 'Yes. On Pro and Scale plans you can upload your logo, set brand colors, and lock typography. Every video Aevora generates will automatically apply your brand identity.',
  },
  {
    q: 'Is there a free trial?',
    a: 'The Starter plan is free forever and includes 3 video exports per month. No credit card is required to sign up. Pro and Scale plans include a 7-day free trial.',
  },
  {
    q: 'How is Aevora different from other AI video tools?',
    a: 'Most AI video tools repurpose text into slideshow-style clips. Aevora is built specifically for product advertising — it understands product context, generates real cinematic motion, and syncs professional-grade SFX rather than royalty-free tracks.',
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      style={{
        width: '100%',
        padding: '80px 40px 100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'transparent',
      }}
    >
      {/* Label */}
      <span
        style={{
          display: 'inline-block',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: '#185fa5',
          fontFamily: "'Inter', -apple-system, sans-serif",
          marginBottom: 14,
        }}
      >
        FAQ
      </span>

      <h2
        style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: '#0d0d0d',
          textAlign: 'center',
          margin: '0 0 14px',
        }}
      >
        Frequently asked questions
      </h2>

      <p
        style={{
          fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
          fontSize: '15.5px',
          fontWeight: 300,
          color: '#4b5563',
          lineHeight: 1.65,
          textAlign: 'center',
          maxWidth: 420,
          margin: '0 0 52px',
        }}
      >
        Everything you need to know before getting started.
      </p>

      {/* Accordion */}
      <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={faq.q}
              style={{
                background: isOpen ? '#fff' : 'rgba(255,255,255,0.55)',
                border: `1.5px solid ${isOpen ? 'rgba(0,0,0,0.09)' : 'rgba(0,0,0,0.06)'}`,
                borderRadius: 14,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                boxShadow: isOpen ? '0 6px 24px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 22px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left' as const,
                  gap: 16,
                }}
              >
                <span style={{
                  fontFamily: "'Inter', -apple-system, sans-serif",
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: '#111827',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.4,
                }}>
                  {faq.q}
                </span>
                <span style={{
                  flexShrink: 0,
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: isOpen ? '#111827' : 'rgba(0,0,0,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease',
                }}>
                  <svg
                    width="12" height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isOpen ? '#fff' : '#6b7280'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}
                  >
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div style={{ padding: '0 22px 20px' }}>
                  <p style={{
                    fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#4b5563',
                    lineHeight: 1.72,
                    margin: 0,
                  }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
