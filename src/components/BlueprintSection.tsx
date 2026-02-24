import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { mmiData, Section } from '../mmiData';
import { AnimatedTag } from './AnimatedTag';
import { SectionVisual } from './SectionVisual';
import { getLayout } from '../utils/transitions';
import { TRANSITION_DURATION } from '../utils/transitions';

interface Props { section: Section; index: number; startFrame: number; }

// ── Shared text block (used by all layouts) ──────────────────────────────────
interface TextBlockProps {
  section: Section; index: number; localFrame: number; fps: number;
  titleSize: number; maxW?: number | string; align?: 'left' | 'center' | 'right';
}
const TextBlock: React.FC<TextBlockProps> = ({
  section, index, localFrame, fps, titleSize, maxW = '100%', align = 'left',
}) => {
  const words = section.title.split(' ');

  const eyeS = spring({ frame: localFrame, fps, config: { stiffness: 240, damping: 28 } });
  const lineW = interpolate(localFrame, [8, 28], [0, 280], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subO = interpolate(localFrame, [22, 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start', maxWidth: maxW }}>

      {/* Eyebrow */}
      <div style={{
        fontFamily: '"Helvetica Neue", sans-serif', fontSize: 15, fontWeight: 600,
        letterSpacing: '0.2em', color: '#BC13FE',
        marginBottom: 12, opacity: eyeS,
        transform: `translateY(${interpolate(eyeS, [0, 1], [10, 0])}px)`,
        textAlign: align,
        textShadow: '0 0 12px #BC13FE, 0 0 25px rgba(188,19,254,0.35)',
      }}>
        {String(index + 1).padStart(2, '0')} // {mmiData.length}
      </div>

      {/* Title — word stagger, massive */}
      <div style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: 900, fontSize: titleSize, lineHeight: 0.9,
        letterSpacing: '-0.03em', color: '#FFFFFF',
        marginBottom: 20, overflow: 'visible', textAlign: align,
        textShadow: '0 0 40px rgba(188,19,254,0.18)',
      }}>
        {words.map((word, wi) => {
          const ws = spring({ frame: localFrame - wi * 6, fps, config: { stiffness: 220, damping: 26, mass: 0.9 } });
          return (
            <span key={wi} style={{
              display: 'inline-block',
              transform: `translateY(${interpolate(ws, [0, 1], [50, 0])}px)`,
              opacity: ws, marginRight: '0.22em',
            }}>
              {word}
            </span>
          );
        })}
      </div>

      {/* Accent rule */}
      <div style={{
        height: 2, width: lineW,
        background: 'linear-gradient(to right, #BC13FE, rgba(188,19,254,0.1))',
        borderRadius: 1, marginBottom: 18,
        alignSelf: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        boxShadow: '0 0 8px #BC13FE, 0 0 16px rgba(188,19,254,0.3)',
      }} />

      {/* Subtitle */}
      <div style={{
        fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 300, fontSize: 24,
        lineHeight: 1.6, color: 'rgba(255,255,255,0.72)',
        opacity: subO, marginBottom: 28, textAlign: align,
      }}>
        {section.subtitle}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}>
        {section.tags.map((tag, ti) => (
          <AnimatedTag key={tag} tag={tag} frame={Math.max(0, localFrame - 28 - ti * 11)} fps={fps} />
        ))}
      </div>
    </div>
  );
};

// ── Layout 0: CENTERED — massive, magazine ───────────────────────────────────
const CenteredLayout: React.FC<{ section: Section; index: number; localFrame: number; fps: number; width: number; height: number }> = (
  { section, index, localFrame, fps, width, height }
) => {
  const titleSize = section.title.length > 12 ? 84 : 108;
  return (
    <div style={{ position: 'relative', width, height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 80px', boxSizing: 'border-box' }}>
      {/* Background visual — very faint */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.07, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SectionVisual section={section} localFrame={localFrame} fps={fps} w={width * 0.7} h={height * 0.7} />
      </div>
      <TextBlock section={section} index={index} localFrame={localFrame} fps={fps} titleSize={titleSize} maxW={1000} align="center" />
    </div>
  );
};

// ── Layout 1: LEFT text / RIGHT visual ──────────────────────────────────────
const LeftLayout: React.FC<{ section: Section; index: number; localFrame: number; fps: number; width: number; height: number }> = (
  { section, index, localFrame, fps, width, height }
) => {
  const HUD = 52; const PAD = 36; const GAP = 48;
  const leftW = Math.floor((width - HUD - PAD * 2 - GAP) * 0.52);
  const rightW = width - HUD - PAD * 2 - GAP - leftW;
  const titleSize = section.title.length > 18 ? 50 : section.title.length > 11 ? 62 : 76;
  const visO = interpolate(localFrame, [16, 36], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', alignItems: 'center', padding: `60px ${PAD}px 40px ${HUD + PAD}px`, boxSizing: 'border-box', gap: GAP }}>
      <div style={{ width: leftW, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <TextBlock section={section} index={index} localFrame={localFrame} fps={fps} titleSize={titleSize} maxW={leftW} />
      </div>
      <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', opacity: visO }}>
        <SectionVisual section={section} localFrame={localFrame} fps={fps} w={rightW} h={height - 100} />
      </div>
    </div>
  );
};

// ── Layout 2: LEFT visual / RIGHT text ──────────────────────────────────────
const RightLayout: React.FC<{ section: Section; index: number; localFrame: number; fps: number; width: number; height: number }> = (
  { section, index, localFrame, fps, width, height }
) => {
  const HUD = 52; const PAD = 36; const GAP = 48;
  const rightW = Math.floor((width - HUD - PAD * 2 - GAP) * 0.50);
  const leftW = width - HUD - PAD * 2 - GAP - rightW;
  const titleSize = section.title.length > 18 ? 50 : section.title.length > 11 ? 62 : 76;
  const visO = interpolate(localFrame, [16, 36], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', alignItems: 'center', padding: `60px ${PAD}px 40px ${HUD + PAD}px`, boxSizing: 'border-box', gap: GAP }}>
      <div style={{ width: leftW, flexShrink: 0, height: '100%', display: 'flex', alignItems: 'center', opacity: visO }}>
        <SectionVisual section={section} localFrame={localFrame} fps={fps} w={leftW} h={height - 100} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <TextBlock section={section} index={index} localFrame={localFrame} fps={fps} titleSize={titleSize} maxW={rightW} align="right" />
      </div>
    </div>
  );
};

// ── Layout 3: FULLSCREEN — editorial, 200px title overflows ─────────────────
const FullscreenLayout: React.FC<{ section: Section; index: number; localFrame: number; fps: number; width: number; height: number }> = (
  { section, index, localFrame, fps, width, height }
) => {
  // Adaptive size: long titles (>18 chars) scale down to stay readable
  const titleSize = section.title.length > 18 ? 88 : section.title.length > 12 ? 110 : 130;
  const HUD = 52;

  const words = section.title.split(' ');
  const bgO = interpolate(localFrame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textO = interpolate(localFrame, [8, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subO = interpolate(localFrame, [20, 36], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lineW = interpolate(localFrame, [6, 26], [0, width * 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tagO = interpolate(localFrame, [28, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'relative', width, height, overflow: 'hidden' }}>
      {/* Full-bleed background visual */}
      <div style={{ position: 'absolute', inset: 0, opacity: bgO * 0.12 }}>
        <SectionVisual section={section} localFrame={localFrame} fps={fps} w={width} h={height} />
      </div>

      {/* Gradient overlay: readable text on left */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, rgba(5,5,5,0.95) 50%, rgba(5,5,5,0.3) 100%)',
      }} />

      {/* Reading overlay — dark rectangle isolates text from background */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        height: titleSize * words.length * 1.1 + 60,
        background: 'rgba(0,0,0,0.40)',
        opacity: textO,
      }} />

      {/* Title — bottom-left, white on black, max contrast */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: HUD + 40,
        right: 60,
        overflow: 'hidden',
        opacity: textO,
      }}>
        <div style={{
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          fontWeight: 900, fontSize: titleSize, lineHeight: 0.88,
          letterSpacing: '-0.03em', color: '#FFFFFF',
          textShadow: '0 2px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 -2px 0 #000, 0 0 24px rgba(0,0,0,0.95)',
          whiteSpace: 'normal', overflow: 'visible',
        }}>
          {words.map((word, wi) => {
            const ws = spring({ frame: localFrame - wi * 8, fps, config: { stiffness: 220, damping: 26 } });
            return (
              <span key={wi} style={{
                display: 'inline-block',
                transform: `translateY(${interpolate(ws, [0, 1], [60, 0])}px)`,
                opacity: ws, marginRight: '0.18em',
              }}>
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Bottom strip: eyebrow + rule + subtitle + tags */}
      <div style={{ position: 'absolute', bottom: 36, left: HUD + 40, right: 60, opacity: subO }}>
        {/* Horizontal rule */}
        <div style={{ height: 1, width: lineW, background: '#BC13FE', marginBottom: 14, boxShadow: '0 0 8px #BC13FE, 0 0 16px rgba(188,19,254,0.3)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{
            fontFamily: '"Helvetica Neue", sans-serif', fontWeight: 300, fontSize: 22,
            color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, maxWidth: '60%',
          }}>
            {section.subtitle}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', opacity: tagO }}>
            {section.tags.map((tag, ti) => (
              <AnimatedTag key={tag} tag={tag} frame={Math.max(0, localFrame - 28 - ti * 10)} fps={fps} />
            ))}
          </div>
        </div>
      </div>

      {/* Section index top-right */}
      <div style={{
        position: 'absolute', top: 36, right: 52,
        fontFamily: '"Helvetica Neue", sans-serif', fontSize: 15, fontWeight: 600,
        letterSpacing: '0.15em', color: '#BC13FE', opacity: textO,
        textShadow: '0 0 12px #BC13FE, 0 0 25px rgba(188,19,254,0.35)',
      }}>
        {String(index + 1).padStart(2, '0')} // {mmiData.length}
      </div>
    </div>
  );
};

// ── Main export ──────────────────────────────────────────────────────────────
export const BlueprintSection: React.FC<Props> = ({ section, index, startFrame }) => {
  const globalFrame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const SLIDE_DELAY = index === 0 ? 0 : TRANSITION_DURATION;
  const localFrame = Math.max(0, globalFrame - startFrame - SLIDE_DELAY);

  const layout = getLayout(index);

  const sharedProps = { section, index, localFrame, fps, width, height };

  return (
    <div style={{ position: 'relative', width, height, flexShrink: 0, background: 'transparent' }}>
      {layout === 'centered'    && <CenteredLayout {...sharedProps} />}
      {layout === 'left'        && <LeftLayout {...sharedProps} />}
      {layout === 'right'       && <RightLayout {...sharedProps} />}
      {layout === 'fullscreen'  && <FullscreenLayout {...sharedProps} />}
    </div>
  );
};
