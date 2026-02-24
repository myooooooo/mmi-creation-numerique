import { mmiData } from '../mmiData';

export type TransitionType = 'whip' | 'vertical' | 'zoom';

/** Deterministic assignment — cycles whip → vertical → zoom */
const TRANSITION_ORDER: TransitionType[] = [
  'whip', 'vertical', 'zoom',
  'whip', 'vertical', 'zoom',
  'whip',
];

export function getTransitionType(boundaryIndex: number): TransitionType {
  return TRANSITION_ORDER[boundaryIndex] ?? 'whip';
}

/** Power4.out: fast start, eases to rest. */
const power4out = (t: number): number => 1 - Math.pow(1 - t, 4);

export const TRANSITION_DURATION = 15; // frames

/**
 * Computes the full camera state for the current frame.
 * Returns translateX, translateY, and scale to apply to the camera rig.
 */
export function computeCamera(
  frame: number,
  width: number,
  height: number,
): { x: number; y: number; scale: number } {
  let x = 0;
  let y = 0;
  let scale = 1;
  let frameAccum = 0;

  for (let i = 0; i < mmiData.length - 1; i++) {
    const type = getTransitionType(i);
    frameAccum += mmiData[i].durationInFrames;
    const tFrame = frame - frameAccum;

    // Raw progress 0→1 over exactly TRANSITION_DURATION frames
    const rawP = Math.max(0, Math.min(1, tFrame / TRANSITION_DURATION));
    const p = power4out(rawP);

    // ── X: all transitions slide horizontally ──────────────────────────────
    x += p * -width;

    // ── Y: vertical transition adds a sine arc ─────────────────────────────
    if (type === 'vertical' && tFrame >= 0 && tFrame < TRANSITION_DURATION) {
      y += Math.sin(rawP * Math.PI) * height * 0.07;
    }

    // ── Scale: zoom transition pulses the camera ───────────────────────────
    if (type === 'zoom' && tFrame >= 0 && tFrame < TRANSITION_DURATION) {
      scale = Math.max(scale, 1 + Math.sin(rawP * Math.PI) * 0.055);
    }
  }

  return { x, y, scale };
}

/** cameraX only (for grid parallax). */
export function computeCameraX(frame: number, width: number): number {
  return computeCamera(frame, width, 720).x;
}

/** Layout type for each section (index % 4). */
export type LayoutType = 'centered' | 'left' | 'right' | 'fullscreen';

export function getLayout(index: number): LayoutType {
  const map: LayoutType[] = ['centered', 'left', 'right', 'fullscreen'];
  return map[index % 4];
}
