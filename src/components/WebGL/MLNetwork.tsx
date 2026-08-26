import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Node interface
interface NetworkNode {
  id: number;
  pos: [number, number, number];
  layer: 'input' | 'hidden' | 'compute' | 'output';
}

// Node coordinates (asymmetric computational graph layout)
const NODES: NetworkNode[] = [
  // Input layer (X = -3)
  { id: 0, pos: [-3.0, 1.2, 0.2], layer: 'input' },
  { id: 1, pos: [-3.0, -0.1, -0.4], layer: 'input' },
  { id: 2, pos: [-3.0, -1.3, 0.5], layer: 'input' },

  // Hidden Layer (X = -1)
  { id: 3, pos: [-1.0, 1.8, -0.3], layer: 'hidden' },
  { id: 4, pos: [-1.0, 0.6, 0.6], layer: 'hidden' },
  { id: 5, pos: [-1.0, -0.6, -0.5], layer: 'hidden' },
  { id: 6, pos: [-1.0, -1.7, 0.4], layer: 'hidden' },

  // Computation layer (X = 1)
  { id: 7, pos: [1.0, 1.5, 0.5], layer: 'compute' },
  { id: 8, pos: [1.0, 0.4, -0.6], layer: 'compute' },
  { id: 9, pos: [1.0, -0.5, 0.3], layer: 'compute' },
  { id: 10, pos: [1.0, -1.6, -0.4], layer: 'compute' },

  // Output layer (X = 3)
  { id: 11, pos: [3.0, 0.7, 0.1], layer: 'output' },
  { id: 12, pos: [3.0, -0.7, -0.3], layer: 'output' }
];

// Connection links
const CONNECTIONS = [
  // Input -> Hidden
  { from: 0, to: 3 }, { from: 0, to: 4 },
  { from: 1, to: 4 }, { from: 1, to: 5 },
  { from: 2, to: 5 }, { from: 2, to: 6 },

  // Hidden -> Computation
  { from: 3, to: 7 }, { from: 3, to: 8 },
  { from: 4, to: 7 }, { from: 4, to: 9 },
  { from: 5, to: 8 }, { from: 5, to: 10 },
  { from: 6, to: 9 }, { from: 6, to: 10 },

  // Computation -> Output
  { from: 7, to: 11 },
  { from: 8, to: 11 }, { from: 8, to: 12 },
  { from: 9, to: 12 },
  { from: 10, to: 12 }
];

// Single Node Component
const NodeMesh: React.FC<{ node: NetworkNode }> = ({ node }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const elapsed = state.clock.getElapsedTime();

    // Pulse node scaling occasionally
    const wave = Math.sin(elapsed * 2.5 + pulseOffset);
    const pulseFactor = wave > 0.85 ? 1.0 + (wave - 0.85) * 0.4 : 1.0;

    meshRef.current.scale.setScalar(pulseFactor);
  });

  return (
    <mesh ref={meshRef} position={node.pos}>
      <sphereGeometry args={[0.16, 16, 16]} />
      {/* Matte black surface with emerald emissive highlights */}
      <meshStandardMaterial
        color="#030504"
        roughness={0.2}
        metalness={0.9}
        emissive="#39FF88"
        emissiveIntensity={0.6}
      />
      {/* Subtle outer wireframe ring */}
      <mesh scale={[1.25, 1.25, 1.25]}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshBasicMaterial color="#10B981" wireframe transparent opacity={0.3} />
      </mesh>
    </mesh>
  );
};

// Data Packet Flowing Along Link
const DataPacket: React.FC<{
  fromPos: [number, number, number];
  toPos: [number, number, number];
  speed: number;
  delay: number;
}> = ({ fromPos, toPos, speed, delay }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const p1 = useMemo(() => new THREE.Vector3(...fromPos), [fromPos]);
  const p2 = useMemo(() => new THREE.Vector3(...toPos), [toPos]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const elapsed = state.clock.getElapsedTime() + delay;
    const duration = 2.5 / speed;
    const progress = (elapsed % duration) / duration;

    // Linearly interpolate positions to flow packet
    meshRef.current.position.lerpVectors(p1, p2, progress);
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.07, 0.07, 0.07]} />
      <meshBasicMaterial color="#39FF88" toneMapped={false} />
    </mesh>
  );
};

// Drift Particles Field
const ParticleField: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  const count = 50;

  const points = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#34D399"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.4}
      />
    </points>
  );
};

// Core Network Graph Component (handles mouse parallax, scroll, and layout scaling)
const NeuralNetworkGraph: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Set up connection lines geometries
  const linesGeometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    CONNECTIONS.forEach((c) => {
      pts.push(new THREE.Vector3(...NODES[c.from].pos));
      pts.push(new THREE.Vector3(...NODES[c.to].pos));
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  // Mouse position ref updated at window level (so pointer-events: none doesn't block parallax)
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    // 1. Mouse Parallax response from window-level ref
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.35, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.25, 0.05);

    // 2. Scroll Interaction
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const scrollRatio = Math.min(scrollY / (window.innerHeight || 800), 1.0);

    // Reorganize perspective: rotate subtly on Z and translate forward
    groupRef.current.rotation.z = scrollRatio * 0.8;
    // Compressing slightly on scroll down
    groupRef.current.scale.setScalar(1.0 - scrollRatio * 0.2);
  });

  // Calculate packet speed multiplier based on scroll
  const [packetSpeed, setPacketSpeed] = useState(1.0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollRatio = Math.min(scrollY / window.innerHeight, 1.0);
      setPacketSpeed(1.0 + scrollRatio * 3.0); // Signals accelerate on scroll
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Drifting particle mist */}
      <ParticleField />

      {/* Network Nodes */}
      {NODES.map((n) => (
        <NodeMesh key={n.id} node={n} />
      ))}

      {/* Connectivity Lines */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial color="#10B981" transparent opacity={0.2} />
      </lineSegments>

      {/* Data Packets flowing */}
      {CONNECTIONS.map((c, i) => (
        <DataPacket
          key={i}
          fromPos={NODES[c.from].pos}
          toPos={NODES[c.to].pos}
          speed={packetSpeed}
          delay={i * 0.45}
        />
      ))}
    </group>
  );
};

// Exposed Wrapper rendering Canvas
export const HeroMLVisual: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <Canvas
        camera={{ fov: 40, near: 0.1, far: 20, position: [0, 0, 7.5] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.5} color="#ffffff" />
        <pointLight position={[-4, 4, 3]} intensity={2.0} color="#10B981" />
        <pointLight position={[4, -4, 3]} intensity={1.5} color="#34D399" />
        <NeuralNetworkGraph />
      </Canvas>
    </div>
  );
};
