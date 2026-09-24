import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import type { Project, ProjectListResponse } from "../types";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";

export const DashboardPage = () => {
  const { userEmail } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data } = await api.get<ProjectListResponse>("/projects/", {
          params: { limit: 6 },
        });
        setProjects(data.items ?? []);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const docxCount = projects.filter((p) => p.doc_type === "docx").length;
  const pptxCount = projects.filter((p) => p.doc_type === "pptx").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Welcome Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          padding: "1.75rem 2rem",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-subtle)",
          background: "radial-gradient(circle at top right, rgba(59, 130, 246, 0.12) 0%, transparent 60%), var(--bg-surface)",
        }}
      >
        <div>
          <h2>Welcome back, {userEmail?.split("@")[0]}</h2>
          <p className="text-secondary" style={{ marginTop: "0.25rem" }}>
            Author, structure, and refine business-ready documents with AI assistance.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button variant="primary" onClick={() => navigate("/projects?action=new")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Document</span>
          </Button>
          <Button variant="secondary" onClick={() => navigate("/templates")}>
            <span>Browse Templates</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}
      >
        <Card>
          <p className="text-muted xs uppercase font-medium" style={{ letterSpacing: "0.05em" }}>
            Total Projects
          </p>
          <h1 style={{ marginTop: "0.5rem", color: "var(--text-primary)" }}>
            {loading ? <Skeleton width="40px" height="32px" /> : projects.length}
          </h1>
          <p className="text-secondary xs" style={{ marginTop: "0.25rem" }}>
            Active document workspaces
          </p>
        </Card>

        <Card>
          <p className="text-muted xs uppercase font-medium" style={{ letterSpacing: "0.05em" }}>
            Word Documents (.docx)
          </p>
          <h1 style={{ marginTop: "0.5rem", color: "#60a5fa" }}>
            {loading ? <Skeleton width="40px" height="32px" /> : docxCount}
          </h1>
          <p className="text-secondary xs" style={{ marginTop: "0.25rem" }}>
            Structured reports & proposals
          </p>
        </Card>

        <Card>
          <p className="text-muted xs uppercase font-medium" style={{ letterSpacing: "0.05em" }}>
            Presentations (.pptx)
          </p>
          <h1 style={{ marginTop: "0.5rem", color: "#f59e0b" }}>
            {loading ? <Skeleton width="40px" height="32px" /> : pptxCount}
          </h1>
          <p className="text-secondary xs" style={{ marginTop: "0.25rem" }}>
            AI-assisted slide outlines
          </p>
        </Card>
      </div>

      {/* Recent Projects Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h3>Recent Projects</h3>
            <p className="text-secondary small">Pick up right where you left off.</p>
          </div>
          <Link to="/projects" className="btn btn-ghost btn-sm">
            <span>View All</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <Card><Skeleton height="140px" /></Card>
            <Card><Skeleton height="140px" /></Card>
            <Card><Skeleton height="140px" /></Card>
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects created yet"
            description="Start by creating your first document or using the AI outline generator."
            actionLabel="Create Project"
            onAction={() => navigate("/projects?action=new")}
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {projects.slice(0, 6).map((project) => (
              <Card key={project.id} hoverable style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h4 style={{ color: "var(--text-primary)", fontWeight: 600 }}>{project.title}</h4>
                  <Badge variant={project.doc_type}>{project.doc_type.toUpperCase()}</Badge>
                </div>
                <p className="text-secondary small" style={{ flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {project.topic_prompt || "No prompt description provided."}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid var(--border-subtle)" }}>
                  <span className="text-muted xs">{project.section_count ?? 0} sections</span>
                  <Link to={`/projects/${project.id}`} className="btn btn-outline btn-sm">
                    <span>Open Editor</span>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
