import { ASSETS, Frame } from './shared';

const MANIFEST = [
  ['Source', '01 product image'],
  ['Scenes', 'Reveal / proof / benefit / detail / close'],
  ['Brand', 'Color / type / logo lock'],
  ['Output', '9:16 / 1:1 / 4:5 / 16:9'],
  ['Audio', 'Voiceover / SFX / music'],
];

const STRIP = [
  { src: ASSETS.scene01, caption: '01 / Reveal', alt: 'Product reveal' },
  { src: ASSETS.scene02, caption: '02 / Proof', alt: 'Hydration proof' },
  { src: ASSETS.scene03, caption: '03 / Benefit', alt: 'Skin benefit' },
  { src: ASSETS.scene04, caption: '04 / Detail', alt: 'Serum detail' },
  { src: ASSETS.scene05, caption: '05 / Close', alt: 'Closing frame' },
];

const BrandManifest = () => (
  <Frame className="a-manifest" label="Aevora brand lock and creative recipe">
    <p className="a-section-tag">
      <span>03</span> CREATIVE RECIPE
    </p>
    <p className="a-edge-label">BRAND LOCKED  ·  OUTPUT NEVER STATIC</p>
    <h2 className="a-manifest-title">
      <span>YOUR BRAND</span>
      <span>STAYS YOURS.</span>
    </h2>

    <div className="a-manifest-card">
      <div className="a-manifest-left">
        <span className="a-manifest-number">#01</span>
        <img src={ASSETS.input} alt="Aurora serum in an Aevora creative recipe card" loading="lazy" />
        <span className="a-manifest-vertical">AURORA / CAMPAIGN 001</span>
      </div>
      <dl className="a-manifest-data">
        {MANIFEST.map(([term, value]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
        <div className="a-manifest-ready">
          <dt>Ready</dt>
          <dd>Under 5 minutes</dd>
        </div>
      </dl>
      <div className="a-manifest-status">
        <span>AEVORA RENDER MANIFEST</span>
        <strong>READY TO PUBLISH</strong>
      </div>
    </div>

    <div className="a-manifest-filmstrip">
      {STRIP.map((shot) => (
        <figure key={shot.caption}>
          <img src={shot.src} alt={shot.alt} loading="lazy" />
          <figcaption>{shot.caption}</figcaption>
        </figure>
      ))}
    </div>

    <span className="a-frame-number">05 / 08</span>
  </Frame>
);

export default BrandManifest;
