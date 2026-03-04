"use client";

import React from "react";
import "./theme.css";

export function SolarLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "200px"
      }}
    >
      <div className="solar-loader" />
    </div>
  );
}
