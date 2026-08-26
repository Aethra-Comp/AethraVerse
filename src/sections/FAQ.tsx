import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  {
    q: 'Who can participate in AethraVerse?',
    a: 'AethraVerse is open to all students of TCET (Thakur College of Engineering and Technology). Teams must consist of exactly 2 members from any branch or year.',
  },
  {
    q: 'Do we need prior AI or coding experience?',
    a: 'No deep experience required! The whole spirit of vibe-coding is to leverage AI tools creatively. Basic familiarity with any programming language and curiosity about AI is enough to compete.',
  },
  {
    q: 'What AI tools are allowed?',
    a: 'You may use any publicly available AI tools — including but not limited to: ChatGPT, Claude, Gemini, Cursor, GitHub Copilot, v0, Bolt, and similar agents. The focus is on how you orchestrate these tools to deliver a working solution.',
  },
  {
    q: 'When is the problem statement revealed?',
    a: 'The problem statement will be revealed at the exact start of the hackathon on September 4, 2026. No pre-built templates, repos, or prior work is permitted.',
  },
  {
    q: 'How long is the hackathon?',
    a: 'Teams will have 3 hours to ideate, design, code, debug, develop, and prepare their final demo. Time management is key!',
  },
  {
    q: 'What happens after the build phase?',
    a: 'After the 3-hour build phase, each team will present their prototype to a panel of expert judges and faculty. The presentation follows a structured 3-phase format: Introduction → Model Design → Results & Demo.',
  },
  {
    q: 'Are internet access and external libraries allowed?',
    a: 'Yes, internet access is fully allowed. You may use any open-source libraries, frameworks, APIs, or pre-trained models. The key restriction is that all solution logic must be developed during the hackathon itself.',
  },
  {
    q: 'How are winners decided?',
    a: "Judges will evaluate teams on: originality of the solution, effective use of AI tools, quality of the working prototype, code architecture, and clarity of the presentation. Judges' decisions are final.",
  },
  {
    q: 'Is there a registration fee?',
    a: 'No, participation in AethraVerse is completely free for all TCET students. Simply register via the form and secure your slot before all 30 spots are filled.',
  },
  {
    q: 'What do all participants receive?',
    a: 'All registered and participating teams receive official E-certificates of participation. Additionally, special recognition certificates are awarded for Best AI Integration and Best UI/UX Design.',
  },
];

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle = (idx: number) => {
    setOpenIdx(prev => (prev === idx ? null : idx));
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section id="faq" style={{ backgroundColor: '#030504', color: 'var(--text-light)', position: 'relative' }}>
      {/* Decorative blobs */}
      <div
        className="glow-blob"
        style={{ width: '400px', height: '400px', background: 'var(--accent-green-deep)', top: '-10%', right: '-8%', opacity: 0.15 }}
      />
      <div
        className="glow-blob"
        style={{ width: '300px', height: '300px', background: 'rgba(16, 185, 129, 0.05)', bottom: '5%', left: '-8%', opacity: 0.18 }}
      />

      {/* Giant editorial background text */}
      <div
        className="text-stroke"
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '3%',
          fontSize: 'clamp(4rem, 14vw, 11rem)',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          opacity: 0.03,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}
      >
        FAQ
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag" style={{ color: 'var(--accent-green-bright)' }}>08 / QUICK ANSWERS</span>
          <h2 className="section-title" style={{ color: '#ffffff' }}>
            FREQUENTLY ASKED <br />
            <span style={{ color: 'var(--accent-green)' }}>QUESTIONS</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '580px', lineHeight: '1.55' }}>
            Everything you need to know before entering the AethraVerse. Can't find your answer? Reach out to the AI Aethra Club.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{ maxWidth: '860px' }}
        >
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="faq-item"
                style={{
                  borderBottom: '2px solid var(--border-green)',
                  background: isOpen ? 'rgba(16, 185, 129, 0.04)' : 'transparent',
                  borderRadius: isOpen ? '12px' : '0',
                  padding: isOpen ? '0 1rem' : '0',
                  marginBottom: isOpen ? '0.5rem' : '0',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {/* Question row */}
                <div
                  className="faq-question"
                  onClick={() => toggle(idx)}
                  style={{
                    padding: '1.4rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '1rem',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Number badge */}
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: isOpen ? 'var(--bg-dark)' : 'rgba(255,255,255,0.4)',
                        background: isOpen ? 'var(--accent-green)' : 'var(--bg-surface-2)',
                        border: isOpen ? '2px solid var(--accent-green)' : '2px solid var(--accent-green-primary)',
                        borderRadius: '6px',
                        padding: '0.2rem 0.5rem',
                        transition: 'all 0.3s',
                        flexShrink: 0,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                        fontWeight: 700,
                        color: isOpen ? 'var(--accent-green)' : '#ffffff',
                        lineHeight: '1.3',
                        transition: 'color 0.25s',
                      }}
                    >
                      {faq.q}
                    </p>
                  </div>

                  {/* Toggle icon */}
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      flexShrink: 0,
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isOpen ? 'var(--accent-green)' : 'var(--bg-surface-2)',
                      border: isOpen ? '2px solid var(--accent-green)' : '2px solid var(--accent-green-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      color: isOpen ? 'var(--bg-dark)' : '#ffffff',
                      transition: 'background 0.3s, border-color 0.3s, color 0.3s',
                    }}
                  >
                    +
                  </motion.div>
                </div>

                {/* Answer panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          color: 'var(--text-muted)',
                          lineHeight: '1.65',
                          paddingBottom: '1.5rem',
                          paddingLeft: isMobile ? '1.25rem' : '3.2rem',
                          borderLeft: '3px solid var(--accent-green-primary)',
                          marginLeft: '0.2rem',
                        }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ marginTop: '3.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Still have questions?
          </p>
          <a
            href="mailto:aiaethra@tcetmumbai.in"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: 'var(--accent-green-bright)',
              textDecoration: 'none',
              borderBottom: '2px solid var(--accent-green-bright)',
              paddingBottom: '2px',
              letterSpacing: '0.05em',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-green)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--accent-green)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-green-bright)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--accent-green-bright)';
            }}
          >
            CONTACT AI AETHRA CLUB →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
