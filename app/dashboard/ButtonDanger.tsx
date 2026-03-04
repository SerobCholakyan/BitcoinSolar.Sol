"use client";

import React from "react";
import "./theme.css";

export function ButtonDanger({
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
        backgroundColor: "rgba(248,113,113,0.15)",
        color: "var(--neon-red)",
        border: "1px solid var(--neon-red)",
        fontWeight: 600,
        cursor: "pointer"
      }}
    >
      {children}
    </button>
  );
}
