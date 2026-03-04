"use client";

import React from "react";
import "./theme.css";

export function HealthBadge({ status }: { status: string }) {
  const palette: Record<string, { bg: string; fg: string; border: string }> = {
    running: {
      bg: "rgba(22, 163, 74, 0.15)",
      fg: "var(--neon-green)",
      border: "var(--neon-green)"
    },
    idle: {
      bg: "rgba(156, 163, 175, 0.15)",
      fg: "var(--neon-gray)",
      border: "var(--neon-gray)"
    },
    paused: {
      bg: "rgba(250, 204, 21, 0.15)",
      fg: "var(--neon-yellow)",
      border: "var(--neon-yellow)"
    },
    planning: {
      bg: "rgba(96, 165, 250, 0.15)",
      fg: "var(--neon-blue)",
      border: "var(--neon-blue)"
    },
    error: {
      bg: "rgba(248, 113, 113, 0.15)",
      fg: "var(--neon-red)",
      border: "var(--neon-red)"
    }
  };

  const { bg, fg, border } = palette[status] || palette.idle;

  return (
    <span
      className="health-badge"
      style={{
        backgroundColor: bg,
        color: fg,
        borderColor: border
      }}
    >
      {status}
    </span>
  );
}
