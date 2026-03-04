"use client";

import React from "react";
import "./theme.css";

export function Input({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: "var(--radius-md)",
        backgroundColor: "var(--bg-panel-alt)",
        border: "1px solid var(--border-soft)",
        color: "var(--text-primary)",
        outline: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease"
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--neon-blue)";
        e.currentTarget.style.boxShadow = "0 0 8px rgba(96,165,250,0.4)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border-soft)";
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  );
}
