export const LandingValueStrip = () => {
  const pillars = [
    {
      title: "AI-Assisted Generation",
      description: "Scaffold complete document sections from topic briefs and prompts.",
    },
    {
      title: "Structured Sections",
      description: "Organize long-form content into modular, manageable sections.",
    },
    {
      title: "Iterative Refinement",
      description: "Fine-tune tone, expand details, or polish text at the section level.",
    },
    {
      title: "Export-Ready Output",
      description: "Download polished Word (.docx) and PowerPoint (.pptx) files instantly.",
    },
  ];

  return (
    <section className="lp-value-strip-section">
      <div className="lp-container">
        <div className="lp-strip-header">
          <span className="lp-strip-label">From idea to final document</span>
        </div>
        <div className="lp-strip-grid">
          {pillars.map((p, i) => (
            <div key={i} className="lp-strip-item">
              <div className="lp-strip-num">0{i + 1}</div>
              <h4 className="lp-strip-title">{p.title}</h4>
              <p className="lp-strip-desc">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
