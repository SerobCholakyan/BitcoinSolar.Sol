"use client";

import React from "react";
import "./theme.css";

export function ButtonSecondary({
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
        backgroundColor: "var(--bg-panel-alt)",
        color: "var(--neon-blue)",
        border: "1px solid var(--neon-blue)",
        fontWeight: 600,
        cursor: "pointer",
        transition: "background-color 0.2s ease"
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "rgba(96,165,250,0.1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "var(--bg-panel-alt)")
      }
    >
      {children}
    </button>
  );
}
