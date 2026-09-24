import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { ToastContainer, type ToastMessage } from "../components/ui/Toast";

export const AiToolsPage = () => {
  const [activeTab, setActiveTab] = useState<"summarizer" | "tone" | "outline">("summarizer");
  const [inputContent, setInputContent] = useState("");
  const [toneOption, setToneOption] = useState("executive");
  const [resultContent, setResultContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "info", message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const handleRunAiTool = async () => {
    if (!inputContent.trim()) {
      addToast("error", "Please provide input text or prompt to process.");
      return;
    }
    setIsProcessing(true);
    setResultContent("");
    try {
      // Simulate quick client processing or mock output format
      await new Promise((res) => setTimeout(res, 1200));
      if (activeTab === "summarizer") {
        setResultContent(
          `**Executive Summary & Key Takeaways**\n\n1. Primary Focus: ${inputContent.slice(0, 100)}...\n2. Strategic Impact: Streamlined authoring workflow and high-fidelity output generation.\n3. Recommendation: Deploy outline scaffolding across all active business units.`
        );
      } else if (activeTab === "tone") {
        setResultContent(
          `**Refined Tone (${toneOption.toUpperCase()})**\n\n${inputContent
            .split(". ")
            .map((s) => `Furthermore, ${s.trim()}`)
            .join(". ")}`
        );
      } else {
        setResultContent(
          `**Generated Outline Scaffolding**\n\nI. Executive Overview & Objectives\nII. Context & Requirements Analysis\nIII. Core Implementation Framework\nIV. Risk Mitigation & Compliance\nV. Next Steps & Timeline`
        );
      }
      addToast("success", "AI processing complete!");
    } catch {
      addToast("error", "Unable to process content.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div>
        <h2>AI Authoring Studio</h2>
        <p className="text-secondary" style={{ marginTop: "0.25rem" }}>
          Standalone AI utilities for drafting, summarizing, and transforming business text.
        </p>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
        <Button
          variant={activeTab === "summarizer" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("summarizer")}
        >
          <span>Executive Summarizer</span>
        </Button>
        <Button
          variant={activeTab === "tone" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("tone")}
        >
          <span>Tone & Style Adjuster</span>
        </Button>
        <Button
          variant={activeTab === "outline" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("outline")}
        >
          <span>Quick Outline Scaffold</span>
        </Button>
      </div>

      {/* Main Studio Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {/* Input Panel */}
        <Card style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Input Content</h3>
            <Badge variant="ai">AI Ready</Badge>
          </div>

          {activeTab === "tone" && (
            <Select
              label="Target Tone"
              value={toneOption}
              onChange={(e) => setToneOption(e.target.value)}
              options={[
                { value: "executive", label: "Executive & Formal" },
                { value: "persuasive", label: "Persuasive Sales Pitch" },
                { value: "technical", label: "Technical & Precise" },
                { value: "concise", label: "Ultra Concise Bullet Points" },
              ]}
            />
          )}

          <Textarea
            label={activeTab === "outline" ? "Topic Prompt" : "Source Draft Text"}
            placeholder={
              activeTab === "outline"
                ? "e.g. AI-driven cybersecurity SaaS proposal for enterprise clients..."
                : "Paste your raw document draft, section text, or notes here..."
            }
            rows={10}
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
          />

          <Button
            variant="primary"
            isLoading={isProcessing}
            onClick={handleRunAiTool}
          >
            <span>Run AI Transformation</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </Button>
        </Card>

        {/* Output Result Panel */}
        <Card style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Transformed Output</h3>
            {resultContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(resultContent);
                  addToast("info", "Copied to clipboard!");
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                <span>Copy</span>
              </Button>
            )}
          </div>

          <Textarea
            placeholder="AI response output will appear here..."
            rows={12}
            value={resultContent}
            readOnly
            style={{ backgroundColor: "var(--bg-app)", fontFamily: "monospace", fontSize: "0.85rem" }}
          />
        </Card>
      </div>
    </div>
  );
};

export default AiToolsPage;
