import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div >
      <h1 style={{ fontSize: "6rem", margin: 0, color: "#343a40" }}>404</h1>
      <h2 style={{ color: "#495057" }}>Page Not Found</h2>
      <p style={{ color: "#868e96", marginBottom: "2rem" }}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/dashboard" style={{
        padding: "0.75rem 1.5rem",
        background: "#007bff",
        color: "white",
        borderRadius: "4px",
        textDecoration: "none",
        fontWeight: "bold"
      }}>
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;