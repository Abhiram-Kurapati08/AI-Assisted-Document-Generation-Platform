export const LandingPrinciples = () => {
  const principles = [
    {
      title: "Author Control First",
      desc: "AI is a collaborative assistant, not an autonomous replacement. You retain full control over content and structure.",
    },
    {
      title: "Modular Section Engineering",
      desc: "Document generation works best when broken into logical, focused sections rather than monolithic text generation.",
    },
    {
      title: "Export Fidelity",
      desc: "Generated documents must translate cleanly into standard business tools like Microsoft Word and PowerPoint.",
    },
    {
      title: "User Data Security & Ownership",
      desc: "Your projects and generated text belong strictly to your user account, protected behind standard authentication.",
    },
  ];

  return (
    <section id="principles" className="lp-section lp-principles-section">
      <div className="lp-container">
        <div className="lp-section-header text-center">
          <span className="lp-section-kicker">Product Philosophy</span>
          <h2 className="lp-section-title">Designed for structured AI-assisted writing.</h2>
          <p className="lp-section-subtitle">
            What Draftly is built around: fundamental principles that prioritize clarity, reliability, and author control.
          </p>
        </div>

        <div className="lp-principles-grid">
          {principles.map((p, i) => (
            <div key={i} className="lp-principle-card">
              <span className="principle-number">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
