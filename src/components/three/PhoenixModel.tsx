import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import PhoenixFallback from './PhoenixFallback';

interface PhoenixModelProps {
  isSelected?: boolean;
  onClick?: () => void;
  scale?: number;
  position?: [number, number, number];
}

function PhoenixModel({ isSelected = false, onClick, scale = 1, position = [0, 0, 0] }: PhoenixModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [modelError, setModelError] = useState(false);

  // Always call useGLTF hook at top level
  const gltfData = useGLTF('/phoenix/scene.gltf');
  
  // Always call useAnimations hook
  const animationHook = useAnimations(gltfData?.animations || [], groupRef);

  // Create a stable cloned scene with proper material handling
  const clonedScene = useMemo(() => {
    if (!gltfData?.scene || modelError) {
      return null;
    }

    try {
      const cloned = gltfData.scene.clone();

      // Safely enhance materials
      cloned.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child.material) {
          // Handle both single materials and material arrays
          const materials = Array.isArray(child.material) ? child.material : [child.material];

          const processedMaterials = materials.map((mat: THREE.Material) => {
            // Only clone if it's a material type we can safely modify
            if (mat instanceof THREE.MeshStandardMaterial ||
                mat instanceof THREE.MeshPhysicalMaterial ||
                mat instanceof THREE.MeshLambertMaterial ||
                mat instanceof THREE.MeshPhongMaterial) {
              const clonedMat = mat.clone();
              // Ensure emissive property exists before using it
              if ('emissive' in clonedMat) {
                clonedMat.emissive = new THREE.Color(0x000000);
              }
              return clonedMat;
            }
            return mat;
          });

          child.material = Array.isArray(child.material) ? processedMaterials : processedMaterials[0];
        }
      });

      return cloned;
    } catch (error) {
      console.warn('Error creating cloned scene:', error);
      setModelError(true);
      return null;
    }
  }, [gltfData?.scene, modelError]);

  // Update material emissive properties safely
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];

        materials.forEach((mat: THREE.Material) => {
          if (mat instanceof THREE.MeshStandardMaterial ||
              mat instanceof THREE.MeshPhysicalMaterial ||
              mat instanceof THREE.MeshLambertMaterial ||
              mat instanceof THREE.MeshPhongMaterial) {

            if ('emissive' in mat && 'emissiveIntensity' in mat) {
              const material = mat as THREE.MeshStandardMaterial;
              if (isSelected) {
                material.emissive.setHex(0xffa500);
                material.emissiveIntensity = 0.3;
              } else if (hovered) {
                material.emissive.setHex(0xff8c00);
                material.emissiveIntensity = 0.2;
              } else {
                material.emissive.setHex(0x000000);
                material.emissiveIntensity = 0;
              }
              mat.needsUpdate = true;
            }
          }
        });
      }
    });
  }, [isSelected, hovered, clonedScene]);

  // Start animations if available
  useEffect(() => {
    if (!animationHook.actions) return;

    const actions = animationHook.actions as Record<string, THREE.AnimationAction>;
    const actionKeys = Object.keys(actions);
    if (actionKeys.length > 0) {
      const firstAction = actions[actionKeys[0]];
      if (firstAction && typeof firstAction.play === 'function') {
        firstAction.play();
      }
    }
  }, [animationHook.actions]);

  // Handle cursor changes
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  // Enhanced fiery animations
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Phoenix-specific dramatic rotation with intensity variations
    groupRef.current.rotation.y += 0.008 + Math.sin(time * 0.5) * 0.003;
    groupRef.current.rotation.x = Math.sin(time * 0.7) * 0.1;
    groupRef.current.rotation.z = Math.cos(time * 0.3) * 0.05;

    // Fiery floating with more dramatic movement
    const baseY = position[1];
    const phoenixFloat = Math.sin(time * 2.5) * 0.15 + Math.sin(time * 0.8) * 0.05;
    groupRef.current.position.y = baseY + phoenixFloat;

    // Add slight lateral movement like flames dancing
    groupRef.current.position.x = position[0] + Math.sin(time * 1.5) * 0.03;
    groupRef.current.position.z = position[2] + Math.cos(time * 1.2) * 0.02;

    // Intense pulsing scale with fire-like breathing
    const fireIntensity = isSelected ? 1.2 : hovered ? 1.1 : 1.0;
    const breathingScale = 1 + Math.sin(time * 6) * 0.08 * fireIntensity;
    const emberScale = 1 + Math.sin(time * 0.5) * 0.03;
    groupRef.current.scale.setScalar(scale * breathingScale * emberScale);
  });

  // Use fallback if scene is not available or there's an error
  if (!clonedScene || modelError) {
    return (
      <PhoenixFallback
        isSelected={isSelected}
        onClick={onClick}
        scale={scale}
        position={position}
      />
    );
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={clonedScene} />

      {/* Intense phoenix fire lighting */}
      <pointLight
        position={[0, 2, 1]}
        intensity={isSelected ? 2.5 : hovered ? 2.0 : 1.2}
        color={isSelected ? "#ff6b00" : hovered ? "#ff8c00" : "#ffa500"}
        distance={10}
        decay={1.5}
      />
      <pointLight
        position={[0, -1, 0]}
        intensity={isSelected ? 1.0 : 0.6}
        color="#ff4500"
        distance={6}
        decay={2}
      />

      {/* Fiery base glow with heat distortion */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial
          color="#ff6b00"
          transparent
          opacity={isSelected ? 0.25 : hovered ? 0.2 : 0.12}
        />
      </mesh>

      {/* Ember particles floating around */}
      {(isSelected || hovered) && [...Array(12)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((Date.now() * 0.001 + i) * 2) * 1.5,
            0.5 + Math.sin((Date.now() * 0.001 + i) * 3) * 0.8 + i * 0.1,
            Math.cos((Date.now() * 0.001 + i) * 2) * 1.5
          ]}
        >
          <sphereGeometry args={[0.02 + Math.sin(Date.now() * 0.005 + i) * 0.01, 8, 8]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#ff4500" : "#ffa500"}
            transparent
            opacity={0.7 + Math.sin(Date.now() * 0.003 + i) * 0.3}
          />
        </mesh>
      ))}

      {/* Phoenix wings glow effect */}
      {isSelected && (
        <>
          <mesh position={[-0.8, 0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
            <planeGeometry args={[0.6, 1.2]} />
            <meshBasicMaterial
              color="#ff6b00"
              transparent
              opacity={0.1}
              side={2}
            />
          </mesh>
          <mesh position={[0.8, 0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <planeGeometry args={[0.6, 1.2]} />
            <meshBasicMaterial
              color="#ff6b00"
              transparent
              opacity={0.1}
              side={2}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload('/phoenix/scene.gltf');

export default PhoenixModel;
