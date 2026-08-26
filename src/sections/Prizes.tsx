import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { eventData } from '../data/eventData';

const prizes = [
  { rank: '1ST PLACE', amt: eventData.prizes.first, title: 'GRAND WINNER', color: 'var(--accent-green)', textColor: '#030504', icon: '🏆', glow: 'rgba(57,255,136,0.6)' },
  { rank: '2ND PLACE', amt: eventData.prizes.second, title: 'RUNNER-UP', color: 'var(--accent-green-bright)', textColor: '#030504', icon: '🥈', glow: 'rgba(52,211,153,0.5)' },
  { rank: '3RD PLACE', amt: eventData.prizes.third, title: 'RUNNER-UP', color: 'var(--accent-green-primary)', textColor: '#ffffff', icon: '🥉', glow: 'rgba(16,185,129,0.5)' },
];

const certificates = [
  { title: eventData.certificates.special[0] || 'BEST AI INTEGRATION', desc: 'Outstanding prompt pipeline and agent orchestration.', color: 'var(--accent-green)' },
  { title: eventData.certificates.special[1] || 'BEST UI/UX DESIGN', desc: 'Stunning interface layout and fluid user interactions.', color: 'var(--accent-green-bright)' },
  { title: 'PARTICIPATION CREDITS', desc: `Official E-certificates for ${eventData.certificates.all.toLowerCase()}.`, color: 'var(--accent-green-primary)' },
];

// Rising 3D Podium Segment
const PodiumMesh: React.FC<{ position: [number, number, number]; args: [number, number, number]; color: string; delay: number }> = ({ position, args, color, delay }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const elapsed = state.clock.getElapsedTime();
    
    // Rotate podium column slowly
    ref.current.rotation.y = elapsed * 0.15 + delay;
    
    // Rise podium on scroll (Section starts roughly around 2500px down)
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const triggerY = 2200;
    const scrollRatio = Math.min(Math.max((scrollY - triggerY) / 1000, 0), 1.0);
    
    // Animate Y position from -4 up to target
    ref.current.position.y = position[1] - 4.0 + (scrollRatio * 4.0);
  });

  return (
    <mesh ref={ref} position={[position[0], position[1] - 4, position[2]]}>
      <boxGeometry args={args} />
      {/* Matte black surface with emerald glow */}
      <meshStandardMaterial
        color="#07110C"
        roughness={0.2}
        metalness={0.9}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
      {/* Wireframe skeleton outline */}
      <mesh scale={[1.01, 1.01, 1.01]}>
        <boxGeometry args={args} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />
      </mesh>
    </mesh>
  );
};

const PrizesPodiumVisual: React.FC = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.4 }}>
      <Canvas camera={{ position: [0, 1.2, 5.5], fov: 45 }}>
        <ambientLight intensity={1.2} color="#ffffff" />
        <pointLight position={[0, 4, 3]} intensity={2.0} color="#10B981" />
        <pointLight position={[3, -2, 2]} intensity={1.5} color="#047857" />
        
        {/* Three podium blocks */}
        <PodiumMesh position={[-1.6, -1.2, 0]} args={[0.9, 1.6, 0.9]} color="#10B981" delay={0} />
        <PodiumMesh position={[0, -0.6, -0.4]} args={[1.1, 2.8, 1.1]} color="#39FF88" delay={Math.PI / 4} />
        <PodiumMesh position={[1.6, -1.5, 0]} args={[0.9, 1.1, 0.9]} color="#34D399" delay={Math.PI / 2} />
      </Canvas>
    </div>
  );
};

export const Prizes: React.FC = () => {
  return (
    <section id="prizes" style={{ backgroundColor: '#030504', position: 'relative', overflow: 'hidden' }}>
      {/* 3D rising podium background layer */}
      <PrizesPodiumVisual />

      {/* Decorative backdrop blobs */}
      <div
        className="glow-blob animate-float"
        style={{ width: '380px', height: '380px', background: 'var(--accent-green-deep)', top: '20%', left: '-5%', opacity: 0.15 }}
      />
      <div
        className="glow-blob animate-float-delay-2"
        style={{ width: '280px', height: '280px', background: 'rgba(16, 185, 129, 0.05)', bottom: '10%', right: '5%', opacity: 0.2 }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag" style={{ color: 'var(--accent-green-bright)' }}>06 / THE REWARDS</span>
          <h2 className="section-title" style={{ color: '#ffffff' }}>PRIZES & CERTIFICATES</h2>
        </motion.div>

        {/* Large visual banner for the total pool */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--accent-green-deep), var(--accent-green-primary))',
            color: '#ffffff',
            border: '4px solid var(--accent-green)',
            boxShadow: '10px 10px 0px var(--accent-green-deep)',
            textAlign: 'center',
            padding: '3rem 2rem',
            marginBottom: '4rem',
            borderRadius: '24px',
          }}
        >
          {/* Shimmer sweep */}
          <div
            className="shimmer-bg"
            style={{ position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none', zIndex: 1 }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ffffff' }}>
              TOTAL HACKATHON REWARD POOL
            </p>
            <motion.h3
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 900,
                lineHeight: '1.0',
                margin: '0.5rem 0',
                letterSpacing: '-0.04em',
                color: 'var(--accent-green)',
              }}
            >
              {eventData.prizePool}
            </motion.h3>
            <span className="neo-badge" style={{ background: 'var(--bg-surface-3)', color: 'var(--accent-green-bright)', border: '2px solid var(--accent-green-primary)', fontSize: '0.78rem' }}>
              PLUS PRESTIGIOUS SPECIAL SHIELDS
            </span>
          </div>
        </motion.div>

        {/* Podium Winner Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem',
            alignItems: 'end',
          }}
        >
          {prizes.map((prize, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -12,
                boxShadow: `10px 18px 0px var(--accent-green-deep)`,
                transition: { duration: 0.2 },
              }}
              className="neo-card"
              style={{
                backgroundColor: 'var(--bg-surface-2)',
                color: 'var(--text-light)',
                border: `4px solid ${prize.color}`,
                boxShadow: idx === 0 ? `8px 8px 0px var(--accent-green-deep), 0 0 40px ${prize.glow}` : '8px 8px 0px var(--accent-green-deep)',
                padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 2vw, 2rem)',
                minHeight: idx === 0 ? 'clamp(240px, 30vw, 320px)' : 'clamp(200px, 25vw, 280px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Crown glow for 1st place */}
              {idx === 0 && (
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120px',
                    height: '80px',
                    background: prize.glow,
                    borderRadius: '50%',
                    filter: 'blur(30px)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'monospace', color: prize.color }}>
                  {prize.rank}
                </span>
                <motion.span
                  style={{ fontSize: '2.4rem', display: 'inline-block' }}
                  animate={idx === 0 ? { rotate: [0, 5, -5, 0], scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {prize.icon}
                </motion.span>
              </div>

              <div style={{ marginTop: '2rem', position: 'relative', zIndex: 2 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.2rem', color: '#ffffff' }}>
                  {prize.title}
                </h4>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: idx === 0 ? '3.5rem' : '2.8rem',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: '1.1',
                  color: prize.color,
                }}>
                  {prize.amt}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special Certificates Section */}
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
        >
          SPECIAL RECOGNITIONS
        </motion.h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {certificates.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="neo-card"
              style={{
                backgroundColor: 'var(--bg-surface-2)',
                color: 'var(--text-light)',
                border: `3px solid ${cert.color}`,
                boxShadow: '6px 6px 0px var(--accent-green-deep)',
                padding: '1.75rem',
                cursor: 'default',
              }}
            >
              <span className="neo-badge" style={{
                background: 'var(--bg-surface-1)',
                color: cert.color,
                border: `2px solid ${cert.color}`,
                fontSize: '0.68rem',
                padding: '0.35rem 0.75rem',
                marginBottom: '1rem',
                boxShadow: 'none',
                display: 'inline-block',
              }}>
                CERTIFICATE
              </span>
              <h4 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                fontWeight: 800,
                margin: '0.5rem 0 0.35rem 0',
                color: cert.color,
              }}>
                {cert.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {cert.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
