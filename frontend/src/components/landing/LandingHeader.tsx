import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LandingHeader = () => {
  const { accessToken } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className={`lp-header ${scrolled ? "lp-header-scrolled" : ""}`}>
      <div className="lp-container lp-header-container">
        {/* Brand */}
        <Link to="/" className="lp-brand">
          <div className="lp-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M8 13h8" />
              <path d="M8 17h5" />
            </svg>
          </div>
          <span>Draftly</span>
        </Link>

        {/* Navigation Links */}
        <nav className="lp-nav-links">
          <button type="button" onClick={() => scrollToSection("product")}>Product</button>
          <button type="button" onClick={() => scrollToSection("features")}>Features</button>
          <button type="button" onClick={() => scrollToSection("how-it-works")}>How it works</button>
          <button type="button" onClick={() => scrollToSection("use-cases")}>Use cases</button>
          <button type="button" onClick={() => scrollToSection("principles")}>About</button>
        </nav>

        {/* Action Buttons */}
        <div className="lp-header-actions">
          {accessToken ? (
            <Link to="/dashboard" className="lp-btn lp-btn-primary">
              <span>Go to Dashboard</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <>
              <Link to="/login" className="lp-btn lp-btn-ghost">
                Sign in
              </Link>
              <Link to="/register" className="lp-btn lp-btn-primary">
                Get started
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lp-mobile-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lp-mobile-drawer">
          <button type="button" onClick={() => scrollToSection("product")}>Product</button>
          <button type="button" onClick={() => scrollToSection("features")}>Features</button>
          <button type="button" onClick={() => scrollToSection("how-it-works")}>How it works</button>
          <button type="button" onClick={() => scrollToSection("use-cases")}>Use cases</button>
          <button type="button" onClick={() => scrollToSection("principles")}>About</button>
          <div className="lp-mobile-actions">
            {accessToken ? (
              <Link to="/dashboard" className="lp-btn lp-btn-primary" onClick={() => setMobileMenuOpen(false)}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="lp-btn lp-btn-ghost" onClick={() => setMobileMenuOpen(false)}>
                  Sign in
                </Link>
                <Link to="/register" className="lp-btn lp-btn-primary" onClick={() => setMobileMenuOpen(false)}>
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
