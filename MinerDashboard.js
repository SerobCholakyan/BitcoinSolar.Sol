<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BLSR Miner — Singularity Engine</title>

  <!-- Ethers v6 UMD -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.1/ethers.umd.min.js"></script>

  <style>
    /* --- Base Styling --- */
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #050510;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: #f9fafb;
    }

    * {
      box-sizing: border-box;
    }

    /* --- Wallpaper --- */
    #wallpaper {
      position: absolute;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background:
        radial-gradient(circle at 20% 0%, rgba(56, 189, 248, 0.12) 0, transparent 55%),
        radial-gradient(circle at 80% 100%, rgba(129, 140, 248, 0.16) 0, transparent 55%),
        radial-gradient(circle at center, #0f172a 0%, #000 100%);
      overflow: hidden;
      z-index: 1;
    }

    /* --- Floating Bubbles --- */
    .bubble {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(148,163,184,0.02));
      border: 1px solid rgba(148,163,184,0.25);
      box-shadow:
        0 0 40px rgba(56,189,248,0.15),
        inset 0 0 30px rgba(15,23,42,0.8);
      opacity: 0.35;
      filter: blur(0.2px);
      mix-blend-mode: screen;
      animation: floatBubble linear infinite;
    }

    @keyframes floatBubble {
      0% {
        transform: translate3d(0, 0, 0) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 0.4;
      }
      50% {
        opacity: 0.7;
      }
      90% {
        opacity: 0.2;
      }
      100% {
        transform: translate3d(0, -120vh, 0) scale(1.2);
        opacity: 0;
      }
    }

    /* --- Singularity Core --- */
    #singularity-core {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 2;
    }

    .core-orbit {
      position: relative;
      width: 420px;
      height: 420px;
      border-radius: 50%;
      background:
        radial-gradient(circle at center, rgba(15,23,42,0.9) 0, rgba(15,23,42,0.1) 55%, transparent 70%);
      box-shadow:
        0 0 120px rgba(56,189,248,0.35),
        0 0 220px rgba(129,140,248,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
    }

    .core-ring {
      position: absolute;
      inset: 12%;
      border-radius: 50%;
      border: 1px solid rgba(148,163,184,0.35);
      box-shadow:
        0 0 40px rgba(56,189,248,0.35),
        inset 0 0 40px rgba(15,23,42,0.9);
      backdrop-filter: blur(12px);
      mask-image: radial-gradient(circle at center, transparent 0, black 40%, transparent 100%);
    }

    .core-pulse {
      position: absolute;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background:
        radial-gradient(circle at 30% 20%, rgba(248,250,252,0.9), rgba(56,189,248,0.1));
      box-shadow:
        0 0 60px rgba(56,189,248,0.8),
        0 0 120px rgba(129,140,248,0.8);
      animation: corePulse 3.2s ease-in-out infinite;
    }

    @keyframes corePulse {
      0% {
        transform: scale(0.96);
        opacity: 0.9;
      }
      50% {
        transform: scale(1.05);
        opacity: 1;
      }
      100% {
        transform: scale(0.96);
        opacity: 0.9;
      }
    }

    .core-orbit-line {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1px dashed rgba(148,163,184,0.25);
      animation: orbitSpin 18s linear infinite;
    }

    .core-orbit-line:nth-child(2) {
      inset: 8%;
      animation-duration: 26s;
      animation-direction: reverse;
      opacity: 0.7;
    }

    .core-orbit-line:nth-child(3) {
      inset: 16%;
      animation-duration: 34s;
      opacity: 0.5;
    }

    @keyframes orbitSpin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .core-fragment {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: radial-gradient(circle at 30% 30%, #e5e7eb, #38bdf8);
      box-shadow:
        0 0 20px rgba(56,189,248,0.9),
        0 0 40px rgba(129,140,248,0.9);
      animation: fragmentOrbit linear infinite;
    }

    @keyframes fragmentOrbit {
      0% {
        transform: rotate(0deg) translateX(150px) rotate(0deg);
      }
      100% {
        transform: rotate(360deg) translateX(150px) rotate(-360deg);
      }
    }

    /* --- UI Shell --- */
    #ui-shell {
      position: relative;
      z-index: 3;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 24px;
      pointer-events: none;
    }

    @media (max-width: 768px) {
      #ui-shell {
        padding: 16px;
      }
    }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
      pointer-events: auto;
    }

    .brand {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .brand-title {
      font-size: 14px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #9ca3af;
    }

    .brand-main {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #e5e7eb;
    }

    .brand-sub {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #6b7280;
    }

    .pill-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .pill {
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      border: 1px solid rgba(148,163,184,0.35);
      background: radial-gradient(circle at top left, rgba(15,23,42,0.9), rgba(15,23,42,0.6));
      color: #e5e7eb;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      backdrop-filter: blur(10px);
    }

    .pill-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: #22c55e;
      box-shadow: 0 0 12px rgba(34,197,94,0.9);
    }

    .pill-dot.idle {
      background: #f97316;
      box-shadow: 0 0 12px rgba(249,115,22,0.9);
    }

    .pill-dot.error {
      background: #ef4444;
      box-shadow: 0 0 12px rgba(239,68,68,0.9);
    }

    /* --- Main Layout --- */
    .main-grid {
      flex: 1;
      display: grid;
      grid-template-columns: minmax(0, 2.1fr) minmax(0, 1.4fr);
      gap: 18px;
      pointer-events: auto;
    }

    @media (max-width: 1024px) {
      .main-grid {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: auto auto;
      }
    }

    .panel {
      position: relative;
      border-radius: 18px;
      padding: 16px 16px 14px;
      background:
        linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.88)),
        radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%);
      border: 1px solid rgba(148,163,184,0.35);
      box-shadow:
        0 0 40px rgba(15,23,42,0.9),
        0 0 80px rgba(15,23,42,0.9);
      overflow: hidden;
    }

    .panel::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at top left, rgba(56,189,248,0.12), transparent 55%),
        radial-gradient(circle at bottom right, rgba(129,140,248,0.12), transparent 55%);
      opacity: 0.4;
      pointer-events: none;
    }

    .panel-inner {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 4px;
    }

    .panel-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #9ca3af;
    }

    .panel-tag {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #6b7280;
    }

    /* --- Metrics --- */
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 6px;
    }

    @media (max-width: 768px) {
      .metrics-row {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    .metric {
      border-radius: 12px;
      padding: 8px 10px;
      border: 1px solid rgba(55,65,81,0.9);
      background:
        radial-gradient(circle at top left, rgba(15,23,42,0.9), rgba(15,23,42,0.7));
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #6b7280;
    }

    .metric-value {
      font-size: 14px;
      font-weight: 500;
      color: #e5e7eb;
    }

    .metric-sub {
      font-size: 10px;
      color: #9ca3af;
    }

    /* --- Mining Console --- */
    .console {
      margin-top: 8px;
      border-radius: 12px;
      border: 1px solid rgba(31,41,55,0.9);
      background: radial-gradient(circle at top left, rgba(15,23,42,0.96), rgba(15,23,42,0.9));
      padding: 10px;
      font-family: "JetBrains Mono", "SF Mono", Menlo, monospace;
      font-size: 11px;
      color: #9ca3af;
      max-height: 180px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .console-log {
      flex: 1;
      overflow-y: auto;
      padding-right: 4px;
    }

    .console-line {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .console-line span.time {
      color: #4b5563;
      margin-right: 6px;
    }

    .console-line span.tag {
      color: #22c55e;
      margin-right: 6px;
    }

    .console-line.error span.tag {
      color: #ef4444;
    }

    .console-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 6px;
    }

    .console-status {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #6b7280;
    }

    /* --- Buttons --- */
    .btn-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn {
      border-radius: 999px;
      padding: 7px 14px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      border: 1px solid rgba(148,163,184,0.5);
      background: radial-gradient(circle at top left, rgba(15,23,42,0.96), rgba(15,23,42,0.8));
      color: #e5e7eb;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.16s ease-out;
    }

    .btn-primary {
      border-color: rgba(56,189,248,0.9);
      background:
        radial-gradient(circle at top left, rgba(56,189,248,0.18), rgba(15,23,42,0.96));
      box-shadow:
        0 0 20px rgba(56,189,248,0.6),
        0 0 40px rgba(129,140,248,0.4);
    }

    .btn[disabled] {
      opacity: 0.5;
      cursor: default;
      box-shadow: none;
    }

    .btn:hover:not([disabled]) {
      transform: translateY(-1px);
      box-shadow:
        0 0 24px rgba(56,189,248,0.7),
        0 0 50px rgba(129,140,248,0.5);
    }

    .btn-icon-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: #22c55e;
      box-shadow: 0 0 12px rgba(34,197,94,0.9);
    }

    .btn-icon-dot.idle {
      background: #f97316;
      box-shadow: 0 0 12px rgba(249,115,22,0.9);
    }

    .btn-icon-dot.error {
      background: #ef4444;
      box-shadow: 0 0 12px rgba(239,68,68,0.9);
    }

    /* --- Right Panel: Wallet & Telemetry --- */
    .stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .kv-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 11px;
      color: #9ca3af;
    }

    .kv-label {
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #6b7280;
    }

    .kv-value {
      font-family: "JetBrains Mono", "SF Mono", Menlo, monospace;
      font-size: 11px;
      color: #e5e7eb;
      max-width: 60%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: right;
    }

    .progress-shell {
      margin-top: 6px;
      border-radius: 999px;
      border: 1px solid rgba(31,41,55,0.9);
      background: radial-gradient(circle at top left, rgba(15,23,42,0.96), rgba(15,23,42,0.9));
      padding: 4px;
      overflow: hidden;
    }

    .progress-bar {
      height: 8px;
      border-radius: 999px;
      background: linear-gradient(90deg, #22c55e, #38bdf8, #a855f7);
      width: 0%;
      box-shadow:
        0 0 16px rgba(56,189,248,0.8),
        0 0 30px rgba(129,140,248,0.8);
      transition: width 0.25s ease-out;
    }

    .footer {
      margin-top: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      font-size: 10px;
      color: #6b7280;
    }

    .footer span {
      text-transform: uppercase;
      letter-spacing: 0.16em;
    }

    .footer strong {
      color: #9ca3af;
      font-weight: 500;
    }

    /* --- Singularity Collapse Flash --- */
    .collapse-flash {
      position: fixed;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at center, rgba(248,250,252,0.9), rgba(15,23,42,0.1));
      opacity: 0;
      mix-blend-mode: screen;
      transition: opacity 0.35s ease-out;
      z-index: 999;
    }

    .collapse-flash.active {
      opacity: 1;
    }
  </style>
</head>
<body>
  <!-- Wallpaper & Bubbles -->
  <div id="wallpaper"></div>

  <!-- Singularity Core -->
  <div id="singularity-core">
    <div class="core-orbit">
      <div class="core-ring"></div>
      <div class="core-orbit-line"></div>
      <div class="core-orbit-line"></div>
      <div class="core-orbit-line"></div>
      <div class="core-pulse"></div>
      <!-- Fragments will be injected via JS -->
    </div>
  </div>

  <!-- UI Shell -->
  <div id="ui-shell">
    <div class="top-bar">
      <div class="brand">
        <div class="brand-title">BitcoinSolar</div>
        <div class="brand-main">BLSR Miner</div>
        <div class="brand-sub">Singularity Engine</div>
      </div>
      <div class="pill-row">
        <div class="pill" id="engine-pill">
          <div class="pill-dot idle" id="engine-dot"></div>
          <span id="engine-label">Engine idle</span>
        </div>
        <div class="pill" id="network-pill">
          <div class="pill-dot idle" id="network-dot"></div>
          <span id="network-label">Wallet disconnected</span>
        </div>
      </div>
    </div>

    <div class="main-grid">
      <!-- Left: Mining Engine -->
      <div class="panel">
        <div class="panel-inner">
          <div class="panel-header">
            <div>
              <div class="panel-title">Singularity Engine</div>
              <div class="panel-tag">Proof-of-Entropy Mining Loop</div>
            </div>
            <div class="btn-row">
              <button class="btn" id="btn-connect">
                <span class="btn-icon-dot idle" id="btn-connect-dot"></span>
                <span id="btn-connect-label">Connect Wallet</span>
              </button>
              <button class="btn btn-primary" id="btn-mine" disabled>
                <span class="btn-icon-dot idle" id="btn-mine-dot"></span>
                <span id="btn-mine-label">Arm Singularity</span>
              </button>
            </div>
          </div>

          <div class="metrics-row">
            <div class="metric">
              <div class="metric-label">Difficulty</div>
              <div class="metric-value" id="metric-difficulty">–</div>
              <div class="metric-sub" id="metric-difficulty-sub">Awaiting network</div>
            </div>
            <div class="metric">
              <div class="metric-label">Hashrate</div>
              <div class="metric-value" id="metric-hashrate">0 H/s</div>
              <div class="metric-sub" id="metric-hashrate-sub">Engine idle</div>
            </div>
            <div class="metric">
              <div class="metric-label">Blocks Solved</div>
              <div class="metric-value" id="metric-blocks">0</div>
              <div class="metric-sub" id="metric-blocks-sub">Session</div>
            </div>
            <div class="metric">
              <div class="metric-label">BLSR Yield</div>
              <div class="metric-value" id="metric-yield">0.0000</div>
              <div class="metric-sub" id="metric-yield-sub">Estimated</div>
            </div>
          </div>

          <div class="console">
            <div class="console-log" id="console-log"></div>
            <div class="console-footer">
              <div class="console-status" id="console-status">Awaiting wallet connection…</div>
              <div class="console-status" id="console-loop-status">Loop: idle</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Wallet & Telemetry -->
      <div class="panel">
        <div class="panel-inner">
          <div class="panel-header">
            <div>
              <div class="panel-title">Telemetry</div>
              <div class="panel-tag">Wallet, Network, and Yield</div>
            </div>
          </div>

          <div class="stack">
            <div class="kv-row">
              <div class="kv-label">Wallet</div>
              <div class="kv-value" id="kv-wallet">Not connected</div>
            </div>
            <div class="kv-row">
              <div class="kv-label">Network</div>
              <div class="kv-value" id="kv-network">–</div>
            </div>
            <div class="kv-row">
              <div class="kv-label">Contract</div>
              <div class="kv-value" id="kv-contract">–</div>
            </div>
            <div class="kv-row">
              <div class="kv-label">Last Block</div>
              <div class="kv-value" id="kv-last-block">–</div>
            </div>
            <div class="kv-row">
              <div class="kv-label">Last Yield</div>
              <div class="kv-value" id="kv-last-yield">–</div>
            </div>

            <div class="progress-shell">
              <div class="progress-bar" id="progress-bar"></div>
            </div>

            <div class="footer">
              <span>Singularity State: <strong id="footer-state">Idle</strong></span>
              <span>Entropy Channel: <strong id="footer-entropy">Closed</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Collapse Flash -->
  <div class="collapse-flash" id="collapse-flash"></div>

  <script>
    // -----------------------------
    // Config
    // -----------------------------
    const RPC_URL = "https://polygon-rpc.com"; // update if needed
    const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO: set BLSR miner contract
    const CONTRACT_ABI = [
      // Minimal example ABI; replace with real one
      "event Mint(address indexed miner, uint256 amount, uint256 blockNumber)",
      "function difficulty() view returns (uint256)",
      "function mine(bytes32 nonce) external",
    ];

    const MINING_BACKEND_URL = "/mine"; // if you have a backend endpoint; otherwise ignore

    // -----------------------------
    // DOM Helpers
    // -----------------------------
    const $ = (id) => document.getElementById(id);

    const engineDot = $("engine-dot");
    const engineLabel = $("engine-label");
    const networkDot = $("network-dot");
    const networkLabel = $("network-label");
    const btnConnect = $("btn-connect");
    const btnConnectDot = $("btn-connect-dot");
    const btnConnectLabel = $("btn-connect-label");
    const btnMine = $("btn-mine");
    const btnMineDot = $("btn-mine-dot");
    const btnMineLabel = $("btn-mine-label");

    const metricDifficulty = $("metric-difficulty");
    const metricDifficultySub = $("metric-difficulty-sub");
    const metricHashrate = $("metric-hashrate");
    const metricHashrateSub = $("metric-hashrate-sub");
    const metricBlocks = $("metric-blocks");
    const metricBlocksSub = $("metric-blocks-sub");
    const metricYield = $("metric-yield");
    const metricYieldSub = $("metric-yield-sub");

    const consoleLog = $("console-log");
    const consoleStatus = $("console-status");
    const consoleLoopStatus = $("console-loop-status");

    const kvWallet = $("kv-wallet");
    const kvNetwork = $("kv-network");
    const kvContract = $("kv-contract");
    const kvLastBlock = $("kv-last-block");
    const kvLastYield = $("kv-last-yield");

    const progressBar = $("progress-bar");
    const footerState = $("footer-state");
    const footerEntropy = $("footer-entropy");
    const collapseFlash = $("collapse-flash");

    // -----------------------------
    // State
    // -----------------------------
    let provider = null;
    let signer = null;
    let contract = null;
    let currentAccount = null;
    let mining = false;
    let miningInterval = null;
    let hashrate = 0;
    let blocksSolved = 0;
    let lastYield = 0;
    let difficulty = null;

    // -----------------------------
    // Logging
    // -----------------------------
    function logLine(message, opts = {}) {
      const line = document.createElement("div");
      line.className = "console-line" + (opts.error ? " error" : "");
      const timeSpan = document.createElement("span");
      timeSpan.className = "time";
      timeSpan.textContent = new Date().toLocaleTimeString("en-US", { hour12: false });

      const tagSpan = document.createElement("span");
      tagSpan.className = "tag";
      tagSpan.textContent = opts.tag || (opts.error ? "[ERR]" : "[SYS]");

      const msgSpan = document.createElement("span");
      msgSpan.textContent = message;

      line.appendChild(timeSpan);
      line.appendChild(tagSpan);
      line.appendChild(msgSpan);
      consoleLog.appendChild(line);
      consoleLog.scrollTop = consoleLog.scrollHeight;
    }

    function setEngineState(state, reason) {
      engineDot.classList.remove("idle", "error");
      btnMineDot.classList.remove("idle", "error");

      if (state === "active") {
        engineDot.style.background = "#22c55e";
        btnMineDot.style.background = "#22c55e";
        engineLabel.textContent = "Engine online";
        btnMineLabel.textContent = "Collapse Singularity";
        footerState.textContent = "Mining";
        footerEntropy.textContent = "Open";
      } else if (state === "idle") {
        engineDot.classList.add("idle");
        btnMineDot.classList.add("idle");
        engineLabel.textContent = "Engine idle";
        btnMineLabel.textContent = "Arm Singularity";
        footerState.textContent = "Idle";
        footerEntropy.textContent = "Closed";
      } else if (state === "error") {
        engineDot.classList.add("error");
        btnMineDot.classList.add("error");
        engineLabel.textContent = "Engine fault";
        footerState.textContent = "Fault";
        if (reason) logLine(reason, { tag: "[ENG]", error: true });
      }
    }

    function setNetworkState(connected, networkName) {
      networkDot.classList.remove("idle", "error");
      btnConnectDot.classList.remove("idle", "error");

      if (connected) {
        networkLabel.textContent = networkName || "Wallet connected";
        btnConnectLabel.textContent = "Connected";
        btnConnectDot.style.background = "#22c55e";
        networkDot.style.background = "#22c55e";
      } else {
        networkDot.classList.add("idle");
        btnConnectDot.classList.add("idle");
        networkLabel.textContent = "Wallet disconnected";
        btnConnectLabel.textContent = "Connect Wallet";
      }
    }

    function setLoopStatus(text) {
      consoleLoopStatus.textContent = "Loop: " + text;
    }

    function updateMetrics() {
      metricHashrate.textContent = `${hashrate.toFixed(1)} H/s`;
      metricBlocks.textContent = blocksSolved.toString();
      metricYield.textContent = lastYield.toFixed(4);
      metricBlocksSub.textContent = "Session";
      metricYieldSub.textContent = "Estimated";
    }

    function setDifficultyDisplay(value) {
      if (value == null) {
        metricDifficulty.textContent = "–";
        metricDifficultySub.textContent = "Awaiting network";
      } else {
        metricDifficulty.textContent = value.toString();
        metricDifficultySub.textContent = "Network difficulty";
      }
    }

    function setProgress(value) {
      const clamped = Math.max(0, Math.min(100, value));
      progressBar.style.width = clamped + "%";
    }

    // -----------------------------
    // Singularity Visuals
    // -----------------------------
    function spawnBubbles() {
      const wallpaper = $("wallpaper");
      const bubbleCount = 26;

      for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        const size = 40 + Math.random() * 220;
        bubble.style.width = size + "px";
        bubble.style.height = size + "px";
        bubble.style.left = Math.random() * 100 + "vw";
        bubble.style.top = 100 + Math.random() * 40 + "vh";
        const duration = 18 + Math.random() * 26;
        bubble.style.animationDuration = duration + "s";
        bubble.style.animationDelay = -Math.random() * duration + "s";
        wallpaper.appendChild(bubble);
      }
    }

    function spawnCoreFragments() {
      const orbit = document.querySelector(".core-orbit");
      const fragmentCount = 10;

      for (let i = 0; i < fragmentCount; i++) {
        const frag = document.createElement("div");
        frag.className = "core-fragment";
        const duration = 10 + Math.random() * 14;
        frag.style.animationDuration = duration + "s";
        frag.style.animationDelay = -Math.random() * duration + "s";
        orbit.appendChild(frag);
      }
    }

    function triggerCollapseFlash() {
      collapseFlash.classList.add("active");
      setTimeout(() => {
        collapseFlash.classList.remove("active");
      }, 180);
    }

    // -----------------------------
    // Ethers / Wallet
    // -----------------------------
    async function connectWallet() {
      try {
        if (!window.ethereum) {
          logLine("No injected wallet detected. Install MetaMask.", { tag: "[WAL]", error: true });
          consoleStatus.textContent = "No wallet detected";
          setNetworkState(false);
          return;
        }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (!accounts || !accounts.length) {
          logLine("Wallet connection rejected.", { tag: "[WAL]", error: true });
          consoleStatus.textContent = "Wallet connection rejected";
          setNetworkState(false);
          return;
        }

        currentAccount = accounts[0];
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const network = await provider.getNetwork();
        const networkName = network.name || `Chain ${network.chainId}`;

        kvWallet.textContent = currentAccount;
        kvNetwork.textContent = networkName;
        kvContract.textContent = CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000"
          ? "Set contract address"
          : CONTRACT_ADDRESS;

        setNetworkState(true, networkName);
        consoleStatus.textContent = "Wallet connected";
        logLine(`Wallet connected: ${currentAccount}`, { tag: "[WAL]" });

        btnMine.disabled = false;
        await refreshDifficulty();
        attachMintListener();
      } catch (err) {
        console.error(err);
        logLine("Wallet connection failed: " + (err?.message || err), { tag: "[WAL]", error: true });
        consoleStatus.textContent = "Wallet connection failed";
        setNetworkState(false);
      }
    }

    async function refreshDifficulty() {
      if (!contract) return;
      try {
        const diff = await contract.difficulty();
        difficulty = Number(diff.toString());
        setDifficultyDisplay(difficulty);
        logLine(`Difficulty updated: ${difficulty}`, { tag: "[NET]" });
      } catch (err) {
        console.error(err);
        logLine("Failed to fetch difficulty", { tag: "[NET]", error: true });
      }
    }

    function attachMintListener() {
      if (!contract) return;
      try {
        contract.removeAllListeners("Mint");
        contract.on("Mint", (miner, amount, blockNumber) => {
          const amt = Number(amount.toString());
          blocksSolved += 1;
          lastYield += amt; // adjust if decimals
          kvLastBlock.textContent = blockNumber.toString();
          kvLastYield.textContent = amt.toString();
          updateMetrics();
          triggerCollapseFlash();
          logLine(`Mint event: miner=${miner}, amount=${amt}, block=${blockNumber}`, { tag: "[EVT]" });
        });
        logLine("Mint event listener attached", { tag: "[EVT]" });
      } catch (err) {
        console.error(err);
        logLine("Failed to attach Mint listener", { tag: "[EVT]", error: true });
      }
    }

    // -----------------------------
    // Mining Loop (frontend-sim + optional backend)
    // -----------------------------
    async function startMining() {
      if (!provider || !signer || !contract) {
        logLine("Connect wallet before mining.", { tag: "[ENG]", error: true });
        return;
      }
      if (mining) return;

      mining = true;
      hashrate = 0;
      setEngineState("active");
      setLoopStatus("active");
      consoleStatus.textContent = "Mining loop engaged";
      logLine("Singularity armed. Beginning entropy sweep…", { tag: "[ENG]" });

      let hashesThisSecond = 0;
      let lastTick = performance.now();

      miningInterval = setInterval(async () => {
        if (!mining) return;

        const now = performance.now();
        const dt = (now - lastTick) / 1000;
        lastTick = now;

        // Fake hashrate curve
        hashesThisSecond = 500 + Math.random() * 1500;
        hashrate = hashesThisSecond / dt;
        updateMetrics();

        // Progress bar oscillation
        const progress = 40 + Math.sin(now / 600) * 40;
        setProgress(progress);

        // Optional: ping backend miner
        try {
          if (MINING_BACKEND_URL) {
            fetch(MINING_BACKEND_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                account: currentAccount,
                timestamp: Date.now(),
              }),
            }).catch(() => {});
          }
        } catch (err) {
          // silent
        }
      }, 1000);
    }

    function stopMining() {
      if (!mining) return;
      mining = false;
      if (miningInterval) {
        clearInterval(miningInterval);
        miningInterval = null;
      }
      hashrate = 0;
      setProgress(0);
      updateMetrics();
      setEngineState("idle");
      setLoopStatus("idle");
      consoleStatus.textContent = "Mining loop disengaged";
      logLine("Singularity collapsed. Engine returned to idle.", { tag: "[ENG]" });
    }

    // -----------------------------
    // Event Wiring
    // -----------------------------
    btnConnect.addEventListener("click", () => {
      connectWallet();
    });

    btnMine.addEventListener("click", () => {
      if (!mining) {
        startMining();
      } else {
        stopMining();
      }
    });

    // Handle wallet events
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (!accounts || !accounts.length) {
          currentAccount = null;
          kvWallet.textContent = "Not connected";
          setNetworkState(false);
          btnMine.disabled = true;
          stopMining();
          logLine("Wallet disconnected", { tag: "[WAL]" });
        } else {
          currentAccount = accounts[0];
          kvWallet.textContent = currentAccount;
          logLine("Account changed: " + currentAccount, { tag: "[WAL]" });
        }
      });

      window.ethereum.on("chainChanged", () => {
        logLine("Chain changed. Reloading…", { tag: "[NET]" });
        window.location.reload();
      });
    }

    // -----------------------------
    // Boot
    // -----------------------------
    function boot() {
      spawnBubbles();
      spawnCoreFragments();
      logLine("BLSR Singularity Engine ready.", { tag: "[SYS]" });
      consoleStatus.textContent = "Awaiting wallet connection…";
      setEngineState("idle");
      setNetworkState(false);
      setDifficultyDisplay(null);
      setProgress(0);
    }

    window.addEventListener("load", boot);
  </script>
</body>
</html>
