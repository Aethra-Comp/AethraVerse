import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const InteractiveOverlay: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.div
      className="hud-overlay"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <motion.div 
          variants={itemVariants} 
          style={{ 
            fontSize: '0.7rem', 
            letterSpacing: '0.25em', 
            fontWeight: 600, 
            color: 'var(--accent-cyan)',
            textShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
          }}
        >
          AETHRAVERSE // PROTO.01
        </motion.div>
        
        <motion.div 
          variants={itemVariants} 
          style={{ 
            fontSize: '0.7rem', 
            letterSpacing: '0.2em', 
            color: 'rgba(255, 255, 255, 0.4)', 
            fontFamily: 'monospace' 
          }}
        >
          SYS.SCROLL_TRIG: {scrollProgress.toFixed(0).padStart(3, '0')}%
        </motion.div>
      </div>

      {/* Dynamic Scroll Helper Cue */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto 0' }}>
        <AnimatePresence>
          {scrollProgress < 8 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: [0.3, 0.7, 0.3], scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.4em',
                color: 'var(--accent-green)',
                textTransform: 'uppercase',
                border: '1px solid rgba(0, 255, 102, 0.25)',
                padding: '0.6rem 1.2rem',
                borderRadius: '2px',
                background: 'rgba(8, 7, 15, 0.7)',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 0 15px rgba(0, 255, 102, 0.1)',
              }}
            >
              Scroll down to deform space
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Architectural Legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-end' }}>
        <motion.div variants={itemVariants} style={{ maxWidth: '380px' }}>
          <p 
            style={{ 
              fontSize: '0.62rem', 
              letterSpacing: '0.15em', 
              lineHeight: '1.8', 
              color: 'rgba(255, 255, 255, 0.45)',
              textTransform: 'uppercase'
            }}
          >
            Conceptual vector canvas. An abstract crystalline core suspended in dynamic multi-depth fields. Interactive gravity drives coordinate deformation.
          </p>
        </motion.div>
        
        <motion.div 
          variants={itemVariants} 
          style={{ 
            fontSize: '0.7rem', 
            letterSpacing: '0.25em', 
            color: 'var(--accent-magenta)', 
            fontWeight: 500,
            textShadow: '0 0 10px rgba(255, 0, 127, 0.3)'
          }}
        >
          [ DIMENSION_MATRIX ]
        </motion.div>
      </div>
    </motion.div>
  );
};
