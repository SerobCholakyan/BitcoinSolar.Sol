"use client";

import React from "react";
import "./theme.css";

export function ButtonWarning({
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
        backgroundColor: "rgba(250,204,21,0.15)",
        color: "var(--neon-yellow)",
        border: "1px solid var(--neon-yellow)",
        fontWeight: 600,
        cursor: "pointer"
      }}
    >
      {children}
    </button>
  );
}
