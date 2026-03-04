"use client";

import { useEffect, useState } from "react";
import "./theme.css";
import { NavBar } from "./NavBar";
import { Panel } from "./Panel";
import { Card } from "./Card";
import { HealthBadge } from "./HealthBadge";
import { SolarLoader } from "./SolarLoader";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_ORCHESTRATOR_URL + "/state",
          { cache: "no-store" }
        );
        const data = await res.json();
        setState(data);
      } catch (err) {
        console.error("Failed to fetch orchestrator state:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <NavBar />
        <SolarLoader />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <NavBar />

      <h1 className="dashboard-heading">Orchestrator Overview</h1>

      <Panel>
        <div className="grid-3">
          <Card title="Orchestrator Status">
            <HealthBadge status={state?.orchestrator?.status} />
            <p style={{ marginTop: "12px" }}>
              Last heartbeat: {state?.orchestrator?.lastHeartbeat}
            </p>
          </Card>

          <Card title="Active Services">
            <p>{state?.services?.activeCount ?? 0} running</p>
          </Card>

          <Card title="Pending Intents">
            <p>{state?.intents?.pendingCount ?? 0} queued</p>
          </Card>
        </div>
      </Panel>

      <h2 className="dashboard-subheading">Recent Activity</h2>

      <Panel>
        {state?.intents?.recent?.length === 0 && (
          <p>No recent intents.</p>
        )}

        {state?.intents?.recent?.map((intent: any, i: number) => (
          <div
            key={i}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid var(--border-soft)"
            }}
          >
            <strong>{intent.type}</strong>
            <p style={{ opacity: 0.7 }}>{intent.timestamp}</p>
          </div>
        ))}
      </Panel>
    </div>
  );
}
