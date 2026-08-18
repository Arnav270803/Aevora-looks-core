import { ASSETS, Frame, goLogin, scrollToId } from './shared';

const STRIP = [
  { src: ASSETS.scene01, alt: 'Product reveal' },
  { src: ASSETS.scene02, alt: 'Hydration proof' },
  { src: ASSETS.scene03, alt: 'Skin benefit' },
  { src: ASSETS.scene04, alt: 'Serum detail' },
  { src: ASSETS.scene05, alt: 'Closing frame' },
];

const FinalCta = () => (
  <Frame className="a-final" label="Start your first Aevora campaign">
    <img className="a-final-bg" src={ASSETS.scene05} alt="" loading="lazy" />
    <div className="a-final-shade" aria-hidden="true" />

    <header className="a-final-nav">
      <span className="a-wordmark a-wordmark-light">
        Aevora<span className="a-wordmark-dot">.</span>
      </span>
      <span>
        <a href="#product" onClick={scrollToId('product')}>Product</a>
        {'  ·  '}
        <a href="#workflow" onClick={scrollToId('workflow')}>Workflow</a>
        {'  ·  '}
        <a href="#pricing" onClick={scrollToId('pricing')}>Pricing</a>
      </span>
      <a href="/login">Sign in</a>
    </header>

    <div className="a-final-copy">
      <p className="a-kicker a-kicker-light">Your first campaign starts here.</p>
      <h2>
        <span>DROP ONE IMAGE.</span>
        <span>LEAVE WITH A CAMPAIGN.</span>
      </h2>
      <p>
        Free to start. No editing experience required.
        <br />
        Your brand stays locked from source to export.
      </p>
      <button type="button" className="a-primary-button" onClick={goLogin}>
        Create your first video <span>↗</span>
      </button>
    </div>

    <div className="a-final-scene-strip" aria-label="Five Aurora campaign scenes">
      {STRIP.map((shot) => (
        <img key={shot.alt} src={shot.src} alt={shot.alt} loading="lazy" />
      ))}
    </div>

    <footer className="a-final-footer">
      <span>© {new Date().getFullYear()} Aevora, Inc.</span>
      <span>Privacy  ·  Terms  ·  Status</span>
      <span>AI VIDEO STUDIO / V1.0</span>
    </footer>

    <span className="a-frame-number a-frame-number-light">08 / 08</span>
  </Frame>
);

export default FinalCta;
