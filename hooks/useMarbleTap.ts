import { useCallback, useRef } from 'react';
import { useSound } from '../contexts/SoundContext';

/**
 * Synthesizes a subtle "marble tap" via Web Audio API — a short, muted
 * knock in the low-mid range with a fast decay. No audio files needed, no
 * network fetch, sub-kilobyte code. Only fires when the user has opted in
 * via the header sound toggle.
 *
 * Web Audio wants a user gesture to first unlock the context — because we
 * only ever play on click, that's always satisfied.
 */
export const useMarbleTap = () => {
  const { enabled } = useSound();
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    const AC: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;

    if (!ctxRef.current) ctxRef.current = new AC();
    const ctx = ctxRef.current;
    // Some browsers suspend the context until an explicit resume even after
    // a gesture — this is a no-op when it's already running.
    if (ctx.state === 'suspended') ctx.resume().catch(() => undefined);

    const now = ctx.currentTime;

    // Marble-tap timbre: two overlapping decaying sines through a shaped
    // envelope. Frequencies picked to feel like knocking on stone: mid-low,
    // with a slightly higher harmonic that dies faster (like ring-off).
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    gain.connect(ctx.destination);

    const o1 = ctx.createOscillator();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(220, now);
    o1.frequency.exponentialRampToValueAtTime(180, now + 0.2);
    o1.connect(gain);
    o1.start(now);
    o1.stop(now + 0.25);

    const o2 = ctx.createOscillator();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(680, now);
    o2.frequency.exponentialRampToValueAtTime(420, now + 0.15);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.0001, now);
    g2.gain.exponentialRampToValueAtTime(0.06, now + 0.004);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    o2.connect(g2);
    g2.connect(ctx.destination);
    o2.start(now);
    o2.stop(now + 0.13);
  }, [enabled]);
};
