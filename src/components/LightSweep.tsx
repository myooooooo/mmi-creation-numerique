import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// Vertical light beam that sweeps the screen every 4 seconds (120f at 30fps)
export const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const CYCLE = 120;   // 4 s
  const DURATION = 28; // frames to cross screen

  const cycle = frame % CYCLE;
  const t = Math.min(cycle / DURATION, 1);

  const x = interpolate(t, [0, 1], [-30, width + 30]);
  const opacity = cycle < DURATION
    ? interpolate(t, [0, 0.05, 0.85, 1], [0, 0.8, 0.8, 0])
    : 0;

  return (
    <div style={{
      position: 'absolute', top: 0, bottom: 0,
      left: x - 18, width: 36,
      background: [
        'linear-gradient(to right,',
        'transparent,',
        'rgba(188,19,254,0.10) 30%,',
        'rgba(255,255,255,0.55) 48%,',
        'rgba(255,255,255,0.55) 52%,',
        'rgba(188,19,254,0.10) 70%,',
        'transparent)',
      ].join(' '),
      height,
      opacity,
      pointerEvents: 'none',
      zIndex: 38,
    }} />
  );
};
