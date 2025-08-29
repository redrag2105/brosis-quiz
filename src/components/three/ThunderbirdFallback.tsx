import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThunderbirdFallbackProps {
  isSelected?: boolean;
  onClick?: () => void;
  scale?: number;
  position?: [number, number, number];
}

export default function ThunderbirdFallback({
  isSelected = false,
  onClick,
  scale = 1,
  position = [0, 0, 0],
}: ThunderbirdFallbackProps) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      if (isSelected) {
        const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
        groupRef.current.scale.setScalar(scale * pulseScale);
      } else {
        groupRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* Thunderbird wings */}
      <mesh position={[-0.6, 0.2, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.8, 0.2, 0.1]} />
        <meshPhongMaterial 
          color={isSelected ? "#3b82f6" : "#60a5fa"} 
          emissive={isSelected ? "#3b82f6" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      
      <mesh position={[0.6, 0.2, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.8, 0.2, 0.1]} />
        <meshPhongMaterial 
          color={isSelected ? "#3b82f6" : "#60a5fa"} 
          emissive={isSelected ? "#3b82f6" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Thunderbird body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
        <meshPhongMaterial 
          color={isSelected ? "#1e40af" : "#2563eb"}
          emissive={isSelected ? "#1e40af" : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Thunderbird head */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.25, 8, 6]} />
        <meshPhongMaterial 
          color={isSelected ? "#1d4ed8" : "#3b82f6"}
          emissive={isSelected ? "#1d4ed8" : "#000000"}
          emissiveIntensity={isSelected ? 0.1 : 0}
        />
      </mesh>

      {/* Lightning effect */}
      <mesh position={[0, 1, 0.3]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshBasicMaterial 
          color="#fbbf24" 
          transparent 
          opacity={isSelected ? 0.8 : 0.6}
        />
      </mesh>

      {/* Glow effect */}
      {isSelected && (
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 24]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
        </mesh>
      )}

      {/* Electric aura */}
      <pointLight
        position={[0, 1, 0]}
        intensity={isSelected ? 1.5 : 1}
        color="#3b82f6"
        distance={5}
      />
    </group>
  );
}
