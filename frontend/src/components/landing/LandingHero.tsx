import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LandingHero = () => {
  const { accessToken } = useAuth();

  const scrollToProduct = () => {
    const el = document.getElementById("product");
    if (el) {
      const offset = 80;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="lp-section lp-hero-section">
      <div className="lp-container lp-hero-container">
        {/* Hero Copy */}
        <div className="lp-hero-content">
          <div className="lp-badge-pill">
            <span className="lp-badge-dot"></span>
            <span>AI-Assisted Document Authoring Platform</span>
          </div>

          <h1 className="lp-hero-title">
            Turn ideas into polished documents with AI.
          </h1>

          <p className="lp-hero-subtitle">
            Draftly helps you structure, generate, refine, and export business-ready documents from a single workspace.
          </p>

          <div className="lp-hero-ctas">
            <Link to={accessToken ? "/dashboard" : "/register"} className="lp-btn lp-btn-primary lp-btn-lg">
              <span>{accessToken ? "Open your workspace" : "Create your first document"}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <button type="button" onClick={scrollToProduct} className="lp-btn lp-btn-secondary lp-btn-lg">
              <span>Explore Draftly</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>

          {/* Value Chips */}
          <div className="lp-value-chips">
            <div className="lp-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>AI-assisted generation</span>
            </div>
            <div className="lp-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Structured document workflow</span>
            </div>
            <div className="lp-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Section-based editing</span>
            </div>
            <div className="lp-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>DOCX / PPTX export</span>
            </div>
          </div>
        </div>

        {/* Product UI Mockup */}
        <div className="lp-hero-visual">
          <div className="lp-mockup-frame">
            <div className="lp-mockup-topbar">
              <div className="lp-mockup-dots">
                <span className="dot-red"></span>
                <span className="dot-yellow"></span>
                <span className="dot-green"></span>
              </div>
              <div className="lp-mockup-title">Enterprise Security Proposal — Draftly Workspace</div>
              <div className="lp-mockup-tag">DOCX Export</div>
            </div>

            <div className="lp-mockup-body">
              {/* Sidebar */}
              <div className="lp-mockup-sidebar">
                <div className="sidebar-header">Sections (4)</div>
                <div className="sidebar-item active">
                  <span>1. Executive Summary</span>
                  <span className="badge-tag tag-ai">AI</span>
                </div>
                <div className="sidebar-item">
                  <span>2. Architecture Overview</span>
                  <span className="badge-tag tag-ai">AI</span>
                </div>
                <div className="sidebar-item">
                  <span>3. Implementation Timeline</span>
                  <span className="badge-tag tag-manual">Manual</span>
                </div>
                <div className="sidebar-item">
                  <span>4. Financial Investment</span>
                  <span className="badge-tag tag-ai">AI</span>
                </div>
              </div>

              {/* Editor */}
              <div className="lp-mockup-editor">
                <div className="editor-toolbar">
                  <span className="tab-pill active">Section Editor</span>
                  <span className="tab-pill pill-ai">AI Refine</span>
                  <button className="btn-export-mock">Export .DOCX</button>
                </div>

                <div className="editor-body">
                  <div className="section-heading-mock">1. Executive Summary</div>
                  <div className="text-line line-full"></div>
                  <div className="text-line line-90"></div>
                  <div className="text-line line-80"></div>
                  <div className="ai-refine-box">
                    <div className="ai-icon">✨</div>
                    <div className="ai-text">
                      <strong>AI Refinement:</strong> Tone updated to Executive Formal. 3 key risk mitigations inserted.
                    </div>
                  </div>
                  <div className="text-line line-full"></div>
                  <div className="text-line line-70"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
