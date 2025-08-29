import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";
import PhoenixModel from "./PhoenixModel";
import FaerieModel from "./FaerieModel";
import ThunderbirdModel from "./ThunderbirdModel";
import UnicornModel from "./UnicornModel";
import type { House } from "../../types";

interface HouseModelSceneProps {
  selectedHouse: House | "";
  onHouseSelect: (houseValue: House) => void;
}

export default function HouseModelScene({
  selectedHouse,
  onHouseSelect,
}: HouseModelSceneProps) {
  // Define proper scales for each model to ensure consistent sizing
  const modelConfigs = {
    phoenix: {
      scale: 0.015,
      position: [0, -0.5, 0] as [number, number, number],
    },
    faerie: {
      scale: 0.025,
      position: [0, -0.3, 0] as [number, number, number],
    },
    thunderbird: {
      scale: 0.018,
      position: [0, -0.4, 0] as [number, number, number],
    },
    unicorn: {
      scale: 0.022,
      position: [0, -0.2, 0] as [number, number, number],
    },
  };

  // Render the appropriate model based on selection
  const renderHouseModel = () => {
    const getModelProps = (house: House) => ({
      position: modelConfigs[house].position,
      scale: modelConfigs[house].scale,
      isSelected: selectedHouse === house,
      onClick: () => onHouseSelect(house),
    });

    switch (selectedHouse) {
      case "phoenix":
        return <PhoenixModel {...getModelProps("phoenix")} />;
      case "faerie":
        return <FaerieModel {...getModelProps("faerie")} />;
      case "thunderbird":
        return <ThunderbirdModel {...getModelProps("thunderbird")} />;
      case "unicorn":
        return <UnicornModel {...getModelProps("unicorn")} />;
      default:
        // Show Phoenix as default when no house is selected
        return (
          <PhoenixModel {...getModelProps("phoenix")} isSelected={false} />
        );
    }
  };

  return (
    <div className="relative w-full h-133 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
      <Canvas
        camera={{ position: [0, 3, 8], fov: 45 }}
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Enhanced Lighting setup */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.4} color="#ffa500" />
          <pointLight position={[5, 5, 5]} intensity={0.3} color="#8b5cf6" />

          {/* Environment */}
          <Environment preset="sunset" />

          {/* Fog for depth */}
          <fog attach="fog" args={["#1e293b", 10, 25]} />

          {/* Render the selected house model */}
          <group>{renderHouseModel()}</group>

          {/* Floating particles around the model */}
          {[...Array(20)].map((_, i) => (
            <group key={i}>
              <mesh
                position={[
                  Math.sin(i * 0.5) * 5,
                  Math.random() * 3 + 1,
                  Math.cos(i * 0.5) * 5,
                ]}
              >
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial
                  color={
                    selectedHouse === "phoenix"
                      ? "#ffa500"
                      : selectedHouse === "faerie"
                      ? "#10b981"
                      : selectedHouse === "thunderbird"
                      ? "#3b82f6"
                      : selectedHouse === "unicorn"
                      ? "#a855f7"
                      : "#ffa500"
                  }
                  transparent
                  opacity={0.6}
                />
              </mesh>
            </group>
          ))}

          {/* Interactive controls - Always allow rotation */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={4}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            autoRotate={true}
            autoRotateSpeed={0.2}
            dampingFactor={0.05}
            enableDamping={true}
          />
        </Suspense>
      </Canvas>

      {/* Loading component */}
      <Loader />

      {/* Enhanced UI overlay */}
      <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-md rounded-xl p-4 text-white text-sm border border-slate-600/50">
        <p className="font-semibold mb-2 text-amber-400">
          🎮 Interactive 3D View
        </p>
        <div className="space-y-1 text-slate-300 text-xs">
          <p>• Drag to orbit camera</p>
          <p>• Scroll to zoom in/out</p>
          <p>• Models auto-rotate</p>
          <p>• Select house below to change</p>
        </div>
      </div>

      {/* Model info overlay */}
      {selectedHouse && (
        <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-md rounded-xl p-2 text-white text-sm border border-slate-600/50">
          <p className="font-semibold text-amber-400 capitalize">
            {selectedHouse}
          </p>
        </div>
      )}
    </div>
  );
}
