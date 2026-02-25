// miner-watcher.js
// Watches a miner log file and emits "blockSolved" when a solved block is detected.

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const EventEmitter = require("events");

class MinerWatcher extends EventEmitter {
  constructor(logPath) {
    super();
    this.logPath = logPath;
    this.stream = null;
    this.rl = null;
    this.watcher = null;
    this.lastSolvedLine = null;
    this._init();
  }

  _init() {
    const dir = path.dirname(this.logPath);

    if (!fs.existsSync(dir)) {
      this.emit("error", new Error(`Log directory does not exist: ${dir}`));
      return;
    }

    if (!fs.existsSync(this.logPath)) {
      fs.writeFileSync(this.logPath, "");
    }

    this._startTail();
    this._startWatcher();
  }

  _startTail() {
    this.stream = fs.createReadStream(this.logPath, {
      encoding: "utf8",
      flags: "r"
    });

    this.rl = readline.createInterface({
      input: this.stream,
      crlfDelay: Infinity
    });

    this.rl.on("line", (line) => this._handleLine(line));
    this.rl.on("error", (err) => this.emit("error", err));
  }

  _startWatcher() {
    this.watcher = fs.watch(this.logPath, (eventType) => {
      if (eventType === "change") {
        this._restartTail();
      }
    });
  }

  _restartTail() {
    try {
      this.stream?.close();
      this.rl?.close();
    } catch (_) {
      // ignore
    }
    this._startTail();
  }

  _handleLine(line) {
    const trimmed = line.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const isSolved =
      lower.includes("block solved") ||
      lower.includes("solution found") ||
      lower.includes("share accepted");

    if (!isSolved) return;
    if (this.lastSolvedLine === trimmed) return;

    this.lastSolvedLine = trimmed;
    this.emit("blockSolved", trimmed);
  }

  stop() {
    try {
      this.watcher?.close();
      this.rl?.close();
      this.stream?.close();
    } catch (_) {
      // ignore
    }
  }
}

module.exports = MinerWatcher;
