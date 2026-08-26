import React from 'react';
import { motion } from 'framer-motion';

const rulesList = [
  'Each team must consist of exactly 2 members.',
  'Only the first 30 registered teams will be considered.',
  'Problem statements will be revealed at the start of the hackathon.',
  'Teams may use AI tools for ideation, coding, debugging, and development.',
  'All submitted work must be original. Plagiarism or direct copying will lead to disqualification.',
  'Teams must develop their solution within the given hackathon time.',
  'Each team must present a working prototype / demo to the judges.',
  'Teams must be able to explain and demonstrate their implementation, including their use of AI.',
  'Any unfair practices, inappropriate content, or misconduct may result in disqualification.',
  "Judges' decisions will be final and binding.",
];

const ACCENT_COLORS = [
  'var(--accent-green-deep)', 'var(--accent-green-primary)', 'var(--accent-green-bright)', 'var(--accent-green)',
  'var(--accent-green-deep)', 'var(--accent-green-primary)', 'var(--accent-green-bright)', 'var(--accent-green)',
  'var(--accent-green-deep)', 'var(--accent-green-primary)'
];

export const Rules: React.FC = () => {
  return (
    <section id="rules" style={{ backgroundColor: 'var(--bg-surface-1)', color: 'var(--text-light)', position: 'relative' }}>
      <div
        className="glow-blob animate-float-delay-1"
        style={{ width: '350px', height: '350px', background: 'var(--accent-green-deep)', bottom: '10%', right: '-10%', opacity: 0.1 }}
      />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag" style={{ color: 'var(--accent-green-bright)' }}>07 / THE CODEX</span>
          <h2 className="section-title" style={{ color: '#ffffff' }}>OFFICIAL RULES</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '580px', lineHeight: '1.55' }}>
            To maintain fair play and high-quality competition, all registered teams must strictly adhere to the following rules:
          </p>
        </motion.div>

        {/* Responsive Dual Column list layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '0' }}>
          {rulesList.map((rule, idx) => {
            const accentColor = ACCENT_COLORS[idx];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{
                  x: 4,
                  backgroundColor: 'rgba(16, 185, 129, 0.05)',
                  transition: { duration: 0.15 },
                }}
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start',
                  padding: '1.5rem',
                  borderBottom: '2px solid var(--border-green)',
                  cursor: 'default',
                  transition: 'background 0.2s',
                }}
              >
                {/* Rule Index badge */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: '1',
                    background: accentColor,
                    padding: '0.4rem 0.6rem',
                    border: '2px solid var(--accent-green-primary)',
                    borderRadius: '8px',
                    boxShadow: '3px 3px 0px var(--accent-green-deep)',
                    minWidth: '46px',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  {(idx + 1).toString().padStart(2, '0')}
                </motion.div>

                {/* Rule text */}
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-light)', lineHeight: '1.6' }}>
                  {rule}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom emphasis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            marginTop: '2.5rem',
            padding: '1.25rem 1.75rem',
            background: 'var(--bg-surface-2)',
            border: '3px solid var(--accent-green-primary)',
            borderRadius: '12px',
            boxShadow: '6px 6px 0px var(--accent-green-deep)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>⚖️</span>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-green-bright)', letterSpacing: '0.04em' }}>
            JUDGES' DECISIONS ARE FINAL AND BINDING. PLAY FAIR — VIBE HARD.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
