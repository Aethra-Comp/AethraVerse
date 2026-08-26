import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { eventData } from '../data/eventData';

// Extract metrics dynamically from single source of truth eventData.ts
const teamSizeNum = parseInt(eventData.teamSize) || 2;
const registrationLimitNum = parseInt(eventData.registrationLimit.replace(/\D/g, '')) || 30;
const dateNum = parseInt(eventData.date.match(/\d+/)?.[0] || '4');
const dateSuffix = eventData.date.match(/\d+([a-zA-Z]+)/)?.[1] || 'th';
const dateLabel = eventData.date.replace(/^\d+[a-zA-Z]*\s*/, '').toUpperCase() || 'SEPTEMBER 2026';

const STATS = [
  { num: teamSizeNum, suffix: '', label: 'MEMBERS PER TEAM', color: 'var(--accent-green)' },
  { num: registrationLimitNum, suffix: '', label: 'TEAMS MAXIMUM', color: 'var(--accent-green-bright)' },
  { num: 3, suffix: '', label: 'HOURS OF CHALLENGE', color: 'var(--accent-green-primary)' },
  { num: dateNum, suffix: dateSuffix, label: dateLabel, color: 'var(--accent-green-bright)', sublabel: 'TCET CAMPUS' },
];

function useCountUp(target: number, duration = 1800, trigger: boolean) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);

  return val;
}

interface StatCardProps {
  stat: typeof STATS[0];
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const count = useCountUp(stat.num, 1600, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.85, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ type: 'spring' as const, stiffness: 120, damping: 14, delay: index * 0.1 }}
      whileHover={{
        y: -6,
        boxShadow: `12px 14px 0px var(--accent-green-deep)`,
        transition: { duration: 0.2 },
      }}
      className="neo-card"
      style={{
        backgroundColor: 'var(--bg-surface-2)',
        color: 'var(--text-light)',
        border: `3px solid var(--accent-green-primary)`,
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 3vw, 2.5rem) 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        minHeight: 'clamp(200px, 25vw, 260px)',
        boxShadow: `8px 8px 0px var(--accent-green-deep)`,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Top glow accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
      }} />

      {/* Massive Count-up Number */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
        fontWeight: 900,
        lineHeight: '0.85',
        color: stat.color,
        letterSpacing: '-0.06em',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '0.1em',
      }}>
        {count}
        {stat.suffix && (
          <span style={{ fontSize: '0.45em', fontWeight: 700, color: stat.color, opacity: 0.8, marginBottom: '0.3em' }}>
            {stat.suffix}
          </span>
        )}
      </div>

      {/* Stat Labels */}
      <div>
        <h4 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          fontWeight: 800,
          letterSpacing: '0.05em',
          lineHeight: '1.2',
          color: '#ffffff',
        }}>
          {stat.label}
        </h4>
        {stat.sublabel && (
          <p style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--accent-green-bright)',
            marginTop: '0.3rem',
            letterSpacing: '0.08em',
            opacity: 0.85,
          }}>
            {stat.sublabel}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export const Stats: React.FC = () => {
  return (
    <section id="stats" style={{ backgroundColor: '#030504', position: 'relative' }}>
      {/* Decorative backdrop blobs */}
      <div
        className="glow-blob animate-float-delay-1"
        style={{ width: '350px', height: '350px', background: 'var(--accent-green-deep)', bottom: '-10%', left: '10%', opacity: 0.15 }}
      />
      <div
        className="glow-blob animate-float"
        style={{ width: '250px', height: '250px', background: 'rgba(16, 185, 129, 0.08)', top: '10%', right: '5%', opacity: 0.2 }}
      />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag" style={{ color: 'var(--accent-green-bright)' }}>04 / BY THE NUMBERS</span>
          <h2 className="section-title" style={{ color: '#ffffff' }}>EVENT METRICS</h2>
        </motion.div>

        {/* Dynamic retro statistics grid */}
        <div className="stats-grid">
          {STATS.map((stat, idx) => (
            <StatCard key={idx} stat={stat} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
