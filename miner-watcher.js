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
    this.watcher = null;
    this.stream = null;
    this.rl = null;
    this.lastSolvedLine = null;
    this.started = false;

    this._boot();
  }

  _boot() {
    const dir = path.dirname(this.logPath);

    if (!fs.existsSync(dir)) {
      this.emit("error", new Error(`Log directory does not exist: ${dir}`));
      return;
    }

    // Ensure file exists
    if (!fs.existsSync(this.logPath)) {
      try {
        fs.writeFileSync(this.logPath, "", { flag: "a" });
      } catch (err) {
        this.emit("error", err);
        return;
      }
    }

    this._startTail();
    this._startWatcher();
  }

  _startTail() {
    try {
      this.stream = fs.createReadStream(this.logPath, {
        encoding: "utf8",
        flags: "r",
      });

      this.rl = readline.createInterface({
        input: this.stream,
        crlfDelay: Infinity,
      });

      this.rl.on("line", (line) => this._handleLine(line));
      this.rl.on("error", (err) => this.emit("error", err));

      this.started = true;
    } catch (err) {
      this.emit("error", err);
    }
  }

  _startWatcher() {
    try {
      this.watcher = fs.watch(this.logPath, (eventType) => {
        if (eventType === "change") {
          this._tailNewData();
        }
      });
    } catch (err) {
      this.emit("error", err);
    }
  }

  _tailNewData() {
    // Close old stream and reopen from end
    if (this.stream) {
      this.stream.close();
    }
    if (this.rl) {
      this.rl.close();
    }
    this._startTail();
  }

  _handleLine(line) {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Very simple heuristic: look for "block solved" or similar
    const lower = trimmed.toLowerCase();
    const isSolved =
      lower.includes("block solved") ||
      lower.includes("solution found") ||
      lower.includes("share accepted");

    if (!isSolved) return;

    // Debounce duplicate lines
    if (this.lastSolvedLine === trimmed) return;
    this.lastSolvedLine = trimmed;

    this.emit("blockSolved", trimmed);
  }

  stop() {
    try {
      if (this.watcher) {
        this.watcher.close();
        this.watcher = null;
      }
    } catch (_) {}

    try {
      if (this.rl) {
        this.rl.close();
        this.rl = null;
      }
    } catch (_) {}

    try {
      if (this.stream) {
        this.stream.close();
        this.stream = null;
      }
    } catch (_) {}

    this.started = false;
  }
}

module.exports = MinerWatcher;
