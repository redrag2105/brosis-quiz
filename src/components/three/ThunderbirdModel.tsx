import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import ThunderbirdFallback from './ThunderbirdFallback';

interface ThunderbirdModelProps {
  isSelected?: boolean;
  onClick?: () => void;
  scale?: number;
  position?: [number, number, number];
}

function ThunderbirdModel({ isSelected = false, onClick, scale = 1, position = [0, 0, 0] }: ThunderbirdModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [modelError, setModelError] = useState(false);

  // Always call useGLTF hook at top level
  const gltfData = useGLTF('/thunderbird/scene.gltf');

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
                material.emissive.setHex(0x3b82f6); // blue
                material.emissiveIntensity = 0.3;
              } else if (hovered) {
                material.emissive.setHex(0x2563eb); // darker blue
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

  // Dynamic thunderbird animations
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Sharp, electrical rotation with sudden movements
    groupRef.current.rotation.y += 0.006 + Math.sin(time * 2) * 0.004;
    groupRef.current.rotation.x = Math.sin(time * 1.5) * 0.12;
    groupRef.current.rotation.z = Math.cos(time * 2.2) * 0.06;

    // Dynamic floating with sudden jolts like lightning strikes
    const baseY = position[1];
    const thunderFloat = Math.sin(time * 3) * 0.1 + Math.sin(time * 0.9) * 0.06;
    const lightningJolt = Math.random() > 0.98 ? Math.random() * 0.1 : 0;
    groupRef.current.position.y = baseY + thunderFloat + lightningJolt;

    // Quick, sharp movements like wind gusts
    groupRef.current.position.x = position[0] + Math.sin(time * 2.5) * 0.04;
    groupRef.current.position.z = position[2] + Math.cos(time * 2.8) * 0.03;

    // Electric pulsing with storm intensity
    const stormIntensity = isSelected ? 1.25 : hovered ? 1.12 : 1.0;
    const electricScale = 1 + Math.sin(time * 8) * 0.06 * stormIntensity;
    const thunderScale = 1 + Math.sin(time * 0.6) * 0.025;
    groupRef.current.scale.setScalar(scale * electricScale * thunderScale);
  });

  // Use fallback if scene is not available or there's an error
  if (!clonedScene || modelError) {
    return (
      <ThunderbirdFallback
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

      {/* Electric storm lighting */}
      <pointLight
        position={[0, 2, 1]}
        intensity={isSelected ? 2.2 : hovered ? 1.8 : 1.1}
        color={isSelected ? "#60a5fa" : hovered ? "#3b82f6" : "#93c5fd"}
        distance={9}
        decay={1.3}
      />
      <pointLight
        position={[2, 1, -1]}
        intensity={isSelected ? 1.2 : 0.7}
        color="#dbeafe"
        distance={6}
        decay={2.5}
      />

      {/* Electric storm base */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={isSelected ? 0.22 : hovered ? 0.18 : 0.1}
        />
      </mesh>

      {/* Lightning spark particles */}
      {(isSelected || hovered) && [...Array(18)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((Date.now() * 0.003 + i) * 3) * 1.6,
            0.4 + Math.sin((Date.now() * 0.005 + i) * 4) * 0.7 + i * 0.07,
            Math.cos((Date.now() * 0.003 + i) * 3) * 1.6
          ]}
        >
          <sphereGeometry args={[0.018 + Math.sin(Date.now() * 0.008 + i) * 0.01, 6, 6]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#60a5fa" : i % 3 === 1 ? "#3b82f6" : "#dbeafe"}
            transparent
            opacity={0.9 + Math.sin(Date.now() * 0.006 + i) * 0.1}
          />
        </mesh>
      ))}

      {/* Lightning bolt effects */}
      {isSelected && Math.random() > 0.7 && [...Array(3)].map((_, i) => (
        <mesh
          key={`bolt-${i}`}
          position={[
            (Math.random() - 0.5) * 3,
            1 + Math.random() * 1.5,
            (Math.random() - 0.5) * 3
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
        >
          <cylinderGeometry args={[0.005, 0.005, 0.8]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Electric wing trails */}
      {isSelected && (
        <>
          <mesh position={[-1, 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.4, 1]} />
            <meshBasicMaterial
              color="#60a5fa"
              transparent
              opacity={0.12}
              side={2}
            />
          </mesh>
          <mesh position={[1, 0.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <planeGeometry args={[0.4, 1]} />
            <meshBasicMaterial
              color="#60a5fa"
              transparent
              opacity={0.12}
              side={2}
            />
          </mesh>
        </>
      )}

      {/* Storm energy field */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2.2, 12, 12]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.04}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload('/thunderbird/scene.gltf');

export default ThunderbirdModel;
