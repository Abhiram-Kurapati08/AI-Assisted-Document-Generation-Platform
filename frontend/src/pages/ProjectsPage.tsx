import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../lib/api";
import type { Project, ProjectListResponse } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ToastContainer, type ToastMessage } from "../components/ui/Toast";

const defaultProjectForm = {
  title: "",
  doc_type: "docx",
  topic_prompt: "",
};

export const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Form states
  const [form, setForm] = useState(defaultProjectForm);
  const [creating, setCreating] = useState(false);

  const [generator, setGenerator] = useState({
    projectId: "",
    num_sections: 5,
    include_outline: true,
    outline_format: "",
  });
  const [generating, setGenerating] = useState(false);

  // Filter & Search
  const [search, setSearch] = useState("");
  const [docTypeFilter, setDocTypeFilter] = useState<string>("all");

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "info", message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  // Pre-fill from URL params if coming from templates
  useEffect(() => {
    const action = searchParams.get("action");
    const paramTitle = searchParams.get("title");
    const paramType = searchParams.get("doc_type");
    const paramPrompt = searchParams.get("prompt");

    if (action === "new") {
      setForm({
        title: paramTitle || "",
        doc_type: paramType === "pptx" ? "pptx" : "docx",
        topic_prompt: paramPrompt || "",
      });
      setIsCreateModalOpen(true);
      // Clean up search params
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ProjectListResponse>("/projects/", {
        params: { limit: 100 },
      });
      setProjects(data.items ?? []);
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? "Unable to load projects";
      setError(msg);
      addToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = !search || project.title.toLowerCase().includes(search.toLowerCase());
      const matchesType = docTypeFilter === "all" || project.doc_type === docTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [projects, search, docTypeFilter]);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      await api.post("/projects/", {
        title: form.title,
        doc_type: form.doc_type,
        topic_prompt: form.topic_prompt || null,
      });
      addToast("success", `Project "${form.title}" created!`);
      setForm(defaultProjectForm);
      setIsCreateModalOpen(false);
      await fetchProjects();
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? "Unable to create project";
      addToast("error", msg);
    } finally {
      setCreating(false);
    }
  };

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault();
    if (!generator.projectId) {
      addToast("error", "Select a project first");
      return;
    }
    setGenerating(true);
    try {
      await api.post(`/projects/${generator.projectId}/generate`, {
        num_sections: generator.num_sections,
        include_outline: generator.include_outline,
        outline_format: generator.outline_format || null,
      });
      addToast("success", "AI outline and sections generated!");
      setIsGenerateModalOpen(false);
      await fetchProjects();
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? "Unable to generate content";
      addToast("error", msg);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Header Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h2>Projects Hub</h2>
          <p className="text-secondary small" style={{ marginTop: "0.2rem" }}>
            Organize, generate, and export business documents.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={() => setIsGenerateModalOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
            <span>Generate AI Outline</span>
          </Button>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "1rem 1.25rem",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ flex: 1, minWidth: "240px" }}>
          <Input
            placeholder="Search projects by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ width: "180px" }}>
          <Select
            value={docTypeFilter}
            onChange={(e) => setDocTypeFilter(e.target.value)}
            options={[
              { value: "all", label: "All Formats" },
              { value: "docx", label: "Word (.docx)" },
              { value: "pptx", label: "PowerPoint (.pptx)" },
            ]}
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Projects Grid / Loading / Empty */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
          <Card><Skeleton height="150px" /></Card>
          <Card><Skeleton height="150px" /></Card>
          <Card><Skeleton height="150px" /></Card>
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title={search || docTypeFilter !== "all" ? "No matching projects found" : "No projects created yet"}
          description={
            search || docTypeFilter !== "all"
              ? "Try adjusting your search terms or format filters."
              : "Create a new project to start authoring document sections with AI."
          }
          actionLabel="Create First Project"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {filteredProjects.map((project) => (
            <Card key={project.id} hoverable style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600 }}>{project.title}</h3>
                <Badge variant={project.doc_type}>{project.doc_type.toUpperCase()}</Badge>
              </div>

              <p
                className="text-secondary small"
                style={{
                  flex: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {project.topic_prompt || "No topic description specified."}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  <span className="text-muted xs font-medium">{project.section_count ?? 0} sections</span>
                </div>

                <Link to={`/projects/${project.id}`} className="btn btn-outline btn-sm">
                  <span>Open Workspace</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Create Project */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        description="Specify document metadata and topic to initialize your authoring workspace."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" isLoading={creating} onClick={handleCreate}>
              Create Project
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input
            label="Project Title"
            placeholder="e.g. Q3 Enterprise Security Proposal"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />

          <Select
            label="Document Format"
            value={form.doc_type}
            onChange={(e) => setForm((prev) => ({ ...prev, doc_type: e.target.value as any }))}
            options={[
              { value: "docx", label: "Microsoft Word Document (.docx)" },
              { value: "pptx", label: "Microsoft PowerPoint Presentation (.pptx)" },
            ]}
          />

          <Textarea
            label="Topic Prompt & Instructions"
            placeholder="Describe the target audience, purpose, and key points for AI content generation..."
            rows={4}
            value={form.topic_prompt}
            onChange={(e) => setForm((prev) => ({ ...prev, topic_prompt: e.target.value }))}
          />
        </form>
      </Modal>

      {/* Modal: Generate AI Outline */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate AI Outline & Sections"
        description="Scaffold sections for an existing project automatically using the LLM."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" isLoading={generating} onClick={handleGenerate}>
              Generate Sections
            </Button>
          </>
        }
      >
        <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Select
            label="Target Project"
            value={generator.projectId}
            onChange={(e) => setGenerator((prev) => ({ ...prev, projectId: e.target.value }))}
            required
          >
            <option value="">Select a project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.doc_type.toUpperCase()})
              </option>
            ))}
          </Select>

          <Input
            label="Number of Sections to Scaffold"
            type="number"
            min={1}
            max={20}
            value={generator.num_sections}
            onChange={(e) =>
              setGenerator((prev) => ({ ...prev, num_sections: Number(e.target.value) }))
            }
          />

          <Input
            label="Outline Numbering Format (Optional)"
            placeholder="e.g. I. A. 1. or 1.0, 1.1"
            value={generator.outline_format}
            onChange={(e) => setGenerator((prev) => ({ ...prev, outline_format: e.target.value }))}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={generator.include_outline}
              onChange={(e) =>
                setGenerator((prev) => ({ ...prev, include_outline: e.target.checked }))
              }
            />
            <span>Include structured outline overview in initial section</span>
          </label>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
