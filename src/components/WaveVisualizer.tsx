import { useCurrentFrame } from 'remotion';
import { getKickPulse } from '../utils/beat';

interface WaveVisualizerProps {
  localFrame: number;
  fps: number;
  colWidth: number;
  /** Unique ID suffix to avoid SVG filter conflicts between instances */
  uid: string;
}

const N = 160; // path resolution

/** Generates a smooth SVG polyline string for a sine wave. */
function buildWavePath(
  width: number,
  centerY: number,
  amplitude: number,
  frequency: number,
  phase: number,
  timeOffset: number,
): string {
  const pts = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const x = t * width;
    const y = centerY + Math.sin(t * frequency * Math.PI * 2 + phase + timeOffset) * amplitude;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M ${pts.join(' L ')}`;
}

export const WaveVisualizer: React.FC<WaveVisualizerProps> = ({
  localFrame,
  fps,
  colWidth,
  uid,
}) => {
  const globalFrame = useCurrentFrame();
  const kick = getKickPulse(globalFrame, fps);

  const W = colWidth;
  const H = 80;
  const CY = H / 2;
  const time = localFrame * 0.055;

  // Amplitude modulated by beat pulse
  const mainAmp = 9 + kick * 14;
  const secAmp = 4 + kick * 6;
  const tertiaryAmp = 2 + kick * 3;

  const p1 = buildWavePath(W, CY, mainAmp, 1.8, 0, time);
  const p2 = buildWavePath(W, CY, secAmp, 2.6, Math.PI * 0.6, time * 0.7);
  const p3 = buildWavePath(W, CY, tertiaryAmp, 3.8, Math.PI * 1.3, time * 1.2);

  const fadeIn = Math.min(1, localFrame / 24);
  const gradId = `wave-mask-${uid}`;

  return (
    <svg
      width={W}
      height={H}
      style={{ display: 'block', opacity: fadeIn, overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F8F9FA" stopOpacity="1" />
          <stop offset="8%" stopColor="#F8F9FA" stopOpacity="0" />
          <stop offset="92%" stopColor="#F8F9FA" stopOpacity="0" />
          <stop offset="100%" stopColor="#F8F9FA" stopOpacity="1" />
        </linearGradient>
        <mask id={`wave-fade-${uid}`}>
          <rect width={W} height={H} fill="white" />
          <rect width={W} height={H} fill={`url(#${gradId})`} />
        </mask>
      </defs>

      <g mask={`url(#wave-fade-${uid})`}>
        {/* Tertiary wave — teal, very subtle */}
        <path d={p3} stroke="#00A896" strokeWidth={1} fill="none" opacity={0.2} />
        {/* Secondary wave — blue, subtle */}
        <path d={p2} stroke="#0052CC" strokeWidth={1} fill="none" opacity={0.3} />
        {/* Main wave — blue, prominent */}
        <path d={p1} stroke="#0052CC" strokeWidth={1.5} fill="none" opacity={0.65} />
        {/* Center baseline */}
        <line x1={0} y1={CY} x2={W} y2={CY} stroke="#0052CC" strokeWidth={0.5} opacity={0.12} />
      </g>
    </svg>
  );
};
