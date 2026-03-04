import React from "react";
import "./theme.css";

export function Card({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-panel-alt)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        border: "1px solid var(--border-soft)",
        marginBottom: "20px"
      }}
    >
      <h3 style={{ color: "var(--text-heading)", marginBottom: "12px" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
