import { useCurrentFrame } from 'remotion';
import { TOTAL_FRAMES, mmiData } from '../mmiData';

export const TechHUD: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / TOTAL_FRAMES;

  let acc = 0; let si = 0;
  for (let i = 0; i < mmiData.length; i++) {
    if (frame < acc + mmiData[i].durationInFrames) { si = i; break; }
    acc += mmiData[i].durationInFrames;
  }

  const TRACK_H = 140;
  const filledH = progress * TRACK_H;

  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, width: 52, height: '100%',
      zIndex: 20,
      background: 'rgba(5,5,5,0.8)',
      borderRight: '1px solid rgba(138,43,226,0.15)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
    }}>
      <div style={{
        fontFamily: '"Helvetica Neue", sans-serif', fontSize: 8, fontWeight: 600,
        color: '#8A2BE2', letterSpacing: '0.08em',
        writingMode: 'vertical-rl', transform: 'rotate(180deg)',
      }}>
        {String(si + 1).padStart(2, '0')}/{mmiData.length}
      </div>

      {/* Track */}
      <div style={{ position: 'relative', width: 2, height: TRACK_H, background: 'rgba(138,43,226,0.12)' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: filledH,
          background: 'linear-gradient(to bottom, #8A2BE2, rgba(138,43,226,0.4))',
        }} />
        <div style={{
          position: 'absolute', top: filledH - 3, left: -2,
          width: 6, height: 6, borderRadius: '50%',
          background: '#8A2BE2', boxShadow: '0 0 8px #8A2BE2',
        }} />
      </div>

      <div style={{
        fontFamily: '"Helvetica Neue", sans-serif', fontSize: 8,
        color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em',
        writingMode: 'vertical-rl', transform: 'rotate(180deg)',
      }}>
        {Math.floor(progress * 100)}%
      </div>
    </div>
  );
};
