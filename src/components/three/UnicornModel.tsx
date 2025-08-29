import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import UnicornFallback from './UnicornFallback';

interface UnicornModelProps {
  isSelected?: boolean;
  onClick?: () => void;
  scale?: number;
  position?: [number, number, number];
}

function UnicornModel({ isSelected = false, onClick, scale = 1, position = [0, 0, 0] }: UnicornModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [modelError, setModelError] = useState(false);

  // Always call useGLTF hook at top level
  const gltfData = useGLTF('/unicorn/scene.gltf');

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
                material.emissive.setHex(0xa855f7); // purple
                material.emissiveIntensity = 0.3;
              } else if (hovered) {
                material.emissive.setHex(0x9333ea); // darker purple
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

  // Graceful mystical animations
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Elegant, mystical rotation with dreamy rhythm
    groupRef.current.rotation.y += 0.004 + Math.sin(time * 0.2) * 0.001;
    groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.06;
    groupRef.current.rotation.z = Math.cos(time * 0.25) * 0.025;

    // Ethereal floating like dancing on clouds
    const baseY = position[1];
    const mysticalFloat = Math.sin(time * 1.5) * 0.14 + Math.sin(time * 0.5) * 0.09;
    groupRef.current.position.y = baseY + mysticalFloat;

    // Graceful drift in figure-8 pattern
    groupRef.current.position.x = position[0] + Math.sin(time * 0.6) * 0.06;
    groupRef.current.position.z = position[2] + Math.sin(time * 1.2) * 0.04;

    // Magical pulsing with rainbow rhythm
    const mysticalIntensity = isSelected ? 1.18 : hovered ? 1.1 : 1.0;
    const rainbowScale = 1 + Math.sin(time * 2.5) * 0.05 * mysticalIntensity;
    const dreamScale = 1 + Math.sin(time * 0.3) * 0.03;
    groupRef.current.scale.setScalar(scale * rainbowScale * dreamScale);
  });

  // Use fallback if scene is not available or there's an error
  if (!clonedScene || modelError) {
    return (
      <UnicornFallback
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

      {/* Mystical unicorn lighting */}
      <pointLight
        position={[0, 2, 1]}
        intensity={isSelected ? 2.0 : hovered ? 1.6 : 1.0}
        color={isSelected ? "#c084fc" : hovered ? "#a855f7" : "#ddd6fe"}
        distance={8}
        decay={1.1}
      />
      <pointLight
        position={[-1, 1, 1]}
        intensity={isSelected ? 0.9 : 0.6}
        color="#f3e8ff"
        distance={5}
        decay={1.8}
      />

      {/* Mystical unicorn base with iridescent effect */}
      <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.35, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={isSelected ? 0.18 : hovered ? 0.14 : 0.09}
        />
      </mesh>

      {/* Rainbow stardust particles */}
      {(isSelected || hovered) && [...Array(20)].map((_, i) => {
        const rainbowColors = ["#ff6b6b", "#ffa726", "#ffeb3b", "#66bb6a", "#42a5f5", "#ab47bc"];
        return (
          <mesh
            key={i}
            position={[
              Math.sin((Date.now() * 0.0006 + i) * 2) * 2,
              0.5 + Math.sin((Date.now() * 0.001 + i) * 1.5) * 0.8 + i * 0.06,
              Math.cos((Date.now() * 0.0006 + i) * 2) * 2
            ]}
          >
            <sphereGeometry args={[0.012 + Math.sin(Date.now() * 0.003 + i) * 0.006, 8, 8]} />
            <meshBasicMaterial
              color={rainbowColors[i % rainbowColors.length]}
              transparent
              opacity={0.7 + Math.sin(Date.now() * 0.002 + i) * 0.3}
            />
          </mesh>
        );
      })}

      {/* Mystical horn light beam */}
      {isSelected && (
        <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.05, 0.8]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Rainbow trail effects */}
      {isSelected && [...Array(6)].map((_, i) => {
        const rainbowColors = ["#ff6b6b", "#ffa726", "#ffeb3b", "#66bb6a", "#42a5f5", "#ab47bc"];
        return (
          <mesh
            key={`rainbow-${i}`}
            position={[
              Math.sin((Date.now() * 0.0004 + i) * 1.2) * 2.5,
              0.6 + Math.sin((Date.now() * 0.0006 + i) * 0.8) * 0.3,
              Math.cos((Date.now() * 0.0004 + i) * 1.2) * 2.5
            ]}
            rotation={[0, Date.now() * 0.001 + i, 0]}
          >
            <planeGeometry args={[0.1, 0.6]} />
            <meshBasicMaterial
              color={rainbowColors[i]}
              transparent
              opacity={0.4}
              side={2}
            />
          </mesh>
        );
      })}

      {/* Mystical energy aura */}
      {isSelected && (
        <>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[2.5, 16, 16]} />
            <meshBasicMaterial
              color="#a855f7"
              transparent
              opacity={0.02}
              wireframe
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[1.8, 0.1, 8, 24]} />
            <meshBasicMaterial
              color="#c084fc"
              transparent
              opacity={0.1}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload('/unicorn/scene.gltf');

export default UnicornModel;
