import { interpolate, spring } from 'remotion';

interface AnimatedTagProps {
  tag: string;
  frame: number;
  fps: number;
}

/** Dark-theme badge: violet accent, rounded, smooth pop-in. */
export const AnimatedTag: React.FC<AnimatedTagProps> = ({ tag, frame, fps }) => {
  const s = spring({ frame, fps, config: { stiffness: 220, damping: 24, mass: 0.8 } });
  const scale = interpolate(s, [0, 1], [0.78, 1]);
  const opacity = interpolate(s, [0, 0.5, 1], [0, 0.6, 1]);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        paddingLeft: 13,
        paddingRight: 13,
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 6,
        background: 'rgba(138,43,226,0.12)',
        border: '1px solid rgba(138,43,226,0.35)',
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: 'left center',
      }}
    >
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#8A2BE2', flexShrink: 0 }} />
      <span style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        color: '#8A2BE2',
        whiteSpace: 'nowrap',
      }}>
        {tag}
      </span>
    </div>
  );
};
