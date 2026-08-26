import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingShapeProps {
  geometryType: 'box' | 'torus' | 'cone' | 'icosahedron' | 'dodecahedron';
  color: string;
  initialPosition: [number, number, number];
  scale?: number;
  parallaxFactor?: number;
  rotationSpeed?: [number, number, number];
}

export const FloatingShape: React.FC<FloatingShapeProps> = ({
  geometryType,
  color,
  initialPosition,
  scale = 1,
  parallaxFactor = 1,
  rotationSpeed = [0.12, 0.1, 0.08],
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);

  hoveredRef.current = hovered;

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (!meshRef.current) return;

    // 1. Dynamic scale lerping on pointer hover
    const targetScale = hoveredRef.current ? scale * 1.4 : scale;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.12);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.12);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.12);

    // 2. Continuous rotation (accelerates on hover)
    const spinMult = hoveredRef.current ? 4.5 : 1.0;
    meshRef.current.rotation.x += rotationSpeed[0] * 0.015 * spinMult;
    meshRef.current.rotation.y += rotationSpeed[1] * 0.01 * spinMult;
    meshRef.current.rotation.z += rotationSpeed[2] * 0.008 * spinMult;

    // 3. Subtle floating sway (sinusoidal drift)
    const sway = Math.sin(elapsed * 1.6 + initialPosition[0] * 1.2) * 0.12;

    // 4. Scroll Parallax: offsets Y position as page scrolls
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const scrollYOffset = scrollY * 0.007 * parallaxFactor;

    meshRef.current.position.y = initialPosition[1] + sway + scrollYOffset;
  });

  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {geometryType === 'box' && <boxGeometry args={[1, 1, 1]} />}
      {geometryType === 'torus' && <torusGeometry args={[0.5, 0.16, 12, 48]} />}
      {geometryType === 'cone' && <coneGeometry args={[0.5, 1, 16]} />}
      {geometryType === 'icosahedron' && <icosahedronGeometry args={[0.6, 0]} />}
      {geometryType === 'dodecahedron' && <dodecahedronGeometry args={[0.6, 0]} />}

      {/* Matte black surface with emerald emissive highlights */}
      <meshStandardMaterial
        color="#07110C"
        roughness={0.3}
        metalness={0.9}
        emissive={color}
        emissiveIntensity={hovered ? 1.5 : 0.4}
        transparent
        opacity={0.85}
      />
      {/* Thin wireframe outer skeleton for computational aesthetic */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        {geometryType === 'box' && <boxGeometry args={[1, 1, 1]} />}
        {geometryType === 'torus' && <torusGeometry args={[0.5, 0.16, 12, 48]} />}
        {geometryType === 'cone' && <coneGeometry args={[0.5, 1, 16]} />}
        {geometryType === 'icosahedron' && <icosahedronGeometry args={[0.6, 0]} />}
        {geometryType === 'dodecahedron' && <dodecahedronGeometry args={[0.6, 0]} />}
        <meshBasicMaterial color={color} wireframe transparent opacity={hovered ? 0.9 : 0.35} />
      </mesh>
    </mesh>
  );
};
