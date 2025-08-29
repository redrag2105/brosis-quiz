import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FaerieFallbackProps {
  isSelected?: boolean;
  onClick?: () => void;
  scale?: number;
  position?: [number, number, number];
}

export default function FaerieFallback({
  isSelected = false,
  onClick,
  scale = 1,
  position = [0, 0, 0],
}: FaerieFallbackProps) {
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
      {/* Faerie wings */}
      <mesh position={[-0.3, 0.5, 0]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshPhongMaterial 
          color={isSelected ? "#10b981" : "#34d399"} 
          transparent 
          opacity={0.7}
          emissive={isSelected ? "#10b981" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      
      <mesh position={[0.3, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshPhongMaterial 
          color={isSelected ? "#10b981" : "#34d399"} 
          transparent 
          opacity={0.7}
          emissive={isSelected ? "#10b981" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Faerie body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.8, 8]} />
        <meshPhongMaterial 
          color={isSelected ? "#065f46" : "#047857"}
          emissive={isSelected ? "#065f46" : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Faerie head */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshPhongMaterial 
          color={isSelected ? "#ecfdf5" : "#f0fdf4"}
          emissive={isSelected ? "#10b981" : "#000000"}
          emissiveIntensity={isSelected ? 0.1 : 0}
        />
      </mesh>

      {/* Glow effect */}
      {isSelected && (
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 24]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
        </mesh>
      )}

      {/* Magic sparkles */}
      <pointLight
        position={[0, 1, 0]}
        intensity={isSelected ? 1.5 : 1}
        color="#10b981"
        distance={5}
      />
    </group>
  );
}
