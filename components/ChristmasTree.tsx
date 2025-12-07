import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Float, Sparkles, Instance, Instances, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrnamentColor, UserPhoto } from '../types';

// --- Star Topper Component ---
const Star: React.FC = () => {
  const starGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 0.6;
    const innerRadius = 0.25;
    const points = 5;

    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 2,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  return (
    <mesh geometry={starGeometry} rotation={[0, 0, 0]}>
      <meshStandardMaterial 
        color="#FFD700" 
        emissive="#FFD700"
        emissiveIntensity={2}
        roughness={0.1}
        metalness={0.8}
      />
      <pointLight distance={10} intensity={10} color="#FFD700" />
    </mesh>
  );
};

// --- Photo Frame Component (Polaroid Style) ---
const PhotoFrame: React.FC<{ photo: UserPhoto }> = ({ photo }) => {
  const texture = useTexture(photo.url);
  const groupRef = useRef<THREE.Group>(null);
  const [showEffects, setShowEffects] = useState(true);
  
  // Ensure texture wraps correctly if not square
  texture.center.set(0.5, 0.5);

  // Animation State
  const [scale, setScale] = useState(0);

  // Initial Spawn Effect Timer
  useEffect(() => {
    // Pop-in animation target
    let start = 0;
    const animateIn = setInterval(() => {
      start += 0.1;
      if (start >= 1) {
        start = 1;
        clearInterval(animateIn);
      }
      setScale(start);
    }, 16);

    // Turn off sparkles after 3 seconds
    const timer = setTimeout(() => {
      setShowEffects(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(animateIn);
    };
  }, []);

  // Frame Loop for "Hanging" Physics (Pendulum Sway)
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Create a unique offset based on position to unsync animations
    const offset = photo.position[0] * 10 + photo.position[1] * 10;
    
    // Gentle sway on Z axis (wind)
    const sway = Math.sin(time * 1.5 + offset) * 0.05;
    // Gentle twist on Y axis
    const twist = Math.sin(time * 0.5 + offset) * 0.05;

    // Apply rotation relative to the initial rotation
    // We assume the group's initial rotation is set by props, so we add to it.
    // However, since props update the group transform directly, we modify the inner mesh or use rotation addition logic.
    // Easier way: The props set the static orientation. We animate the rotation slightly around that.
    
    // Actually, React Three Fiber applies props every frame if they change. 
    // Since props are static here, we can safely mutate ref rotation slightly.
    // We add the sway to the base rotation passed in props.
    groupRef.current.rotation.z = photo.rotation[2] + sway;
    groupRef.current.rotation.y = photo.rotation[1] + twist;
  });
  
  return (
    <group position={photo.position} ref={groupRef} rotation={[photo.rotation[0], photo.rotation[1], photo.rotation[2]]} scale={scale * photo.scale}>
        
        {/* Spawn VFX: Burst of Gold Sparkles */}
        {showEffects && (
          <Sparkles 
            count={40} 
            scale={2.5} 
            size={6} 
            speed={1} 
            opacity={1} 
            color="#FFD700" 
            position={[0, -0.5, 0]} // Center sparkles on the photo
          />
        )}

        {/* The Hook/String Geometry */}
        {/* We move the photo DOWN relative to this group so (0,0,0) is the pivot point */}
        
        {/* The String (Longer to go "into" the tree) */}
        <mesh position={[0, -0.3, -0.02]}>
           <cylinderGeometry args={[0.01, 0.01, 0.8]} />
           <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* The Hook Ring at the top */}
        <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.05, 0.01, 8, 16]} />
            <meshStandardMaterial color="#FFD700" metalness={1} />
        </mesh>

        {/* The Photo Frame Content (Shifted Down) */}
        <group position={[0, -0.8, 0]}> {/* Pivot point is 0.8 units above center of photo */}
            
            {/* Polaroid Paper Backing */}
            <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.1, 1.4, 0.05]} /> 
            <meshStandardMaterial 
                color="#FFFFFF" 
                roughness={0.9} 
                metalness={0.0}
            />
            </mesh>

            {/* The Photo Image */}
            <mesh position={[0, 0.1, 0.04]}> 
            <planeGeometry args={[0.95, 0.95]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>

             {/* Handwritten "Memory" text line placeholder (Visual detail) */}
             <mesh position={[0, -0.5, 0.03]}>
                <planeGeometry args={[0.8, 0.02]} />
                <meshBasicMaterial color="#ddd" opacity={0.5} transparent />
             </mesh>
        </group>
    </group>
  );
};

// --- Abstract Tree Elements Generator ---
// We generate positions inside a cone volume to create the "implied" tree shape.
const AbstractTreeContent: React.FC = () => {
  
  const generatePositions = (count: number, itemType: 'box' | 'sphere' | 'crystal') => {
    const items = [];
    const height = 7;
    const baseRadius = 2.8;

    for (let i = 0; i < count; i++) {
      // Height (y) from bottom to top
      const y = (Math.random() * height) - 2; // -2 to 5
      
      // Normalized height (0 to 1) for radius calc
      const hNorm = (y + 2) / height;
      
      // Radius at this height (cone shape)
      const rMax = baseRadius * (1 - hNorm);
      
      // Random radius within the volume (mostly surface, some inside)
      // Bias towards surface for shape definition: sqrt(random)
      const r = rMax * Math.sqrt(Math.random() * 0.8 + 0.2); 
      
      const theta = Math.random() * Math.PI * 2;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);

      // Random Scale
      const scale = Math.random() * 0.3 + 0.1;

      // Color selection
      let color = OrnamentColor.MIST_WHITE;
      if (Math.random() > 0.6) color = OrnamentColor.ROSE_GOLD;
      if (Math.random() > 0.8) color = OrnamentColor.GOLD;
      if (Math.random() > 0.9) color = OrnamentColor.RUBY; // Red accents

      // Rotation
      const rotation: [number, number, number] = [
        Math.random() * Math.PI, 
        Math.random() * Math.PI, 
        Math.random() * Math.PI
      ];

      items.push({ position: [x, y, z] as [number, number, number], scale, color, rotation });
    }
    return items;
  };

  const boxes = useMemo(() => generatePositions(250, 'box'), []);
  const spheres = useMemo(() => generatePositions(200, 'sphere'), []);
  const crystals = useMemo(() => generatePositions(100, 'crystal'), []);

  return (
    <>
      {/* Gift Boxes / Parcels */}
      <Instances range={boxes.length}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.3} metalness={0.5} />
        {boxes.map((data, i) => (
          <Instance
            key={`box-${i}`}
            position={data.position}
            scale={[data.scale, data.scale * (Math.random() + 0.5), data.scale]} // Varied box shapes
            rotation={data.rotation}
            color={data.color}
          />
        ))}
      </Instances>

      {/* Ornaments / Balls */}
      <Instances range={spheres.length}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial roughness={0.1} metalness={0.9} transmission={0.1} thickness={0.5} />
        {spheres.map((data, i) => (
          <Instance
            key={`sphere-${i}`}
            position={data.position}
            scale={[data.scale, data.scale, data.scale]}
            color={data.color === OrnamentColor.RUBY ? '#ff3366' : data.color}
          />
        ))}
      </Instances>

      {/* Crystals / Lights */}
      <Instances range={crystals.length}>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial emissive="#fff" emissiveIntensity={0.5} toneMapped={false} />
        {crystals.map((data, i) => (
          <Instance
            key={`crystal-${i}`}
            position={data.position}
            scale={[data.scale * 0.7, data.scale * 0.7, data.scale * 0.7]}
            rotation={data.rotation}
            color={OrnamentColor.GOLD}
          />
        ))}
      </Instances>
    </>
  );
};

const ChristmasTree: React.FC<{ photos: UserPhoto[] }> = ({ photos }) => {
  return (
    <group>
      {/* Central Axis (Thin trunk, barely visible) */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.4, 7]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.9} />
      </mesh>

      {/* The "Elements" Tree */}
      <AbstractTreeContent />

      {/* User Photos */}
      {photos.map((photo) => (
        <PhotoFrame key={photo.id} photo={photo} />
      ))}

      {/* Top Star */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <group position={[0, 5.5, 0]}>
          <Star />
        </group>
      </Float>

      {/* Magic Dust */}
      <Sparkles 
        count={300} 
        scale={8} 
        size={5} 
        speed={0.4} 
        opacity={0.6} 
        color="#F4C2C2" 
        position={[0, 2, 0]}
      />
    </group>
  );
};

export default ChristmasTree;