"use client";

import React from "react";
import "./theme.css";

export function Button({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: "var(--radius-md)",
        backgroundColor: "var(--neon-green)",
        color: "#0d0d0d",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 0 10px rgba(74, 222, 128, 0.5)",
        transition: "transform 0.15s ease"
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}
