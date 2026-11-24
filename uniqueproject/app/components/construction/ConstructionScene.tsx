import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useLayoutEffect } from "react";
import HouseModel from "./HouseModel";

function Camera({ progress, still }: { progress: number; still: boolean }) {
  const { camera, size, invalidate } = useThree();

  useLayoutEffect(() => {
    const distance = Math.max(1, 1.24 * size.height / Math.max(size.width, 1));
    const reveal = still ? 0 : Math.max(0, (progress - 0.8) / 0.2);
    camera.position.set((17 - reveal * 1.3) * distance, 2.4 + 9.8 * distance, (22 + reveal) * distance);
    camera.lookAt(0, 2.4, 0);
    invalidate();
  }, [camera, invalidate, progress, size.height, size.width, still]);

  return null;
}

export default function ConstructionScene({ progress, still }: { progress: number; still: boolean }) {
  return (
    <div className="absolute inset-0" role="img" aria-label="Three-quarter view of a modern residence assembling on its site">
      <Canvas
        camera={{ fov: 37, near: 0.1, far: 120 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        shadows="percentage"
        gl={{ alpha: true, antialias: true, powerPreference: "default" }}
      >
        <hemisphereLight args={["#fff2da", "#6b6254", 1.55]} />
        <directionalLight
          castShadow
          color="#ffdfb4"
          intensity={2.85}
          position={[-10, 17, 11]}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-13}
          shadow-camera-right={13}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-camera-far={48}
          shadow-normalBias={0.035}
          shadow-radius={3}
        />
        <Environment resolution={64}>
          <Lightformer form="rect" intensity={2.1} color="#e4ecf0" position={[4, 6, 7]} rotation={[0, 0.45, 0]} scale={[12, 6]} />
          <Lightformer form="rect" intensity={1.3} color="#ffdfb8" position={[-5, 3, 0]} rotation={[0, Math.PI / 2, 0]} scale={[8, 5]} />
        </Environment>
        <HouseModel progress={progress} />
        <Camera progress={progress} still={still} />
      </Canvas>
    </div>
  );
}
