import { useCurrentFrame, useVideoConfig } from 'remotion';
import { getKickPulse, BPM } from '../utils/beat';

const NUM_BARS = 48;
const BASE_RADIUS = 100;
const MAX_BAR = 65;

export const AudioVisualizer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const kickPulse = getKickPulse(frame, fps);

  // Hi-hat fires on every half-beat (smaller pulse)
  const framesPerHalfBeat = (fps * 60) / BPM / 2;
  const hihatFrame = frame % framesPerHalfBeat;
  // Simple exponential decay for hi-hat
  const hihatPulse = Math.exp(-hihatFrame * 0.4) * 0.28;

  const cx = width / 2;
  const cy = height / 2;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
      width={width}
      height={height}
    >
      <defs>
        <filter id="glow-viz">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-soft">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#8A2BE2" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient core glow */}
      <circle
        cx={cx}
        cy={cy}
        r={BASE_RADIUS * (0.8 + kickPulse * 0.3)}
        fill="url(#core-grad)"
        filter="url(#glow-soft)"
      />

      {/* Inner ring */}
      <circle
        cx={cx} cy={cy} r={BASE_RADIUS - 8}
        stroke="#8A2BE2" strokeWidth={0.5} fill="none"
        opacity={0.25 + kickPulse * 0.2}
      />
      <circle
        cx={cx} cy={cy} r={BASE_RADIUS}
        stroke="#FF00FF" strokeWidth={1} fill="none"
        opacity={0.2 + kickPulse * 0.35}
        filter="url(#glow-viz)"
      />

      {/* Visualizer bars */}
      {Array.from({ length: NUM_BARS }).map((_, i) => {
        const angle = (i / NUM_BARS) * Math.PI * 2 - Math.PI / 2;

        // Per-bar frequency response: combination of kick + organic oscillation
        const barPhase = i * 0.65;
        const freqResp = Math.abs(Math.sin(barPhase + frame * 0.04)) * 0.5
          + Math.abs(Math.sin(barPhase * 1.7 + frame * 0.02)) * 0.3;
        const barVal = kickPulse * (0.4 + freqResp * 0.6) + hihatPulse + freqResp * 0.15;
        const barLen = Math.max(2, barVal * MAX_BAR);

        const r1 = BASE_RADIUS + 3;
        const r2 = BASE_RADIUS + 3 + barLen;
        const x1 = cx + Math.cos(angle) * r1;
        const y1 = cy + Math.sin(angle) * r1;
        const x2 = cx + Math.cos(angle) * r2;
        const y2 = cy + Math.sin(angle) * r2;

        // Color cycles: violet → magenta → xenon blue
        const color = i % 3 === 0 ? '#8A2BE2' : i % 3 === 1 ? '#FF00FF' : '#0047FF';
        const opacity = 0.25 + barVal * 0.55;

        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color}
            strokeWidth={i % 4 === 0 ? 2.5 : 1.5}
            opacity={opacity}
            filter="url(#glow-viz)"
          />
        );
      })}

      {/* Center pulse dot */}
      <circle
        cx={cx} cy={cy}
        r={3 + kickPulse * 10}
        fill="#FF00FF"
        opacity={0.5 + kickPulse * 0.4}
        filter="url(#glow-viz)"
      />
      <circle cx={cx} cy={cy} r={2} fill="#fff" opacity={0.8} />
    </svg>
  );
};
