import { useCurrentFrame, useVideoConfig } from 'remotion';

/** Animated film grain using SVG feTurbulence — seed changes every frame. */
export const NoiseBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const seed = frame % 120; // 120 unique grain patterns cycling

  return (
    <svg
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      width={width}
      height={height}
    >
      <defs>
        <filter id={`grain-f${seed}`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75 0.85"
            numOctaves="4"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="overlay" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      {/* Dark base with violet tint */}
      <rect width={width} height={height} fill="rgba(10, 0, 20, 0.4)" />
      {/* Grain overlay */}
      <rect
        width={width}
        height={height}
        fill="rgba(138, 43, 226, 0.06)"
        filter={`url(#grain-f${seed})`}
        opacity={0.45}
      />
    </svg>
  );
};
