import { useVideoConfig } from 'remotion';
import { seededRandom } from '../utils/beat';

interface GlitchOverlayProps {
  /** Camera velocity in px/frame — drives glitch intensity */
  velocity: number;
  frame: number;
}

export const GlitchOverlay: React.FC<GlitchOverlayProps> = ({ velocity, frame }) => {
  const { height } = useVideoConfig();

  // Glitch intensity: ramps from 0 at low velocity to 1 at 600px/frame
  const intensity = Math.min(1, Math.max(0, (velocity - 60) / 500));

  // Slice artifacts: 3 horizontal tears at pseudo-random positions
  const slices = [0, 1, 2].map((i) => ({
    y: seededRandom(frame * 3.1 + i * 7) * height,
    h: 2 + seededRandom(frame * 5.3 + i * 11) * 8 * intensity,
    dx: (seededRandom(frame * 7.7 + i * 13) - 0.5) * 40 * intensity,
    color: i === 0 ? 'rgba(255,0,255,0.6)' : i === 1 ? 'rgba(0,71,255,0.5)' : 'rgba(138,43,226,0.5)',
  }));

  // RGB chromatic split during transitions
  const splitX = intensity * seededRandom(frame * 2.3) * 8;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 25,
        overflow: 'hidden',
      }}
    >
      {/* Always-on scanlines */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `repeating-linear-gradient(
            to bottom,
            rgba(138, 43, 226, 0.03) 0px,
            rgba(138, 43, 226, 0.03) 1px,
            transparent 1px,
            transparent 4px
          )`,
        }}
      />

      {/* Chromatic aberration during whip pan */}
      {intensity > 0.05 && (
        <>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(255,0,255,0.08)',
            transform: `translateX(${-splitX}px)`,
            mixBlendMode: 'screen',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,71,255,0.08)',
            transform: `translateX(${splitX}px)`,
            mixBlendMode: 'screen',
          }} />
        </>
      )}

      {/* Horizontal slice tears */}
      {intensity > 0.1 && slices.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            top: s.y,
            width: '100%',
            height: s.h,
            background: s.color,
            transform: `translateX(${s.dx}px)`,
            mixBlendMode: 'screen',
          }}
        />
      ))}

      {/* Full flash at peak velocity */}
      {intensity > 0.7 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#8A2BE2',
          opacity: (intensity - 0.7) * 0.3,
          mixBlendMode: 'screen',
        }} />
      )}
    </div>
  );
};
