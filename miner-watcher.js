// miner-watcher.js
const fs = require('fs');
const EventEmitter = require('events');

class MinerWatcher extends EventEmitter {
  constructor(logPath) {
    super();
    this.logPath = logPath;
    this.lastSize = 0;
    this.init();
  }

  init() {
    if (!fs.existsSync(this.logPath)) {
      console.log("Miner log not found:", this.logPath);
      return;
    }

    this.lastSize = fs.statSync(this.logPath).size;

    fs.watchFile(this.logPath, { interval: 500 }, () => {
      const stats = fs.statSync(this.logPath);
      if (stats.size <= this.lastSize) return;

      const stream = fs.createReadStream(this.logPath, {
        start: this.lastSize,
        end: stats.size
      });

      stream.on('data', chunk => {
        const text = chunk.toString();
        const lines = text.split(/\r?\n/);

        for (const line of lines) {
          if (!line.trim()) continue;

          // Adjust these markers to match your miner’s log format
          if (line.includes("BLOCK SOLVED") || line.includes("FOUND BLOCK")) {
            this.emit("blockSolved", line);
          }
        }
      });

      this.lastSize = stats.size;
    });
  }
}

module.exports = MinerWatcher;
