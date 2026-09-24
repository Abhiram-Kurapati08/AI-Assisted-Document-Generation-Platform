import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ToastContainer, type ToastMessage } from "../components/ui/Toast";

export const SettingsPage = () => {
  const { userEmail, logout } = useAuth();
  const [defaultFormat, setDefaultFormat] = useState("docx");
  const [llmTemperature, setLlmTemperature] = useState("0.7");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setToasts((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "success", message: "Author preferences updated successfully!" },
    ]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: "800px" }}>
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div>
        <h2>Account & Platform Settings</h2>
        <p className="text-secondary" style={{ marginTop: "0.25rem" }}>
          Manage your account identity, default document export preferences, and AI provider status.
        </p>
      </div>

      {/* User Profile Card */}
      <Card style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <h3>Author Profile</h3>
        <Input label="Email Address" value={userEmail || ""} readOnly disabled />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p className="text-primary font-medium">Authentication Token Session</p>
            <p className="text-muted xs">Authenticated via OAuth2 JWT Bearer strategy.</p>
          </div>
          <Badge variant="success">Active Session</Badge>
        </div>
      </Card>

      {/* Preferences Form */}
      <form onSubmit={handleSaveSettings}>
        <Card style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h3>Default Document Preferences</h3>
          
          <Select
            label="Default Document Export Format"
            value={defaultFormat}
            onChange={(e) => setDefaultFormat(e.target.value)}
            options={[
              { value: "docx", label: "Microsoft Word (.docx)" },
              { value: "pptx", label: "Microsoft PowerPoint (.pptx)" },
              { value: "txt", label: "Plain Text (.txt)" },
            ]}
          />

          <Select
            label="Default AI Temperature (Creativity Level)"
            value={llmTemperature}
            onChange={(e) => setLlmTemperature(e.target.value)}
            options={[
              { value: "0.2", label: "0.2 - Strict & Fact-focused" },
              { value: "0.5", label: "0.5 - Balanced Professional" },
              { value: "0.7", label: "0.7 - Creative & Fluent (Default)" },
              { value: "0.9", label: "0.9 - High Innovation" },
            ]}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.5rem" }}>
            <Button type="submit" variant="primary">
              Save Preferences
            </Button>
          </div>
        </Card>
      </form>

      {/* Danger Zone */}
      <Card style={{ border: "1px solid rgba(239, 68, 68, 0.3)", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3 style={{ color: "var(--destructive)" }}>Session Actions</h3>
        <p className="text-secondary small">
          Signing out will invalidate your local session tokens. You can log back in anytime.
        </p>
        <div>
          <Button variant="destructive" onClick={logout}>
            Sign Out of Draftly
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
