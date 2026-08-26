import { useLenis } from './hooks/useLenis';
import { Header } from './components/Header';
import { BackgroundCanvas } from './components/WebGL/BackgroundCanvas';
import { FrameSequencer } from './components/FrameSequencer';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Unknown } from './sections/Unknown';
import { Challenge } from './sections/Challenge';
import { Stats } from './sections/Stats';
import { Presentation } from './sections/Presentation';
import { Prizes } from './sections/Prizes';
import { Rules } from './sections/Rules';
import { FAQ } from './sections/FAQ';
import { Register } from './sections/Register';
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ArrowLeft, Terminal, FileText, CheckSquare, Play } from 'lucide-react';
import { eventData } from './data/eventData';
import { problemStatementData } from './data/problemStatement';

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

const FOOTER_NAV = [
  { label: 'About', href: '#about' },
  { label: 'Challenge', href: '#challenge' },
  { label: 'Stats', href: '#stats' },
  { label: 'Presentation', href: '#presentation' },
  { label: 'Prizes', href: '#prizes' },
  { label: 'Rules', href: '#rules' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Register', href: '#register' },
];

function useShowBackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return show;
}

// Dedicated Problem Statement view component
const ProblemStatementView: React.FC<{ isUnlocked: boolean; targetMs: number }> = ({ isUnlocked, targetMs }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    window.scrollTo({ top: 0 });
    
    if (isUnlocked) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetMs - now;
      if (diff <= 0) {
        clearInterval(interval);
        window.location.reload(); // Reload to activate decrypted layout
        return;
      }
      const sec = Math.floor((diff / 1000) % 60);
      const min = Math.floor((diff / 1000 / 60) % 60);
      const hr = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const dy = Math.floor(diff / (1000 * 60 * 60 * 24));
      setTimeLeft({ days: dy, hours: hr, minutes: min, seconds: sec });
    }, 1000);

    return () => clearInterval(interval);
  }, [isUnlocked, targetMs]);

  // Locked Gate screen
  if (!isUnlocked) {
    return (
      <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '8rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="neo-card"
          style={{
            maxWidth: '580px',
            width: '100%',
            backgroundColor: 'var(--bg-surface-2)',
            border: '4px solid var(--accent-green-primary)',
            boxShadow: '10px 10px 0px var(--accent-green-deep)',
            textAlign: 'center',
            padding: '3rem 2rem',
          }}
        >
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '3px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.25)',
          }}>
            <Lock className="w-8 h-8" />
          </div>

          <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', color: '#ef4444', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            SECURE_VAULT_RESERVED // STATUS_LOCKED
          </span>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 900,
            color: '#ffffff',
            marginTop: '0.75rem',
            marginBottom: '1rem',
            lineHeight: '1.1',
          }}>
            ACCESS DENIED
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '2.5rem' }}>
            The problem statement is sealed inside the computational vault. The system decryption sequence triggers at event kickoff.
          </p>

          {/* Countdown display */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
            {[
              { label: 'D', val: timeLeft.days },
              { label: 'H', val: timeLeft.hours },
              { label: 'M', val: timeLeft.minutes },
              { label: 'S', val: timeLeft.seconds },
            ].map(item => (
              <div
                key={item.label}
                style={{
                  background: 'var(--bg-surface-1)',
                  border: '2px solid var(--border-green)',
                  borderRadius: '10px',
                  padding: '0.5rem 1rem',
                  minWidth: '55px',
                }}
              >
                <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>
                  {String(item.val).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-muted)' }}>{item.label}</div>
              </div>
            ))}
          </div>

          <a href="#home" className="neo-btn" style={{
            padding: '0.75rem 2rem',
            fontSize: '0.9rem',
            background: 'transparent',
            color: 'var(--accent-green)',
            border: '3px solid var(--accent-green-primary)',
            boxShadow: '4px 4px 0px var(--accent-green-deep)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center',
          }}>
            <ArrowLeft className="w-4 h-4" /> RETURN TO WEBSITE
          </a>
        </motion.div>
      </div>
    );
  }

  // Decrypted Problem Statement screen
  return (
    <div className="container" style={{ minHeight: '90vh', paddingTop: '8.5rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Navigation back header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <a href="#home" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--accent-green-bright)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            <ArrowLeft className="w-4 h-4" /> Back to System Terminal
          </a>
        </div>

        {/* Header Title Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-card"
          style={{
            backgroundColor: 'var(--bg-surface-2)',
            border: '4px solid var(--accent-green)',
            boxShadow: '12px 12px 0px var(--accent-green-deep)',
            padding: '2.5rem clamp(1.25rem, 3vw, 3rem)',
            marginBottom: '3rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top glow tag */}
          <div style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'rgba(57, 255, 136, 0.1)',
            border: '2px solid var(--accent-green)',
            borderRadius: '6px',
            padding: '0.35rem 0.75rem',
            color: 'var(--accent-green-bright)',
            fontFamily: 'monospace',
            fontSize: '0.68rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <Unlock className="w-3.5 h-3.5" /> DECRYPT_STATUS: CLEAR
          </div>

          <span style={{ fontSize: '0.72rem', color: 'var(--accent-green-bright)', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            OFFICIAL PROBLEM STATEMENT // SECURE_DECRYPTED_NODE
          </span>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: '1.05',
            marginTop: '0.75rem',
            marginBottom: '1rem',
            textTransform: 'uppercase',
          }}>
            {problemStatementData.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.88rem', fontFamily: 'monospace', borderTop: '1px dashed var(--border-green)', paddingTop: '1rem' }}>
            <Terminal className="w-4 h-4 text-green" />
            <span>THEME: <strong>{problemStatementData.theme}</strong></span>
          </div>
        </motion.div>

        {/* Content Breakdown Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2.5rem' }}>
          
          {/* Left Column: Description & Detailed requirements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Description card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="neo-card"
              style={{
                backgroundColor: 'var(--bg-surface-2)',
                border: '3px solid var(--accent-green-primary)',
                boxShadow: '8px 8px 0px var(--accent-green-deep)',
                padding: '2rem',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <FileText className="w-5 h-5 text-green" /> CHALLENGE BRIEF
              </h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.94rem', lineHeight: '1.6', margin: 0 }}>
                {problemStatementData.description}
              </p>
            </motion.div>

            {/* Detailed Requirements Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="neo-card"
              style={{
                backgroundColor: 'var(--bg-surface-2)',
                border: '3px solid var(--accent-green-primary)',
                boxShadow: '8px 8px 0px var(--accent-green-deep)',
                padding: '2rem',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <CheckSquare className="w-5 h-5 text-green" /> DETAILED REQUIREMENTS
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.2rem', margin: 0 }}>
                {problemStatementData.detailedRequirements.map((req, i) => (
                  <li key={i} style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                    {req}
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>

          {/* Right Column: Submission details & Guidelines */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="neo-card"
              style={{
                backgroundColor: 'var(--bg-surface-2)',
                border: '3px solid var(--accent-green)',
                boxShadow: '8px 8px 0px var(--accent-green-deep)',
                padding: '2rem',
                position: 'sticky',
                top: '6.5rem',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-green-bright)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <Play className="w-5 h-5" /> SUBMISSION STEPS
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {problemStatementData.submissionInstructions.map((ins, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.85rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(57, 255, 136, 0.1)',
                      border: '1px solid var(--accent-green)',
                      color: 'var(--accent-green-bright)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: '0.1rem',
                    }}>
                      0{i + 1}
                    </div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.88rem', lineHeight: '1.45' }}>
                      {ins}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
};

// Dynamic Scrolling Divider based on status
const MarqueeDivider: React.FC<{ isUnlocked: boolean }> = ({ isUnlocked }) => {
  const textArray = useMemo(() => {
    return isUnlocked
      ? [
          '✦ SYSTEM ONLINE', '✦ PROBLEM STATEMENT REVEALED', '✦ ACCESS GRANTED',
          '✦ HACKATHON LIVE', '✦ SECTOR OPEN', '✦ VIBE-CODING ACTIVE'
        ]
      : [
          '✦ SYSTEM LOCKED', '✦ DECRYPT KEY PENDING', '✦ VAULT LOCKED',
          '✦ SECTOR CLOSED', '✦ ONLY FIRST 30 TEAMS', '✦ 4 SEPT 2026'
        ];
  }, [isUnlocked]);

  return (
    <div style={{
      borderTop: '2px solid var(--border-green)',
      borderBottom: '2px solid var(--border-green)',
      overflow: 'hidden',
      padding: '0.75rem 0',
      background: 'rgba(16, 185, 129, 0.04)',
      position: 'relative',
      zIndex: 10,
      width: '100%',
    }}>
      <div style={{ display: 'flex', overflow: 'hidden', gap: '3rem' }}>
        <div className="marquee-track" style={{ gap: '3rem', flexShrink: 0 }}>
          {[
            ...textArray, ...textArray, ...textArray, ...textArray,
            ...textArray, ...textArray, ...textArray, ...textArray
          ].map((text, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'var(--accent-green)',
                whiteSpace: 'nowrap',
                opacity: 0.75,
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  useLenis();
  const showBackToTop = useShowBackToTop();
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const targetMs = getTargetMs();

  // Listen to hash changes for sub-view routing
  useEffect(() => {
    const handleHash = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Monitor unlock status in real-time
  useEffect(() => {
    const checkUnlock = () => {
      const active = Date.now() >= targetMs;
      setIsUnlocked(active);
    };
    checkUnlock();
    const interval = setInterval(checkUnlock, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  const isProblemRoute = currentHash === '#/problem-statement';

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* Immersive retro analog grain overlay */}
      <div className="noise-overlay" />

      {/* FIXED 3D background canvas */}
      <BackgroundCanvas />

      {/* STICKY navigation header */}
      <Header />

      {/* DOM main scrollable layout container */}
      <main style={{ position: 'relative', zIndex: 5, width: '100%' }}>
        <AnimatePresence mode="wait">
          {isProblemRoute ? (
            <motion.div
              key="problem-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProblemStatementView isUnlocked={isUnlocked} targetMs={targetMs} />
            </motion.div>
          ) : (
            <motion.div
              key="main-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FrameSequencer />
              <Hero />
              <MarqueeDivider isUnlocked={isUnlocked} />
              <About />
              <MarqueeDivider isUnlocked={isUnlocked} />
              <Unknown />
              <MarqueeDivider isUnlocked={isUnlocked} />
              <Challenge />
              <MarqueeDivider isUnlocked={isUnlocked} />
              <Stats />
              <MarqueeDivider isUnlocked={isUnlocked} />
              <Presentation />
              <MarqueeDivider isUnlocked={isUnlocked} />
              <Prizes />
              <MarqueeDivider isUnlocked={isUnlocked} />
              <Rules />
              <MarqueeDivider isUnlocked={isUnlocked} />
              <FAQ />
              <MarqueeDivider isUnlocked={isUnlocked} />
              <Register />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* =========================================
          UPGRADED FOOTER
          ========================================= */}
      <footer style={{ backgroundColor: '#030504', borderTop: '2px solid var(--border-green)', position: 'relative', zIndex: 10 }}>
        {/* Scrolling marquee ticker */}
        <div style={{
          borderBottom: '2px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
          padding: '0.75rem 0',
          background: 'rgba(57,255,136,0.04)',
        }}>
          <div style={{ display: 'flex', overflow: 'hidden', gap: '3rem' }}>
            <div className="marquee-track" style={{ gap: '3rem', flexShrink: 0 }}>
              {(() => {
                const footerItems = isUnlocked
                  ? ['✦ SYSTEM ONLINE', '✦ PROBLEM STATEMENT REVEALED', '✦ ACCESS GRANTED', '✦ HACKATHON LIVE']
                  : ['✦ SYSTEM LOCKED', '✦ VAULT LOCKED', '✦ DECRYPT KEY PENDING', '✦ ACCESS SEALED'];
                const repeatedItems = [
                  ...footerItems, ...footerItems, ...footerItems, ...footerItems,
                  ...footerItems, ...footerItems, ...footerItems, ...footerItems
                ];
                return repeatedItems.map((text, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      color: 'var(--accent-green)',
                      whiteSpace: 'nowrap',
                      opacity: 0.75,
                    }}
                  >
                    {text}
                  </span>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Footer body */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 3vw, 2rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
          }}
        >
          {/* Brand column */}
          <div>
            <a
              href="#home"
              style={{
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.6rem',
                color: '#ffffff',
                letterSpacing: '0.02em',
                display: 'inline-block',
                marginBottom: '1rem',
              }}
            >
              AETHRA<span style={{ color: 'var(--accent-green)' }}>VERSE</span>
            </a>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', maxWidth: '260px' }}>
              An AI-powered vibe-coding hackathon by the AI Aethra Club, TCET — Department of Computer Engineering.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <span style={{
                padding: '0.3rem 0.75rem',
                background: 'rgba(57,255,136,0.08)',
                border: '1px solid rgba(57,255,136,0.25)',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--accent-green)',
                letterSpacing: '0.08em',
              }}>
                TCET
              </span>
              <span style={{
                padding: '0.3rem 0.75rem',
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid var(--accent-green-primary)',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--accent-green-bright)',
                letterSpacing: '0.08em',
              }}>
                AI AETHRA CLUB
              </span>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}>
              NAVIGATION
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem' }}>
              {FOOTER_NAV.map(item => (
                <a
                  key={item.href}
                  href={isProblemRoute ? `#home` : item.href}
                  style={{
                    textDecoration: 'none',
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    transition: 'color 0.2s',
                    padding: '0.2rem 0',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-green)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'; }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Event details column */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}>
              EVENT INFO
            </h4>
            {[
              { label: 'DATE', value: eventData.date },
              { label: 'DURATION', value: '3 Hours' },
              { label: 'TEAM SIZE', value: eventData.teamSize },
              { label: 'SLOTS', value: eventData.registrationLimit },
              { label: 'PRIZE POOL', value: eventData.prizePool },
              { label: 'VENUE', value: 'TCET Campus, Mumbai' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>{label}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '1.5rem clamp(1.25rem, 3vw, 2rem)',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{
            fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>
            © 2026 AETHRAVERSE // TCET AI AETHRA CLUB // ALL RIGHTS RESERVED
          </p>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
            DEPARTMENT OF COMPUTER ENGINEERING
          </p>
        </div>
      </footer>

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && !isProblemRoute && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              zIndex: 200,
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'var(--accent-green)',
              color: 'var(--bg-dark)',
              border: '3px solid var(--accent-green-primary)',
              boxShadow: '4px 4px 0px var(--accent-green-deep)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
