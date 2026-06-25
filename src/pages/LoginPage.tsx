import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

type Screen = 'mobile' | 'tablet' | 'desktop';

const getScreen = (width: number): Screen => {
  if (width < 720) return 'mobile';
  if (width < 1080) return 'tablet';
  return 'desktop';
};

const Brand = () => (
  <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
    <img src="/logo.svg" alt="Aevora Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
    <span
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 17,
        fontWeight: 750,
        color: '#111827',
        letterSpacing: '-0.4px',
      }}
    >
      Ae<span style={{ color: '#e8622a' }}>vora</span>
    </span>
  </a>
);

const LoginPage = () => {
  const [screen, setScreen] = useState<Screen>('desktop');
  const [backHover, setBackHover] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const { status, isAuthenticated, signInWithGoogleCredential } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const onResize = () => setScreen(getScreen(window.innerWidth));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = screen === 'mobile';
  const isTablet = screen === 'tablet';
  const nextPath = new URLSearchParams(window.location.search).get('next') || '/app';

  useEffect(() => {
    if (isAuthenticated) {
      window.location.replace(nextPath);
    }
  }, [isAuthenticated, nextPath]);

  const handleGoogleCredential = useCallback(async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      setAuthError('Google did not return a sign-in credential. Please try again.');
      return;
    }

    setAuthError('');
    setIsSubmitting(true);

    try {
      await signInWithGoogleCredential(response.credential);
      window.location.replace(nextPath);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Sign-in failed. Please try again.');
      setIsSubmitting(false);
    }
  }, [nextPath, signInWithGoogleCredential]);

  useEffect(() => {
    if (!googleClientId) {
      setAuthError('Missing VITE_GOOGLE_CLIENT_ID in the frontend environment.');
      return;
    }

    let cancelled = false;

    const loadGoogleScript = () => new Promise<void>((resolve, reject) => {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }

      const existingScript = document.getElementById('google-identity-services');

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Google sign-in script failed to load.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-identity-services';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google sign-in script failed to load.'));
      document.head.appendChild(script);
    });

    loadGoogleScript()
      .then(() => {
        if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) {
          return;
        }

        googleButtonRef.current.innerHTML = '';
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredential,
          context: 'signin',
          ux_mode: 'popup',
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'rectangular',
          text: 'continue_with',
          logo_alignment: 'left',
          width: isMobile ? 290 : 360,
        });
      })
      .catch((error) => {
        if (!cancelled) {
          setAuthError(error instanceof Error ? error.message : 'Google sign-in could not start.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [googleClientId, handleGoogleCredential, isMobile]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f3f6ff 0%, #fafbff 62%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: '#111827',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.72,
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.42) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <nav
          style={{
            height: 64,
            padding: isMobile ? '0 20px' : '0 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Brand />
          <button
            type="button"
            onClick={() => { window.location.href = '/'; }}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            style={{
              border: '1px solid #e5e7eb',
              background: backHover ? '#eff6ff' : 'rgba(255,255,255,0.78)',
              color: backHover ? '#185fa5' : '#475569',
              borderRadius: 8,
              padding: isMobile ? '8px 11px' : '9px 14px',
              fontSize: 13,
              fontWeight: 650,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
            }}
          >
            Back to site
          </button>
        </nav>

        <main
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'minmax(0, 440px) minmax(0, 1fr)' : 'minmax(380px, 460px) minmax(0, 1fr)',
            alignItems: 'center',
            gap: isMobile ? 26 : isTablet ? 44 : 72,
            width: '100%',
            maxWidth: 1180,
            margin: '0 auto',
            padding: isMobile ? '22px 20px 40px' : isTablet ? '40px 44px 58px' : '44px 56px 64px',
            boxSizing: 'border-box',
          }}
        >
          <section
            aria-label="Login"
            style={{
              background: 'rgba(255,255,255,0.94)',
              border: '1px solid rgba(99,102,241,0.20)',
              borderRadius: 8,
              boxShadow: '0 18px 46px rgba(99,102,241,0.18), 0 2px 12px rgba(15,23,42,0.06)',
              padding: isMobile ? '26px 22px' : '34px 34px',
              backdropFilter: 'blur(14px)',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#e8622a',
                background: '#fff4ef',
                border: '1px solid #fed7c3',
                borderRadius: 6,
                padding: '5px 9px',
                marginBottom: 18,
              }}
            >
              Aevora workspace
            </span>

            <h1
              style={{
                margin: '0 0 10px',
                fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
                fontSize: isMobile ? 36 : 44,
                lineHeight: 1.02,
                fontWeight: 400,
                color: '#0d0d0d',
                letterSpacing: '0',
              }}
            >
              Sign in to build video ads
            </h1>

            <p
              style={{
                margin: '0 0 28px',
                color: '#6b7280',
                fontSize: 14,
                lineHeight: 1.65,
                maxWidth: 360,
              }}
            >
              Continue with your Google account and return to your ad creation workspace.
            </p>

            <div
              style={{
                width: '100%',
                minHeight: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isSubmitting || status === 'loading' ? 0.62 : 1,
                pointerEvents: isSubmitting || status === 'loading' ? 'none' : 'auto',
              }}
            >
              <div ref={googleButtonRef} />
            </div>

            {isSubmitting && (
              <div style={{ marginTop: 12, fontSize: 12.5, color: '#185fa5', fontWeight: 700 }}>
                Signing you in...
              </div>
            )}

            {authError && (
              <div
                role="alert"
                style={{
                  marginTop: 12,
                  border: '1px solid #fecaca',
                  background: '#fff1f2',
                  color: '#be123c',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 12.5,
                  lineHeight: 1.45,
                }}
              >
                {authError}
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginTop: 24,
              }}
            >
              {[
                ['Access', 'Your projects'],
                ['Session', 'Secure JWT'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    border: '1px solid #eef2f7',
                    background: '#fbfdff',
                    borderRadius: 8,
                    padding: '12px 13px',
                  }}
                >
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', color: '#a1adbd', textTransform: 'uppercase', marginBottom: 5 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 13, color: '#27324a', fontWeight: 750 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {!isMobile && (
            <section aria-label="Aevora preview" style={{ minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#185fa5', boxShadow: '0 0 0 4px rgba(24,95,165,0.12)' }} />
                <span style={{ color: '#185fa5', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Product video workflow
                </span>
              </div>

              <div
                style={{
                  border: '1px solid rgba(99,102,241,0.18)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#ffffff',
                  boxShadow: '0 18px 42px rgba(15,23,42,0.10)',
                }}
              >
                <video
                  src="/DRINK COMMERCIAL - Daniel Schiffer style.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '16 / 9',
                    objectFit: 'cover',
                    background: '#0f172a',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 12,
                  marginTop: 14,
                }}
              >
                {[
                  ['01', 'Upload product'],
                  ['02', 'Generate scenes'],
                  ['03', 'Export video'],
                ].map(([num, label], index) => (
                  <div
                    key={num}
                    style={{
                      border: `1px solid ${index === 0 ? '#fed7c3' : '#e2e8f0'}`,
                      background: index === 0 ? '#fffaf7' : 'rgba(255,255,255,0.88)',
                      borderRadius: 8,
                      padding: '13px 14px',
                      boxShadow: '0 8px 22px rgba(99,102,241,0.08)',
                    }}
                  >
                    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', color: index === 0 ? '#e8622a' : '#94a3b8', marginBottom: 6 }}>
                      STEP {num}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 750, color: '#172033' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
