import StudioLanding from '../sections/LandingPage/StudioLanding';
import {
  FAQ,
  Footer,
  ProductDemoAndSteps,
  SubscriptionExperience,
  Tutorial,
  WhatMakesAevoraDifferent,
} from '../sections/LandingPage';

const LandingPage = () => (
  <div
    style={{
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
      background: 'linear-gradient(to bottom, #fffdf9 0%, #f3f7ff 42%, #ffffff 100%)',
    }}
  >
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.36,
        backgroundImage: 'radial-gradient(circle, rgba(86, 121, 192, 0.26) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    />
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 62% 12%, rgba(240, 90, 42, 0.08) 0%, transparent 34%)',
      }}
    />

    <div style={{ position: 'relative', zIndex: 10 }}>
      <StudioLanding />
      <div id="product-demo">
        <ProductDemoAndSteps />
      </div>
      <div id="features">
        <WhatMakesAevoraDifferent />
      </div>
      <Tutorial />
      <div id="pricing">
        <SubscriptionExperience />
      </div>
      <FAQ />
      <Footer />
    </div>
  </div>
);

export default LandingPage;
