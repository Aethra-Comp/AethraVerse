import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeroMLVisual } from '../components/WebGL/MLNetwork';
import { eventData } from '../data/eventData';

// Typewriter phrases cycling through
const PHRASES = [
  'VIBE-CODING HACKATHON',
  'AI-POWERED BUILDING',
  'PROMPT ENGINEERING',
  'GENERATIVE DEVELOPMENT',
  'AGENTIC CREATION',
];

// Target time parsed dynamically from configuration
const getTargetMs = (): number => {
  const date = eventData.problemStatementReveal.date;
  const time = eventData.problemStatementReveal.time;
  const timezone = eventData.problemStatementReveal.timezone;
  
  let offset = '+05:30'; // Default Asia/Kolkata
  if (timezone === 'UTC') offset = 'Z';
  else if (timezone === 'America/New_York') offset = '-04:00';
  
  return Date.parse(`${date}T${time}${offset}`);
};

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const targetMs = getTargetMs();
    const tick = () => {
      const diff = targetMs - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        setIsLive(true);
        return;
      }
      setIsLive(false);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return { timeLeft, isLive };
}

function useTypewriter(phrases: string[], speed = 70, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(i => i + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(i => i - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx(i => (i + 1) % phrases.length);
    }

    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

  return display;
}

// 1. ISOLATED SUB-COMPONENT: Typewriter Subtitle to prevent parent re-renders
const TypewriterSubtitle: React.FC = () => {
  const typeText = useTypewriter(PHRASES);
  return (
    <h2
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
        fontWeight: 800,
        color: 'var(--accent-green)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '2rem',
        lineHeight: '1.1',
        minHeight: '2.2em',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
      }}
    >
      {typeText}
      <span
        style={{
          display: 'inline-block',
          width: '3px',
          height: '1.1em',
          background: 'var(--accent-green)',
          borderRadius: '2px',
          animation: 'blink-caret 0.8s step-end infinite',
          marginLeft: '2px',
          verticalAlign: 'middle',
        }}
      />
    </h2>
  );
};

// 2. ISOLATED SUB-COMPONENT: Countdown Timer to prevent parent re-renders
const HeroCountdown: React.FC<{ itemVariants: any }> = ({ itemVariants }) => {
  const { timeLeft: countdown, isLive } = useCountdown();
  return (
    <motion.div variants={itemVariants} style={{ marginBottom: '2.5rem' }}>
      <p style={{
        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.75rem',
      }}>
        ⏱ {isLive ? 'EVENT STATUS' : 'HACKATHON STARTS IN'}
      </p>
      {isLive ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(16, 185, 129, 0.06)',
            border: '3px solid var(--accent-green)',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            boxShadow: '4px 4px 0px var(--accent-green-deep)',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 900,
            color: 'var(--accent-green-bright)',
            letterSpacing: '0.05em',
          }}>
            🚀 HACKATHON IS LIVE!
          </span>
        </motion.div>
      ) : (
        <div className="countdown-grid">
          {[
            { val: countdown.days, label: 'DAYS' },
            { val: countdown.hours, label: 'HOURS' },
            { val: countdown.mins, label: 'MINS' },
            { val: countdown.secs, label: 'SECS' },
          ].map(({ val, label }) => (
            <motion.div
              key={label}
              className="countdown-unit"
              whileHover={{ scale: 1.06 }}
            >
              <div className="countdown-num">
                {String(val).padStart(2, '0')}
              </div>
              <span className="countdown-label">{label}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Background floating particle definitions
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 4,
  color: ['var(--accent-green)', 'var(--accent-green-bright)', 'var(--accent-green-primary)', 'rgba(57,255,136,0.3)'][i % 4],
}));

export const Hero: React.FC = () => {
  // Track responsiveness to position the 3D graph dynamically
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', backgroundColor: '#030504' }}>
      {/* Decorative atmospheric green blobs */}
      <div
        className="glow-blob animate-float"
        style={{ width: '420px', height: '420px', background: 'var(--accent-green-deep)', top: '15%', left: '-8%', opacity: 0.25 }}
      />
      <div
        className="glow-blob animate-float-delay-1"
        style={{ width: '400px', height: '400px', background: 'rgba(16, 185, 129, 0.15)', bottom: '8%', right: '3%', opacity: 0.2 }}
      />

      {/* Floating background particles */}
      {PARTICLES.map(p => (
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
            opacity: 0.45,
            pointerEvents: 'none',
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            zIndex: 2,
          }}
        />
      ))}

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <div style={{ position: 'relative', width: '100%' }}>
          
          {/* Main Hero text content */}
          <div style={{ maxWidth: isMobile ? '100%' : '620px', position: 'relative', zIndex: 10 }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              {/* Sponsoring / Club Tagline */}
              <motion.div variants={itemVariants} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <span className="neo-badge">
                  TCET / Department of Computer Engineering
                </span>
                <span className="neo-badge" style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>
                  AI AETHRA CLUB
                </span>
              </motion.div>

              {/* Massive Oversized Title */}
              <motion.h1
                variants={itemVariants}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.8rem, 8vw, 6.2rem)',
                  fontWeight: 800,
                  lineHeight: '1.05',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                  marginBottom: '0.5rem',
                  color: '#ffffff',
                }}
              >
                AETHRA<span className="text-stroke">VERSE</span>
              </motion.h1>

              {/* Isolated Subtitle Ticker */}
              <TypewriterSubtitle />

              {/* Quick Info Grid (Badges) updated for Black + Green theme */}
              <motion.div
                variants={itemVariants}
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem', width: '100%' }}
              >
                <motion.div
                  className="neo-card"
                  whileHover={{ y: -4, boxShadow: '8px 12px 0px var(--accent-green-deep)' }}
                  style={{ padding: '0.75rem 1.25rem', border: '3px solid var(--accent-green-primary)' }}
                >
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>📅 DATE</p>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--accent-green)', fontWeight: 800 }}>{eventData.date.toUpperCase()}</h4>
                </motion.div>

                <motion.div
                  className="neo-card"
                  whileHover={{ y: -4, boxShadow: '8px 12px 0px var(--accent-green-deep)' }}
                  style={{ padding: '0.75rem 1.25rem', border: '3px solid var(--accent-green-primary)' }}
                >
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>👥 TEAM SIZE</p>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--accent-green-bright)', fontWeight: 800 }}>{eventData.teamSize.toUpperCase()}</h4>
                </motion.div>

                <motion.div
                  className="neo-card"
                  whileHover={{ y: -4, boxShadow: '8px 12px 0px var(--accent-green-deep)' }}
                  style={{ padding: '0.75rem 1.25rem', border: '3px solid var(--accent-green-primary)' }}
                >
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>🔥 SLOTS</p>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--accent-green)', fontWeight: 800 }}>{eventData.registrationLimit.toUpperCase()}</h4>
                </motion.div>
              </motion.div>

              {/* Isolated Countdown Ticker */}
              <HeroCountdown itemVariants={itemVariants} />

              {/* Action buttons */}
              <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <motion.a
                  href="#register"
                  className="neo-btn"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Register Now ➔
                </motion.a>
                <motion.a
                  href="#about"
                  className="neo-btn"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ background: 'transparent', color: 'var(--accent-green)', border: '4px solid var(--accent-green-primary)', boxShadow: '6px 6px 0px var(--accent-green-deep)' }}
                  onMouseEnter={e => { 
                    (e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent-green-deep)'; 
                    (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; 
                  }}
                  onMouseLeave={e => { 
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; 
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-green)'; 
                  }}
                >
                  Learn More
                </motion.a>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: WebGL Interactive Graph */}
          {!isMobile && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '-10%',
                transform: 'translateY(-50%)',
                width: '650px',
                height: '650px',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            >
              <HeroMLVisual />
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
};
