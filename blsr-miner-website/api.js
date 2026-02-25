// api.js
// Thin wrapper around your backend

const API_BASE = ""; // same origin, or set to "http://localhost:8080"

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function pingMining(address) {
  // This is a placeholder "start mining" call.
  // You can extend your backend with a /start_mining endpoint if you want.
  const res = await fetch(`${API_BASE}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      job_id: "manual",
      address,
      nonce: "00",
      hash: "00"
    })
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Mining request failed");
  }
  return body;
}
