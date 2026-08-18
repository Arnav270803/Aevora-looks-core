import { ASSETS, Frame } from './shared';

const OUTPUTS = [
  { cls: 'a-output-01', src: ASSETS.scene01, index: '01', label: 'Product reveal' },
  { cls: 'a-output-02', src: ASSETS.scene02, index: '02', label: 'Hydration proof' },
  { cls: 'a-output-03', src: ASSETS.scene03, index: '03', label: 'Skin benefit' },
  { cls: 'a-output-04', src: ASSETS.scene04, index: '04', label: 'Serum detail' },
  { cls: 'a-output-05', src: ASSETS.scene05, index: '05', label: 'Closing frame' },
];

const InputToCampaign = () => (
  <Frame className="a-transform" id="product" label="One input becomes five campaign scenes">
    <p className="a-section-tag">
      <span>01</span> SOURCE → OUTPUT
    </p>
    <p className="a-edge-label">UPLOAD ONCE  ·  DIRECT THE WORLD</p>
    <h2 className="a-transform-title">
      <span>ONE INPUT.</span>
      <span>A WHOLE CAMPAIGN.</span>
    </h2>

    <figure className="a-input-card">
      <img src={ASSETS.input} alt="Original Aurora serum product image" loading="lazy" />
      <figcaption>
        <span>INPUT</span>
        <span>PNG / 1254×1254</span>
      </figcaption>
      <div className="a-input-ring" aria-hidden="true" />
    </figure>

    {OUTPUTS.map(({ cls, src, index, label }) => (
      <figure key={cls} className={`a-output-card ${cls}`}>
        <img src={src} alt={`${label} output`} loading="lazy" />
        <figcaption>
          <span>{index}</span> {label}
        </figcaption>
      </figure>
    ))}

    <div className="a-output-filters" aria-label="Campaign formats">
      <span>Product film</span>
      <span>Reels</span>
      <span>Paid social</span>
      <span>Retail</span>
    </div>

    <p className="a-transform-note">
      The source stays recognizable.
      <br />
      The world around it keeps moving.
    </p>

    <span className="a-frame-number">02 / 08</span>
  </Frame>
);

export default InputToCampaign;
