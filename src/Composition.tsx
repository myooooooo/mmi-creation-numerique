import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { mmiData } from './mmiData';
import { GridBackground } from './components/GridBackground';
import { TechHUD } from './components/TechHUD';
import { BlueprintSection } from './components/BlueprintSection';
import { CameraRig } from './components/CameraRig';
import { DebugBanner } from './components/DebugBanner';
import { Scanlines } from './components/Scanlines';
import { computeCamera } from './utils/transitions';

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Full camera state: x (slide), y (vertical arc), scale (zoom pulse)
  const { x: cameraX, y: cameraY, scale: cameraScale } = computeCamera(frame, width, height);

  // Section start frames
  const sectionStarts: number[] = [];
  let acc = 0;
  for (const s of mmiData) { sectionStarts.push(acc); acc += s.durationInFrames; }

  return (
    <AbsoluteFill style={{ background: '#050505', overflow: 'hidden' }}>

      {/* Architectural grid (parallax handled internally) */}
      <GridBackground />

      {/* Camera: scale applied here so it acts on the viewport center */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${cameraScale})`,
        transformOrigin: `${width / 2}px ${height / 2}px`,
      }}>
        <CameraRig x={cameraX} y={cameraY}>
          {mmiData.map((section, index) => (
            <BlueprintSection
              key={section.id}
              section={section}
              index={index}
              startFrame={sectionStarts[index]}
            />
          ))}
        </CameraRig>
      </div>

      {/* Fixed chrome — not affected by camera or scale */}
      <TechHUD />
      <DebugBanner />

      {/* Scanlines — always on top */}
      <Scanlines />
    </AbsoluteFill>
  );
};
