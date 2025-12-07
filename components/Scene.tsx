import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import ChristmasTree from './ChristmasTree';
import Snow from './Snow';
import { UserPhoto } from '../types';

interface SceneProps {
  photos: UserPhoto[];
}

const Scene: React.FC<SceneProps> = ({ photos }) => {
  return (
    <div className="w-full h-screen bg-[#050505]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 1, 14]} fov={45} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.1} color="#F4C2C2" />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.2} 
          penumbra={1} 
          intensity={80} 
          castShadow 
          shadow-mapSize={[2048, 2048]} 
          color="#fff5e6"
        />
        <pointLight position={[-5, 0, -5]} intensity={5} color="#50C878" />
        <pointLight position={[5, -2, 5]} intensity={5} color="#E0115F" />
        
        {/* Environment for reflections */}
        <Environment preset="city" blur={0.8} />

        {/* Scene Content */}
        <group position={[0, -1.5, 0]}>
          <ChristmasTree photos={photos} />
          <Snow count={1000} />
          <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
        </group>

        {/* Camera Control - Fully interactive based on user request */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={true}
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.8}
          minDistance={3} // Allow closer inspection
          maxDistance={25} // Allow backing away
          autoRotate={false} // Disable auto rotate so user cursor decides turn
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />

        {/* Post Processing */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={1} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.5}
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Scene;