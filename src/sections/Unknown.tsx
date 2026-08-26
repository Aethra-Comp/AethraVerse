import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Lock, Unlock, AlertTriangle, Eye } from 'lucide-react';
import { eventData } from '../data/eventData';

// Configures target timestamp calculation
const getTargetMs = (): number => {
  const date = eventData.problemStatementReveal.date;
  const time = eventData.problemStatementReveal.time;
  const timezone = eventData.problemStatementReveal.timezone;
  
  let offset = '+05:30'; // Default Asia/Kolkata
  if (timezone === 'UTC') offset = 'Z';
  else if (timezone === 'America/New_York') offset = '-04:00';
  
  return Date.parse(`${date}T${time}${offset}`);
};

type VaultState = 'LOCKED' | 'COUNTDOWN' | 'UNLOCKED';

// 3D Vault Core - Zero React Props, Self-Contained 60FPS Time check inside useFrame
const VaultCore: React.FC = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Track cinematic unlock frames
  const unlockTimeRef = useRef<number | null>(null);

  // Particle positions drift vectors
  const particleDrifts = useMemo(() => {
    const count = 70;
    const pos = new Float32Array(count * 3);
    const dirs = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const dist = 1.3 + Math.random() * 0.4;
      
      // Starting positions
      pos[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = dist * Math.cos(phi);

      // Radial directions
      dirs[i * 3] = pos[i * 3] / dist;
      dirs[i * 3 + 1] = pos[i * 3 + 1] / dist;
      dirs[i * 3 + 2] = pos[i * 3 + 2] / dist;
    }
    return { pos, dirs };
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const targetMs = getTargetMs();
    const now = Date.now();
    const diff = targetMs - now;

    // Calculate vault state locally inside frame
    let localVaultState: VaultState = 'LOCKED';
    if (diff <= 0) {
      localVaultState = 'UNLOCKED';
    } else if (diff < 10 * 60 * 1000) {
      localVaultState = 'COUNTDOWN';
    }

    const progress = diff <= 0 ? 1.0 : diff > 10 * 60 * 1000 ? 0.0 : (10 * 60 * 1000 - diff) / (10 * 60 * 1000);

    // 1. Camera Shake on final countdown
    if (localVaultState === 'COUNTDOWN') {
      const shakeIntensity = 0.03 * progress;
      state.camera.position.x = Math.sin(elapsed * 60) * shakeIntensity;
      state.camera.position.y = Math.cos(elapsed * 55) * shakeIntensity;
    } else if (localVaultState === 'LOCKED') {
      state.camera.position.set(0, 0, 4.2);
    }

    // 2. Animate Vault geometry based on state
    if (localVaultState === 'LOCKED') {
      // Slow rotation
      if (coreRef.current) coreRef.current.rotation.y = elapsed * 0.2;
      if (ring1Ref.current) {
        ring1Ref.current.rotation.y = elapsed * 0.4;
        ring1Ref.current.scale.setScalar(1.0);
      }
      if (ring2Ref.current) {
        ring2Ref.current.rotation.x = elapsed * -0.3;
        ring2Ref.current.scale.setScalar(1.0);
      }
      if (particlesRef.current) {
        particlesRef.current.rotation.z = elapsed * 0.15;
      }
    } 
    else if (localVaultState === 'COUNTDOWN') {
      // Speed up rotations based on progress
      const rotSpeed = 0.2 + progress * 2.5;
      if (coreRef.current) {
        coreRef.current.rotation.y = elapsed * rotSpeed;
        const breathe = 1.0 + Math.sin(elapsed * 15.0) * 0.04 * progress;
        coreRef.current.scale.setScalar(breathe);
      }
      if (ring1Ref.current) ring1Ref.current.rotation.y = elapsed * rotSpeed * 1.5;
      if (ring2Ref.current) ring2Ref.current.rotation.x = -elapsed * rotSpeed * 1.2;
      if (particlesRef.current) {
        particlesRef.current.rotation.z = elapsed * rotSpeed * 0.6;
      }
    } 
    else if (localVaultState === 'UNLOCKED') {
      if (unlockTimeRef.current === null) {
        unlockTimeRef.current = elapsed;
      }
      const timeSinceUnlock = elapsed - unlockTimeRef.current;

      // CINEMATIC STAGES
      if (timeSinceUnlock < 0.5) {
        // Stage 1: Brief freeze
        if (coreRef.current) coreRef.current.scale.setScalar(1.0);
      } 
      else if (timeSinceUnlock < 1.5) {
        // Stage 2: Core flash glow
        const flashIntensity = 1.0 + Math.sin((timeSinceUnlock - 0.5) * Math.PI) * 4.0;
        if (coreRef.current) {
          const mat = coreRef.current.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = flashIntensity;
          coreRef.current.scale.setScalar(1.0 + (timeSinceUnlock - 0.5) * 0.15);
        }
      } 
      else {
        // Stage 3: Split rings & Particle burst
        const t = Math.min((timeSinceUnlock - 1.5) / 2.0, 1.0); // 2 seconds transition
        const ease = 1 - Math.pow(1 - t, 3); // Ease out cubic

        if (ring1Ref.current) {
          // Slide ring 1 outward
          ring1Ref.current.scale.setScalar(1.0 + ease * 1.8);
          ring1Ref.current.rotation.y = elapsed * 0.08;
        }
        if (ring2Ref.current) {
          // Slide ring 2 outward
          ring2Ref.current.scale.setScalar(1.0 + ease * 1.8);
          ring2Ref.current.rotation.x = -elapsed * 0.05;
        }
        if (coreRef.current) {
          coreRef.current.rotation.y = elapsed * 0.15;
          const mat = coreRef.current.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 0.5;
        }

        // Translate particles radially outward (burst)
        if (particlesRef.current) {
          const posAttribute = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
          const initialPos = particleDrifts.pos;
          const dirs = particleDrifts.dirs;
          for (let i = 0; i < initialPos.length; i++) {
            posAttribute.array[i] = initialPos[i] + dirs[i] * ease * 3.5;
          }
          posAttribute.needsUpdate = true;
          particlesRef.current.rotation.z = elapsed * 0.05;
        }
      }
    }
  });

  return (
    <group>
      {/* Background drifting particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(particleDrifts.pos), 3]}
          />
        </bufferGeometry>
        <pointsMaterial color="#39FF88" size={0.045} sizeAttenuation transparent opacity={0.65} />
      </points>

      {/* Outer Rotating Cage Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.2, 0.02, 8, 48]} />
        <meshBasicMaterial color="#10B981" wireframe transparent opacity={0.4} />
      </mesh>

      {/* Outer Rotating Cage Ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.22, 0.015, 8, 48]} />
        <meshBasicMaterial color="#34D399" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Central Capsule Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshStandardMaterial
          color="#030504"
          roughness={0.2}
          metalness={0.8}
          emissive="#39FF88"
          emissiveIntensity={0.8}
        />
        {/* Outer wire mesh outline */}
        <mesh scale={[1.05, 1.05, 1.05]}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshBasicMaterial color="#34D399" wireframe transparent opacity={0.25} />
        </mesh>
      </mesh>
    </group>
  );
};

// ISOLATED SUB-COMPONENT: Countdown panel, alerts and actions to prevent canvas refreshes
const VaultCountdownPanel: React.FC<{ onLockedClick: (timeLeftStr: string) => void }> = ({ onLockedClick }) => {
  const [vaultState, setVaultState] = useState<VaultState>('LOCKED');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetMs = getTargetMs();
    
    const updateCountdown = () => {
      const now = Date.now();
      const diff = targetMs - now;

      if (diff <= 0) {
        setVaultState('UNLOCKED');
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return true;
      }

      if (diff < 10 * 60 * 1000) {
        setVaultState('COUNTDOWN');
      } else {
        setVaultState('LOCKED');
      }

      const sec = Math.floor((diff / 1000) % 60);
      const min = Math.floor((diff / 1000 / 60) % 60);
      const hr = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const dy = Math.floor(diff / (1000 * 60 * 60 * 24));

      setTimeLeft({ days: dy, hours: hr, minutes: min, seconds: sec });
      return false;
    };

    const isOver = updateCountdown();
    if (isOver) return;

    const intervalId = setInterval(() => {
      const done = updateCountdown();
      if (done) clearInterval(intervalId);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleQueryClick = () => {
    if (vaultState === 'UNLOCKED') return;
    const d = String(timeLeft.days).padStart(2, '0');
    const h = String(timeLeft.hours).padStart(2, '0');
    const m = String(timeLeft.minutes).padStart(2, '0');
    const s = String(timeLeft.seconds).padStart(2, '0');
    onLockedClick(`${d}D : ${h}H : ${m}M : ${s}S`);
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <span className="section-tag" style={{ color: 'var(--accent-green-bright)' }}>02 / THE MYSTERY</span>
      
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
        fontWeight: 800,
        lineHeight: '1.1',
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: '-0.02em',
        marginBottom: '1rem',
      }}>
        AethraVerse <br />
        <span className="text-stroke">System Vault</span>
      </h2>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.55', marginBottom: '2rem' }}>
        The problem statement is encrypted. The time-lock capsule will automatically open at the start of the event, release data nodes, and activate the sectors.
      </p>

      {/* Countdown Grid (Locked / Final Countdown States) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <AnimatePresence mode="wait">
          {vaultState === 'UNLOCKED' ? (
            <motion.div
              key="unlocked"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              style={{
                display: 'inline-block',
                background: 'rgba(16, 185, 129, 0.06)',
                border: '3px solid var(--accent-green)',
                borderRadius: '16px',
                padding: '1.25rem 2rem',
                boxShadow: '6px 6px 0px var(--accent-green-deep)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--accent-green-bright)' }}>
                <Unlock className="w-5 h-5" />
                <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.2em' }}>STATUS: SYSTEM_UNLOCKED</span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.02em',
                margin: 0,
              }}>
                PROBLEM STATEMENT REVEALED
              </h3>
            </motion.div>
          ) : (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: vaultState === 'COUNTDOWN' ? 'var(--accent-green)' : 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 800 }}>
                <Lock className="w-4 h-4" />
                <span style={{ letterSpacing: '0.15em' }}>
                  {vaultState === 'COUNTDOWN' ? 'WARNING: FINAL UNLOCK SEQUENCE ACTIVE' : 'SYSTEM LOCK TIMEOUT IN'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', width: '100%', maxWidth: '360px' }}>
                {[
                  { label: 'DAYS', val: timeLeft.days },
                  { label: 'HOURS', val: timeLeft.hours },
                  { label: 'MINUTES', val: timeLeft.minutes },
                  { label: 'SECONDS', val: timeLeft.seconds },
                ].map(item => (
                  <div
                    key={item.label}
                    className="neo-card"
                    onClick={handleQueryClick}
                    style={{
                      background: 'var(--bg-surface-2)',
                      border: vaultState === 'COUNTDOWN' ? '3px solid var(--accent-green)' : '3px solid var(--accent-green-primary)',
                      boxShadow: vaultState === 'COUNTDOWN' ? '4px 4px 0px var(--accent-green)' : '4px 4px 0px var(--accent-green-deep)',
                      padding: '0.5rem 0.65rem',
                      minWidth: '50px',
                      maxWidth: '100px',
                      textAlign: 'center',
                      flex: '1 1 auto',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      color: vaultState === 'COUNTDOWN' ? 'var(--accent-green)' : '#ffffff',
                      lineHeight: '1.1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {String(item.val).padStart(2, '0')}
                    </div>
                    <div style={{
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.08em',
                      marginTop: '0.2rem',
                    }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action CTA Button */}
      <div>
        {vaultState === 'UNLOCKED' ? (
          <a
            href="#/problem-statement"
            className="neo-btn"
            style={{
              padding: '0.85rem 2.25rem',
              fontSize: '0.95rem',
              background: 'var(--accent-green)',
              color: 'var(--bg-dark)',
              border: '3px solid var(--accent-green-primary)',
              boxShadow: '6px 6px 0px var(--accent-green-deep)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Eye className="w-4 h-4" />
            VIEW PROBLEM STATEMENT ➔
          </a>
        ) : (
          <button
            type="button"
            onClick={handleQueryClick}
            className="neo-btn"
            style={{
              padding: '0.85rem 2.25rem',
              fontSize: '0.95rem',
              background: 'transparent',
              color: 'rgba(255,255,255,0.4)',
              border: '3px solid rgba(255,255,255,0.15)',
              boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Lock className="w-4 h-4" />
            WAITING FOR REVEAL...
          </button>
        )}
      </div>
    </div>
  );
};

export const Unknown: React.FC = () => {
  const [warningNotice, setWarningNotice] = useState<{ show: boolean; timeLeftStr: string } | null>(null);

  const triggerLockedAlert = (timeLeftStr: string) => {
    setWarningNotice({
      show: true,
      timeLeftStr
    });

    // Auto fade after 4 seconds
    setTimeout(() => {
      setWarningNotice(null);
    }, 4000);
  };

  return (
    <section id="unknown-mystery" style={{ backgroundColor: '#030504', position: 'relative', overflow: 'hidden' }}>
      {/* Backdrop decorative outline text */}
      <div
        className="text-stroke"
        style={{
          position: 'absolute',
          top: '6%',
          right: '4%',
          fontSize: 'clamp(3rem, 11vw, 8rem)',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          opacity: 0.03,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          zIndex: 2,
        }}
      >
        SYSTEM LOCKED
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Warning notification modal overlay */}
        <AnimatePresence>
          {warningNotice?.show && (
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              style={{
                position: 'fixed',
                top: '5.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 999,
                width: 'calc(100% - 2rem)',
                maxWidth: '460px',
                pointerEvents: 'all',
              }}
            >
              <div
                className="neo-card"
                style={{
                  background: 'rgba(7, 17, 12, 0.96)',
                  backdropFilter: 'blur(16px)',
                  border: '3px solid var(--accent-green)',
                  boxShadow: '6px 6px 0px var(--accent-green-deep)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.15rem',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <div style={{
                  flexShrink: 0,
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(57, 255, 136, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-green)',
                }}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    SYSTEM VAULT ACCESS DENIED
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                    The official Problem Statement is sealed. Release triggers at kickoff.
                  </p>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--accent-green-bright)', borderTop: '1px dashed var(--border-green)', paddingTop: '0.5rem' }}>
                    REVEAL PROTOCOL: {eventData.date.toUpperCase()} @ 13:30 IST <br />
                    LOCK TIMELINE: {warningNotice.timeLeftStr}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '3rem', alignItems: 'center' }}>
          
          {/* Left Column: Interactive 3D Capsule Vault Canvas */}
          <div 
            onClick={() => triggerLockedAlert('SEALED')}
            style={{ 
              position: 'relative', 
              height: '380px', 
              width: '100%', 
              backgroundColor: 'var(--bg-surface-2)',
              border: '3px solid var(--accent-green-primary)',
              borderRadius: '24px',
              boxShadow: '6px 6px 0px var(--accent-green-deep)',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            {/* 3D Core Layer */}
            <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
              <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }}>
                <ambientLight intensity={1.5} color="#ffffff" />
                <pointLight position={[0, 4, 3]} intensity={2.5} color="#10B981" />
                <pointLight position={[3, -2, 2]} intensity={1.5} color="#047857" />
                <VaultCore />
              </Canvas>
            </div>

            {/* Lock Status overlay inside container */}
            <div style={{
              position: 'absolute',
              top: '1.25rem',
              left: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: '#030504',
              border: '2px solid var(--accent-green-primary)',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: 'var(--accent-green-bright)',
            }}>
              <span className="live-dot" style={{
                background: '#ef4444',
              }} />
              <span>CORE_LOCK = SEALED</span>
            </div>

            {/* Click hint inside locked device */}
            <div style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              pointerEvents: 'none',
            }}>
              [ CLICK DEVICE TO QUERY ]
            </div>
          </div>

          {/* Right Column: Title info and Countdown panel */}
          <VaultCountdownPanel onLockedClick={triggerLockedAlert} />
        </div>

      </div>
    </section>
  );
};
