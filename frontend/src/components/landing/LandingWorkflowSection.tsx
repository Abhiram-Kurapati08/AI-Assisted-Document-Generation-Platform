export const LandingWorkflowSection = () => {
  const pipeline = [
    { label: "IDEA", desc: "Topic Brief" },
    { label: "OUTLINE", desc: "Scaffold Structure" },
    { label: "SECTIONS", desc: "Modular Drafting" },
    { label: "REFINEMENT", desc: "AI Style Polish" },
    { label: "FINAL DOCUMENT", desc: "DOCX / PPTX Export" },
  ];

  return (
    <section className="lp-section lp-workflow-section">
      <div className="lp-container">
        <div className="lp-section-header text-center">
          <span className="lp-section-kicker">Document Transformation Pipeline</span>
          <h2 className="lp-section-title">The Draftly Document Lifecycle</h2>
          <p className="lp-section-subtitle">
            See how raw ideas move through structured stages to become polished, production-ready deliverables.
          </p>
        </div>

        <div className="lp-pipeline-container">
          <div className="lp-pipeline-track">
            {pipeline.map((stage, idx) => (
              <div key={idx} className="lp-pipeline-node">
                <div className="node-box">
                  <span className="node-step">Stage 0{idx + 1}</span>
                  <strong className="node-label">{stage.label}</strong>
                  <span className="node-desc">{stage.desc}</span>
                </div>
                {idx < pipeline.length - 1 && (
                  <div className="node-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
