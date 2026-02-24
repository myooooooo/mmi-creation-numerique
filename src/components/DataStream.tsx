import { interpolate, useCurrentFrame } from 'remotion';
import { TOTAL_FRAMES } from '../mmiData';

const STREAM_LINES = [
  '47.3220° N, 5.0415° E // DIJON',
  '{ "module": "design_graphique", "type": "CYBER" }',
  'LAT: 47.3220  LON: 5.0415  ALT: 247m',
  '> init: CREATION_NUMERIQUE v2.6.0',
  '48.8566° N, 2.3522° E // PARIS',
  'fn spring(stiffness: 800, damping: 10) {',
  '  return animate(frame, mass: 0.5);',
  '}',
  '"tags": ["Design", "Motion", "XR", "Cyber"],',
  '> GLITCH_ENGINE: ACTIVE // chromatic: ON',
  '43.2965° N, 5.3698° E // MARSEILLE',
  'const glow = "0 0 40px #8A2BE2, 0 0 80px #FF00FF";',
  '> AUDIO_VIZ: BPM=128 // KICK_SYNC: OK',
  '{ "neon": "#8A2BE2", "magenta": "#FF00FF", "xenon": "#0047FF" }',
  'fn glitch(velocity: f32) -> ColorShift {',
  '  aberrate(v * 0.15, split: 8px)',
  '}',
  '45.7640° N, 4.8357° E // LYON',
  'COORD_LOCK: 47.3220 / 5.0415 / 247',
  '> RENDER_NODE_01: ACTIVE // CACHE: ENABLED',
  'stiffness: 800, damping: 10, mass: 0.5',
  'import { spring, interpolate } from "remotion"',
  '48.5734° N, 7.7521° E // STRASBOURG',
  '{ "format": "1280x720", "fps": 30, "bloom": true }',
  '// parcours: CREATION_NUMERIQUE // promo: 2026',
  'const scale = 1 + progress * 0.05; // zoom',
  '> DATA_STREAM: { live: true, opacity: 0.05 }',
  'keyframe: whip_pan(5f) + blur(18px)',
  '{ "designer": "ANSSAFOU_Z", "year": 2026 }',
  '47.3220° N, 5.0415° E // SCAN LOCK',
];

const LINE_HEIGHT = 14;

export const DataStream: React.FC = () => {
  const frame = useCurrentFrame();

  const scrollY = interpolate(frame, [0, TOTAL_FRAMES], [0, -STREAM_LINES.length * LINE_HEIGHT * 1.8], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 26,
        bottom: 0,
        width: 190,
        overflow: 'hidden',
        zIndex: 5,
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <div style={{ transform: `translateY(${scrollY}px)`, paddingTop: 20 }}>
        {[...STREAM_LINES, ...STREAM_LINES].map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 8,
              color: '#8A2BE2',
              opacity: 0.05,
              letterSpacing: '0.04em',
              lineHeight: `${LINE_HEIGHT}px`,
              height: LINE_HEIGHT,
              paddingRight: 14,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              filter: 'blur(0.3px)',
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};
