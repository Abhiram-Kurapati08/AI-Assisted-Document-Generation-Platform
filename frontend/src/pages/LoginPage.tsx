import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      const from = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
      const path = from?.pathname ?? "";
      const redirect =
        path.startsWith("/") && !path.startsWith("//") && !path.includes("\\")
          ? `${path}${from?.search ?? ""}${from?.hash ?? ""}`
          : "/projects";
      navigate(redirect, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Unable to login. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h2>Sign in to Draftly</h2>
        <p className="text-secondary small" style={{ marginTop: "0.25rem" }}>
          Access your AI document authoring workspace.
        </p>
      </div>

      <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" variant="primary" isLoading={loading} style={{ marginTop: "0.5rem" }}>
          Sign In
        </Button>
      </form>

      <p className="text-secondary small" style={{ textAlign: "center" }}>
        New to Draftly?{" "}
        <Link to="/register" style={{ fontWeight: 600 }}>
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
