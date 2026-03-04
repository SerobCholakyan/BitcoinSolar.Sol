import { NavBar } from "./NavBar";
import { getDashboardSnapshot } from "../actions/getDashboardSnapshot";
import { Panel } from "./Panel";
import { Card } from "./Card";
import { HealthBadge } from "./HealthBadge";
import { SolarLoader } from "./SolarLoader";
import "./theme.css";

export default async function DashboardPage() {
  const data = await getDashboardSnapshot();

  if (!data) {
    return (
      <div className="dashboard-container">
        <NavBar />
        <SolarLoader />
      </div>
    );
  }

  const { orchestrator, services, intents, metrics } = data;

  return (
    <div className="dashboard-container">
      <NavBar />

      <h1 className="dashboard-heading">AI Orchestrator Dashboard</h1>

      <Panel>
        <h2 className="dashboard-subheading">System Overview</h2>
        <p>
          <strong>Health:</strong> <HealthBadge status={orchestrator.health} />
        </p>
        <p>
          <strong>Last Tick:</strong>{" "}
          {new Date(orchestrator.lastTick).toLocaleString()}
        </p>
      </Panel>

      <Panel>
        <h2 className="dashboard-subheading">Services</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
