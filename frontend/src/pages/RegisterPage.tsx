import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register(email, password);
      navigate("/projects", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h2>Create your Draftly Account</h2>
        <p className="text-secondary small" style={{ marginTop: "0.25rem" }}>
          Start authoring AI-assisted documents in seconds.
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
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          autoComplete="new-password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
          required
        />

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" variant="primary" isLoading={loading} style={{ marginTop: "0.5rem" }}>
          Create Account
        </Button>
      </form>

      <p className="text-secondary small" style={{ textAlign: "center" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ fontWeight: 600 }}>
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
