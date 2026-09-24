import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LandingFooter = () => {
  const { accessToken } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <Link to="/" className="lp-brand">
              <div className="lp-brand-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M8 13h8" />
                  <path d="M8 17h5" />
                </svg>
              </div>
              <span>Draftly</span>
            </Link>
            <p className="footer-desc">
              AI-assisted document authoring platform for structuring, drafting, refining, and exporting business documents.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-links-col">
            <h5>Product</h5>
            <ul>
              <li><button type="button" onClick={() => scrollToSection("product")}>Product Overview</button></li>
              <li><button type="button" onClick={() => scrollToSection("features")}>Features</button></li>
              <li><button type="button" onClick={() => scrollToSection("how-it-works")}>How It Works</button></li>
              <li><Link to={accessToken ? "/projects" : "/login"}>Projects Hub</Link></li>
              <li><Link to={accessToken ? "/ai-tools" : "/login"}>AI Tools</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h5>Resources</h5>
            <ul>
              <li><button type="button" onClick={() => scrollToSection("use-cases")}>Use Cases</button></li>
              <li><button type="button" onClick={() => scrollToSection("principles")}>Principles</button></li>
              <li><Link to={accessToken ? "/templates" : "/login"}>Templates</Link></li>
              <li><Link to={accessToken ? "/settings" : "/login"}>Settings</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h5>Account</h5>
            <ul>
              {accessToken ? (
                <>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/projects">Workspaces</Link></li>
                  <li><Link to="/settings">Account Settings</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Sign In</Link></li>
                  <li><Link to="/register">Create Account</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <p>© {new Date().getFullYear()} Draftly Inc. All rights reserved.</p>
          <div className="footer-legal-tags">
            <span>Structured Writing</span>
            <span>•</span>
            <span>AI Authoring</span>
            <span>•</span>
            <span>DOCX & PPTX Export</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
