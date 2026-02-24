import { Img, interpolate, spring, staticFile } from 'remotion';
import { Section } from '../mmiData';

interface SectionVisualProps {
  section: Section;
  localFrame: number;
  fps: number;
  w: number;
  h: number;
}

// ── Layout Grid (Design Graphique) ───────────────────────────────────────────
const LayoutGridVisual: React.FC<{ localFrame: number; fps: number; w: number; h: number }> = ({
  localFrame, fps, w, h,
}) => {
  const ZONES = [
    { x: 0.04, y: 0.04, rw: 0.92, rh: 0.14, label: 'HEADER / NAVIGATION' },
    { x: 0.04, y: 0.22, rw: 0.42, rh: 0.50, label: 'HERO' },
    { x: 0.50, y: 0.22, rw: 0.46, rh: 0.23, label: 'INFO' },
    { x: 0.50, y: 0.49, rw: 0.46, rh: 0.23, label: 'CTA' },
    { x: 0.04, y: 0.76, rw: 0.92, rh: 0.12, label: 'FOOTER' },
  ];
  const DELAY_PER_ZONE = 10;

  return (
    <svg width={w} height={h}>
      <defs>
        <filter id="grid-glow">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Technical grid fill — horizontal scanlines every 4px */}
        <pattern id="zone-grid" width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="6" y2="0" stroke="rgba(188,19,254,0.18)" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(188,19,254,0.10)" strokeWidth="0.5" />
        </pattern>
      </defs>
      {ZONES.map((z, i) => {
        const px = z.x * w; const py = z.y * h;
        const pw = z.rw * w; const ph = z.rh * h;
        const perim = 2 * (pw + ph);
        const s = spring({ frame: localFrame - i * DELAY_PER_ZONE, fps, config: { stiffness: 300, damping: 28 } });
        const dash = interpolate(s, [0, 1], [perim, 0]);
        const labelOpacity = interpolate(s, [0.6, 1], [0, 1]);
        return (
          <g key={i}>
            {/* Grid texture fill — "screen waiting for data" */}
            <rect x={px} y={py} width={pw} height={ph}
              fill="url(#zone-grid)" opacity={labelOpacity * 0.55} />
            {/* Zone border trace-in */}
            <rect x={px} y={py} width={pw} height={ph}
              fill="none" stroke="#BC13FE"
              strokeWidth={0.8} strokeDasharray={perim} strokeDashoffset={dash}
              filter="url(#grid-glow)" />
            <text x={px + pw / 2} y={py + ph / 2}
              textAnchor="middle" dominantBaseline="middle"
              fontFamily='"Helvetica Neue", Helvetica, sans-serif'
              fontSize={Math.min(13, ph * 0.28)} fill="#BC13FE"
              letterSpacing="0.12em" opacity={labelOpacity * 0.8}>
              {z.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};


// ── Image Card ────────────────────────────────────────────────────────────────
const ImageCard: React.FC<{ src: string; w: number; h: number; localFrame: number }> = ({
  src, w, h, localFrame,
}) => {
  const fadeIn = interpolate(localFrame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale = interpolate(localFrame, [0, 40], [1.04, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      width: w, height: h,
      borderRadius: 20, overflow: 'hidden',
      border: '1.5px solid #BC13FE',
      boxShadow: '0 0 22px rgba(188,19,254,0.40), 0 0 60px rgba(188,19,254,0.14)',
      opacity: fadeIn, flexShrink: 0,
    }}>
      <Img
        src={staticFile(src)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: `scale(${scale})`, transformOrigin: 'center center' }}
      />
    </div>
  );
};

// ── Router ────────────────────────────────────────────────────────────────────
export const SectionVisual: React.FC<SectionVisualProps> = ({
  section, localFrame, fps, w, h,
}) => {
  // Image takes priority — sections 1-6 have a photo
  if (section.image) {
    return <ImageCard src={section.image} w={w} h={h} localFrame={localFrame} />;
  }
  // No image: fallback to data-driven visuals (only 'intro' reaches this)
  return <LayoutGridVisual localFrame={localFrame} fps={fps} w={w} h={h} />;
};
