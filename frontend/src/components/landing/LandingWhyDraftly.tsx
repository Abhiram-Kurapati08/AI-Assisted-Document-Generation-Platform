export const LandingWhyDraftly = () => {
  const benefits = [
    {
      title: "Less Context Switching",
      desc: "Stop jumping between external AI chat windows, note apps, and word processors. Draft and refine right inside your project.",
    },
    {
      title: "Structured Instead of Chaotic",
      desc: "Maintain clear document outlines and section boundaries so large documents never descend into disorganized chaos.",
    },
    {
      title: "AI Assistance Without Losing Control",
      desc: "AI scaffolds and suggests, but you maintain 100% edit authority over every word, section title, and export option.",
    },
    {
      title: "Granular Section Refinement",
      desc: "Target individual sections for tone or length adjustments without affecting the rest of your document.",
    },
    {
      title: "One Workspace to Export",
      desc: "Move seamlessly from initial idea to downloadable Microsoft Word (.docx) or PowerPoint (.pptx) files.",
    },
  ];

  return (
    <section className="lp-section lp-why-section">
      <div className="lp-container">
        <div className="lp-section-header text-center">
          <span className="lp-section-kicker">Workflow Advantages</span>
          <h2 className="lp-section-title">Why choose Draftly for document creation?</h2>
          <p className="lp-section-subtitle">
            A practical, structured approach to writing that combines AI speed with human precision.
          </p>
        </div>

        <div className="lp-why-grid">
          {benefits.map((b, i) => (
            <div key={i} className="lp-why-card">
              <div className="why-check">✓</div>
              <div>
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
