"use client";

import { useState } from "react";
import "../../dashboard/theme.css";
import { Input } from "../../dashboard/Input";
import { Button } from "../../dashboard/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-main)",
        padding: "24px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--bg-panel)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
          border: "1px solid var(--border-soft)",
          boxShadow: "0 0 20px rgba(250, 204, 21, 0.15)"
        }}
      >
        <h1
          style={{
            color: "var(--neon-yellow)",
            fontSize: "28px",
            marginBottom: "24px",
            textAlign: "center",
            letterSpacing: "1px"
          }}
        >
          BitcoinSolar Login
        </h1>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>Email</label>
          <Input value={email} onChange={setEmail} placeholder="you@example.com" />
        </div>

        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>Password</label>
          <Input
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />
        </div>

        <Button onClick={handleLogin}>Login</Button>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "var(--text-secondary)",
            fontSize: "14px"
          }}
        >
          Access restricted to BitcoinSolar operators.
        </p>
      </div>
    </div>
  );
}
