import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'IDEATE', desc: 'Brainstorm and architect prompt structures to solve the core statement.', color: 'var(--accent-green-deep)' },
  { num: '02', title: 'DESIGN', desc: 'Configure typography hierarchies and high-contrast color styles.', color: 'var(--accent-green-primary)' },
  { num: '03', title: 'CODE', desc: 'Deploy components, coordinate state logic, and rig parameters.', color: 'var(--accent-green-bright)' },
  { num: '04', title: 'DEBUG', desc: 'Inspect logs, run compiler checks, and verify zero warnings.', color: 'var(--accent-green)' },
  { num: '05', title: 'DEVELOP', desc: 'Stitch layers, optimize asset bundling, and clean assets.', color: 'var(--accent-green-bright)' },
  { num: '06', title: 'DEMONSTRATE', desc: 'Deploy live, present structural features, and walk through code.', color: 'var(--accent-green-primary)' },
];

export const Challenge: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="challenge" style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-light)', position: 'relative' }}>
      {/* Decorative green blobs */}
      <div
        className="glow-blob animate-float-delay-1"
        style={{ width: '320px', height: '320px', background: 'var(--accent-green-deep)', top: '30%', left: '-10%', opacity: 0.1 }}
      />
      <div
        className="glow-blob animate-float"
        style={{ width: '200px', height: '200px', background: 'rgba(16, 185, 129, 0.05)', bottom: '10%', right: '5%', opacity: 0.15 }}
      />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag" style={{ color: 'var(--accent-green-bright)' }}>03 / THE PIPELINE</span>
          <h2 className="section-title" style={{ color: '#ffffff' }}>THE CREATIVE FLOW</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '580px', lineHeight: '1.55' }}>
            Work through the code cycle to build a complete product. Each stage demands strategic prompt execution and high-performance compilation.
          </p>
        </motion.div>

        {/* Timeline container */}
        <div style={{ position: 'relative' }}>
          {/* Vertical connecting line */}
          <div
            className="timeline-line"
            style={{ display: 'block', left: isMobile ? '28px' : '50%' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative' }}>
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: isMobile ? 30 : (isEven ? -60 : 60) }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'flex',
                    justifyContent: isMobile ? 'flex-start' : (isEven ? 'flex-start' : 'flex-end'),
                    width: '100%',
                    paddingLeft: isMobile ? '4.2rem' : '0',
                  }}
                >
                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    style={{
                      position: 'absolute',
                      left: isMobile ? '28px' : '50%',
                      transform: 'translateX(-50%)',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: step.color,
                      border: '3px solid var(--bg-dark)',
                      boxShadow: `0 0 0 4px ${step.color}33`,
                      zIndex: 3,
                      top: '2rem',
                    }}
                  />

                  {/* Neo-brutalist Pipeline Step Card */}
                  <motion.div
                    whileHover={{
                      y: -6,
                      rotate: isMobile ? 0 : (isEven ? -1 : 1),
                      boxShadow: `12px 12px 0px ${step.color}`,
                      transition: { duration: 0.2 },
                    }}
                    className="neo-card"
                    style={{
                      backgroundColor: 'var(--bg-surface-3)',
                      color: 'var(--text-light)',
                      width: '100%',
                      maxWidth: isMobile ? '100%' : 'min(480px, calc(50% - 2rem))',
                      border: `4px solid ${step.color}`,
                      boxShadow: '8px 8px 0px var(--accent-green-deep)',
                      display: 'flex',
                      gap: '1.25rem',
                      alignItems: 'flex-start',
                      padding: '1.5rem 1.75rem',
                      cursor: 'default',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Progress fill bar at bottom */}
                    <motion.div
                      initial={{ width: '0%' }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 + idx * 0.1, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '3px',
                        background: step.color,
                        opacity: 0.3,
                        borderRadius: '0 0 12px 12px',
                      }}
                    />

                    {/* Oversized Step Number */}
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2.2rem, 5vw, 3rem)',
                      fontWeight: 800,
                      lineHeight: '1',
                      letterSpacing: '-0.05em',
                      color: 'var(--accent-green)',
                      opacity: 0.95,
                      flexShrink: 0,
                    }}>
                      {step.num}
                    </div>

                    {/* Step Description */}
                    <div>
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.2rem, 3vw, 1.45rem)',
                        fontWeight: 800,
                        marginBottom: '0.35rem',
                        letterSpacing: '-0.02em',
                        color: 'var(--accent-green-bright)',
                      }}>
                        {step.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: '1.45', color: 'var(--text-muted)' }}>
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
