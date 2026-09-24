import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LandingFinalCTA = () => {
  const { accessToken } = useAuth();

  return (
    <section className="lp-section lp-cta-section">
      <div className="lp-container">
        <div className="lp-cta-box">
          <h2 className="cta-title">Ready to turn your next idea into a document?</h2>
          <p className="cta-desc">
            Create, refine, organize, and export business-ready documents from one unified workspace.
          </p>
          <div className="cta-actions">
            <Link to={accessToken ? "/dashboard" : "/register"} className="lp-btn lp-btn-primary lp-btn-lg">
              <span>{accessToken ? "Go to Dashboard" : "Get started"}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to={accessToken ? "/projects" : "/login"} className="lp-btn lp-btn-secondary lp-btn-lg">
              <span>{accessToken ? "View Projects" : "Sign in to workspace"}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
