import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AI_TOOLS = [
  { name: 'ChatGPT', icon: '🤖', color: 'var(--accent-green)' },
  { name: 'Claude', icon: '✨', color: 'var(--accent-green-bright)' },
  { name: 'Cursor', icon: '⚡', color: 'var(--accent-green-primary)' },
  { name: 'Gemini', icon: '💎', color: 'var(--accent-green-bright)' },
  { name: 'Copilot', icon: '🚀', color: 'var(--accent-green)' },
];

export const About: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="about" style={{ backgroundColor: 'var(--bg-surface-1)', color: 'var(--text-light)' }}>
      {/* Dynamic green glow blobs */}
      <div
        className="glow-blob animate-float"
        style={{ width: '380px', height: '380px', background: 'var(--accent-green-deep)', top: '-10%', right: '-5%', opacity: 0.15 }}
      />
      <div
        className="glow-blob animate-float-delay-2"
        style={{ width: '280px', height: '280px', background: 'rgba(16,185,129,0.06)', bottom: '5%', left: '5%', opacity: 0.2 }}
      />

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '57% 43%', gap: '4rem', alignItems: 'center' }}>

          {/* Left Text Detail */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <span className="section-tag" style={{ color: 'var(--accent-green-bright)' }}>01 / THE MISSION</span>
            <h2 className="section-title" style={{
              color: '#ffffff',
              fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
              lineHeight: '1.1',
              marginBottom: '1.5rem',
            }}>
              WHAT IS AETHRAVERSE?
            </h2>
            <p style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.45rem)', fontWeight: 500, lineHeight: '1.65', color: 'var(--text-light)', marginBottom: '2rem' }}>
              AethraVerse is an AI-powered vibe-coding challenge where participants use AI tools to ideate, design, code, debug, develop and demonstrate an original working solution within a limited time.
            </p>

            {/* Floating AI Tool Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {AI_TOOLS.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  className={i % 3 === 0 ? 'animate-float' : i % 3 === 1 ? 'animate-float-delay-1' : 'animate-float-delay-2'}
                  whileHover={{ scale: 1.12, rotate: 3 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.9rem',
                    background: 'var(--bg-surface-2)',
                    border: `2px solid ${tool.color}`,
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    boxShadow: `0 0 12px ${tool.color}22`,
                    cursor: 'default',
                  }}
                >
                  <span>{tool.icon}</span>
                  {tool.name}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Playful Card Callout */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            whileHover={{ y: -8, boxShadow: '14px 14px 0px var(--accent-green-deep)' }}
            className="neo-card"
            style={{
              backgroundColor: 'var(--bg-surface-2)',
              border: '4px solid var(--accent-green-primary)',
              boxShadow: '10px 10px 0px var(--accent-green-deep)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Shimmer overlay */}
            <div
              className="shimmer-bg"
              style={{
                position: 'absolute', inset: 0,
                borderRadius: '16px',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-green)', marginBottom: '0.75rem' }}>
                THE AI PARADIGM
              </h3>
              <p style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text-muted)', lineHeight: '1.55' }}>
                Forget standard boilerplate coding. Vibe-coding is about prompt architecture, visual system configuration, and accelerating deployment cycles using AI agents to build full-scale solutions in hours.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.25rem' }}>
                {['LLM PROMPTING', 'GENERATIVE DEV', 'FAST BUNDLING', 'AGENT RIGGING'].map((tag, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.08, rotate: -2 }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      border: '2px solid var(--accent-green-primary)',
                      background: 'var(--bg-surface-1)',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: 'var(--accent-green-bright)',
                      cursor: 'default',
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
