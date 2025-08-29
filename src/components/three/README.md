# Three.js Integration

This directory contains Three.js components for the FPT Quiz application's house selection feature.

## Components

### PhoenixModel.tsx
- Loads and displays the 3D phoenix model from `/public/phoenix/scene.gltf`
- Features:
  - Automatic rotation animation
  - Floating animation
  - Interactive hover effects
  - Glowing emissive materials when selected
  - Dynamic lighting
  - Click interaction for selection

### HouseModelScene.tsx
- Main Three.js canvas component that orchestrates the 3D scene
- Features:
  - Orbital camera controls
  - Environment lighting with sunset preset
  - Interactive 3D model selection
  - Ground plane with shadows
  - UI overlays for instructions and selection status
  - Placeholder system for other house models (currently shows boxes)

### ThreeErrorBoundary.tsx
- Error boundary component to gracefully handle Three.js loading failures
- Provides fallback UI when 3D models fail to load
- Includes retry functionality

## Dependencies

- `three` - Core Three.js library
- `@types/three` - TypeScript definitions
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers and abstractions

## Model Assets

The phoenix model is located in `/public/phoenix/` and includes:
- `scene.gltf` - Main GLTF model file
- `scene.bin` - Binary data
- `license.txt` - Model licensing information

## Usage

```tsx
import { HouseModelScene, ThreeErrorBoundary } from '../components/three';

// Wrap in error boundary for graceful failure handling
<ThreeErrorBoundary>
  <HouseModelScene 
    selectedHouse={selectedHouse}
    onHouseSelect={handleHouseSelect}
  />
</ThreeErrorBoundary>
```

## Future Enhancements

1. Add 3D models for other houses (Faerie, Thunderbird, Unicorn)
2. Implement house-specific animations and effects
3. Add physics interactions
4. Implement particle effects for magical atmospheres
5. Add sound effects for interactions
6. Optimize loading with progressive model loading

## Performance Notes

- Models are preloaded using `useGLTF.preload()`
- Materials are cloned to avoid shared state issues
- Canvas is optimized for the specific use case
- Error boundaries prevent crashes from loading failures
