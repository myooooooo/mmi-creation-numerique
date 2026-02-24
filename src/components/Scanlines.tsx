import { useVideoConfig } from 'remotion';

/** Subtle CRT-monitor scanlines at 3% opacity. Fixed overlay, no z-fight. */
export const Scanlines: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width, height,
        pointerEvents: 'none',
        zIndex: 40,
        background: `repeating-linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.03) 0px,
          rgba(255, 255, 255, 0.03) 1px,
          transparent 1px,
          transparent 3px
        )`,
      }}
    />
  );
};
