import React from 'react';
import { Canvas } from '@react-three/fiber';
import { FloatingShape } from './FloatingShape';

export const BackgroundCanvas: React.FC = () => {
  return (
    <div className="background-canvas-container">
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 25, position: [0, 0, 8] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Colorful lighting setup to illuminate shapes from multiple angles */}
        <ambientLight intensity={1.2} color="#ffffff" />
        <directionalLight position={[5, 12, 6]} intensity={2.5} color="#ffffff" />
        
        {/* Soft emerald backlights */}
        <pointLight position={[-8, -8, -4]} intensity={2.0} color="#10B981" /> {/* Primary Green */}
        <pointLight position={[8, 8, 4]} intensity={2.5} color="#34D399" />  {/* Bright Green */}
        <pointLight position={[0, -12, 2]} intensity={2.0} color="#047857" /> {/* Deep Green */}

        {/* 
          Distributed floating objects mapped along the vertical scroll depth.
        */}

        {/* Section 1 - Hero Shapes */}
        <FloatingShape
          geometryType="torus"
          color="#34D399" // Bright Green
          initialPosition={[-4.2, 2.2, -2.5]}
          scale={1.2}
          parallaxFactor={0.65}
          rotationSpeed={[0.15, 0.1, 0.08]}
        />
        <FloatingShape
          geometryType="icosahedron"
          color="#39FF88" // Accent Green
          initialPosition={[4.5, 1.6, -1.8]}
          scale={1.15}
          parallaxFactor={0.5}
          rotationSpeed={[0.1, 0.18, 0.05]}
        />
        
        {/* Section 2 - About Shapes */}
        <FloatingShape
          geometryType="cone"
          color="#10B981" // Primary Green
          initialPosition={[-3.8, -3.5, -3]}
          scale={1.0}
          parallaxFactor={0.55}
          rotationSpeed={[0.18, 0.05, 0.12]}
        />
        <FloatingShape
          geometryType="box"
          color="#047857" // Deep Green
          initialPosition={[4.0, -5.2, -2.2]}
          scale={1.3}
          parallaxFactor={0.7}
          rotationSpeed={[0.08, 0.12, 0.15]}
        />

        {/* Section 3 - The Unknown */}
        <FloatingShape
          geometryType="dodecahedron"
          color="#39FF88" // Accent Green
          initialPosition={[-4.5, -11.0, -2.8]}
          scale={1.2}
          parallaxFactor={0.5}
          rotationSpeed={[0.1, 0.1, 0.1]}
        />

        {/* Section 4 - The Challenge */}
        <FloatingShape
          geometryType="torus"
          color="#34D399" // Bright Green
          initialPosition={[4.2, -15.5, -2]}
          scale={1.1}
          parallaxFactor={0.6}
          rotationSpeed={[0.12, 0.14, 0.06]}
        />
        
        {/* Section 5 - Stats */}
        <FloatingShape
          geometryType="cone"
          color="#10B981" // Primary Green
          initialPosition={[-4.0, -21.0, -2.5]}
          scale={1.1}
          parallaxFactor={0.55}
          rotationSpeed={[0.1, 0.1, 0.15]}
        />

        {/* Section 6 - Presentation */}
        <FloatingShape
          geometryType="icosahedron"
          color="#047857" // Deep Green
          initialPosition={[4.4, -26.5, -2.2]}
          scale={1.25}
          parallaxFactor={0.5}
          rotationSpeed={[0.08, 0.15, 0.1]}
        />

        {/* Section 7 - Prizes */}
        <FloatingShape
          geometryType="box"
          color="#39FF88" // Accent Green
          initialPosition={[-4.6, -33.0, -3.2]}
          scale={1.35}
          parallaxFactor={0.6}
          rotationSpeed={[0.15, 0.08, 0.1]}
        />

        {/* Section 8 - Rules */}
        <FloatingShape
          geometryType="torus"
          color="#34D399" // Bright Green
          initialPosition={[4.0, -40.0, -1.8]}
          scale={1.15}
          parallaxFactor={0.5}
          rotationSpeed={[0.08, 0.12, 0.1]}
        />

        {/* Section 9 - Register */}
        <FloatingShape
          geometryType="cone"
          color="#10B981" // Primary Green
          initialPosition={[-4.2, -47.0, -2.4]}
          scale={1.2}
          parallaxFactor={0.65}
          rotationSpeed={[0.18, 0.1, 0.1]}
        />
      </Canvas>
    </div>
  );
};
