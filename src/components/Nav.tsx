import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import React, { useState } from "react";
import ConfirmDialog from "./ConfirmDialog"; // ✅ NEW

const linkBase: React.CSSProperties = {
  color: "#e2e8f0",
  padding: "8px 10px",
  borderRadius: 6,
};

function navLinkStyle({ isActive }: { isActive: boolean }): React.CSSProperties {
  return {
    ...linkBase,
    background: isActive ? "rgba(148, 163, 184, 0.15)" : "transparent",
  };
}

export default function Nav() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false); // ✅ NEW

  const openLogoutConfirm = () => setShowConfirm(true);   // NEW
  const cancelLogout = () => setShowConfirm(false);        // NEW

  const confirmLogout = () => {                           // NEW
    setShowConfirm(false);
    logout();
    navigate("/");
  };

  return (
    <>
      <nav
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          background: "#0f172a",
          borderBottom: "1px solid rgba(148,163,184,0.15)",
        }}
      >
        {/* Brand Name */}
        <div
          onClick={() => navigate("/dashboard")}
          style={{
            color: "#3b82f6",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "6px",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "#60a5fa";
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "#3b82f6";
            e.currentTarget.style.background = "transparent";
          }}
        >
          OneBlog
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <NavLink to="/dashboard" style={navLinkStyle}>Dashboard</NavLink>
          {currentUser && (
            <NavLink to="/profile" style={navLinkStyle}>Profile</NavLink>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>
            {currentUser ? `Hi, ${currentUser.name}` : "Status: logged out"}
          </span>

          {!currentUser && (
            <>
              <NavLink to="/" style={navLinkStyle}>Login</NavLink>
              <NavLink to="/register" style={navLinkStyle}>Register</NavLink>
            </>
          )}

          {currentUser && (
            <button
              onClick={openLogoutConfirm}              // ⬅️ NEW CHANGED
              style={{
                ...linkBase,
                background: "rgba(239, 68, 68, 0.20)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      
      <ConfirmDialog
        open={showConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}