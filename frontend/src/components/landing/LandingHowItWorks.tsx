export const LandingHowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Create a project",
      desc: "Define your document title and choose between Word (.docx) or PowerPoint (.pptx) format.",
    },
    {
      num: "02",
      title: "Describe what you need",
      desc: "Provide a brief topic prompt, target audience details, or outline preferences.",
    },
    {
      num: "03",
      title: "Generate and refine",
      desc: "Let AI scaffold initial sections, then edit content directly or prompt section-level refinements.",
    },
    {
      num: "04",
      title: "Export your document",
      desc: "Download your completed document cleanly formatted and ready for business presentation.",
    },
  ];

  return (
    <section id="how-it-works" className="lp-section lp-how-section">
      <div className="lp-container">
        <div className="lp-section-header text-center">
          <span className="lp-section-kicker">Simple 4-Step Process</span>
          <h2 className="lp-section-title">How Draftly powers your workflow.</h2>
          <p className="lp-section-subtitle">
            From initial concept to downloadable file, Draftly provides structure every step of the way.
          </p>
        </div>

        <div className="lp-timeline-grid">
          {steps.map((s, i) => (
            <div key={i} className="lp-timeline-step">
              <div className="step-badge">{s.num}</div>
              <h4 className="step-title">{s.title}</h4>
              <p className="step-desc">{s.desc}</p>
              {i < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
