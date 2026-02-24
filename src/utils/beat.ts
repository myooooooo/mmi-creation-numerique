import { spring } from 'remotion';

export const BPM = 128;

/** Deterministic pseudo-random from a seed (no Math.random). */
export const seededRandom = (seed: number): number => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

/** Returns spring kick value that pulses every beat. */
export function getKickPulse(frame: number, fps: number): number {
  const framesPerBeat = (fps * 60) / BPM;
  const framesSinceLastBeat = frame % framesPerBeat;
  return spring({
    frame: framesSinceLastBeat,
    fps,
    config: { stiffness: 600, damping: 12, mass: 0.5 },
  });
}
