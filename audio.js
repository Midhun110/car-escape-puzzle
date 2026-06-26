// Audio Synthesis Engine for Car Escape Puzzle
// Generates synthwave music and sound effects procedurally with volume scales

class AudioSynthEngine {
  constructor() {
    this.ctx = null;
    
    // Volume levels (0.0 to 1.0)
    this.musicVolume = 0.5;
    this.sfxVolume = 0.6;
    this.vibrationEnabled = true;
    
    // Music state
    this.musicInterval = null;
    this.currentStep = 0;
    this.bpm = 100;
    this.isPlayingMusic = false;
    
    // Engine sound state
    this.engineOsc = null;
    this.engineGain = null;
    this.isEngineRunning = false;

    // Active World theme setup
    this.activeWorld = "downtown";
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  resumeContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMusicVolume(vol) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    // If music volume is 0, stop sequencer; if >0 and not running, start it
    if (this.musicVolume === 0) {
      this.stopMusic();
    } else if (!this.isPlayingMusic) {
      this.startMusic();
    }
  }

  setSFXVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    // Adjust running engine volume if active
    if (this.isEngineRunning && this.engineGain) {
      this.engineGain.gain.setValueAtTime(this.sfxVolume * 0.14, this.ctx.currentTime);
    }
  }

  setVibrationEnabled(enabled) {
    this.vibrationEnabled = enabled;
  }

  triggerHaptic(duration) {
    if (this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }

  // SFX: UI Button Click
  playClick() {
    if (this.sfxVolume <= 0) return;
    this.resumeContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // SFX: Sliding Car
  playSlide(speed = 1.0) {
    if (this.sfxVolume <= 0) return;
    this.resumeContext();
    if (!this.ctx) return;

    const mult = Math.max(0.4, Math.min(2.5, speed));

    const bufferSize = this.ctx.sampleRate * 0.22;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320 * mult, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(160 * mult, this.ctx.currentTime + 0.22);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.sfxVolume * 0.08 * Math.sqrt(mult), this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
    
    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noiseNode.start();
    noiseNode.stop(this.ctx.currentTime + 0.22);
  }

  // SFX: Collision Thud/Bump
  playCollision() {
    if (this.sfxVolume <= 0) return;
    this.resumeContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.28, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
    
    // Trigger collision haptic feedback
    this.triggerHaptic(20);
  }

  // SFX: Engine Rumble (continuous)
  playEngineStart() {
    if (this.sfxVolume <= 0 || this.isEngineRunning) return;
    this.resumeContext();
    if (!this.ctx) return;

    this.isEngineRunning = true;
    
    this.engineOsc = this.ctx.createOscillator();
    this.engineGain = this.ctx.createGain();
    
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(110, this.ctx.currentTime);
    
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime);
    
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 8;
    lfoGain.gain.value = 4;
    
    lfo.connect(lfoGain);
    lfoGain.connect(this.engineOsc.frequency);
    
    this.engineOsc.connect(lowpass);
    lowpass.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);
    
    this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.engineGain.gain.linearRampToValueAtTime(this.sfxVolume * 0.14, this.ctx.currentTime + 0.3);
    
    lfo.start();
    this.engineOsc.start();
  }

  playEngineStop() {
    if (!this.isEngineRunning) return;
    this.isEngineRunning = false;
    
    if (this.engineGain && this.ctx) {
      const currentGain = this.engineGain.gain;
      currentGain.setValueAtTime(this.engineGain.gain.value, this.ctx.currentTime);
      currentGain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      
      const osc = this.engineOsc;
      setTimeout(() => {
        try {
          osc.stop();
        } catch(e){}
      }, 500);
    }
  }

  // SFX: Restart Level / Game Over synth sweep
  playGameOver() {
    if (this.sfxVolume <= 0) return;
    this.resumeContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.35);
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.15, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // SFX: Level Solved Victory Fanfare
  playVictory() {
    if (this.sfxVolume <= 0) return;
    this.resumeContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, index) => {
      const time = now + index * 0.08;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, time);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(this.sfxVolume * 0.08, time);
      gain.gain.linearRampToValueAtTime(0.001, time + 0.35);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.4);
    });
  }

  // SFX: Coin Collection Sweep
  playCoinCollect() {
    if (this.sfxVolume <= 0) return;
    this.resumeContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.12, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // SFX: Hint Chime
  playHint() {
    if (this.sfxVolume <= 0) return;
    this.resumeContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const time = now + index * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(this.sfxVolume * 0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.3);
    });
  }

  // SFX: Tow Truck winch
  playTowTruck() {
    if (this.sfxVolume <= 0) return;
    this.resumeContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(80, now);
    osc1.frequency.linearRampToValueAtTime(160, now + 0.65);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(82, now);
    osc2.frequency.linearRampToValueAtTime(162, now + 0.65);

    gain.gain.setValueAtTime(this.sfxVolume * 0.16, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.65);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.65);
    osc2.stop(now + 0.65);
  }

  // Set World and change sequencer track
  setActiveWorld(world) {
    this.activeWorld = world || "downtown";
    const bpmMap = {
      downtown: 100,
      beach: 90,
      mountain: 105,
      airport: 95,
      shopping_mall: 110,
      industrial_area: 102,
      neon_city: 122
    };
    this.bpm = bpmMap[this.activeWorld] || 110;
    
    // Refresh loop to adapt BPM immediately if sequencer is active
    if (this.isPlayingMusic) {
      this.stopMusic();
      this.startMusic();
    }
  }

  toggleMusic(on) {
    if (on) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  // Sequencer background music loop
  startMusic() {
    if (this.isPlayingMusic || this.musicVolume <= 0) return;
    this.resumeContext();
    if (!this.ctx) return;

    this.isPlayingMusic = true;
    this.currentStep = 0;
    
    const stepDuration = 60 / this.bpm / 2;
    
    const scheduler = () => {
      if (!this.isPlayingMusic) return;
      this.playStep(this.currentStep);
      this.currentStep = (this.currentStep + 1) % 16;
      
      this.musicInterval = setTimeout(scheduler, stepDuration * 1000);
    };
    
    scheduler();
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // Procedural Synthwave Sequencer step
  playStep(step) {
    if (!this.ctx || this.musicVolume <= 0) return;
    
    const now = this.ctx.currentTime;
    
    // Drum elements variations per activeWorld
    let playKick = false;
    let playSnare = false;
    let playHat = false;
    let playIndustrialHit = false;

    if (this.activeWorld === "downtown") {
      playKick = (step === 0 || step === 8);
      playSnare = (step === 4 || step === 12);
      playHat = (step % 4 === 2);
    } else if (this.activeWorld === "beach") {
      playKick = (step === 0 || step === 6 || step === 8 || step === 14);
      playSnare = (step === 4 || step === 12);
      playHat = (step % 2 === 1);
    } else if (this.activeWorld === "mountain") {
      playKick = (step === 0 || step === 8);
      playSnare = (step === 4 || step === 12); // Melancholic lofi, no hats
    } else if (this.activeWorld === "airport") {
      playKick = (step === 0 || step === 8);
      playSnare = (step === 4 || step === 12);
      playHat = (step % 2 === 0); // Lowpass lofi tick
    } else if (this.activeWorld === "shopping_mall") {
      playKick = (step === 0 || step === 4 || step === 8 || step === 12);
      playSnare = (step === 4 || step === 12);
      playHat = (step % 4 === 1 || step % 4 === 3);
    } else if (this.activeWorld === "industrial_area") {
      playKick = (step === 0 || step === 8);
      playSnare = (step === 4 || step === 12);
      playIndustrialHit = (step % 4 === 2);
    } else if (this.activeWorld === "neon_city") {
      playKick = (step % 4 === 0); // Four-on-the-floor synthwave
      playSnare = (step === 4 || step === 12);
      playHat = (step % 2 === 1);
    }

    // 1. Kick Drum
    if (playKick) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      
      kickOsc.connect(kickGain);
      kickGain.connect(this.ctx.destination);
      
      kickOsc.frequency.setValueAtTime(130, now);
      kickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      
      kickGain.gain.setValueAtTime(this.musicVolume * 0.18, now);
      kickGain.gain.linearRampToValueAtTime(0.001, now + 0.12);
      
      kickOsc.start(now);
      kickOsc.stop(now + 0.12);
    }
    
    // 2. Snare Drum
    if (playSnare) {
      const snareBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.08, this.ctx.sampleRate);
      const data = snareBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const snareNode = this.ctx.createBufferSource();
      snareNode.buffer = snareBuffer;
      
      const snareFilter = this.ctx.createBiquadFilter();
      snareFilter.type = 'bandpass';
      snareFilter.frequency.value = (this.activeWorld === "airport" ? 600 : 1000);
      
      const snareGain = this.ctx.createGain();
      snareGain.gain.setValueAtTime(this.musicVolume * 0.06, now);
      snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      snareNode.connect(snareFilter);
      snareFilter.connect(snareGain);
      snareGain.connect(this.ctx.destination);
      
      snareNode.start(now);
      snareNode.stop(now + 0.08);
    }

    // 3. Hi-Hat
    if (playHat) {
      const hatOsc = this.ctx.createOscillator();
      const hatGain = this.ctx.createGain();
      const hatFilter = this.ctx.createBiquadFilter();
      
      hatOsc.type = 'square';
      hatOsc.frequency.value = 8000;
      
      hatFilter.type = 'highpass';
      hatFilter.frequency.value = (this.activeWorld === "airport" ? 7500 : 6000);
      
      hatGain.gain.setValueAtTime(this.musicVolume * 0.014, now);
      hatGain.gain.linearRampToValueAtTime(0.001, now + 0.04);
      
      hatOsc.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(this.ctx.destination);
      
      hatOsc.start(now);
      hatOsc.stop(now + 0.04);
    }

    // 3b. Industrial metal hit
    if (playIndustrialHit) {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1500, now);
      filter.Q.value = 4.0;
      
      gain.gain.setValueAtTime(this.musicVolume * 0.04, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.07);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.07);
    }
    
    // 4. Bassline Sequencer Chords based on activeWorld
    let chordPattern;
    if (this.activeWorld === "beach") {
      // Cmaj7 (130.81), Fmaj7 (87.31), G (98.00), Em (82.41)
      chordPattern = [
        [130.81, 130.81, 130.81, 130.81],
        [87.31, 87.31, 87.31, 87.31],
        [98.00, 98.00, 98.00, 98.00],
        [82.41, 82.41, 82.41, 82.41]
      ];
    } else if (this.activeWorld === "mountain") {
      // Am (110.00), Em (82.41), F (87.31), G (98.00)
      chordPattern = [
        [110.00, 110.00, 110.00, 110.00],
        [82.41, 82.41, 82.41, 82.41],
        [87.31, 87.31, 87.31, 87.31],
        [98.00, 98.00, 98.00, 98.00]
      ];
    } else if (this.activeWorld === "airport") {
      // Dm (146.83), Am (110.00), C (130.81), G (98.00)
      chordPattern = [
        [146.83, 146.83, 146.83, 146.83],
        [110.00, 110.00, 110.00, 110.00],
        [130.81, 130.81, 130.81, 130.81],
        [98.00, 98.00, 98.00, 98.00]
      ];
    } else if (this.activeWorld === "shopping_mall") {
      // Cmaj7, Am7, Dm7, G7
      chordPattern = [
        [130.81, 130.81, 130.81, 130.81],
        [110.00, 110.00, 110.00, 110.00],
        [146.83, 146.83, 146.83, 146.83],
        [98.00, 98.00, 98.00, 98.00]
      ];
    } else if (this.activeWorld === "industrial_area") {
      // Em, C, D, Bm
      chordPattern = [
        [82.41, 82.41, 82.41, 82.41],
        [130.81, 130.81, 130.81, 130.81],
        [146.83, 146.83, 146.83, 146.83],
        [123.47, 123.47, 123.47, 123.47]
      ];
    } else if (this.activeWorld === "neon_city") {
      // Am (110.00), G (98.00), F (87.31), E (82.41)
      chordPattern = [
        [110.00, 110.00, 110.00, 110.00],
        [98.00, 98.00, 98.00, 98.00],
        [87.31, 87.31, 87.31, 87.31],
        [82.41, 82.41, 82.41, 82.41]
      ];
    } else { // downtown (default)
      // A2 (110.00), F2 (87.31), G2 (98.00), C3 (130.81)
      chordPattern = [
        [110.00, 110.00, 110.00, 110.00],
        [87.31, 87.31, 87.31, 87.31],
        [98.00, 98.00, 98.00, 98.00],
        [130.81, 130.81, 130.81, 130.81]
      ];
    }
    
    if (!this.barCounter) this.barCounter = 0;
    if (step === 0) {
      this.barCounter = (this.barCounter + 1) % 4;
    }
    
    const bassFreq = chordPattern[this.barCounter][Math.floor(step / 4)];
    const bassSteps = [0, 2, 3, 5, 6, 8, 10, 11, 13, 14];
    
    if (bassSteps.includes(step)) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      const bassFilter = this.ctx.createBiquadFilter();
      
      bassOsc.type = (this.activeWorld === "neon_city" ? 'sawtooth' : 'triangle');
      
      let freq = bassFreq;
      if (step % 3 === 0) freq = freq * 2;
      
      bassOsc.frequency.setValueAtTime(freq, now);
      
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime((this.activeWorld === "neon_city" ? 280 : 180), now);
      
      bassGain.gain.setValueAtTime(this.musicVolume * (this.activeWorld === "neon_city" ? 0.05 : 0.07), now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      
      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      
      bassOsc.start(now);
      bassOsc.stop(now + 0.18);
    }
    
    // 5. Synth Lead Pads
    const leadSteps = [0, 6, 12, 14];
    if (leadSteps.includes(step)) {
      let leadMelodies;
      if (this.activeWorld === "beach") {
        // Cmaj7, Fmaj7, G, Em
        leadMelodies = [
          [523.25, 659.25, 783.99, 987.77],
          [698.46, 880.00, 1046.50, 1318.51],
          [587.33, 783.99, 987.77, 1174.66],
          [659.25, 783.99, 987.77, 1318.51]
        ];
      } else if (this.activeWorld === "mountain") {
        // Cold slow piano feel
        leadMelodies = [
          [440.00, 523.25, 659.25, 880.00],
          [329.63, 392.00, 493.88, 659.25],
          [349.23, 440.00, 523.25, 698.46],
          [392.00, 493.88, 587.33, 783.99]
        ];
      } else if (this.activeWorld === "airport") {
        leadMelodies = [
          [587.33, 698.46, 880.00, 1046.50],
          [440.00, 523.25, 659.25, 880.00],
          [523.25, 659.25, 783.99, 1046.50],
          [392.00, 493.88, 587.33, 783.99]
        ];
      } else if (this.activeWorld === "shopping_mall") {
        leadMelodies = [
          [523.25, 659.25, 783.99, 987.77],
          [440.00, 523.25, 659.25, 880.00],
          [587.33, 698.46, 880.00, 1046.50],
          [392.00, 493.88, 587.33, 783.99]
        ];
      } else if (this.activeWorld === "industrial_area") {
        leadMelodies = [
          [329.63, 392.00, 493.88, 659.25],
          [523.25, 659.25, 783.99, 1046.50],
          [587.33, 698.46, 880.00, 1046.50],
          [493.88, 587.33, 739.99, 987.77]
        ];
      } else if (this.activeWorld === "neon_city") {
        // Cyberpunk arpeggio lead notes
        leadMelodies = [
          [440.00, 523.25, 659.25, 880.00, 1046.50],
          [392.00, 493.88, 587.33, 783.99, 987.77],
          [349.23, 440.00, 523.25, 698.46, 880.00],
          [329.63, 415.30, 493.88, 659.25, 830.61]
        ];
      } else {
        leadMelodies = [
          [440.00, 523.25, 659.25],
          [349.23, 440.00, 523.25],
          [392.00, 493.88, 587.33],
          [523.25, 659.25, 783.99]
        ];
      }
      
      const chord = leadMelodies[this.barCounter];
      const freq = chord[Math.floor(Math.random() * chord.length)];
      
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      const leadFilter = this.ctx.createBiquadFilter();
      
      leadOsc.type = (this.activeWorld === "neon_city" ? 'sawtooth' : 'triangle');
      leadOsc.frequency.setValueAtTime(freq, now);
      
      leadFilter.type = 'lowpass';
      leadFilter.frequency.setValueAtTime((this.activeWorld === "mountain" ? 600 : 800), now);
      leadFilter.Q.value = 1.0;
      
      leadGain.gain.setValueAtTime(0, now);
      leadGain.gain.linearRampToValueAtTime(this.musicVolume * (this.activeWorld === "neon_city" ? 0.012 : 0.02), now + 0.05);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      leadOsc.connect(leadFilter);
      leadFilter.connect(leadGain);
      leadGain.connect(this.ctx.destination);
      
      leadOsc.start(now);
      leadOsc.stop(now + 0.4);
    }
  }

  // SFX: Level / World Locked double buzz beep
  playLocked() {
    if (this.sfxVolume <= 0) return;
    this.resumeContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.setValueAtTime(80, now + 0.08);
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.22, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.20);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.20);
    
    this.triggerHaptic(60);
  }
}

// Global instantiation
window.gameAudio = new AudioSynthEngine();
