import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import FaerieFallback from './FaerieFallback';

interface FaerieModelProps {
  isSelected?: boolean;
  onClick?: () => void;
  scale?: number;
  position?: [number, number, number];
}

function FaerieModel({ isSelected = false, onClick, scale = 1, position = [0, 0, 0] }: FaerieModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [modelError, setModelError] = useState(false);

  // Always call useGLTF hook at top level
  const gltfData = useGLTF('/faerie/scene.gltf');

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
                material.emissive.setHex(0x10b981); // emerald green
                material.emissiveIntensity = 0.3;
              } else if (hovered) {
                material.emissive.setHex(0x059669); // darker emerald
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

  // Magical faerie animations
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Graceful, magical rotation with nature-like rhythm
    groupRef.current.rotation.y += 0.003 + Math.sin(time * 0.3) * 0.002;
    groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.08;
    groupRef.current.rotation.z = Math.cos(time * 0.4) * 0.03;

    // Gentle, mystical floating like floating on air currents
    const baseY = position[1];
    const magicalFloat = Math.sin(time * 1.8) * 0.12 + Math.sin(time * 0.6) * 0.08;
    groupRef.current.position.y = baseY + magicalFloat;

    // Subtle drift like being carried by magical winds
    groupRef.current.position.x = position[0] + Math.sin(time * 0.8) * 0.05;
    groupRef.current.position.z = position[2] + Math.cos(time * 0.7) * 0.04;

    // Gentle magical pulsing with sparkle rhythm
    const magicIntensity = isSelected ? 1.15 : hovered ? 1.08 : 1.0;
    const sparkleScale = 1 + Math.sin(time * 3) * 0.04 * magicIntensity;
    const mysticalScale = 1 + Math.sin(time * 0.4) * 0.02;
    groupRef.current.scale.setScalar(scale * sparkleScale * mysticalScale);
  });

  // Use fallback if scene is not available or there's an error
  if (!clonedScene || modelError) {
    return (
      <FaerieFallback
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

      {/* Magical faerie lighting */}
      <pointLight
        position={[0, 2, 1]}
        intensity={isSelected ? 1.8 : hovered ? 1.4 : 1.0}
        color={isSelected ? "#34d399" : hovered ? "#10b981" : "#6ee7b7"}
        distance={8}
        decay={1.2}
      />
      <pointLight
        position={[0, 0.5, -1]}
        intensity={isSelected ? 0.8 : 0.5}
        color="#a7f3d0"
        distance={5}
        decay={2}
      />

      {/* Magical nature circle with growing effect */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.3, 32]} />
        <meshBasicMaterial
          color="#34d399"
          transparent
          opacity={isSelected ? 0.2 : hovered ? 0.15 : 0.08}
        />
      </mesh>

      {/* Sparkle particles dancing around */}
      {(isSelected || hovered) && [...Array(15)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((Date.now() * 0.0008 + i) * 2.5) * 1.8,
            0.3 + Math.sin((Date.now() * 0.0012 + i) * 2) * 0.6 + i * 0.08,
            Math.cos((Date.now() * 0.0008 + i) * 2.5) * 1.8
          ]}
        >
          <sphereGeometry args={[0.015 + Math.sin(Date.now() * 0.004 + i) * 0.008, 6, 6]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#34d399" : i % 3 === 1 ? "#6ee7b7" : "#a7f3d0"}
            transparent
            opacity={0.8 + Math.sin(Date.now() * 0.002 + i) * 0.2}
          />
        </mesh>
      ))}

      {/* Magical leaf/petal effects */}
      {isSelected && [...Array(8)].map((_, i) => (
        <mesh
          key={`leaf-${i}`}
          position={[
            Math.sin((Date.now() * 0.0005 + i) * 1.5) * 2,
            0.8 + Math.sin((Date.now() * 0.0008 + i) * 1.2) * 0.4,
            Math.cos((Date.now() * 0.0005 + i) * 1.5) * 2
          ]}
          rotation={[
            Math.sin(Date.now() * 0.001 + i) * 0.5,
            Date.now() * 0.001 + i,
            Math.cos(Date.now() * 0.001 + i) * 0.3
          ]}
        >
          <planeGeometry args={[0.08, 0.15]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#34d399" : "#6ee7b7"}
            transparent
            opacity={0.6}
            side={2}
          />
        </mesh>
      ))}

      {/* Nature magic aura */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial
            color="#34d399"
            transparent
            opacity={0.03}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload('/faerie/scene.gltf');

export default FaerieModel;
