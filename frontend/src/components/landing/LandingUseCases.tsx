export const LandingUseCases = () => {
  const useCases = [
    {
      title: "Project Proposals",
      tag: "DOCX",
      desc: "Turn business requirements and client needs into structured, persuasive proposal documents.",
    },
    {
      title: "Technical Reports",
      tag: "DOCX",
      desc: "Structure complex engineering data, architecture reviews, and specifications into clean sections.",
    },
    {
      title: "Business Documents",
      tag: "DOCX / TXT",
      desc: "Draft executive summaries, quarterly business reviews, and operational frameworks with AI aid.",
    },
    {
      title: "Slide Presentations",
      tag: "PPTX",
      desc: "Build presentation-ready slide outlines and section briefs exportable directly to PowerPoint.",
    },
    {
      title: "Research Summaries",
      tag: "DOCX / TXT",
      desc: "Organize dense research findings and literature into structured, readable sections.",
    },
  ];

  return (
    <section id="use-cases" className="lp-section lp-usecases-section">
      <div className="lp-container">
        <div className="lp-section-header text-center">
          <span className="lp-section-kicker">Tailored Solutions</span>
          <h2 className="lp-section-title">Built for real-world document tasks.</h2>
          <p className="lp-section-subtitle">
            Whether you are writing a multi-page enterprise proposal or a executive slide deck, Draftly adapts to your document goals.
          </p>
        </div>

        <div className="lp-usecase-grid">
          {useCases.map((uc, i) => (
            <div key={i} className="lp-usecase-card">
              <div className="card-top">
                <span className="uc-badge">{uc.tag}</span>
              </div>
              <h3 className="uc-title">{uc.title}</h3>
              <p className="uc-desc">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
