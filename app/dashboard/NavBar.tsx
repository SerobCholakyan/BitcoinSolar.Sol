"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./theme.css";

export function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/services", label: "Services" },
    { href: "/dashboard/intents", label: "Intents" },
    { href: "/dashboard/metrics", label: "Metrics" },
    { href: "/dashboard/settings", label: "Settings" }
  ];

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

      <div style={{ display: "flex", gap: "24px" }}>
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
      </div>
    </nav>
  );
}
