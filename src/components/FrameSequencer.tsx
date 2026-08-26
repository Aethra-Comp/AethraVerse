import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import { eventData } from '../data/eventData';

const TOTAL_FRAMES = 30;

// Preload all frames
const frames: HTMLImageElement[] = [];
let loadedCount = 0;

function preloadFrames(onReady: () => void) {
  if (frames.length === TOTAL_FRAMES) { onReady(); return; }
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const num = String(i).padStart(3, '0');
    img.src = `/img/frame_${num}.png`;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === TOTAL_FRAMES) onReady();
    };
    frames[i - 1] = img;
  }
}

export const FrameSequencer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress to frame index (opens laptop by 50% scroll and keeps it open)
  const frameIndex = useTransform(scrollYProgress, [0, 0.5, 1], [0, TOTAL_FRAMES - 1, TOTAL_FRAMES - 1]);

  // Draw on canvas whenever frame changes
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;
    const idx = Math.round(Math.max(0, Math.min(TOTAL_FRAMES - 1, latest)));
    const img = frames[idx];
    if (!img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, w, h);
  });

  useEffect(() => {
    preloadFrames(() => {
      setLoaded(true);
      // Draw first frame immediately
      const canvas = canvasRef.current;
      if (!canvas) return;
      const img = frames[0];
      if (!img) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    });

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !loaded) return;
      const idx = Math.round(frameIndex.get());
      const img = frames[idx];
      if (!img) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loaded]);

  // Text fade: title fades in early, text info fades out as you scroll further
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.1], [30, 0]);
  const badgesOpacity = useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const loadingOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    // Outer container: controls scroll height (shortened to 120vh for quicker laptop opening)
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '120vh',
        width: '100%',
      }}
    >
      {/* Sticky inner: sticks while scrolling */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Canvas for frame sequence */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        />

        {/* Loading overlay */}
        {!loaded && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#030504',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: loadingOpacity,
              zIndex: 20,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTop: '3px solid var(--accent-green)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem',
              }} />
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', letterSpacing: '0.15em' }}>LOADING SEQUENCE...</p>
            </div>
          </motion.div>
        )}

        {/* Dark vignette overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(3,5,4,0.75) 100%)',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />

        {/* Centered Overlay Content sitting inside the laptop screen */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 clamp(1rem, 4vw, 3rem)',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {/* Badges */}
          <motion.div
            style={{ opacity: badgesOpacity, display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.25rem' }}
          >
            <span className="neo-badge" style={{ background: 'var(--bg-surface-1)', color: 'var(--accent-green-bright)', border: '2px solid var(--accent-green-primary)' }}>
              TCET / MUMBAI UNIVERSITY
            </span>
            <span className="neo-badge" style={{ background: 'var(--bg-surface-1)', color: 'var(--accent-green-bright)', border: '2px solid var(--accent-green-primary)' }}>
              AI AETHRA CLUB
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            style={{
              opacity: titleOpacity,
              y: titleY,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: '1.1',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
              color: '#ffffff',
              textShadow: '0 2px 30px rgba(0,0,0,0.9)',
            }}
          >
            WELCOME TO <span className="text-stroke">AETHRAVERSE</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            style={{
              opacity: titleOpacity,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.9rem, 2vw, 1.4rem)',
              fontWeight: 800,
              color: 'var(--accent-green-bright)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '1.5rem',
              textShadow: '0 2px 20px rgba(0,0,0,0.8)',
            }}
          >
            VIBE-CODING HACKATHON
          </motion.h2>

          {/* Info Cards */}
          <motion.div
            style={{
              opacity: badgesOpacity,
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '2rem',
              width: '100%',
              maxWidth: '650px',
            }}
          >
            {[
              { label: 'DATE', value: eventData.date.toUpperCase(), color: 'var(--accent-green)' },
              { label: 'TEAM SIZE', value: eventData.teamSize.toUpperCase(), color: 'var(--accent-green-bright)' },
              { label: 'SLOTS', value: eventData.registrationLimit.toUpperCase(), color: 'var(--accent-green-primary)' },
            ].map((item) => (
              <div
                key={item.label}
                className="neo-card"
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--bg-surface-2)',
                  border: '3px solid var(--accent-green-primary)',
                  boxShadow: '4px 4px 0px var(--accent-green-deep)',
                  minWidth: '140px',
                  flex: '1 1 auto',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{item.label}</p>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: item.color, fontWeight: 800 }}>{item.value}</h4>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div style={{ opacity: ctaOpacity, display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            <a href="#register" className="neo-btn" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>Register Now ➔</a>
            <a
              href="#about"
              className="neo-btn"
              style={{ padding: '0.8rem 2rem', fontSize: '1rem', background: 'transparent', color: 'var(--accent-green)', border: '4px solid var(--accent-green-primary)', boxShadow: '6px 6px 0px var(--accent-green-deep)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-green-deep)'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-green)'; }}
            >
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Scroll hint indicator */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: useTransform(scrollYProgress, [0, 0.12], [1, 0]),
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Scroll to reveal</p>
          <div style={{
            width: '24px',
            height: '40px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '12px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '8px',
              borderRadius: '2px',
              background: 'var(--accent-green)',
              animation: 'scrollPulse 1.5s ease-in-out infinite',
            }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
