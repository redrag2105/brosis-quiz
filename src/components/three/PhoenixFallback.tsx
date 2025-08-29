import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PhoenixFallbackProps {
  isSelected?: boolean;
  onClick?: () => void;
  scale?: number;
  position?: [number, number, number];
}

export default function PhoenixFallback({ 
  isSelected = false, 
  onClick, 
  scale = 1, 
  position = [0, 0, 0] 
}: PhoenixFallbackProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Simple phoenix-like shape */}
      <mesh ref={meshRef} scale={scale}>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial
          color={isSelected ? "#ff6b00" : "#ff8c00"}
          emissive={isSelected ? "#ff4500" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      
      {/* Wings */}
      <mesh position={[-0.7, 0.5, 0]} rotation={[0, 0, Math.PI / 6]} scale={scale}>
        <planeGeometry args={[1, 0.5]} />
        <meshStandardMaterial
          color={isSelected ? "#ff8c00" : "#ffa500"}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh position={[0.7, 0.5, 0]} rotation={[0, 0, -Math.PI / 6]} scale={scale}>
        <planeGeometry args={[1, 0.5]} />
        <meshStandardMaterial
          color={isSelected ? "#ff8c00" : "#ffa500"}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Light effect */}
      {isSelected && (
        <pointLight
          position={[0, 1, 0]}
          intensity={1}
          color="#ff6b00"
          distance={5}
        />
      )}
    </group>
  );
}
