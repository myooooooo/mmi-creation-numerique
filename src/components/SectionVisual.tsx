import { Img, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { Section } from '../mmiData';
import { getKickPulse } from '../utils/beat';

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

// ── Waveform (Production AV) ─────────────────────────────────────────────────
const WaveformVisual: React.FC<{ localFrame: number; fps: number; w: number; h: number }> = ({
  localFrame, fps, w, h,
}) => {
  const globalFrame = useCurrentFrame();
  const kick = getKickPulse(globalFrame, fps);
  const N = 200;
  const cy = h / 2;
  const t = localFrame * 0.05;
  const amp = 14 + kick * 24;
  const amp2 = 5 + kick * 10;

  const buildPath = (freq: number, amplitude: number, phase: number) =>
    `M ${Array.from({ length: N }, (_, i) => {
      const x = (i / (N - 1)) * w;
      const y = cy + Math.sin(i * freq + t + phase) * amplitude
              + Math.sin(i * freq * 2.1 + t * 0.7 + phase) * amplitude * 0.3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' L ')}`;

  const fadeIn = Math.min(1, localFrame / 20);

  return (
    <svg width={w} height={h} style={{ opacity: fadeIn }}>
      <path d={buildPath(0.17, amp2, Math.PI)} stroke="rgba(188,19,254,0.35)" strokeWidth={1} fill="none" />
      <path d={buildPath(0.17, amp, 0)} stroke="rgba(255,255,255,0.75)" strokeWidth={1.5} fill="none" />
      <line x1={0} y1={cy} x2={w} y2={cy} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
    </svg>
  );
};

// ── Geometric Shapes (Motion Design) ─────────────────────────────────────────
const GeometricVisual: React.FC<{ localFrame: number; fps: number; w: number; h: number }> = ({
  localFrame, fps, w, h,
}) => {
  const globalFrame = useCurrentFrame();
  const kick = getKickPulse(globalFrame, fps);
  const t = localFrame * 0.04;
  const cx = w / 2; const cy = h / 2;
  const ORBIT_R = Math.min(w, h) * 0.28;

  const entryS = spring({ frame: localFrame, fps, config: { stiffness: 200, damping: 26 } });
  const entryOpacity = entryS;

  return (
    <svg width={w} height={h} style={{ opacity: entryOpacity }}>
      <defs>
        <filter id="geo-glow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Rotating diamond (square at 45°) */}
      {(() => {
        const size = 80 + kick * 20;
        const rot = t * 30;
        return (
          <rect
            x={cx - size / 2} y={cy - size / 2}
            width={size} height={size}
            fill="none" stroke="#BC13FE" strokeWidth={1.5}
            transform={`rotate(${rot + 45}, ${cx}, ${cy})`}
            filter="url(#geo-glow)" opacity={0.8}
          />
        );
      })()}

      {/* Orbiting circle */}
      {(() => {
        const ox = cx + Math.cos(t) * ORBIT_R;
        const oy = cy + Math.sin(t) * ORBIT_R;
        const r = 10 + kick * 8;
        return (
          <circle cx={ox} cy={oy} r={r} fill="#BC13FE"
            filter="url(#geo-glow)" opacity={0.7} />
        );
      })()}

      {/* Counter-rotating outer square */}
      {(() => {
        const size = 160 + kick * 10;
        const rot = -t * 15;
        return (
          <rect
            x={cx - size / 2} y={cy - size / 2}
            width={size} height={size}
            fill="none" stroke="rgba(188,19,254,0.25)" strokeWidth={0.8}
            transform={`rotate(${rot}, ${cx}, ${cy})`}
          />
        );
      })()}

      {/* Center dot pulse */}
      <circle cx={cx} cy={cy} r={4 + kick * 12} fill="none"
        stroke="#BC13FE" strokeWidth={1} opacity={0.5 + kick * 0.4} />
      <circle cx={cx} cy={cy} r={3} fill="rgba(255,255,255,0.9)" />
    </svg>
  );
};

// ── JSON Data Block (default) ─────────────────────────────────────────────────
const JSON_DATA: Record<string, object> = {
  'intro':               { formation: 'BUT_MMI', grade: 'LICENCE', ects: 180, duree: '3_ANS' },
  'creation-numerique':  { parcours: 'CREATION_NUM', annee: 2, type: 'SPECIALISATION' },
  'narration-interactive': { medium: ['XR', 'INSTALL', 'WEB'], storytelling: true },
  'hard-skills':         { tools: ['Figma', 'AE', 'Blender', 'HTML'], level: 'BAC+3' },
  'debouches':           { metiers: ['UI_DESIGN', 'MOTION', 'DA'], secteur: 'CREATIVE' },
};

const JsonDataBlock: React.FC<{ section: Section; localFrame: number; w: number }> = ({
  section, localFrame, w,
}) => {
  const data = JSON_DATA[section.id] ?? { id: section.id, tags: section.tags };
  const lines: string[] = ['{'];
  for (const [k, v] of Object.entries(data)) {
    const val = typeof v === 'string' ? `"${v}"` : JSON.stringify(v);
    lines.push(`  "${k}": ${val},`);
  }
  lines.push('}');

  const fadeIn = Math.min(1, localFrame / 18);

  return (
    <div style={{ width: w, opacity: fadeIn, padding: '8px 0' }}>
      {lines.map((line, i) => {
        const lineOpacity = Math.min(1, Math.max(0, (localFrame - i * 4) / 10));
        const isKey = line.includes('"') && line.includes(':');
        const isBracket = line.trim() === '{' || line.trim() === '}';
        const isValue = !isBracket && !isKey;
        return (
          <div
            key={i}
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 16,
              lineHeight: '30px',
              opacity: lineOpacity * 0.85,
              color: isBracket
                  ? 'rgba(255,255,255,0.2)'
                  : isKey
                    ? 'rgba(255,255,255,0.55)'
                    : '#BC13FE',
              textShadow: isValue ? '0 0 10px rgba(188,19,254,0.25)' : 'none',
              whiteSpace: 'pre',
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
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
  // No image: fallback to data-driven visuals
  switch (section.id) {
    case 'design-graphique':
    case 'hard-skills':
      return <LayoutGridVisual localFrame={localFrame} fps={fps} w={w} h={h} />;
    case 'production-av':
      return <WaveformVisual localFrame={localFrame} fps={fps} w={w} h={h} />;
    case 'motion-design':
      return <GeometricVisual localFrame={localFrame} fps={fps} w={w} h={h} />;
    default:
      return <JsonDataBlock section={section} localFrame={localFrame} w={w} />;
  }
};
