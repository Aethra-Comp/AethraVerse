import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { REGISTRATION_CONFIG } from '../data/registrationData';

// Floating particle field for the section background
const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 5,
  color: i % 2 === 0 ? 'var(--accent-green)' : 'var(--accent-green-primary)',
  opacity: 0.12 + Math.random() * 0.15,
}));

interface RegistrationData {
  id: string;
  emailAddress: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  timestamp: string;
}

// 3D Portal Core Component
const CoreMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (meshRef.current) {
      const breathe = 1.0 + Math.sin(elapsed * 2.0) * 0.12;
      meshRef.current.scale.setScalar(breathe);
      meshRef.current.rotation.y = elapsed * 0.25;
      meshRef.current.rotation.x = elapsed * 0.12;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z = -elapsed * 0.2;
      particlesRef.current.rotation.y = Math.sin(elapsed * 0.25) * 0.15;
    }
  });

  const particleData = useMemo(() => {
    const count = 50;
    const arr = new Float32Array(count * 3);
    const radius = 1.35;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.12;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.sin(angle) * r;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    return arr;
  }, []);

  return (
    <group>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particleData, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#39FF88" size={0.05} sizeAttenuation transparent opacity={0.6} />
      </points>

      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color="#030504"
          roughness={0.15}
          metalness={0.9}
          emissive="#34D399"
          emissiveIntensity={1.0}
        />
        <mesh scale={[1.05, 1.05, 1.05]}>
          <icosahedronGeometry args={[0.6, 1]} />
          <meshBasicMaterial color="#39FF88" wireframe transparent opacity={0.2} />
        </mesh>
      </mesh>
    </group>
  );
};

const PortalCoreVisual: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '260px' }}>
      <Canvas camera={{ position: [0, 0, 3.4], fov: 45 }}>
        <ambientLight intensity={1.5} color="#ffffff" />
        <pointLight position={[0, 3, 2]} intensity={2.0} color="#10B981" />
        <pointLight position={[-3, -3, 1]} intensity={1.2} color="#047857" />
        <CoreMesh />
      </Canvas>
    </div>
  );
};

export const Register: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<RegistrationData | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Form Inputs State (Exactly 8 participant entered fields)
  const [formData, setFormData] = useState({
    emailAddress: '',
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    memberName: '',
    memberEmail: '',
    memberPhone: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 820);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Inputs Validation Rules
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    // Email Address
    if (!formData.emailAddress.trim()) {
      errors.emailAddress = 'Email is required';
    } else if (!emailRegex.test(formData.emailAddress.trim())) {
      errors.emailAddress = 'Invalid email';
    } else if (!formData.emailAddress.trim().toLowerCase().endsWith('@tcetmumbai.in')) {
      errors.emailAddress = 'Must end with @tcetmumbai.in';
    }

    // Team Name
    if (!formData.teamName.trim()) {
      errors.teamName = 'Team name is required';
    }

    // Leader Name
    if (!formData.leaderName.trim()) {
      errors.leaderName = 'Leader name is required';
    }

    // Leader Email
    if (!formData.leaderEmail.trim()) {
      errors.leaderEmail = 'Leader email is required';
    } else if (!emailRegex.test(formData.leaderEmail.trim())) {
      errors.leaderEmail = 'Invalid email';
    } else if (!formData.leaderEmail.trim().toLowerCase().endsWith('@tcetmumbai.in')) {
      errors.leaderEmail = 'Must end with @tcetmumbai.in';
    }

    // Leader Contact
    if (!formData.leaderPhone.trim()) {
      errors.leaderPhone = 'Contact is required';
    } else if (!phoneRegex.test(formData.leaderPhone.trim())) {
      errors.leaderPhone = '10-digit number required';
    }

    // Member Name
    if (!formData.memberName.trim()) {
      errors.memberName = 'Member name is required';
    }

    // Member Email
    if (!formData.memberEmail.trim()) {
      errors.memberEmail = 'Member email is required';
    } else if (!emailRegex.test(formData.memberEmail.trim())) {
      errors.memberEmail = 'Invalid email';
    } else if (!formData.memberEmail.trim().toLowerCase().endsWith('@tcetmumbai.in')) {
      errors.memberEmail = 'Must end with @tcetmumbai.in';
    }

    // Member Contact
    if (!formData.memberPhone.trim()) {
      errors.memberPhone = 'Contact is required';
    } else if (!phoneRegex.test(formData.memberPhone.trim())) {
      errors.memberPhone = '10-digit number required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const uniqueId = `REG-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();

    const payload = {
      emailAddress: formData.emailAddress.trim(),
      teamName: formData.teamName.trim(),
      leaderName: formData.leaderName.trim(),
      leaderEmail: formData.leaderEmail.trim(),
      leaderPhone: formData.leaderPhone.trim(),
      memberName: formData.memberName.trim(),
      memberEmail: formData.memberEmail.trim(),
      memberPhone: formData.memberPhone.trim(),
    };

    try {
      if (!REGISTRATION_CONFIG.endpointUrl) {
        if (import.meta.env.DEV) {
          console.warn("[DEV MODE] VITE_REGISTRATION_ENDPOINT_URL is empty. Simulating success locally. Deploy Google Apps Script to connect to Google Sheets.");
          await new Promise((resolve) => setTimeout(resolve, 1500));
          
          setIsSubmitting(false);
          const successObj: RegistrationData = {
            id: uniqueId,
            emailAddress: formData.emailAddress,
            teamName: formData.teamName,
            leaderName: formData.leaderName,
            leaderEmail: formData.leaderEmail,
            leaderPhone: formData.leaderPhone,
            memberName: formData.memberName,
            memberEmail: formData.memberEmail,
            memberPhone: formData.memberPhone,
            timestamp,
          };
          setSuccessData(successObj);
          triggerConfetti();
          return;
        } else {
          throw new Error('VITE_REGISTRATION_ENDPOINT_URL is not configured in env.');
        }
      }

      // POST to Google Apps Script Endpoint Web App URL
      // We do not set application/json content header to prevent preflight CORS OPTIONS triggers
      const response = await fetch(REGISTRATION_CONFIG.endpointUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const resText = await response.text();
      let resJson;
      try {
        resJson = JSON.parse(resText);
      } catch (pErr) {
        throw new Error('Server returned invalid verification payload.');
      }

      if (resJson.status === 'success' || response.ok) {
        setIsSubmitting(false);
        const successObj: RegistrationData = {
          id: uniqueId,
          emailAddress: formData.emailAddress,
          teamName: formData.teamName,
          leaderName: formData.leaderName,
          leaderEmail: formData.leaderEmail,
          leaderPhone: formData.leaderPhone,
          memberName: formData.memberName,
          memberEmail: formData.memberEmail,
          memberPhone: formData.memberPhone,
          timestamp,
        };
        setSuccessData(successObj);
        triggerConfetti();
      } else {
        throw new Error(resJson.message || 'Verification endpoint rejected authorization.');
      }
    } catch (err: any) {
      console.error("Sheets Apps Script connection failed:", err);
      setIsSubmitting(false);
      setSubmitError(err.message || 'Registration failed. Check internet connection and try again.');
    }
  };

  const triggerConfetti = () => {
    const colors = ['#10b981', '#34d399', '#39ff88'];
    const end = Date.now() + 2 * 1000;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const resetForm = () => {
    setFormData({
      emailAddress: '',
      teamName: '',
      leaderName: '',
      leaderEmail: '',
      leaderPhone: '',
      memberName: '',
      memberEmail: '',
      memberPhone: '',
    });
    setFormErrors({});
    setSuccessData(null);
    setSubmitError(null);
    setFocusedField(null);
  };

  // Inputs Styling helpers
  const inputStyle = (errorKey: string) => {
    const isFocused = focusedField === errorKey;
    return {
      width: '100%',
      height: '2.75rem',
      padding: '0.65rem 1rem',
      background: '#030504',
      border: formErrors[errorKey] 
        ? '2px solid #ef4444' 
        : isFocused 
          ? '2px solid var(--accent-green)' 
          : '2px solid var(--accent-green-primary)',
      boxShadow: formErrors[errorKey]
        ? '0 0 10px rgba(239, 68, 68, 0.25)'
        : isFocused
          ? '0 0 10px rgba(57, 255, 136, 0.35)'
          : 'none',
      borderRadius: '10px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontSize: '0.9rem',
      outline: 'none',
      transition: 'border 0.2s, box-shadow 0.2s',
    };
  };

  const labelStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.68rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    marginBottom: '0.45rem',
    fontFamily: 'monospace',
  };

  return (
    <section id="register" style={{ position: 'relative', overflow: 'hidden', padding: '6rem 0', backgroundColor: '#000000' }}>
      {/* Background Particles decoration */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            pointerEvents: 'none',
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            zIndex: 1,
          }}
        />
      ))}

      <div
        className="glow-blob animate-float"
        style={{ width: '450px', height: '450px', background: 'var(--accent-green-deep)', top: '-15%', left: '5%', opacity: 0.15 }}
      />
      <div
        className="glow-blob animate-float-delay-2"
        style={{ width: '400px', height: '400px', background: 'rgba(16, 185, 129, 0.04)', bottom: '-15%', right: '5%', opacity: 0.2 }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="neo-card"
          style={{
            backgroundColor: 'var(--bg-surface-2)',
            color: 'var(--text-light)',
            border: '4px solid var(--accent-green-primary)',
            boxShadow: '12px 12px 0px var(--accent-green-deep)',
            padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 3vw, 2rem)',
            borderRadius: '28px',
            maxWidth: '1020px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait">
            {!successData ? (
              <div key="register-portal-split" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'flex-start', gap: '2.5rem', width: '100%' }}>
                
                {/* Left Column: Interactive Form */}
                <div style={{ flex: '1 1 60%', textAlign: 'left', width: '100%' }}>
                  
                  {/* Title and sector metrics */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="live-dot" />
                    </div>
                    <span className="neo-badge" style={{ background: 'var(--bg-surface-1)', color: 'var(--accent-green)', fontSize: '0.72rem', border: '2px solid var(--accent-green-primary)', boxShadow: 'none' }}>
                      SECTOR_09: DISPATCH_AUTHORIZATION
                    </span>
                  </div>

                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                    fontWeight: 900,
                    lineHeight: '1.1',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    marginBottom: '1rem',
                    color: '#ffffff',
                  }}>
                    TEAM DISPATCH PORTAL
                  </h2>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
                    Register your team of exactly 2 members. Submission data will be compiled and uploaded directly to the official event logs. Limit of first 30 slots applies.
                  </p>

                  {/* Submission Form */}
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* General Identification Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
                      {/* Email Address */}
                      <div>
                        <label style={labelStyle}>
                          <span>Email Address</span>
                          {formErrors.emailAddress && <span style={{ color: '#ef4444', textTransform: 'lowercase' }}>{formErrors.emailAddress}</span>}
                        </label>
                        <input
                          name="emailAddress"
                          value={formData.emailAddress}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('emailAddress')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Primary contact address"
                          disabled={isSubmitting}
                          style={inputStyle('emailAddress')}
                        />
                      </div>

                      {/* Team Name */}
                      <div>
                        <label style={labelStyle}>
                          <span>Team Name</span>
                          {formErrors.teamName && <span style={{ color: '#ef4444', textTransform: 'lowercase' }}>{formErrors.teamName}</span>}
                        </label>
                        <input
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('teamName')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Squad name designation"
                          disabled={isSubmitting}
                          style={inputStyle('teamName')}
                        />
                      </div>
                    </div>

                    {/* Member Details side-by-side grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2.5rem', borderTop: '1px solid rgba(57,255,136,0.12)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                      
                      {/* Leader details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderRight: isMobile ? 'none' : '1px dashed rgba(57,255,136,0.12)', paddingRight: isMobile ? 0 : '1.5rem' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }}>
                          // SQUAD LEADER (MEMBER 01)
                        </span>

                        {/* Leader Name */}
                        <div>
                          <label style={labelStyle}>
                            <span>Leader Name</span>
                            {formErrors.leaderName && <span style={{ color: '#ef4444', textTransform: 'lowercase' }}>{formErrors.leaderName}</span>}
                          </label>
                          <input
                            name="leaderName"
                            value={formData.leaderName}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('leaderName')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Full name"
                            disabled={isSubmitting}
                            style={inputStyle('leaderName')}
                          />
                        </div>

                        {/* Leader Email ID */}
                        <div>
                          <label style={labelStyle}>
                            <span>Leader Email ID</span>
                            {formErrors.leaderEmail && <span style={{ color: '#ef4444', textTransform: 'lowercase' }}>{formErrors.leaderEmail}</span>}
                          </label>
                          <input
                            name="leaderEmail"
                            value={formData.leaderEmail}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('leaderEmail')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Leader email address"
                            disabled={isSubmitting}
                            style={inputStyle('leaderEmail')}
                          />
                        </div>

                        {/* Leader Contact */}
                        <div>
                          <label style={labelStyle}>
                            <span>Leader Contact</span>
                            {formErrors.leaderPhone && <span style={{ color: '#ef4444', textTransform: 'lowercase' }}>{formErrors.leaderPhone}</span>}
                          </label>
                          <input
                            name="leaderPhone"
                            value={formData.leaderPhone}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('leaderPhone')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="10-digit mobile"
                            disabled={isSubmitting}
                            style={inputStyle('leaderPhone')}
                          />
                        </div>
                      </div>

                      {/* Companion details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }}>
                          // SQUAD COMPANION (MEMBER 02)
                        </span>

                        {/* Companion Name */}
                        <div>
                          <label style={labelStyle}>
                            <span>Member Name</span>
                            {formErrors.memberName && <span style={{ color: '#ef4444', textTransform: 'lowercase' }}>{formErrors.memberName}</span>}
                          </label>
                          <input
                            name="memberName"
                            value={formData.memberName}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('memberName')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Full name"
                            disabled={isSubmitting}
                            style={inputStyle('memberName')}
                          />
                        </div>

                        {/* Companion Email ID */}
                        <div>
                          <label style={labelStyle}>
                            <span>Member Email ID</span>
                            {formErrors.memberEmail && <span style={{ color: '#ef4444', textTransform: 'lowercase' }}>{formErrors.memberEmail}</span>}
                          </label>
                          <input
                            name="memberEmail"
                            value={formData.memberEmail}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('memberEmail')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Member email address"
                            disabled={isSubmitting}
                            style={inputStyle('memberEmail')}
                          />
                        </div>

                        {/* Companion Contact */}
                        <div>
                          <label style={labelStyle}>
                            <span>Member Contact</span>
                            {formErrors.memberPhone && <span style={{ color: '#ef4444', textTransform: 'lowercase' }}>{formErrors.memberPhone}</span>}
                          </label>
                          <input
                            name="memberPhone"
                            value={formData.memberPhone}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('memberPhone')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="10-digit mobile"
                            disabled={isSubmitting}
                            style={inputStyle('memberPhone')}
                          />
                        </div>
                      </div>

                    </div>

                    {/* Submit Error message banner */}
                    {submitError && (
                      <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.06)',
                        border: '2px solid #ef4444',
                        padding: '0.85rem 1.25rem',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                        fontFamily: 'monospace',
                        alignItems: 'center',
                        marginTop: '0.5rem',
                      }}>
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <span>REGISTRATION FAILED: {submitError}</span>
                      </div>
                    )}

                    {/* Submit Action Button */}
                    <div style={{ marginTop: '0.5rem' }}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="neo-btn"
                        style={{
                          width: '100%',
                          padding: '1rem 2rem',
                          fontSize: '1rem',
                          background: 'var(--accent-green)',
                          color: 'var(--bg-dark)',
                          border: '3px solid var(--accent-green-primary)',
                          boxShadow: '6px 6px 0px var(--accent-green-deep)',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          opacity: isSubmitting ? 0.75 : 1,
                        }}
                      >
                        {isSubmitting ? 'TRANSMITTING SQUAD CLEARANCE DATA...' : 'AUTHORIZE SQUAD LOGS ➔'}
                      </button>
                    </div>

                  </form>
                </div>

                {/* Right Column: Portal Core Visual */}
                <div style={{ flex: '1 1 40%', width: '100%', height: isMobile ? '240px' : '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', pointerEvents: 'none' }}>
                  <PortalCoreVisual />
                </div>

              </div>
            ) : (
              // Polished Success State Ticket
              <motion.div
                key="register-success-state"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem 1rem',
                  textAlign: 'center',
                }}
              >
                <div className="live-dot" style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '2px solid var(--accent-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-green-bright)',
                  boxShadow: '0 0 25px rgba(52, 211, 153, 0.25)',
                  marginBottom: '1.25rem',
                  animation: 'pulse 2s infinite',
                }}>
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <span style={{ fontSize: '0.98rem', color: 'var(--accent-green-bright)', fontWeight: 900, letterSpacing: '0.25rem', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                  YOU'RE IN
                </span>

                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                  fontWeight: 900,
                  lineHeight: '1.1',
                  color: '#ffffff',
                  marginTop: '0.5rem',
                  marginBottom: '1rem',
                  textTransform: 'uppercase',
                }}>
                  REGISTRATION COMPLETE
                </h2>

                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 2rem auto', lineHeight: '1.5' }}>
                  Welcome Explorer! Your vibe-coding squadron **{successData.teamName}** has authorized entry logs to the official database.
                </p>

                {/* Authorization Pass Ticket Layout */}
                <div style={{
                  border: '2px dashed var(--accent-green-primary)',
                  background: 'rgba(16, 185, 129, 0.03)',
                  padding: '1.75rem 2.25rem',
                  borderRadius: '16px',
                  maxWidth: '420px',
                  width: '100%',
                  position: 'relative',
                  marginBottom: '2.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  textAlign: 'left',
                }}>
                  <span style={{ position: 'absolute', top: '8px', left: '16px', fontSize: '0.58rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    SECURE_ENTRY_CLEARANCE
                  </span>
                  
                  <div style={{ marginTop: '0.75rem', borderBottom: '1px solid var(--border-green)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Squad ID</span>
                    <h3 style={{ fontSize: '2.2rem', fontFamily: 'monospace', fontWeight: 900, color: 'var(--accent-green)', letterSpacing: '0.04em', margin: '0.1rem 0 0 0' }}>
                      {successData.id}
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem', fontSize: '0.7rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>TEAM SQUAD</span>
                      <strong style={{ color: '#ffffff', fontSize: '0.8rem' }}>{successData.teamName}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>CONTACT EMAIL</span>
                      <strong style={{ color: '#ffffff', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                        {successData.emailAddress}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>LEADER (M1)</span>
                      <strong style={{ color: '#ffffff', fontSize: '0.8rem' }}>{successData.leaderName}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>COMPANION (M2)</span>
                      <strong style={{ color: '#ffffff', fontSize: '0.8rem' }}>{successData.memberName}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-green)', marginTop: '1rem', paddingTop: '0.75rem', fontSize: '0.58rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    <span>GRID: SECTOR_TCET_COMP</span>
                    <span>TS: {new Date(successData.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                  {/* WhatsApp CTA Action */}
                  <a
                    href={REGISTRATION_CONFIG.whatsappGroupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-btn"
                    style={{
                      width: '100%',
                      padding: '1rem 2rem',
                      fontSize: '1rem',
                      background: 'var(--accent-green)',
                      color: 'var(--bg-dark)',
                      border: '3px solid var(--accent-green-primary)',
                      boxShadow: '6px 6px 0px var(--accent-green-deep)',
                      textDecoration: 'none',
                      fontWeight: 800,
                      textAlign: 'center',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    💬 JOIN OFFICIAL WHATSAPP GROUP
                  </a>

                  {/* Secondary Skip / Reset Options */}
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }}>
                    <button
                      onClick={resetForm}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      [ Register Another Team ]
                    </button>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>|</span>
                    <a
                      href="#home"
                      style={{
                        color: 'var(--accent-green-bright)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      Continue to Website ➔
                    </a>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
