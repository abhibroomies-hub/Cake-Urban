// Sound Feedback Engine - Programmatic Web Audio Synthesizer for high-end luxury feel
let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

// Play a sweet, premium metallic chime on success (e.g. added to cart, purchase)
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  
  // Create first ring
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(523.25, now); // C5
  osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
  
  gain1.gain.setValueAtTime(0.12, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
  
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  
  // Create second harmonic ring for rich metallic depth
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(1046.50, now + 0.08); // C6
  osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.25); // E6
  
  gain2.gain.setValueAtTime(0.06, now + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
  
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  
  osc1.start(now);
  osc1.stop(now + 0.8);
  osc2.start(now + 0.08);
  osc2.stop(now + 0.9);
}

// Play a subtle, high-end mechanical device click/tap 
export function playBtnTap() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
  
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(now);
  osc.stop(now + 0.06);
}

// Play a delicate slide click for tab switches or toggles
export function playSlidePop() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
  
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(now);
  osc.stop(now + 0.08);
}
