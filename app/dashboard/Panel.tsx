import React from "react";
import "./theme.css";

export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-panel)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        border: "1px solid var(--border-soft)",
        marginBottom: "24px"
      }}
    >
      {children}
    </div>
  );
}
