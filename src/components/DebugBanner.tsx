import { useCurrentFrame } from 'remotion';
import { TOTAL_FRAMES, mmiData } from '../mmiData';
import { getTransitionType } from '../utils/transitions';

export const DebugBanner: React.FC = () => {
  const frame = useCurrentFrame();

  let acc = 0; let si = 0;
  for (let i = 0; i < mmiData.length; i++) {
    if (frame < acc + mmiData[i].durationInFrames) { si = i; break; }
    acc += mmiData[i].durationInFrames;
  }

  const nextTr = si < mmiData.length - 1 ? getTransitionType(si).toUpperCase() : 'END';
  const progress = frame / TOTAL_FRAMES;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 34,
      zIndex: 30,
      background: 'rgba(5,5,5,0.92)',
      borderBottom: '1px solid rgba(188,19,254,0.2)',
      display: 'flex', alignItems: 'center',
      paddingLeft: 64, paddingRight: 40, gap: 0,
    }}>
      {/* Progress bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: `${progress * 100}%`,
        background: 'rgba(188,19,254,0.15)',
      }} />

      {[
        { v: `SECTION ${String(si + 1).padStart(2, '0')}/${mmiData.length}`, accent: true },
        { v: mmiData[si].id.toUpperCase().replace(/-/g, '_') },
        { v: `NEXT_TR: ${nextTr}` },
        { v: `F:${String(frame).padStart(4, '0')}` },
        { v: `${Math.floor(progress * 100)}%` },
      ].map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          {i > 0 && <span style={{ margin: '0 9px', color: 'rgba(188,19,254,0.4)', fontFamily: 'monospace', fontSize: 9 }}>//</span>}
          <span style={{
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSize: 13,
            letterSpacing: '0.08em',
            color: item.accent ? '#BC13FE' : 'rgba(255,255,255,0.35)',
            fontWeight: item.accent ? 600 : 400,
          }}>
            {item.v}
          </span>
        </span>
      ))}
    </div>
  );
};
