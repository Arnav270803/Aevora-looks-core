import { ASSETS, Frame } from './shared';

const CapabilityPanels = () => (
  <Frame
    className="a-capabilities"
    id="features"
    label="Aevora product imagery and campaign motion capabilities"
  >
    <article className="a-cap-panel a-cap-product">
      <p className="a-cap-label">•  AI PRODUCT WORLDS</p>
      <figure className="a-cap-image a-cap-image-wide">
        <img src={ASSETS.scene01} alt="Architectural Aurora product shot" loading="lazy" />
      </figure>
      <figure className="a-cap-image a-cap-image-square">
        <img src={ASSETS.input} alt="Aurora source packshot" loading="lazy" />
      </figure>
      <figure className="a-cap-image a-cap-image-small">
        <img src={ASSETS.scene04} alt="Serum texture detail" loading="lazy" />
      </figure>
      <div className="a-cap-copy">
        <h2>
          ONE PRODUCT.
          <br />
          INFINITE WORLDS.
        </h2>
        <p>Direct clean packshots, proof moments, and styled scenes without another shoot.</p>
      </div>
      <span className="a-cap-index">#01</span>
    </article>

    <article className="a-cap-panel a-cap-motion">
      <p className="a-cap-label">•  CAMPAIGN MOTION</p>
      <figure className="a-cap-image a-cap-motion-red">
        <img src={ASSETS.scene03} alt="Skin benefit campaign frame" loading="lazy" />
      </figure>
      <figure className="a-cap-image a-cap-motion-tall">
        <img src={ASSETS.scene02} alt="Water motion campaign frame" loading="lazy" />
      </figure>
      <figure className="a-cap-image a-cap-motion-edge">
        <img src={ASSETS.scene05} alt="Aurora campaign closing frame" loading="lazy" />
      </figure>
      <div className="a-cap-copy">
        <h2>
          SCENE BY SCENE.
          <br />
          AD BY AD.
        </h2>
        <p>Build on-brand motion for Reels, paid social, and every screen your audience uses.</p>
      </div>
      <span className="a-cap-index">#02</span>
    </article>

    <span className="a-frame-number">03 / 08</span>
  </Frame>
);

export default CapabilityPanels;
