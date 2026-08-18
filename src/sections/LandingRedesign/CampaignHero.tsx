import { ASSETS, Frame, goLogin, scrollToId } from './shared';

const CampaignHero = () => (
  <Frame className="a-hero" label="One product becomes every campaign">
    <header className="a-nav">
      <div className="a-wordmark">
        Aevora<span className="a-wordmark-dot">.</span>
      </div>
      <nav className="a-nav-pill" aria-label="Primary navigation">
        <span className="a-menu-lines" aria-hidden="true" />
        <a href="#product" onClick={scrollToId('product')}>Product</a>
        <a href="#workflow" onClick={scrollToId('workflow')}>Workflow</a>
        <span className="a-nav-progress">01 / 08</span>
      </nav>
      <div className="a-nav-actions">
        <a href="/login">Sign in</a>
        <button type="button" onClick={goLogin}>
          Create a video <span>↗</span>
        </button>
      </div>
    </header>

    <p className="a-edge-label">AI VIDEO STUDIO  ·  SOURCE TO CAMPAIGN</p>

    <div className="a-hero-copy">
      <p className="a-kicker">One source. Every channel.</p>
      <h1>
        <span>ONE PRODUCT.</span>
        <span>EVERY CAMPAIGN.</span>
      </h1>
    </div>

    <figure className="a-hero-source">
      <img src={ASSETS.input} alt="Aurora clarifying serum source product" />
      <figcaption>
        <span>Source / 01</span>
        <span>Product image</span>
      </figcaption>
    </figure>
    <figure className="a-orbit-shot a-orbit-one">
      <img src={ASSETS.scene02} alt="Generated water campaign frame" />
    </figure>
    <figure className="a-orbit-shot a-orbit-two">
      <img src={ASSETS.scene03} alt="Generated skincare benefit frame" />
    </figure>
    <figure className="a-orbit-shot a-orbit-three">
      <img src={ASSETS.scene04} alt="Generated macro serum frame" />
    </figure>

    <div className="a-hero-bottom-copy">
      <p>
        Upload one product image. Direct the story.
        <br />
        Export a 20-second, ready-to-run campaign.
      </p>
      <button type="button" className="a-primary-button" onClick={goLogin}>
        Start with an image <span>→</span>
      </button>
    </div>

    <aside className="a-render-ticket" aria-label="Campaign output summary">
      <div>
        <span>Aevora / Render</span>
        <span>Ready</span>
      </div>
      <strong>05 SCENES</strong>
      <div>
        <span>00:20</span>
        <span>9:16 / 1:1 / 16:9</span>
      </div>
    </aside>

    <span className="a-frame-number">01 / 08</span>
  </Frame>
);

export default CampaignHero;
