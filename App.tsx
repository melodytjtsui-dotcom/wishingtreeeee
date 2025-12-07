import React, { Suspense, useState, useCallback } from 'react';
import Scene from './components/Scene';
import UI from './components/UI';
import { UserPhoto } from './types';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  const handleAddPhoto = useCallback((url: string) => {
    // Generate a random position on the tree surface for the new photo
    // We adjust logic to ensure it sits ON TOP of the elements, not inside
    
    // Height range approx -1 to 4.5
    const y = -1 + Math.random() * 5.5; 
    
    // Cone logic: radius decreases as Y increases
    // Base radius approx 3.0 at bottom, tapering to near 0 at top (y=5.5)
    // We add a small offset (+ 0.6) to push the photo slightly OUTSIDE the volume of gifts
    const coneRadius = 3.2 * (1 - (y + 2) / 8); 
    const surfaceOffset = 0.5; 
    const finalRadius = coneRadius + surfaceOffset;

    const theta = Math.random() * Math.PI * 2;
    
    const x = finalRadius * Math.cos(theta);
    const z = finalRadius * Math.sin(theta);

    // Look at center roughly (rotate Y to face outward)
    // -theta + PI/2 usually orients the plane normal to center
    const rotY = -theta + Math.PI / 2;

    // Add a slight random tilt for natural hanging look
    const rotZ = (Math.random() - 0.5) * 0.2; 

    const newPhoto: UserPhoto = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      position: [x, y, z],
      rotation: [0, rotY, rotZ],
      scale: 0.8 // Slightly smaller to fit nicely
    };

    setPhotos(prev => [...prev, newPhoto]);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-[#050505] text-[#F4C2C2] font-serif tracking-widest">
            LOADING EXPERIENCE...
        </div>
      }>
        <Scene photos={photos} />
        <UI onAddPhoto={handleAddPhoto} />
      </Suspense>
    </div>
  );
};

export default App;