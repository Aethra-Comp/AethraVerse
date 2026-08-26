import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Scroll progress hook
function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

// Active section hook via IntersectionObserver
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [ids]);

  return active;
}

const NAV_ITEMS = [
  { label: 'HOME', href: '#home', id: 'home' },
  { label: 'ABOUT', href: '#about', id: 'about' },
  { label: 'CHALLENGE', href: '#challenge', id: 'challenge' },
  { label: 'PRESENTATION', href: '#presentation', id: 'presentation' },
  { label: 'PRIZES', href: '#prizes', id: 'prizes' },
  { label: 'RULES', href: '#rules', id: 'rules' },
  { label: 'FAQ', href: '#faq', id: 'faq' },
];

export const Header: React.FC = () => {
  const scrollProgress = useScrollProgress();
  const activeSection = useActiveSection(NAV_ITEMS.map(n => n.id));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 2rem)',
          maxWidth: '1100px',
          height: '3.5rem',
          backgroundColor: 'rgba(7, 17, 12, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '2px solid var(--border-green)',
          borderRadius: '9999px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
          gap: '1rem',
        }}
      >
        {/* Brand Logo */}
        <a
          href="#home"
          style={{
            textDecoration: 'none',
            color: '#ffffff',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.15rem',
            letterSpacing: '0.05em',
            flexShrink: 0,
          }}
        >
          AETHRA
          <motion.span
            style={{ color: 'var(--accent-green)' }}
            animate={{ color: ['var(--accent-green)', 'var(--accent-cyan)', 'var(--accent-green)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            VERSE
          </motion.span>
        </a>

        {/* Nav list - hidden on mobile via CSS class */}
        <nav
          style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexShrink: 0 }}
          className="desktop-nav"
        >
          {NAV_ITEMS.map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={idx}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  color: isActive ? 'var(--accent-green)' : '#ffffff',
                  fontSize: '0.76rem',
                  fontWeight: isActive ? 700 : 600,
                  letterSpacing: '0.06em',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  paddingBottom: '2px',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-green)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
              >
                {item.label}
                {/* Active underline */}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      left: 0,
                      right: 0,
                      height: '2px',
                      borderRadius: '2px',
                      background: 'var(--accent-green)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right side: CTA + Mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Navigation CTA Button */}
          <a
            href="#register"
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: '9999px',
              backgroundColor: 'var(--accent-green-primary)',
              color: '#ffffff',
              textDecoration: 'none',
              border: '2px solid var(--accent-green-deep)',
              boxShadow: '3px 3px 0px var(--accent-green-deep)',
              fontFamily: 'var(--font-display)',
              transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translate(-2px, -2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '5px 5px 0px var(--accent-green-deep)';
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--accent-green)';
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--bg-dark)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'none';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '3px 3px 0px var(--accent-green-deep)';
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--accent-green-primary)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
            }}
          >
            REGISTER
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle mobile menu"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              flexDirection: 'column',
              gap: '5px',
            }}
            className="mobile-hamburger"
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                animate={{
                  rotate: mobileOpen && i === 0 ? 45 : mobileOpen && i === 2 ? -45 : 0,
                  y: mobileOpen && i === 0 ? 7 : mobileOpen && i === 2 ? -7 : 0,
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }}
                style={{
                  display: 'block',
                  width: '22px',
                  height: '2px',
                  background: '#ffffff',
                  borderRadius: '2px',
                  transformOrigin: 'center',
                }}
              />
            ))}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu drawer */}
      <motion.div
        initial={false}
        animate={{ opacity: mobileOpen ? 1 : 0, y: mobileOpen ? 0 : -20, pointerEvents: mobileOpen ? 'all' : 'none' }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          top: '5.5rem',
          left: '1rem',
          right: '1rem',
          background: 'rgba(7, 17, 12, 0.97)',
          backdropFilter: 'blur(20px)',
          border: '2px solid var(--border-green)',
          borderRadius: '20px',
          zIndex: 99,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}
        className="mobile-nav-menu"
      >
        {NAV_ITEMS.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            style={{
              textDecoration: 'none',
              color: activeSection === item.id ? 'var(--accent-green)' : 'rgba(255,255,255,0.85)',
              fontSize: '1.05rem',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.08em',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: activeSection === item.id ? 'rgba(57,255,136,0.07)' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            {item.label}
          </a>
        ))}
        <a
          href="#register"
          onClick={() => setMobileOpen(false)}
          className="neo-btn"
          style={{ marginTop: '0.75rem', fontSize: '0.9rem', padding: '0.75rem', borderRadius: '12px' }}
        >
          REGISTER NOW ➔
        </a>
      </motion.div>
    </>
  );
};
