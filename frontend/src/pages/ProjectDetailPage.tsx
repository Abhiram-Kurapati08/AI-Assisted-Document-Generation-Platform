import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import api, { getApiErrorMessage } from "../lib/api";
import type { Project, Section, SectionListResponse } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Skeleton } from "../components/ui/Skeleton";
import { ToastContainer, type ToastMessage } from "../components/ui/Toast";

const emptySection = {
  title: "",
  content: "",
  idx: 0,
};

export const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sectionForm, setSectionForm] = useState(emptySection);
  const [savingSection, setSavingSection] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  // AI states
  const [refinePrompt, setRefinePrompt] = useState("");
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [llmBusy, setLlmBusy] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState<"edit" | "generate" | "refine">("edit");

  // Export states
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"docx" | "pptx" | "txt">("docx");

  // Modal
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "info", message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const fetchProject = async () => {
    if (!projectId) return;
    try {
      const { data } = await api.get<Project>(`/projects/${projectId}`);
      setProject(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Unable to load project"));
    }
  };

  const fetchSections = async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<SectionListResponse>(
        `/projects/${projectId}/sections/`,
        { params: { limit: 100 } }
      );
      setSections(data.items ?? []);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Unable to load sections"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchSections();
  }, [projectId]);

  useEffect(() => {
    if (sections.length === 0) {
      setSelectedSection(null);
      return;
    }
    setSelectedSection((prev) => {
      if (!prev) return sections[0];
      const updated = sections.find((section) => section.id === prev.id);
      return updated ?? sections[0];
    });
  }, [sections]);

  const handleSectionCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!projectId || !sectionForm.title.trim()) return;
    setSavingSection(true);
    try {
      await api.post(`/projects/${projectId}/sections/`, {
        title: sectionForm.title,
        content: sectionForm.content,
        idx: sectionForm.idx,
      });
      addToast("success", `Section "${sectionForm.title}" added!`);
      setSectionForm(emptySection);
      setIsAddSectionOpen(false);
      await fetchSections();
    } catch (err: unknown) {
      addToast("error", getApiErrorMessage(err, "Unable to create section"));
    } finally {
      setSavingSection(false);
    }
  };

  const handleSectionUpdate = async (section: Section) => {
    if (!projectId) return;
    setSavingSection(true);
    try {
      await api.put(`/projects/${projectId}/sections/${section.id}`, {
        title: section.title,
        content: section.content,
      });
      addToast("success", "Section content saved!");
      await fetchSections();
    } catch (err: unknown) {
      addToast("error", getApiErrorMessage(err, "Unable to update section"));
    } finally {
      setSavingSection(false);
    }
  };

  const handleGenerate = async () => {
    if (!projectId || !selectedSection) return;
    setLlmBusy(true);
    try {
      const { data } = await api.post(
        `/projects/${projectId}/sections/${selectedSection.id}/refine/generate`,
        {
          prompt: generatePrompt || selectedSection.title,
          temperature: 0.7,
          max_tokens: 800,
        }
      );
      setSelectedSection(data);
      addToast("success", "AI generated content for section!");
      await fetchSections();
      setActiveAiTab("edit");
    } catch (err: unknown) {
      addToast("error", getApiErrorMessage(err, "Unable to generate content"));
    } finally {
      setLlmBusy(false);
    }
  };

  const handleRefine = async () => {
    if (!projectId || !selectedSection) return;
    setLlmBusy(true);
    try {
      const { data } = await api.post(
        `/projects/${projectId}/sections/${selectedSection.id}/refine/`,
        {
          refine_instruction: refinePrompt,
          preserve_formatting: true,
          temperature: 0.6,
          max_tokens: 800,
        }
      );
      setSelectedSection(data);
      addToast("success", "AI refined section content!");
      await fetchSections();
      setRefinePrompt("");
      setActiveAiTab("edit");
    } catch (err: unknown) {
      addToast("error", getApiErrorMessage(err, "Unable to refine content"));
    } finally {
      setLlmBusy(false);
    }
  };

  const handleExport = async () => {
    if (!projectId) return;
    setExporting(true);
    try {
      const authHeader =
        typeof api.defaults.headers.common.Authorization === "string"
          ? api.defaults.headers.common.Authorization
          : undefined;
      const baseURL = api.defaults.baseURL || "/api";
      const response = await fetch(
        `${baseURL}/projects/${projectId}/export/?format=${exportFormat}`,
        {
          headers: authHeader ? { Authorization: authHeader } : undefined,
        }
      );
      if (!response.ok) throw new Error("Export request failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${project?.title ?? "document"}.${exportFormat}`;
      link.click();
      window.URL.revokeObjectURL(url);
      addToast("success", `Downloaded ${exportFormat.toUpperCase()} file!`);
    } catch (err: unknown) {
      addToast("error", getApiErrorMessage(err, "Unable to download export"));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Top Document Bar */}
      <Card style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <Link to="/projects" className="btn btn-ghost btn-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Back to Projects</span>
          </Link>

          {project && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <div style={{ width: "130px" }}>
                <Select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  options={[
                    { value: "docx", label: ".DOCX" },
                    { value: "pptx", label: ".PPTX" },
                    { value: "txt", label: ".TXT" },
                  ]}
                />
              </div>

              <Button
                variant="primary"
                isLoading={exporting}
                onClick={handleExport}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Export {exportFormat.toUpperCase()}</span>
              </Button>
            </div>
          )}
        </div>

        {project ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
              <h2>{project.title}</h2>
              <Badge variant={project.doc_type}>{project.doc_type.toUpperCase()}</Badge>
            </div>
            <p className="text-secondary small">{project.topic_prompt || "No prompt description specified."}</p>
          </div>
        ) : (
          <Skeleton height="60px" />
        )}
      </Card>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Editor Split Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {/* Left Column: Sections List Sidebar */}
        <Card style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3>Document Sections</h3>
              <p className="text-muted xs">{sections.length} total sections</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setIsAddSectionOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add</span>
            </Button>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Skeleton height="45px" />
              <Skeleton height="45px" />
              <Skeleton height="45px" />
            </div>
          ) : sections.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 1rem", border: "1px dashed var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
              <p className="text-secondary small">No sections created yet.</p>
              <Button variant="outline" size="sm" onClick={() => setIsAddSectionOpen(true)} style={{ marginTop: "0.75rem" }}>
                Add First Section
              </Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {sections.map((sec, idx) => {
                const isSelected = selectedSection?.id === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedSection(sec)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 0.9rem",
                      borderRadius: "var(--radius-md)",
                      border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border-subtle)",
                      backgroundColor: isSelected ? "var(--primary-light)" : "var(--bg-surface-elevated)",
                      color: isSelected ? "var(--primary)" : "var(--text-primary)",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "var(--transition)",
                      outline: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", overflow: "hidden" }}>
                      <span className="text-muted xs font-medium" style={{ minWidth: "16px" }}>
                        {idx + 1}.
                      </span>
                      <span style={{ fontWeight: isSelected ? 600 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {sec.title}
                      </span>
                    </div>
                    <Badge variant={sec.initial_generated ? "ai" : "manual"}>
                      {sec.initial_generated ? "AI" : "Manual"}
                    </Badge>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {/* Right Column: Active Section Workspace & AI Refiner */}
        <Card style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {selectedSection ? (
            <>
              {/* Section Header Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <h3 style={{ color: "var(--text-primary)" }}>Section Editor</h3>
                  <p className="text-muted xs">Editing section #{selectedSection.idx + 1}</p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Button
                    variant={activeAiTab === "edit" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveAiTab("edit")}
                  >
                    <span>Direct Edit</span>
                  </Button>
                  <Button
                    variant={activeAiTab === "generate" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveAiTab("generate")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                    <span>AI Generate</span>
                  </Button>
                  <Button
                    variant={activeAiTab === "refine" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveAiTab("refine")}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span>AI Refine</span>
                  </Button>
                </div>
              </div>

              {/* Title Input */}
              <Input
                label="Section Title"
                value={selectedSection.title}
                onChange={(e) =>
                  setSelectedSection((prev) =>
                    prev ? { ...prev, title: e.target.value } : prev
                  )
                }
              />

              {/* AI Assistant Sub-Panel (Progressive Disclosure) */}
              {activeAiTab === "generate" && (
                <div
                  style={{
                    backgroundColor: "var(--primary-light)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    padding: "1rem",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <p className="text-primary font-medium small">Generate Section Draft with AI</p>
                  <Input
                    placeholder="Enter prompt e.g. Write a 3-paragraph executive summary detailing cloud architecture..."
                    value={generatePrompt}
                    onChange={(e) => setGeneratePrompt(e.target.value)}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                    <Button variant="ghost" size="sm" onClick={() => setActiveAiTab("edit")}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" isLoading={llmBusy} onClick={handleGenerate}>
                      Generate Text
                    </Button>
                  </div>
                </div>
              )}

              {activeAiTab === "refine" && (
                <div
                  style={{
                    backgroundColor: "rgba(168, 85, 247, 0.1)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                    padding: "1rem",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <p className="text-primary font-medium small">Refine Current Content with AI</p>
                  <Input
                    placeholder="Enter instructions e.g. Make the tone more formal and fix grammatical clarity..."
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                    <Button variant="ghost" size="sm" onClick={() => setActiveAiTab("edit")}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" isLoading={llmBusy} onClick={handleRefine}>
                      Refine Content
                    </Button>
                  </div>
                </div>
              )}

              {/* Textarea Content Editor */}
              <Textarea
                label="Section Body Content"
                rows={14}
                value={selectedSection.content || ""}
                onChange={(e) =>
                  setSelectedSection((prev) =>
                    prev ? { ...prev, content: e.target.value } : prev
                  )
                }
              />

              {/* Bottom Action Footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
                <Button
                  variant="primary"
                  isLoading={savingSection}
                  onClick={() => selectedSection && handleSectionUpdate(selectedSection)}
                >
                  Save Section Changes
                </Button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
              <p className="text-secondary">Select a section from the left sidebar or create a new section.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Modal: Add Manual Section */}
      <Modal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        title="Add Manual Section"
        description="Insert a custom section directly into this document."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddSectionOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" isLoading={savingSection} onClick={handleSectionCreate}>
              Add Section
            </Button>
          </>
        }
      >
        <form onSubmit={handleSectionCreate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input
            label="Section Title"
            placeholder="e.g. Technical Specifications"
            value={sectionForm.title}
            onChange={(e) => setSectionForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />

          <Textarea
            label="Initial Content (Optional)"
            placeholder="Enter draft text for this section..."
            rows={5}
            value={sectionForm.content}
            onChange={(e) => setSectionForm((prev) => ({ ...prev, content: e.target.value }))}
          />

          <Input
            label="Section Index Position"
            type="number"
            min={0}
            value={sectionForm.idx}
            onChange={(e) => setSectionForm((prev) => ({ ...prev, idx: Number(e.target.value) }))}
          />
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;
