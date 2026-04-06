// src/pages/Register.tsx
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await register({ name: name.trim(), email: email.trim(), password });
      navigate("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "40px auto" }}>
      <h1 style={{ marginBottom: 16 }}>Register</h1>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10 }}
        />
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
          {loading ? "Registering..." : "Create account"}
        </button>

        {error && <p style={{ color: "#ef4444", marginTop: 4 }}>{error}</p>}
      </form>
    </div>
  );
}