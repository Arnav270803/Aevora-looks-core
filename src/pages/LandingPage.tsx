import '../sections/LandingRedesign/redesign.css';
import {
  BrandManifest,
  CampaignHero,
  CapabilityPanels,
  DirectTheStory,
  FaqSection,
  FinalCta,
  InputToCampaign,
  PricingSection,
  VideoHero,
} from '../sections/LandingRedesign';

const LandingPage = () => (
  <div className="aevora-redesign">
    <VideoHero />
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
