import { LandingHeader } from "../components/landing/LandingHeader";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingValueStrip } from "../components/landing/LandingValueStrip";
import { LandingProductOverview } from "../components/landing/LandingProductOverview";
import { LandingFeatureGrid } from "../components/landing/LandingFeatureGrid";
import { LandingHowItWorks } from "../components/landing/LandingHowItWorks";
import { LandingWorkflowSection } from "../components/landing/LandingWorkflowSection";
import { LandingProductPreview } from "../components/landing/LandingProductPreview";
import { LandingUseCases } from "../components/landing/LandingUseCases";
import { LandingWhyDraftly } from "../components/landing/LandingWhyDraftly";
import { LandingPrinciples } from "../components/landing/LandingPrinciples";
import { LandingFinalCTA } from "../components/landing/LandingFinalCTA";
import { LandingFooter } from "../components/landing/LandingFooter";

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingValueStrip />
        <LandingProductOverview />
        <LandingFeatureGrid />
        <LandingHowItWorks />
        <LandingWorkflowSection />
        <LandingProductPreview />
        <LandingUseCases />
        <LandingWhyDraftly />
        <LandingPrinciples />
        <LandingFinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
