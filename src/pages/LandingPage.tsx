import '../sections/LandingRedesign/redesign.css';
import {
  BrandManifest,
  CampaignHero,
  CapabilityPanels,
  CinematicHero,
  DirectTheStory,
  FaqSection,
  FinalCta,
  InputToCampaign,
  PricingSection,
} from '../sections/LandingRedesign';

const LandingPage = () => (
  <div className="aevora-redesign">
    <CinematicHero />
    <CampaignHero />
    <InputToCampaign />
    <CapabilityPanels />
    <DirectTheStory />
    <BrandManifest />
    <PricingSection />
    <FaqSection />
    <FinalCta />
  </div>
);

export default LandingPage;
