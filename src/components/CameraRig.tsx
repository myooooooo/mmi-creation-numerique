import { useVideoConfig } from 'remotion';

interface CameraRigProps {
  children: React.ReactNode;
  x: number;
  y: number;
}

/** Camera rig: horizontal + vertical movement. Scale applied by parent. */
export const CameraRig: React.FC<CameraRigProps> = ({ children, x, y }) => {
  const { height } = useVideoConfig();
  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0,
        height,
        display: 'flex',
        flexDirection: 'row',
        transform: `translate(${x}px, ${y}px)`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
