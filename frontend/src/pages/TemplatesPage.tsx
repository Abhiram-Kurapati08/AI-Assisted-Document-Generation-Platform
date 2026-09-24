import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ToastContainer, type ToastMessage } from "../components/ui/Toast";

type TemplateItem = {
  id: string;
  title: string;
  doc_type: "docx" | "pptx";
  category: string;
  description: string;
  sections: string[];
};

const SAMPLE_TEMPLATES: TemplateItem[] = [
  {
    id: "business-proposal",
    title: "Executive Business Proposal",
    doc_type: "docx",
    category: "Strategy & Sales",
    description: "Structured proposal outline containing executive summary, market problem, solution architecture, and pricing tiers.",
    sections: ["Executive Summary", "Market Problem", "Proposed Solution", "Financial Tiers & Next Steps"],
  },
  {
    id: "product-roadmap",
    title: "Product Roadmap & Requirements",
    doc_type: "docx",
    category: "Product Management",
    description: "Complete PRD document with feature specifications, milestone timeline, technical dependencies, and success metrics.",
    sections: ["Overview & Goals", "User Stories", "Technical Architecture", "Release Schedule"],
  },
  {
    id: "pitch-deck",
    title: "Investor Pitch Presentation",
    doc_type: "pptx",
    category: "Fundraising",
    description: "High-impact presentation outline highlighting vision, traction, business model, go-to-market strategy, and team.",
    sections: ["Vision & Mission", "Traction & Metrics", "Business Model", "The Ask & Allocation"],
  },
  {
    id: "quarterly-review",
    title: "Quarterly Business Review Deck",
    doc_type: "pptx",
    category: "Operations",
    description: "Executive QBR template for presenting KPIs, revenue milestones, department highlights, and strategic risks.",
    sections: ["Performance Summary", "Department Highlights", "Financial Breakdown", "Next Quarter Strategy"],
  },
];

export const TemplatesPage = () => {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleUseTemplate = (template: TemplateItem) => {
    navigate(`/projects?title=${encodeURIComponent(template.title)}&doc_type=${template.doc_type}&prompt=${encodeURIComponent(template.description)}&action=new`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div>
        <h2>Document & Slide Templates</h2>
        <p className="text-secondary" style={{ marginTop: "0.25rem" }}>
          Jumpstart your authoring with pre-structured business frameworks.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {SAMPLE_TEMPLATES.map((tmpl) => (
          <Card key={tmpl.id} hoverable style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span className="text-muted xs font-medium uppercase" style={{ letterSpacing: "0.04em" }}>{tmpl.category}</span>
                <h3 style={{ marginTop: "0.2rem" }}>{tmpl.title}</h3>
              </div>
              <Badge variant={tmpl.doc_type}>{tmpl.doc_type.toUpperCase()}</Badge>
            </div>

            <p className="text-secondary small">{tmpl.description}</p>

            <div style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: "0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <p className="text-muted xs font-medium mb-1">Includes Sections:</p>
              <ul style={{ listStyle: "circle", paddingLeft: "1.2rem", margin: 0 }} className="text-secondary xs">
                {tmpl.sections.map((sec, i) => (
                  <li key={i}>{sec}</li>
                ))}
              </ul>
            </div>

            <Button
              variant="primary"
              onClick={() => handleUseTemplate(tmpl)}
              style={{ marginTop: "auto" }}
            >
              <span>Use This Template</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
