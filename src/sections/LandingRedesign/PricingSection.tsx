import { Frame, goLogin } from './shared';

const PricingSection = () => (
  <Frame className="a-pricing" id="pricing" label="Aevora pricing">
    <header className="a-mini-nav">
      <span>Aevora / Pricing</span>
      <span>Monthly  ·  Cancel anytime</span>
    </header>

    <p className="a-section-tag">
      <span>04</span> SIMPLE PRICING
    </p>
    <h2 className="a-pricing-title">
      <span>START FREE.</span>
      <span>SHIP OFTEN.</span>
    </h2>
    <p className="a-pricing-intro">
      No hidden fees. Start with three exports, then scale when your creative cadence does.
    </p>

    <div className="a-pricing-table">
      <article className="a-plan">
        <span className="a-plan-index">#01</span>
        <h3>Starter</h3>
        <p className="a-plan-price">Free</p>
        <p>
          3 exports / month
          <br />
          720p · basic scenes
          <br />
          Aevora watermark
        </p>
        <button type="button" onClick={goLogin}>
          Get started <span>→</span>
        </button>
      </article>

      <article className="a-plan a-plan-featured">
        <div className="a-plan-badge">MOST POPULAR</div>
        <span className="a-plan-index">#02</span>
        <h3>Pro</h3>
        <p className="a-plan-price">
          $49 <small>/ month</small>
        </p>
        <p>
          50 exports / month
          <br />
          4K · full scene library
          <br />
          Brand lock · priority render
        </p>
        <button type="button" onClick={goLogin}>
          Start Pro <span>→</span>
        </button>
      </article>

      <article className="a-plan">
        <span className="a-plan-index">#03</span>
        <h3>Scale</h3>
        <p className="a-plan-price">
          $149 <small>/ month</small>
        </p>
        <p>
          Unlimited exports
          <br />
          4K · API access
          <br />
          Custom presets · support
        </p>
        <button type="button" onClick={goLogin}>
          Talk to us <span>→</span>
        </button>
      </article>
    </div>

    <span className="a-frame-number">06 / 08</span>
  </Frame>
);

export default PricingSection;
