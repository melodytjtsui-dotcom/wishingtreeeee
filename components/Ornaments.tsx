import React, { useMemo } from 'react';
import { Instance, Instances } from '@react-three/drei';
import { OrnamentColor } from '../types';

interface OrnamentsProps {
  positions: [number, number, number][];
}

const Ornaments: React.FC<OrnamentsProps> = ({ positions }) => {
  
  const colors = [
    OrnamentColor.ROSE_GOLD, 
    OrnamentColor.ROSE_GOLD, 
    OrnamentColor.MIST_WHITE, 
    OrnamentColor.GOLD
  ];

  const ornamentData = useMemo(() => {
    return positions.map((pos) => ({
      position: pos,
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: 0.15 + Math.random() * 0.1,
    }));
  }, [positions]);

  return (
    <Instances range={100}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        roughness={0.1} 
        metalness={0.9} 
        envMapIntensity={1.5}
      />
      
      {ornamentData.map((data, i) => (
        <Instance
          key={i}
          position={data.position}
          scale={[data.scale, data.scale, data.scale]}
          color={data.color}
        />
      ))}
    </Instances>
  );
};

export default Ornaments;
