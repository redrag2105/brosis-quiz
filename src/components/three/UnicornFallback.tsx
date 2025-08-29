import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface UnicornFallbackProps {
  isSelected?: boolean;
  onClick?: () => void;
  scale?: number;
  position?: [number, number, number];
}

export default function UnicornFallback({
  isSelected = false,
  onClick,
  scale = 1,
  position = [0, 0, 0],
}: UnicornFallbackProps) {
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
      {/* Unicorn body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 1.2, 8]} />
        <meshPhongMaterial 
          color={isSelected ? "#a855f7" : "#c084fc"}
          emissive={isSelected ? "#a855f7" : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Unicorn head */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshPhongMaterial 
          color={isSelected ? "#e879f9" : "#f0abfc"}
          emissive={isSelected ? "#a855f7" : "#000000"}
          emissiveIntensity={isSelected ? 0.1 : 0}
        />
      </mesh>

      {/* Unicorn horn */}
      <mesh position={[0, 1.3, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.08, 0.6, 8]} />
        <meshPhongMaterial 
          color="#fbbf24" 
          emissive={isSelected ? "#fbbf24" : "#000000"}
          emissiveIntensity={isSelected ? 0.4 : 0.2}
        />
      </mesh>

      {/* Unicorn mane */}
      <mesh position={[-0.2, 1, 0.2]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.15, 6, 4]} />
        <meshPhongMaterial 
          color={isSelected ? "#ec4899" : "#f472b6"} 
          transparent 
          opacity={0.8}
          emissive={isSelected ? "#ec4899" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      <mesh position={[0.2, 1, 0.2]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.15, 6, 4]} />
        <meshPhongMaterial 
          color={isSelected ? "#ec4899" : "#f472b6"} 
          transparent 
          opacity={0.8}
          emissive={isSelected ? "#ec4899" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Magical stars around unicorn */}
      <mesh position={[0.5, 1.2, 0.5]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshBasicMaterial 
          color="#fde047" 
          transparent 
          opacity={isSelected ? 0.9 : 0.6}
        />
      </mesh>

      <mesh position={[-0.5, 1.1, 0.3]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.04, 0.15, 0.04]} />
        <meshBasicMaterial 
          color="#fde047" 
          transparent 
          opacity={isSelected ? 0.8 : 0.5}
        />
      </mesh>

      {/* Glow effect */}
      {isSelected && (
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 24]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.15} />
        </mesh>
      )}

      {/* Magical aura */}
      <pointLight
        position={[0, 1.3, 0]}
        intensity={isSelected ? 1.5 : 1}
        color="#a855f7"
        distance={5}
      />
    </group>
  );
}
