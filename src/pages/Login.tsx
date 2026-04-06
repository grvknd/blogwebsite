// src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message ?? "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "40px auto" }}>
      <h1 style={{ marginBottom: 16 }}>Login</h1>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10 }}
        />
        <button type="submit" disabled={loading} style={{ padding: 10, cursor: "pointer" }}>
          {loading ? "Signing in..." : "Login"}
        </button>

        {error && <p style={{ color: "#ef4444", marginTop: 4 }}>{error}</p>}
      </form>

      <p style={{ marginTop: 12 }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}