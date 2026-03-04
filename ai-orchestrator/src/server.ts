import express from "express";
import { getState } from "./state";
import { getServices } from "./services";
import { getIntents } from "./intents";
import { getMetrics } from "./metrics";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});

app.get("/state", (req, res) => {
  res.json(getState());
});

app.get("/services", (req, res) => {
  res.json(getServices());
});

app.get("/intents", (req, res) => {
  res.json(getIntents());
});

app.get("/metrics", (req, res) => {
  res.json(getMetrics());
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`AI Orchestrator API running on port ${PORT}`);
});
