// Live Synthesizer for Cinematic Ambient Soundscapes
// Generates space resonance and organic chord modulations based on the user's active act.
export class AmbientSound {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private oscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private isMuted: boolean = true;
  private lfo: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;

  constructor() {
    // Lazy loaded on first user interaction
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.setValueAtTime(0, this.ctx.currentTime);

      // Low pass filter to keep it celestial, heavy, and non-intrusive
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
      this.filter.frequency.setValueAtTime(250, this.ctx.currentTime);

      this.filter.connect(this.masterVolume);
      this.masterVolume.connect(this.ctx.destination);

      // Create base drone frequencies (C2, G2, C3, E3 - Celestial Major Chord or Drone)
      const freqs = [65.41, 98.00, 130.81, 164.81];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.filter) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        // Soft triangular oscillator for maximum warmth
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Individual gains
        oscGain.gain.setValueAtTime(idx === 0 ? 0.35 : 0.15, this.ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(this.filter);
        osc.start(0);

        this.oscs.push({ osc, gain: oscGain });
      });

      // Ambient celestial modulation (LFO)
      this.lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.lfo.type = "sine";
      this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow sweep
      lfoGain.gain.setValueAtTime(60, this.ctx.currentTime); // sweep range in Hz

      this.lfo.connect(lfoGain);
      if (this.filter && this.filter.frequency) {
        lfoGain.connect(this.filter.frequency);
      }
      this.lfo.start(0);

    } catch (e) {
      console.warn("AudioContext not supported or blocked", e);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.init();
    
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.masterVolume && this.ctx) {
      const targetVolume = muted ? 0 : 0.4;
      this.masterVolume.gain.setTargetAtTime(targetVolume, this.ctx.currentTime, 0.4);
    }
  }

  public getMutedStatus(): boolean {
    return this.isMuted;
  }

  // Morph frequency chords based on scroll progress to fit emotional tones
  // actIndex determines drone base: Act 1 (Tense, minor hints) -> Act 7 (Harmonic peace)
  public morphToneForAct(actIndex: number) {
    if (!this.ctx || this.isMuted) return;

    // Frequencies representing the narrative arc
    // Act 1 (Minor, anxious: C2, Eb2, G2, Bb2)
    // Act 4 (Transition: D2, F#2, A2, C3)
    // Act 7 (Sattvic pure major: C2, E2, G2, B2)
    const baseFreqs = [
      [65.41, 77.78, 98.00, 116.54], // Act 1: Chaotic minor chord
      [65.41, 77.78, 98.00, 116.54], // Act 2
      [73.42, 87.31, 110.00, 130.81], // Act 3: Shift
      [73.42, 92.50, 110.00, 146.83], // Act 4: Resolving to brighter notes
      [82.41, 103.83, 123.47, 164.81], // Act 5: Rising major theme
      [82.41, 103.83, 123.47, 164.81], // Act 6
      [130.81, 164.81, 196.00, 246.94] // Act 7: Celestial High Major
    ];

    const currentChord = baseFreqs[Math.min(actIndex, baseFreqs.length - 1)];
    const time = this.ctx.currentTime;

    this.oscs.forEach((item, idx) => {
      const targetFreq = currentChord[idx] || 100;
      item.osc.frequency.setTargetAtTime(targetFreq, time, 1.2);
    });

    // Also morph the low-pass filter frequency for structural drama (chaos: low muffled, discovery: high beam)
    if (this.filter) {
      const filterCutoff = actIndex === 0 ? 180 : 250 + actIndex * 50;
      this.filter.frequency.setTargetAtTime(filterCutoff, time, 1.0);
    }
  }
}

// Export single shared manager
export const ambientController = new AmbientSound();
