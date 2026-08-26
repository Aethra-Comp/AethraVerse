import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'INTRODUCTION',
    subtitle: 'Problem & Objective',
    desc: 'Formulate the problem statement clearly. Outline the objective and explain why your approach solves the core issue.',
    color: 'var(--accent-green-deep)',
    textColor: 'var(--text-light)',
  },
  {
    num: '02',
    title: 'MODEL DESIGN',
    subtitle: 'Approach & Tools',
    desc: 'Deconstruct your algorithm framework, model prompting architectures, package dependencies, and the AI agents utilized.',
    color: 'var(--accent-green-primary)',
    textColor: 'var(--text-light)',
  },
  {
    num: '03',
    title: 'RESULTS',
    subtitle: 'Output & Demo',
    desc: 'Launch your prototype. Explain and demonstrate the implementation, explaining details of prompt outputs and structural mechanics.',
    color: 'var(--accent-green)',
    textColor: 'var(--text-light)',
  },
];

export const Presentation: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 820);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="presentation" style={{ backgroundColor: 'var(--bg-surface-3)', color: 'var(--text-light)', position: 'relative' }}>
      <div
        className="glow-blob animate-float"
        style={{ width: '320px', height: '320px', background: 'var(--accent-green-deep)', top: '10%', right: '5%', opacity: 0.12 }}
      />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag" style={{ color: 'var(--accent-green-bright)' }}>05 / THE JUDGING</span>
          <h2 className="section-title" style={{ color: '#ffffff' }}>PRESENTATION FORMAT</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '620px', lineHeight: '1.55' }}>
            Teams will present their functional prototype before a panel of expert judges and computer engineering faculty members. Pitch structure:
          </p>
        </motion.div>

        {/* Step connector line (horizontal, hidden on mobile) */}
        <div style={{ position: 'relative' }}>
          {!isMobile && (
            <div style={{
              position: 'absolute',
              top: '80px',
              left: '10%',
              right: '10%',
              height: '3px',
              background: 'linear-gradient(90deg, var(--accent-green-deep), var(--accent-green-primary), var(--accent-green))',
              zIndex: 0,
              borderRadius: '2px',
            }} />
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
              gap: 'clamp(1.25rem, 2.5vw, 2.5rem)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  rotate: isMobile ? 0 : (idx === 1 ? 0 : idx === 0 ? -1.5 : 1.5),
                  boxShadow: `14px 14px 0px ${step.color}`,
                  transition: { duration: 0.2 },
                }}
                className="neo-card"
                style={{
                  backgroundColor: 'var(--bg-surface-2)',
                  color: step.textColor,
                  border: `4px solid ${step.color}`,
                  boxShadow: '10px 10px 0px var(--accent-green-deep)',
                  padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 2vw, 2rem)',
                  minHeight: 'clamp(180px, 22vw, 230px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Animated phase indicator */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', fontWeight: 900, lineHeight: '1', opacity: 0.9, color: 'var(--accent-green)' }}>
                      {step.num}
                    </span>
                    <motion.span
                      animate={{
                        boxShadow: [
                          `0 0 0 0 ${step.color}55`,
                          `0 0 0 8px ${step.color}00`,
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '0.15rem',
                        border: `2px solid ${step.color}`,
                        padding: '0.3rem 0.6rem',
                        background: 'var(--bg-surface-1)',
                        color: 'var(--accent-green-bright)',
                        borderRadius: '6px',
                      }}
                    >
                      PHASE_0{idx + 1}
                    </motion.span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    marginBottom: '0.25rem',
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                  }}>
                    {step.title}
                  </h3>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: 600, opacity: 0.8, letterSpacing: '0.05em', marginBottom: '1.25rem', color: 'var(--accent-green-bright)' }}>
                    {step.subtitle}
                  </h5>
                </div>

                <p style={{ fontSize: '0.88rem', fontWeight: 500, lineHeight: '1.6', opacity: 0.9, color: 'var(--text-muted)' }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
