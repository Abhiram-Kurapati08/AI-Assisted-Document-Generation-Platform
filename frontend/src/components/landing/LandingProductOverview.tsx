export const LandingProductOverview = () => {
  return (
    <section id="product" className="lp-section lp-overview-section">
      <div className="lp-container">
        <div className="lp-section-header text-center">
          <span className="lp-section-kicker">Unified Authoring Environment</span>
          <h2 className="lp-section-title">One workspace for creating better documents.</h2>
          <p className="lp-section-subtitle">
            Draftly eliminates context switching between text editors and AI generators by unifying organization, section drafting, refinement, and file exporting into a single workflow.
          </p>
        </div>

        <div className="lp-overview-grid">
          {/* Left Column: Feature Highlights */}
          <div className="lp-overview-features">
            <div className="lp-overview-card active">
              <div className="card-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                </svg>
              </div>
              <div>
                <h4>Project & Document Workspaces</h4>
                <p>Keep technical proposals, reports, and slide decks structured within dedicated project containers.</p>
              </div>
            </div>

            <div className="lp-overview-card">
              <div className="card-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </div>
              <div>
                <h4>Modular Section Authoring</h4>
                <p>Break complex documents into manageable sections to write, edit, and reorganize without losing context.</p>
              </div>
            </div>

            <div className="lp-overview-card">
              <div className="card-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <div>
                <h4>AI Generation & Section Refinement</h4>
                <p>Prompt the LLM to generate initial drafts or refine section text with targeted tone and style instructions.</p>
              </div>
            </div>

            <div className="lp-overview-card">
              <div className="card-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div>
                <h4>Native Multi-Format Export</h4>
                <p>Export finished documents cleanly to Word (.docx), PowerPoint (.pptx), or plain text format.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product UI Card */}
          <div className="lp-overview-visual">
            <div className="lp-visual-card">
              <div className="card-header-bar">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
                <span className="header-text">Draftly Product Architecture</span>
              </div>
              <div className="card-inner-body">
                <div className="architecture-diagram">
                  <div className="arch-node node-input">
                    <span className="node-tag">INPUT</span>
                    <strong>Topic Brief & Prompt</strong>
                  </div>
                  <div className="arch-arrow">↓</div>
                  <div className="arch-node node-core">
                    <span className="node-tag">CORE ENGINE</span>
                    <strong>Section Scaffolder & AI Refiner</strong>
                  </div>
                  <div className="arch-arrow">↓</div>
                  <div className="arch-node node-output">
                    <span className="node-tag">EXPORT FORMATS</span>
                    <div className="format-badges">
                      <span className="badge-f docx">Word .DOCX</span>
                      <span className="badge-f pptx">Slides .PPTX</span>
                      <span className="badge-f txt">Text .TXT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
