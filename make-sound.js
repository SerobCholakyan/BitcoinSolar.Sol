// make-sound.js
const { execSync } = require("child_process");
const path = require("path");

const type = process.argv[2] || "info";

function play(file) {
  const full = path.join(__dirname, "sounds", file);
  try {
    // macOS
    execSync(`afplay "${full}"`, { stdio: "ignore" });
  } catch {
    try {
      // Linux
      execSync(`aplay "${full}"`, { stdio: "ignore" });
    } catch {
      console.log(`[sound] would play: ${full}`);
    }
  }
}

switch (type) {
  case "success":
    play("success.wav");
    break;
  case "error":
    play("error.wav");
    break;
  default:
    play("info.wav");
}
