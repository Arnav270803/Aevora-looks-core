const FOOTER_LINKS: Record<string, string[]> = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Resources: ['Documentation', 'API Reference', 'Status', 'Community'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

const Footer = () => {
  return (
    <footer
      style={{
        width: '100%',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        padding: '60px 40px 36px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1040,
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          gap: 40,
        }}
      >
        {/* Brand column */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <img src="/logo.svg" alt="Aevora" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            <span style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: '#1a1a1a',
              letterSpacing: '-0.5px',
            }}>
              Ae<span style={{ color: '#FF6B35' }}>vora</span>
            </span>
          </a>
          <p style={{
            fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: 1.65,
            margin: 0,
            maxWidth: 220,
          }}>
            Turn product images into studio-quality video ads — in minutes.
          </p>
          {/* Social icons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            {['twitter', 'linkedin', 'instagram'].map((s) => (
              <a
                key={s}
                href="#"
                aria-label={s}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  textDecoration: 'none',
                  transition: 'border-color 0.18s, color 0.18s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#111827';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,0,0,0.22)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#6b7280';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,0,0,0.10)';
                }}
              >
                {s === 'twitter' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                )}
                {s === 'linkedin' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                )}
                {s === 'instagram' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([category, links]) => (
          <div key={category} style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            <span style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase' as const,
              color: '#374151',
              marginBottom: 4,
            }}>
              {category}
            </span>
            {links.map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
                  fontSize: '13.5px',
                  color: '#6b7280',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#111827'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#6b7280'; }}
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        width: '100%',
        maxWidth: 1040,
        marginTop: 52,
        paddingTop: 20,
        borderTop: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap' as const,
        gap: 12,
      }}>
        <span style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: '12.5px',
          color: '#9ca3af',
        }}>
          © {new Date().getFullYear()} Aevora, Inc. All rights reserved.
        </span>
        <span style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: '12.5px',
          color: '#9ca3af',
        }}>
          Made with care for marketers everywhere.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
