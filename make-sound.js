const Tone = require("tone");
const WavEncoder = require("wav-encoder");
const fs = require("fs");
const lamejs = require("lamejs");

async function createBlackholeWoosh() {
  const duration = 2.5;
  const sampleRate = 44100;

  const buffer = await Tone.Offline(() => {
    // Deep brown noise rumble
    const noise = new Tone.Noise("brown").start();
    const noiseFilter = new Tone.Filter({
      type: "lowpass",
      frequency: 200,
      Q: 1
    });

    const noiseGain = new Tone.Gain(0.6);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.toDestination();

    // Rising sine sweep
    const sweep = new Tone.Oscillator({
      type: "sine",
      frequency: 40
    }).start();

    const sweepGain = new Tone.Gain(0.7).toDestination();
    sweep.connect(sweepGain);

    sweep.frequency.rampTo(900, duration);
    sweepGain.gain.rampTo(0, duration);

  }, duration, sampleRate);

  const wavData = {
    sampleRate: buffer.sampleRate,
    channelData: [buffer.getChannelData(0)]
  };

  const wavBuffer = await WavEncoder.encode(wavData);

  const samples = new Int16Array(wavBuffer.length / 2);
  for (let i = 0; i < samples.length; i++) {
    samples[i] = (wavBuffer.readInt16LE ? wavBuffer.readInt16LE(i * 2) : 0);
  }

  const mp3Encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
  const mp3Data = [];
  const chunk = mp3Encoder.encodeBuffer(samples);
  if (chunk.length > 0) mp3Data.push(Buffer.from(chunk));
  const end = mp3Encoder.flush();
  if (end.length > 0) mp3Data.push(Buffer.from(end));

  const mp3Buffer = Buffer.concat(mp3Data);

  fs.mkdirSync("sounds", { recursive: true });
  fs.writeFileSync("sounds/blackhole_woosh.mp3", mp3Buffer);

  console.log("Created sounds/blackhole_woosh.mp3");
}

createBlackholeWoosh().catch(console.error);
