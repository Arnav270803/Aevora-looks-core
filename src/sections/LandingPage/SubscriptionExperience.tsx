import { useState } from 'react';

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    tagline: 'Try Aevora with no commitment.',
    features: [
      '3 video exports / month',
      '720p resolution',
      'Basic scene styles',
      'Aevora watermark',
      'Email support',
    ],
    cta: 'Get started free',
    ctaStyle: 'ghost',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/ month',
    tagline: 'For growing brands & creators.',
    features: [
      '50 video exports / month',
      '4K resolution',
      'Full scene style library',
      'No watermark',
      'SFX & music library',
      'Priority rendering',
      'Priority support',
    ],
    cta: 'Start Pro trial',
    ctaStyle: 'primary',
    highlight: true,
  },
  {
    name: 'Scale',
    price: '$149',
    period: '/ month',
    tagline: 'For agencies and high-volume teams.',
    features: [
      'Unlimited video exports',
      '4K resolution',
      'Full scene style library',
      'No watermark',
      'SFX & music library',
      'API access',
      'Custom brand presets',
      'Dedicated account manager',
    ],
    cta: 'Contact sales',
    ctaStyle: 'ghost',
    highlight: false,
  },
];

const SubscriptionExperience = () => {
  const [hovered, setHovered] = useState<number | null>(null);

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
          color: '#e8622a',
          fontFamily: "'Inter', -apple-system, sans-serif",
          marginBottom: 14,
        }}
      >
        Pricing
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
        Simple, transparent pricing
      </h2>

      <p
        style={{
          fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
          fontSize: '15.5px',
          fontWeight: 300,
          color: '#4b5563',
          lineHeight: 1.65,
          textAlign: 'center',
          maxWidth: 440,
          margin: '0 0 56px',
        }}
      >
        Start free, scale when you're ready. No hidden fees.
      </p>

      {/* Pricing cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
          width: '100%',
          maxWidth: 960,
          alignItems: 'stretch',
        }}
      >
        {PLANS.map((plan, i) => (
          <div
            key={plan.name}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: plan.highlight ? 'linear-gradient(160deg, #1a2a6c 0%, #185fa5 100%)' : (hovered === i ? '#fff' : 'rgba(255,255,255,0.65)'),
              border: plan.highlight
                ? '1.5px solid rgba(255,255,255,0.12)'
                : `1.5px solid ${hovered === i ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.07)'}`,
              borderRadius: 20,
              padding: '32px 28px',
              backdropFilter: 'blur(12px)',
              boxShadow: plan.highlight
                ? '0 20px 60px rgba(24,95,165,0.30), 0 4px 16px rgba(0,0,0,0.10)'
                : hovered === i ? '0 12px 40px rgba(0,0,0,0.09)' : '0 2px 12px rgba(0,0,0,0.04)',
              transform: plan.highlight ? 'scale(1.03)' : hovered === i ? 'translateY(-3px)' : 'translateY(0)',
              transition: 'all 0.22s ease',
              display: 'flex',
              flexDirection: 'column' as const,
              position: 'relative' as const,
            }}
          >
            {plan.highlight && (
              <div style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #e8622a 0%, #d4521e 100%)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.10em',
                textTransform: 'uppercase' as const,
                padding: '4px 14px',
                borderRadius: 999,
                whiteSpace: 'nowrap' as const,
                fontFamily: "'Inter', -apple-system, sans-serif",
                boxShadow: '0 2px 8px rgba(232,98,42,0.40)',
              }}>
                Most Popular
              </div>
            )}

            <div style={{ marginBottom: 6 }}>
              <span style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                color: plan.highlight ? 'rgba(255,255,255,0.65)' : '#9ca3af',
              }}>
                {plan.name}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
              <span style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: '36px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: plan.highlight ? '#fff' : '#111827',
                lineHeight: 1,
              }}>
                {plan.price}
              </span>
              {plan.period && (
                <span style={{
                  fontFamily: "-apple-system, sans-serif",
                  fontSize: '13px',
                  color: plan.highlight ? 'rgba(255,255,255,0.55)' : '#9ca3af',
                }}>
                  {plan.period}
                </span>
              )}
            </div>

            <p style={{
              fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
              fontSize: '13px',
              color: plan.highlight ? 'rgba(255,255,255,0.65)' : '#6b7280',
              lineHeight: 1.5,
              margin: '0 0 24px',
            }}>
              {plan.tagline}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
              {plan.features.map((feat) => (
                <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? 'rgba(255,255,255,0.7)' : '#059669'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{
                    fontFamily: "-apple-system, sans-serif",
                    fontSize: '13.5px',
                    color: plan.highlight ? 'rgba(255,255,255,0.80)' : '#374151',
                  }}>
                    {feat}
                  </span>
                </li>
              ))}
            </ul>

            <button
              style={{
                marginTop: 'auto',
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: '13.5px',
                fontWeight: 600,
                padding: '12px 0',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                width: '100%',
                ...(plan.ctaStyle === 'primary'
                  ? {
                      background: 'linear-gradient(135deg, #e8622a 0%, #d4521e 100%)',
                      color: '#fff',
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(232,98,42,0.35)',
                    }
                  : plan.highlight
                  ? {
                      background: 'rgba(255,255,255,0.12)',
                      color: '#fff',
                      border: '1.5px solid rgba(255,255,255,0.22)',
                    }
                  : {
                      background: 'transparent',
                      color: '#374151',
                      border: '1.5px solid rgba(0,0,0,0.12)',
                    }),
              }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Trust note */}
      <p style={{
        fontFamily: "-apple-system, sans-serif",
        fontSize: '12.5px',
        color: '#9ca3af',
        marginTop: 32,
        textAlign: 'center',
      }}>
        No credit card required to start · Cancel anytime · Billed monthly
      </p>
    </section>
  );
};

export default SubscriptionExperience;
