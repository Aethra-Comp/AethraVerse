import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AbstractStructureProps {
  structureRef: React.RefObject<THREE.Group | null>;
}

export const AbstractStructure: React.FC<AbstractStructureProps> = ({ structureRef }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  // Extract unique vertices from an icosahedron geometry to place node spheres
  const nodePositions = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(1.4, 1);
    const pos = geom.getAttribute('position');
    const points: THREE.Vector3[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const key = `${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)}`;
      if (!seen.has(key)) {
        seen.add(key);
        points.push(v);
      }
    }
    geom.dispose();
    return points;
  }, []);

  // Idle animation loop for micro-interactions
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // Core pulsing scale and rotation
    if (coreRef.current) {
      coreRef.current.rotation.y = elapsed * 0.15;
      coreRef.current.rotation.x = elapsed * 0.1;
      const pulse = 1 + Math.sin(elapsed * 2) * 0.03;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    if (wireRef.current) {
      wireRef.current.rotation.y = -elapsed * 0.1;
      wireRef.current.rotation.z = elapsed * 0.08;
    }

    // Concentric gyroscope rings rotating on distinct axes
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = elapsed * 0.25;
      ring1Ref.current.rotation.y = elapsed * 0.15;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = elapsed * 0.2;
      ring2Ref.current.rotation.z = -elapsed * 0.3;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -elapsed * 0.15;
      ring3Ref.current.rotation.z = elapsed * 0.25;
    }
  });

  return (
    <group ref={structureRef}>
      {/* 1. Core Glassy Icosahedron */}
      <mesh ref={coreRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1.4, 2]} />
        <meshPhysicalMaterial
          color="#8b5cf6" // Deep violet base
          emissive="#2c0054"
          roughness={0.1}
          metalness={0.1}
          transmission={0.9} // Glass opacity
          thickness={1.5}    // Refraction thickness
          ior={1.5}          // Index of refraction
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 2. Outer Wireframe Sheath */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.42, 1]} />
        <meshBasicMaterial
          color="#00ff66" // Acid Emerald Green
          wireframe
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Glowing Node Spheres at Vertices */}
      <group>
        {nodePositions.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial
              color={idx % 2 === 0 ? "#00f0ff" : "#ff007f"} // Alternating Cyan / Magenta
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* 4. Gyroscopic Ring 1 (Cyan - Inner) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.0, 0.015, 8, 100]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 5. Gyroscopic Ring 2 (Magenta - Middle) */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.4, 0.012, 8, 100]} />
        <meshBasicMaterial
          color="#ff007f"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 6. Gyroscopic Ring 3 (Amber - Outer) */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.8, 0.008, 8, 100]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
