import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LandingProductPreview = () => {
  const { accessToken } = useAuth();

  return (
    <section className="lp-section lp-preview-section">
      <div className="lp-container">
        <div className="lp-section-header text-center">
          <span className="lp-section-kicker">Interactive Product Preview</span>
          <h2 className="lp-section-title">Built for precision document authoring.</h2>
          <p className="lp-section-subtitle">
            Experience a clean, distraction-free environment designed specifically for document creators and business professionals.
          </p>
        </div>

        <div className="lp-preview-frame">
          <div className="preview-header-bar">
            <div className="window-controls">
              <span className="control-dot close"></span>
              <span className="control-dot minimize"></span>
              <span className="control-dot expand"></span>
            </div>
            <div className="address-bar">https://draftly.app/projects/q3-security-proposal</div>
            <div className="user-status-pill">● Online Workspace</div>
          </div>

          <div className="preview-app-interface">
            {/* App Nav Sidebar */}
            <div className="app-sidebar-mock">
              <div className="brand-header">
                <div className="icon">D</div>
                <span>Draftly</span>
              </div>
              <div className="nav-group">
                <div className="nav-link">Dashboard</div>
                <div className="nav-link active">Projects</div>
                <div className="nav-link">Templates</div>
                <div className="nav-link">AI Tools</div>
                <div className="nav-link">Settings</div>
              </div>
            </div>

            {/* Main Area */}
            <div className="app-main-mock">
              <div className="doc-toolbar-mock">
                <div>
                  <h4>Q3 Enterprise Security Proposal</h4>
                  <p className="xs text-muted">Word Document (.docx) • 4 Sections</p>
                </div>
                <div className="action-buttons-mock">
                  <span className="btn-mock outline">Export .DOCX</span>
                  <span className="btn-mock primary">Save Changes</span>
                </div>
              </div>

              <div className="editor-grid-mock">
                <div className="sections-list-mock">
                  <div className="sec-item active">1. Executive Overview</div>
                  <div className="sec-item">2. Technical Architecture</div>
                  <div className="sec-item">3. Implementation Schedule</div>
                  <div className="sec-item">4. Financial Breakdown</div>
                </div>

                <div className="editor-workspace-mock">
                  <div className="ai-bar-mock">
                    <span>✨ AI Refine: "Make the tone formal and highlight enterprise compliance"</span>
                    <button className="btn-refine-mock">Refine Section</button>
                  </div>
                  <div className="content-mock">
                    <p><strong>1. Executive Overview</strong></p>
                    <p>This proposal outlines the strategic implementation of enterprise-grade security protocols tailored for cloud infrastructures...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center" style={{ marginTop: "2.5rem" }}>
          <Link to={accessToken ? "/dashboard" : "/register"} className="lp-btn lp-btn-primary lp-btn-lg">
            <span>{accessToken ? "Open your workspace" : "Open your workspace"}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
