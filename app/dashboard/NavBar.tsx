"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./theme.css";
import { useMetamask } from "./useMetamask";

export function NavBar() {
  const pathname = usePathname();
  const { address, connect } = useMetamask();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/services", label: "Services" },
    { href: "/dashboard/intents", label: "Intents" },
    { href: "/dashboard/metrics", label: "Metrics" },
    { href: "/dashboard/settings", label: "Settings" }
  ];

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <nav
      style={{
        width: "100%",
        backgroundColor: "var(--bg-panel)",
        borderBottom: "1px solid var(--border-soft)",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}
    >
      <div
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--neon-yellow)",
          letterSpacing: "1px"
        }}
      >
        BitcoinSolar
      </div>

      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: active ? "var(--neon-green)" : "var(--text-secondary)",
                fontWeight: active ? 600 : 500,
                textDecoration: "none",
                padding: "6px 0",
                borderBottom: active
                  ? "2px solid var(--neon-green)"
                  : "2px solid transparent",
                transition: "color 0.2s ease, border-color 0.2s ease"
              }}
            >
              {link.label}
            </Link>
          );
        })}

        {address ? (
          <span
            style={{
              fontSize: "12px",
              color: "var(--neon-blue)",
              border: "1px solid var(--neon-blue)",
              borderRadius: "999px",
              padding: "4px 10px"
            }}
          >
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connect}
            style={{
              color: "#0d0d0d",
              backgroundColor: "var(--neon-green)",
              borderRadius: "999px",
              border: "none",
              padding: "6px 12px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Connect Wallet
          </button>
        )}

        <button
          onClick={logout}
          style={{
            color: "var(--neon-red)",
            fontWeight: 600,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 0"
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
