import { interpolate, spring } from 'remotion';

interface AnimatedTagProps {
  tag: string;
  frame: number;
  fps: number;
}

const V = '#BC13FE';

/** High-energy neon badge — Electric Violet, prominent glow, readable size. */
export const AnimatedTag: React.FC<AnimatedTagProps> = ({ tag, frame, fps }) => {
  const s = spring({ frame, fps, config: { stiffness: 220, damping: 24, mass: 0.8 } });
  const scale = interpolate(s, [0, 1], [0.78, 1]);
  const opacity = interpolate(s, [0, 0.5, 1], [0, 0.7, 1]);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 9,
        paddingBottom: 9,
        borderRadius: 8,
        background: 'rgba(188,19,254,0.10)',
        border: `1px solid rgba(188,19,254,0.50)`,
        boxShadow: `0 0 10px rgba(188,19,254,0.25), inset 0 0 8px rgba(188,19,254,0.06)`,
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: 'left center',
      }}
    >
      <div style={{
        width: 5, height: 5, borderRadius: '50%',
        background: V,
        boxShadow: `0 0 6px ${V}`,
        flexShrink: 0,
      }} />
      <span style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.05em',
        color: V,
        textShadow: `0 0 8px rgba(188,19,254,0.7)`,
        whiteSpace: 'nowrap',
      }}>
        {tag}
      </span>
    </div>
  );
};
