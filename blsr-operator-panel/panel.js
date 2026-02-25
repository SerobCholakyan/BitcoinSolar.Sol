const API = "https://api.bitcoinsolar.org";

async function loadMiners() {
  const res = await fetch(`${API}/metrics`);
  const text = await res.text();

  const miners = {};

  text.split("\n").forEach((line) => {
    if (line.startsWith("blsr_miner_shares_total")) {
      const match = line.match(
        /blsr_miner_shares_total\{address="([^"]+)",worker="([^"]+)",result="([^"]+)"\} (\d+(?:\.\d+)?)/
      );
      if (match) {
        const [, address, worker, result, count] = match;
        const key = `${address}::${worker}`;
        if (!miners[key]) {
          miners[key] = { address, worker, valid: 0, invalid: 0, last: null };
        }
        miners[key][result] = Number(count);
      }
    }

    if (line.startsWith("blsr_miner_last_share_ts")) {
      const match = line.match(
        /blsr_miner_last_share_ts\{address="([^"]+)",worker="([^"]+)"\} (\d+(?:\.\d+)?)/
      );
      if (match) {
        const [, address, worker, ts] = match;
        const key = `${address}::${worker}`;
        if (!miners[key]) {
          miners[key] = { address, worker, valid: 0, invalid: 0, last: null };
        }
        miners[key].last = new Date(Number(ts) * 1000).toLocaleString();
      }
    }
  });

  const tbody = document.querySelector("#miners-table tbody");
  tbody.innerHTML = "";

  Object.values(miners).forEach((m) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${m.address}</td>
      <td>${m.worker}</td>
      <td>${m.valid}</td>
      <td>${m.invalid}</td>
      <td>${m.last || "-"}</td>
    `;
    tbody.appendChild(row);
  });
}

async function loadPayouts() {
  const address = document.getElementById("payout-address").value.trim();
  if (!address) return;

  const res = await fetch(`${API}/payouts/${address}`);
  if (!res.ok) {
    alert("Failed to load payouts");
    return;
  }

  const payouts = await res.json();
  const tbody = document.querySelector("#payouts-table tbody");
  tbody.innerHTML = "";

  payouts.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.worker || "-"}</td>
      <td>${p.amount}</td>
      <td>${p.tx_hash}</td>
      <td>${new Date(p.timestamp * 1000).toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });
}

document.getElementById("load-payouts").addEventListener("click", loadPayouts);

loadMiners();
setInterval(loadMiners, 5000);
