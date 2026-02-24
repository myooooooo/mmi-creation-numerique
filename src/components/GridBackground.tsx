import { useVideoConfig } from 'remotion';
import { computeCameraX } from '../utils/computeCameraX';
import { useCurrentFrame } from 'remotion';

/** Dark architectural grid at 4% opacity with parallax. */
export const GridBackground: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const cameraX = computeCameraX(frame, width);
  const parallaxX = cameraX * 0.12;

  const COLS = 12; const ROWS = 8;
  const cw = width / COLS; const rh = height / ROWS;

  return (
    <svg
      style={{
        position: 'absolute', top: 0, left: 0,
        pointerEvents: 'none',
        transform: `translateX(${parallaxX}px)`,
        overflow: 'visible',
      }}
      width={width + 120} height={height}
    >
      {Array.from({ length: COLS + 2 }).map((_, i) => (
        <line key={`v${i}`}
          x1={(i - 1) * cw} y1={0} x2={(i - 1) * cw} y2={height}
          stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
      ))}
      {Array.from({ length: ROWS + 1 }).map((_, i) => (
        <line key={`h${i}`}
          x1={-60} y1={i * rh} x2={width + 120} y2={i * rh}
          stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
      ))}
    </svg>
  );
};
