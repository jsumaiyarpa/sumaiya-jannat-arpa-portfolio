import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { site } from './data/site.js';
import { categories, projects } from './data/projects.js';
import { skillCategories } from './data/skills.js';
import { githubConfig, languageColors, formatRelativeDate, fetchAdditionalRepos } from './data/github.js';
import { faqData } from './data/faq.js';

export function usePageTitle(t) {
  useEffect(() => {
    document.title = t ? `${t} — ${site.name}` : `${site.name} — Portfolio`;
  }, [t]);
}

// -------------------------------------------------------------
// THEME TOGGLE COMPONENT
// Supports Light mode (default) and Art-directed Dark mode.
// Persists in localStorage and prevents flash of unstyled theme.
// -------------------------------------------------------------
export function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || document.documentElement.getAttribute('data-theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      const metaThemeColor = document.getElementById('theme-color-meta');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'light' ? '#F4F6FA' : '#080A0F');
      }
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDark ? (
          // Sun Icon (Switch to Light)
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          // Moon Icon (Switch to Dark)
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </span>
      <span className="theme-toggle-label">{isDark ? 'LIGHT' : 'DARK'}</span>
    </button>
  );
}

// -------------------------------------------------------------
// ARCHITECTURAL PLACEHOLDER GENERATOR
// Dual-theme vector schematics for software, UI/UX, SQA, and graphics
// -------------------------------------------------------------
export function ArchitecturalPlaceholder({ category = 'software', label = '', ratio = '16/10', role = 'figure' }) {
  switch (category) {
    case 'software':
      return (
        <div className="arch-ph arch-ph-software" style={{ aspectRatio: ratio }} role={role} aria-label={`${label} (Architecture Specimen)`}>
          <div className="ph-grid-bg" />
          <div className="ph-header">
            <span className="ph-tag">SWE // ARCHITECTURE</span>
            <span className="ph-badge">VITE + REACT</span>
          </div>
          <div className="ph-body">
            <div className="ph-code-tree">
              <div className="ph-line ph-highlight">&lt;AppProvider router=&#123;appRoutes&#125;&gt;</div>
              <div className="ph-line pl-1">&lt;Layout theme=&quot;dynamic&quot;&gt;</div>
              <div className="ph-line pl-2">&lt;ComponentTree data=&#123;state&#125; /&gt;</div>
              <div className="ph-line pl-2 ph-accent">&lt;APIClient contract=&quot;REST_V1&quot; /&gt;</div>
              <div className="ph-line pl-1">&lt;/Layout&gt;</div>
              <div className="ph-line">&lt;/AppProvider&gt;</div>
            </div>
            <div className="ph-metric-strip">
              <span className="ph-metric"><span>STACK:</span> REACT / NODE / TS</span>
              <span className="ph-metric"><span>STATE:</span> STABLE</span>
            </div>
          </div>
          <div className="ph-footer">
            <span className="ph-label">{label || 'Software Engineering Architecture'}</span>
            <span className="ph-coord">EWU // SWE.01</span>
          </div>
        </div>
      );

    case 'uiux':
      return (
        <div className="arch-ph arch-ph-uiux" style={{ aspectRatio: ratio }} role={role} aria-label={`${label} (UI/UX Specimen)`}>
          <div className="ph-grid-dots" />
          <div className="ph-header">
            <span className="ph-tag">OSTAD // UI/UX CAREER TRACK</span>
            <span className="ph-badge">FIGMA DESIGN SYSTEM</span>
          </div>
          <div className="ph-body ph-body-uiux">
            <div className="ph-wireframe-frame">
              <div className="ph-wf-nav" />
              <div className="ph-wf-hero" />
              <div className="ph-wf-row">
                <div className="ph-wf-card" />
                <div className="ph-wf-card" />
              </div>
            </div>
            <div className="ph-bezier-spec">
              <svg viewBox="0 0 120 60" className="ph-bezier-curve" aria-hidden="true">
                <path d="M 10 50 C 40 10, 80 10, 110 50" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="50" r="3" fill="#8EA9D4" />
                <circle cx="40" cy="10" r="2.5" fill="currentColor" />
                <circle cx="80" cy="10" r="2.5" fill="currentColor" />
                <circle cx="110" cy="50" r="3" fill="#8EA9D4" />
              </svg>
              <span className="ph-spec-note">RESEARCH &amp; PERSONAS</span>
            </div>
          </div>
          <div className="ph-footer">
            <span className="ph-label">{label || 'UI/UX Research & Prototype'}</span>
            <span className="ph-coord">FIGMA // HCI.02</span>
          </div>
        </div>
      );

    case 'sqa':
      return (
        <div className="arch-ph arch-ph-sqa" style={{ aspectRatio: ratio }} role={role} aria-label={`${label} (SQA Test Matrix)`}>
          <div className="ph-grid-bg" />
          <div className="ph-header">
            <span className="ph-tag">OSTAD // SQA AUTOMATION</span>
            <span className="ph-badge ph-badge-sage">POSTMAN + SELENIUM</span>
          </div>
          <div className="ph-body">
            <div className="ph-test-list">
              <div className="ph-test-row"><span className="ph-dot-pass" /> ✓ API: POST /auth boundary token validation</div>
              <div className="ph-test-row"><span className="ph-dot-pass" /> ✓ NEWMAN: Automated CLI test collection execution</div>
              <div className="ph-test-row"><span className="ph-dot-pass" /> ✓ SELENIUM: Cross-browser UI regression verification</div>
              <div className="ph-test-row"><span className="ph-dot-pass" /> ✓ REPORTING: HTML test metrics &amp; defect triage</div>
            </div>
          </div>
          <div className="ph-footer">
            <span className="ph-label">{label || 'Software Quality Assurance Matrix'}</span>
            <span className="ph-coord">QA // TEST.03</span>
          </div>
        </div>
      );

    case 'graphic':
      return (
        <div className="arch-ph arch-ph-graphic" style={{ aspectRatio: ratio }} role={role} aria-label={`${label} (Poster Specimen)`}>
          <div className="ph-poster-grid">
            <div className="ph-crop-tl" />
            <div className="ph-crop-tr" />
            <div className="ph-crop-bl" />
            <div className="ph-crop-br" />
          </div>
          <div className="ph-header">
            <span className="ph-tag">EWUECC // CANVA PRO</span>
            <span className="ph-badge">CAMPUS PRINT &amp; DIGITAL</span>
          </div>
          <div className="ph-body ph-body-graphic">
            <div className="ph-graphic-title">POSTER // ART</div>
            <div className="ph-graphic-bars">
              <div className="ph-bar-thick" />
              <div className="ph-bar-thin" />
            </div>
            <div className="ph-graphic-annotation">TYPOGRAPHIC BALANCE &amp; BILINGUAL HIERARCHY</div>
          </div>
          <div className="ph-footer">
            <span className="ph-label">{label || 'Campus Event Poster & Graphic'}</span>
            <span className="ph-coord">CANVA // VIS.04</span>
          </div>
        </div>
      );

    case 'portrait':
      return (
        <div className="arch-ph arch-ph-portrait" style={{ aspectRatio: ratio }} role={role} aria-label="Portrait Placeholder Frame">
          <div className="ph-portrait-frame">
            <div className="ph-crosshair ph-ch-tl">+</div>
            <div className="ph-crosshair ph-ch-tr">+</div>
            <div className="ph-crosshair ph-ch-bl">+</div>
            <div className="ph-crosshair ph-ch-br">+</div>
            <div className="ph-portrait-monogram">SJA</div>
            <div className="ph-portrait-meta">
              <span className="ph-tag">PORTRAIT PHOTO SPEC</span>
              <p className="ph-sub">Add your photo in <code>public/images/portrait.jpg</code></p>
            </div>
          </div>
          <div className="ph-footer">
            <span className="ph-label">Sumaiya Jannat Arpa</span>
            <span className="ph-coord">EAST WEST UNIV.</span>
          </div>
        </div>
      );

    default:
      return (
        <div className="arch-ph arch-ph-generic" style={{ aspectRatio: ratio }} role={role} aria-label={`${label} (Placeholder)`}>
          <div className="ph-grid-bg" />
          <div className="ph-body ph-body-center">
            <span className="ph-tag">PROJECT SPECIMEN</span>
            <span className="ph-label-lg">{label || 'Artifact Specimen'}</span>
            <span className="ph-sub">Add real screenshot in <code>public/images/projects/</code></span>
          </div>
          <div className="ph-footer">
            <span className="ph-coord">RATIO: {ratio}</span>
          </div>
        </div>
      );
  }
}

// -------------------------------------------------------------
// HYBRID IMAGE COMPONENT
// Loads real image if src is defined, else renders category architectural vector
// -------------------------------------------------------------
export function Img({ src, alt = '', ratio = '16/10', label = '', category = 'software', className = '' }) {
  if (src && src.trim() !== '') {
    return (
      <div className={`img-wrapper ${className}`} style={{ aspectRatio: ratio }}>
        <img
          className="img"
          style={{ aspectRatio: ratio }}
          src={src}
          alt={alt || label}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={`img-wrapper ${className}`}>
      <ArchitecturalPlaceholder category={category} label={label || alt} ratio={ratio} />
    </div>
  );
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// EDITORIAL SECTION HEADER
// Clean, minimal typographic lockup with optional category label
// -------------------------------------------------------------
export function SectionHeader({ tag = '', number = '', title, subtitle = '', action = null, className = '' }) {
  const hasTop = Boolean(tag || action);
  return (
    <div className={`sec-header ${!hasTop ? 'sec-header-clean' : ''} ${className}`}>
      {hasTop && (
        <div className="sec-header-top">
          {tag && <span className="sec-tag">{tag}</span>}
          {action && <div className="sec-action-top">{action}</div>}
        </div>
      )}
      <div className="sec-header-main">
        <h2 className="sec-title">{title}</h2>
        {subtitle && <p className="sec-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// HERO PORTRAIT COMPONENT
// Refined, softly rounded portrait frame with subtle glass border,
// faint navy-blue ambient glow, and an asset-ready image loader.
// Automatically renders real photo from public/images/portrait.jpg
// if available; otherwise presents an intentional, elegant dark-glass
// -------------------------------------------------------------
// 04. HERO PORTRAIT
// Pure, natural portrait with NO frame, NO border, NO stroke,
// NO outline, NO circular container, NO card background, and NO decorative box.
// Preserves the natural shape and transparency of the cutout image.
// -------------------------------------------------------------
export function HeroPortrait({ src = '/images/portrait.jpg', className = '', alt = 'Sumaiya Jannat Arpa' }) {
  return (
    <div className={`hero-natural-portrait ${className}`} aria-label="Portrait of Sumaiya Jannat Arpa">
      <img
        src={src}
        alt={alt}
        className="hero-natural-portrait-img"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

// -------------------------------------------------------------
// GLASSMORPHIC STACKED CARDS (HERO VISUAL ANCHOR)
// Layered translucent glass cards floating with controlled depth,
// interactive elevation, subtle specular sheen, and clear typography.
// -------------------------------------------------------------
const DISCIPLINES_DATA = [
  {
    num: '01',
    code: 'SWE',
    title: 'Software Engineering',
    tag: 'Full-Stack & Systems',
    desc: 'Engineering scalable web architectures with React, Node.js, Express, and structured RESTful contracts.',
    deliverables: ['PortfolioBanao Platform', 'CareShelf Web App', 'Noor-e-verse'],
    stack: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    meta: 'East West University · 100% Merit Scholar',
    badge: 'ACTIVE FOCUS',
  },
  {
    num: '02',
    code: 'UI/UX',
    title: 'UI/UX Design & Research',
    tag: 'Human-Centered Design',
    desc: 'Bridging user empathy and digital precision through surveys, iterative wireframing, and Figma design systems.',
    deliverables: ['OneCitizen Super-App (14 Services)', 'MediLink e-Health Card'],
    stack: ['Figma', 'FigJam', 'User Research', 'Design Systems'],
    meta: 'Ostad UI/UX Career Track · 50+ Survey Cohort',
    badge: 'RESEARCH-LED',
  },
  {
    num: '03',
    code: 'SQA',
    title: 'Software Quality Assurance',
    tag: 'Automated & Functional QA',
    desc: 'Validating software reliability via Postman API suites, Newman CLI pipelines, and Selenium WebDriver automation.',
    deliverables: ['Automated API Collection', 'Selenium Browser Suite', 'Defect Triage'],
    stack: ['Selenium', 'Postman', 'Newman CLI', 'Mocha'],
    meta: 'Ostad SQA Program · 100% Passing Assertions',
    badge: 'DISCIPLINED RIGOR',
  },
];

export function GlassmorphicCardStack() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveIndex(index);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % DISCIPLINES_DATA.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + DISCIPLINES_DATA.length) % DISCIPLINES_DATA.length);
    }
  };

  return (
    <div className="glass-stack-wrapper" aria-label="Core Pillars of Practice">
      {/* Sleek Minimal Tab Switcher */}
      <div className="glass-stack-switcher" role="tablist" aria-label="Select discipline card">
        {DISCIPLINES_DATA.map((item, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={item.num}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`glass-card-${idx}`}
              id={`glass-tab-${idx}`}
              className={`glass-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <span className="glass-tab-num">{item.num}</span>
              <span className="glass-tab-code">{item.code}</span>
              {isActive && <span className="glass-tab-indicator" />}
            </button>
          );
        })}
      </div>

      {/* Layered Floating Cards Stack */}
      <div className="glass-stack-stage">
        {DISCIPLINES_DATA.map((item, idx) => {
          // Calculate relative order in stack from activeIndex
          const offset = (idx - activeIndex + DISCIPLINES_DATA.length) % DISCIPLINES_DATA.length;
          const isTop = offset === 0;

          return (
            <article
              key={item.num}
              id={`glass-card-${idx}`}
              role="tabpanel"
              aria-labelledby={`glass-tab-${idx}`}
              aria-hidden={!isTop}
              tabIndex={isTop ? 0 : -1}
              className={`glass-card glass-stack-layer-${offset} ${isTop ? 'glass-card-top' : 'glass-card-behind'}`}
              onClick={() => !isTop && setActiveIndex(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              <div className="glass-sheen" aria-hidden="true" />
              
              <div className="glass-card-header">
                <div className="glass-card-lead-badge">
                  <span className="glass-status-dot" aria-hidden="true" />
                  <span className="glass-badge-text">{item.badge}</span>
                </div>
                <div className="glass-card-num-lockup">
                  <span className="glass-card-num">{item.num}</span>
                  <span className="glass-card-tag">{item.tag}</span>
                </div>
              </div>

              <div className="glass-card-body">
                <h3 className="glass-card-title">{item.title}</h3>
                <p className="glass-card-desc">{item.desc}</p>
              </div>

              <div className="glass-card-deliverables">
                <span className="glass-section-label">KEY DELIVERABLES</span>
                <ul className="glass-deliverable-list">
                  {item.deliverables.map((del, dIdx) => (
                    <li key={dIdx} className="glass-deliverable-item">
                      <span className="glass-bullet" aria-hidden="true">↗</span>
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card-footer">
                <div className="glass-stack-tags">
                  {item.stack.map((tech, tIdx) => (
                    <span key={tIdx} className="glass-tech-pill">{tech}</span>
                  ))}
                </div>
                <span className="glass-meta-line">{item.meta}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// Backwards compatibility aliases
export const HeroPlate = HeroPortrait;
export const HeroConsole = HeroPortrait;

// -------------------------------------------------------------
// 05. CONTINUOUS HORIZONTAL KEYWORD CAROUSEL / MARQUEE
// Seamless, infinite horizontal loop directly beneath the hero.
// Includes 13 verified keywords separated by subtle dots.
// Pause on hover, prefers-reduced-motion compliant.
// -------------------------------------------------------------
export function KeywordMarquee() {
  const keywords = [
    'East West University',
    'Computer Science & Engineering',
    'Software Engineering',
    'User Interface Design',
    'User Experience Design',
    'UX Research',
    'Wireframing & Prototyping',
    'Software Quality Assurance',
    'Manual Testing',
    'API Testing',
    'Frontend Development',
    'Full-Stack Development',
    'Creative Design',
  ];

  return (
    <div className="keyword-marquee-section" aria-label="Core competencies, major and academic affiliations marquee">
      <div className="keyword-marquee-track">
        {[...keywords, ...keywords, ...keywords].map((item, idx) => (
          <span key={idx} className="marquee-keyword-chip">
            <span className="marquee-keyword-dot" aria-hidden="true">•</span>
            <span className="marquee-keyword-text">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// PREMIUM PROJECT CAROUSEL
// Horizontal sliding showcase with dominant featured slide, adjacent
// peeking slides, smooth hardware-accelerated transitions, quiet glass
// arrow controls, keyboard navigation, touch/swipe, and preserved links.
// -------------------------------------------------------------
export function ProjectCarousel({ projects = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const total = projects.length;

  if (!projects || total === 0) return null;

  const goTo = (index) => {
    setCurrentIndex((index + total) % total);
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(total - 1);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }
  };

  return (
    <div
      className="project-carousel-wrapper"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Projects Carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Stage: 3D Horizontal Carousel Track */}
      <div
        className="carousel-stage"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="carousel-slides-container">
          {projects.map((proj, idx) => {
            // Compute relative position
            let offset = idx - currentIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCurrent = offset === 0;
            const isPrev = offset === -1;
            const isNext = offset === 1;
            const isVisible = isCurrent || isPrev || isNext;

            const cat = categories[proj.category] || { label: proj.category, tag: 'WORK' };

            return (
              <div
                key={proj.slug}
                className={`carousel-slide ${isCurrent ? 'slide-current' : ''} ${isPrev ? 'slide-prev' : ''} ${isNext ? 'slide-next' : ''} ${!isVisible ? 'slide-hidden' : ''}`}
                style={{
                  transform: `translateX(${offset * 105}%) scale(${isCurrent ? 1 : 0.88})`,
                  opacity: isCurrent ? 1 : (isPrev || isNext ? 0.35 : 0),
                  zIndex: isCurrent ? 10 : (isPrev || isNext ? 5 : 1),
                  pointerEvents: isCurrent ? 'auto' : (isPrev || isNext ? 'auto' : 'none'),
                }}
                onClick={() => {
                  if (isPrev) prev();
                  if (isNext) next();
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${total}: ${proj.title}`}
                aria-hidden={!isCurrent}
              >
                <div className="carousel-slide-inner">
                  {/* Media Frame */}
                  <Link
                    to={`/work/${proj.slug}`}
                    className="carousel-media-frame"
                    tabIndex={isCurrent ? 0 : -1}
                    aria-label={`Open case study: ${proj.title}`}
                  >
                    <Img
                      src={proj.cover}
                      alt={proj.coverAlt || proj.title}
                      ratio="16/10"
                      category={proj.category}
                      label={proj.title}
                      className="carousel-img"
                    />
                    <div className="carousel-media-overlay" aria-hidden="true" />
                  </Link>

                  {/* Glassmorphic Floating Caption Card */}
                  <div className="carousel-glass-caption">
                    <div className="carousel-caption-sheen" aria-hidden="true" />
                    <div className="carousel-caption-meta">
                      <span className="carousel-cat-tag">{cat.tag || cat.label}</span>
                      <span className="carousel-dot" aria-hidden="true">·</span>
                      <span className="carousel-timeline">{proj.timeline || '2024'}</span>
                      <span className="carousel-order-tag">[{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}]</span>
                    </div>

                    <h3 className="carousel-project-title">
                      <Link to={`/work/${proj.slug}`} tabIndex={isCurrent ? 0 : -1} className="carousel-title-link">
                        <span>{proj.title}</span>
                        <span className="carousel-arrow" aria-hidden="true"> ↗</span>
                      </Link>
                    </h3>

                    <p className="carousel-project-summary">{proj.summary}</p>

                    <div className="carousel-bottom-row">
                      {proj.tools && proj.tools.length > 0 && (
                        <div className="carousel-tools-cluster">
                          {proj.tools.slice(0, 3).map((tool, tIdx) => (
                            <span key={tIdx} className="carousel-tool-pill">{tool}</span>
                          ))}
                        </div>
                      )}

                      <div className="carousel-actions-cluster">
                        {proj.repo && (
                          <a
                            href={proj.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn outline carousel-btn-sm"
                            tabIndex={isCurrent ? 0 : -1}
                            aria-label={`View ${proj.title} source code on GitHub`}
                          >
                            GitHub ↗
                          </a>
                        )}
                        <Link
                          to={`/work/${proj.slug}`}
                          className="btn solid carousel-btn-sm"
                          tabIndex={isCurrent ? 0 : -1}
                        >
                          Case Study ↗
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiet, Minimal Carousel Navigation & Progress */}
      <div className="carousel-controls-bar">
        <button
          type="button"
          className="carousel-arrow-btn"
          onClick={prev}
          aria-label="Previous Project"
          title="Previous (Arrow Left)"
        >
          <span aria-hidden="true">←</span>
        </button>

        <div className="carousel-progress-group">
          <span className="carousel-counter-curr">{String(currentIndex + 1).padStart(2, '0')}</span>
          <div
            className="carousel-progress-rail"
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label="Project slide progress"
          >
            <div
              className="carousel-progress-fill"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>
          <span className="carousel-counter-total">{String(total).padStart(2, '0')}</span>
        </div>

        <button
          type="button"
          className="carousel-arrow-btn"
          onClick={next}
          aria-label="Next Project"
          title="Next (Arrow Right)"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Discreet Slide Selector Pills */}
      <div className="carousel-pills-strip" role="tablist" aria-label="Direct project jump">
        {projects.map((proj, pIdx) => {
          const isSelected = pIdx === currentIndex;
          return (
            <button
              key={proj.slug}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`carousel-pill-btn ${isSelected ? 'active' : ''}`}
              onClick={() => goTo(pIdx)}
              aria-label={`Jump to slide ${pIdx + 1}: ${proj.title}`}
            >
              <span className="pill-dash" />
              <span className="pill-label">{String(pIdx + 1).padStart(2, '0')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SKILLS SECTION COMPONENT
// Open editorial typography list without arbitrary progress bars
// -------------------------------------------------------------
export function SkillsOverview() {
  return (
    <div className="skills-editorial-grid">
      {skillCategories.map((cat) => (
        <article key={cat.id} className="skill-editorial-col">
          <div className="skill-cat-header">
            <span className="skill-cat-tag">0{cat.code} · {cat.id.toUpperCase()}</span>
            <h3 className="skill-cat-title">{cat.title}</h3>
          </div>
          <p className="skill-cat-blurb">{cat.blurb}</p>
          <ul className="skill-competency-list">
            {cat.skills.map((skill, sIdx) => (
              <li key={sIdx} className="skill-competency-item">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-desc">{skill.level}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// CURATED EDITORIAL PROJECT CARD
// Minimal, typography-first card designed for a 2-column showcase
// -------------------------------------------------------------
export function ProjectCard({ project, index = 0, variant = 'default' }) {
  const p = project;
  const cat = categories[p.category] || { label: p.category };

  return (
    <article className={`project-card ${p.layoutSpan || ''}`}>
      <Link to={`/work/${p.slug}`} className="project-media-wrap" aria-label={`View ${p.title} case study`}>
        <Img
          src={p.cover}
          alt={p.coverAlt || `${p.title} preview`}
          ratio={p.aspectRatio || '16/10'}
          category={p.category}
          label={p.title}
        />
      </Link>

      <div className="project-body">
        <div className="project-meta-row">
          <span className="project-cat">{cat.label}</span>
          <span className="project-dot" aria-hidden="true">·</span>
          <span className="project-year">{p.timeline || '2024'}</span>
        </div>

        <h3 className="project-title">
          <Link to={`/work/${p.slug}`} className="project-title-link">
            <span>{p.title}</span>
            <span className="project-arrow" aria-hidden="true"> ↗</span>
          </Link>
        </h3>

        <p className="project-summary">{p.summary}</p>

        {p.tools && p.tools.length > 0 && (
          <div className="project-tools">
            {p.tools.slice(0, 3).map((tool, i) => (
              <span key={i} className="tool-tag">{tool}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// -------------------------------------------------------------
// PROGRESSIVE EDITORIAL TIMELINE
// Supporting progressive promotions within organizations
// -------------------------------------------------------------
export function Timeline({ entries }) {
  return (
    <div className="editorial-timeline">
      {entries.map((item, idx) => (
        <article key={idx} className="timeline-org-block">
          <div className="timeline-org-col">
            <span className="timeline-counter">[{String(idx + 1).padStart(2, '0')}]</span>
            <h3 className="timeline-org-name">{item.org}</h3>
            {item.fullName && item.fullName !== item.org && (
              <p className="timeline-org-full">{item.fullName}</p>
            )}
            <div className="timeline-org-tags">
              {item.type && <span className="meta-tag">{item.type}</span>}
              {item.location && <span className="meta-tag">{item.location}</span>}
            </div>
          </div>

          <div className="timeline-roles-col">
            {item.roles && item.roles.map((role, rIdx) => (
              <div key={rIdx} className="timeline-role-entry">
                <div className="timeline-role-header">
                  <h4 className="timeline-role-title">
                    {role.title}
                    {rIdx === 0 && item.roles.length > 1 && (
                      <span className="promotion-badge">Advanced Responsibility</span>
                    )}
                  </h4>
                  <span className="timeline-role-dates">{role.dates}</span>
                </div>
                <p className="timeline-role-desc">{role.description}</p>
                {role.highlights && role.highlights.length > 0 && (
                  <ul className="timeline-highlights">
                    {role.highlights.map((hl, hIdx) => (
                      <li key={hIdx}>{hl}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// EDITORIAL SOCIALS
// Real, working links to GitHub, LinkedIn, Behance, and Email
// -------------------------------------------------------------
export function Socials() {
  return (
    <div className="editorial-socials-grid">
      {site.socials.map((s) => (
        <div key={s.id} className="social-row">
          <span className="social-label">{s.label}</span>
          <a
            href={s.url}
            className="social-link"
            {...(s.url.startsWith('mailto:') || s.url.startsWith('tel:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            aria-label={`${s.label}: ${s.handle}`}
          >
            <span>{s.handle}</span>
            <span className="link-arrow" aria-hidden="true"> ↗</span>
          </a>
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// CV DOWNLOAD BUTTON HELPER
// Consistent, accessible CV trigger
// -------------------------------------------------------------
// CV DOWNLOAD BUTTON HELPER
// Direct download from configured site.cvUrl
// -------------------------------------------------------------
export function CVButton({ className = '', variant = 'solid' }) {
  return (
    <a
      href={site.cvUrl}
      download="Sumaiya_Jannat_Arpa_Resume.pdf"
      className={`btn ${variant} ${className}`}
      aria-label="Download Curriculum Vitae (PDF)"
    >
      <span>Download CV</span>
      <span aria-hidden="true"> ↓</span>
    </a>
  );
}

// -------------------------------------------------------------
// SOCIAL ICON HELPER
// Recognizable SVG vectors for Facebook, Instagram, GitHub, LinkedIn, Behance
// -------------------------------------------------------------
export function SocialIcon({ name }) {
  switch (name) {
    case 'facebook':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case 'github':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case 'behance':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 6h6a3 3 0 0 1 0 6H3zm0 6h7a3 3 0 0 1 0 6H3zM15 7h6M15 13a3.5 3.5 0 1 0 7 0c0-2-1.5-3.5-3.5-3.5S15 11 15 13z" />
        </svg>
      );
    default:
      return null;
  }
}

// -------------------------------------------------------------
// NAV AVATAR
// Left side brand identity: small circular profile picture.
// No logo, no monogram text, no separate branding symbol.
// Clicking returns to homepage/top of page with smooth scroll.
// -------------------------------------------------------------
export function NavAvatar({ src = '/images/portrait.jpg', onClick }) {
  const [hasImg, setHasImg] = useState(false);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.onload = () => setHasImg(true);
    img.onerror = () => setHasImg(false);
  }, [src]);

  return (
    <button
      type="button"
      className="brand-avatar-btn"
      onClick={onClick}
      aria-label="Sumaiya Jannat Arpa — Return to top of page"
      title="Sumaiya Jannat Arpa — Return to top"
    >
      <div className="brand-avatar-circle">
        {hasImg ? (
          <img src={src} alt="Sumaiya Jannat Arpa" className="brand-avatar-img" />
        ) : (
          <div className="brand-avatar-fallback" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

function GitHubIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function BehanceIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7.785 14.502h-3.41v-1.748h3.364c.594 0 1.04.103 1.337.311.297.208.446.526.446.953 0 .426-.149.744-.446.952-.297.208-.743.312-1.337.312zm-.31-3.238H4.375V9.69h3.048c.531 0 .937.094 1.218.281.281.188.422.469.422.844 0 .375-.141.656-.422.844-.281.187-.687.281-1.218.281zm5.176 1.637c-.015-1.24.281-2.229.89-2.969.609-.739 1.484-1.109 2.625-1.109 1.094 0 1.943.359 2.547 1.078.604.719.906 1.693.906 2.922 0 .094 0 .219-.015.375h-5.063c.031.781.286 1.375.766 1.781.479.406 1.094.609 1.844.609.672 0 1.25-.156 1.734-.469.484-.312.828-.75 1.031-1.312l1.641.656c-.344.891-.906 1.602-1.688 2.133-.781.531-1.703.797-2.766.797-1.328 0-2.391-.422-3.188-1.266-.796-.844-1.203-1.922-1.22-3.234l-.008.007zm3.484-2.5c-.562 0-1.026.167-1.391.5-.365.333-.578.802-.641 1.406h3.984c-.031-.609-.234-1.083-.609-1.422-.375-.338-.828-.484-1.344-.484zM2.438 7.375h5.531c1.234 0 2.219.297 2.953.891.734.594 1.102 1.406 1.102 2.438 0 .688-.172 1.281-.516 1.781-.344.5-.828.875-1.453 1.125.828.25 1.453.688 1.875 1.312.422.625.633 1.375.633 2.25 0 1.156-.406 2.078-1.219 2.766-.812.688-1.891 1.031-3.234 1.031H2.438V7.375zm12.469-.938h5.344v1.312h-5.344V6.437z"/>
    </svg>
  );
}

// -------------------------------------------------------------
// CATEGORY PROJECTS MODAL
// Interactive modal to explore real projects for the selected category.
// Displays category title & description, clear return buttons,
// responsive cards with exact screenshots, titles, descriptions, and verified links.
// -------------------------------------------------------------
export function CategoryProjectModal({ categoryId, onClose }) {
  const [activeCat, setActiveCat] = useState(categoryId || 'software');

  useEffect(() => {
    if (categoryId) setActiveCat(categoryId);
  }, [categoryId]);

  const catInfo = categories[activeCat] || categories['software'];
  const catProjects = projects.filter((p) => p.category === activeCat);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="cat-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cat-modal-title"
    >
      <div className="cat-modal-glass" onClick={(e) => e.stopPropagation()}>
        {/* Top Controls Bar with Return Button & Category Navigation */}
        <div className="cat-modal-controls-bar">
          <button
            type="button"
            className="cat-modal-back-btn"
            onClick={onClose}
            aria-label="Return to category deck"
          >
            <span aria-hidden="true">←</span>
            <span>Return to Categories</span>
          </button>

          <div className="cat-modal-category-pills" role="tablist" aria-label="Switch project collection">
            {Object.values(categories).map((c) => {
              const count = projects.filter((p) => p.category === c.id).length;
              const isActive = c.id === activeCat;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`cat-modal-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveCat(c.id)}
                >
                  <span>{c.label}</span>
                  <span className="cat-modal-pill-count">{count}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="cat-modal-close"
            onClick={onClose}
            aria-label="Close project modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Header: Category title & description */}
        <div className="cat-modal-header">
          <div className="cat-modal-title-lockup">
            <span className="cat-modal-tag">{catInfo.tag || 'PROJECT ARCHIVE'}</span>
            <h2 id="cat-modal-title" className="cat-modal-title">{catInfo.label}</h2>
            <p className="cat-modal-blurb">{catInfo.blurb}</p>
          </div>
        </div>

        {/* Modal Body: Category-specific project displays */}
        <div className="cat-modal-body">
          {activeCat === 'graphic' ? (
            /* Canva Designs: 8 image-focused cards with derived readable titles */
            <div className="cat-modal-designs-grid">
              {catProjects.map((p, idx) => (
                <article key={p.slug || idx} className="cat-design-card">
                  <div className="cat-design-media" style={{ aspectRatio: p.aspectRatio || '1/1' }}>
                    <img
                      src={p.cover}
                      alt={p.title}
                      className="cat-design-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="cat-design-footer">
                    <h3 className="cat-design-title">{p.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          ) : activeCat === 'sqa' ? (
            /* SQA & Others: 2 repository cards with clickable titles & GitHub icons */
            <div className="cat-modal-sqa-grid">
              {catProjects.map((p) => (
                <article key={p.slug} className="cat-sqa-card">
                  <div className="cat-sqa-code-header">
                    <div className="cat-sqa-term-dots" aria-hidden="true">
                      <span className="term-dot red" />
                      <span className="term-dot yellow" />
                      <span className="term-dot green" />
                    </div>
                    <span className="cat-sqa-repo-tag">
                      <GitHubIcon size={14} />
                      <span>GITHUB REPOSITORY</span>
                    </span>
                  </div>

                  <div className="cat-sqa-card-content">
                    <h3 className="cat-sqa-card-title">
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cat-sqa-repo-link"
                        aria-label={`Open ${p.title} on GitHub (opens in new tab)`}
                      >
                        <GitHubIcon size={18} className="cat-sqa-git-icon" />
                        <span>{p.title}</span>
                        <span className="cat-ext-arrow" aria-hidden="true">↗</span>
                      </a>
                    </h3>

                    <p className="cat-sqa-card-desc">{p.summary}</p>

                    {p.tools && (
                      <div className="cat-project-tools">
                        {p.tools.map((t, i) => (
                          <span key={i} className="cat-tool-pill">{t}</span>
                        ))}
                      </div>
                    )}

                    <div className="cat-sqa-actions">
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn solid btn-sm cat-sqa-github-cta"
                        aria-label={`View ${p.title} repository on GitHub`}
                      >
                        <GitHubIcon size={16} />
                        <span>View Repository on GitHub</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Website Projects & UI/UX Projects */
            <div className="cat-modal-projects-grid">
              {catProjects.map((p) => (
                <article key={p.slug} className="cat-project-item">
                  <div className="cat-project-media">
                    {p.cover ? (
                      <img
                        src={p.cover}
                        alt={p.coverAlt || p.title}
                        className="cat-project-img"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <ArchitecturalPlaceholder category={p.category} label={p.title} ratio="16/10" />
                    )}
                  </div>
                  <div className="cat-project-info">
                    <h3 className="cat-project-title">{p.title}</h3>
                    <p className="cat-project-desc">{p.summary}</p>
                    {p.tools && (
                      <div className="cat-project-tools">
                        {p.tools.slice(0, 5).map((t, i) => (
                          <span key={i} className="cat-tool-pill">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="cat-project-actions">
                      {p.repo && (
                        <a
                          href={p.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn outline btn-sm cat-btn-with-icon"
                          aria-label={`View ${p.title} repository on GitHub`}
                        >
                          <GitHubIcon size={14} />
                          <span>GitHub</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      )}
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn outline btn-sm cat-btn-with-icon"
                          aria-label={`View ${p.title} external project`}
                        >
                          {p.category === 'uiux' ? <BehanceIcon size={14} /> : null}
                          <span>{p.category === 'uiux' ? 'Behance' : 'Live Demo'}</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      )}
                      <Link
                        to={`/work/${p.slug}`}
                        className="btn solid btn-sm"
                        onClick={onClose}
                        aria-label={`Read ${p.title} full case study`}
                      >
                        Case Study ↗
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="cat-modal-footer">
          <span className="cat-modal-footer-count">
            Showing {catProjects.length} {catInfo.label}
          </span>
          <button
            type="button"
            className="btn outline btn-sm cat-modal-bottom-return"
            onClick={onClose}
          >
            ← Return to Categories
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FOUR PRIMARY CATEGORY CARDS — 4-CARD LAYERED CREST / T-DECK
// Matches the user's hand-drawn crest composition:
// - Front Center Card (foreground / active)
// - Left & Right Flanking Cards (peeking symmetrically behind front card)
// - Top Crest Card (elevated top center, peeking above front & flank cards)
// Interactive 3D deck with instant category tabs and smooth slot transitions.
// Card 1: Website Projects (Personal Portfolio, PortfolioBanao, CareShelf, Noor-e-verse, AttendAi)
// Card 2: UI/UX Projects (OneCitizen, MediLink, ResumeXi, hide.me VPN, FinAlert)
// Card 3: Canva Designs (8 authentic campus posters & event banners)
// Card 4: SQA & Others (OSTAD Assessment, CS423 SOLID Query)
// -------------------------------------------------------------
export function FourCategoryCards({ onSelectCategory }) {
  const [activeId, setActiveId] = useState('software');

  const fourCategories = [
    {
      id: 'software',
      title: 'Website Projects',
      desc: 'Full-stack web applications and software systems built with React, Node.js, Express, and clean architecture.',
      previewLabel: 'Personal Portfolio Website',
      thumbnail: '/images/projects/website/arpa-portfolio.png',
      count: projects.filter((p) => p.category === 'software').length,
    },
    {
      id: 'uiux',
      title: 'UI/UX Projects',
      desc: 'Research-led digital product concepts, interactive Figma prototypes, user personas, and design systems.',
      previewLabel: 'OneCitizen, MediLink & ResumeXi',
      thumbnail: '/images/projects/uiux/onecitizen.png',
      count: projects.filter((p) => p.category === 'uiux').length,
    },
    {
      id: 'graphic',
      title: 'Canva Designs',
      desc: 'Dedicated visual designs, promotional event posters, and digital campaign collateral for campus initiatives.',
      previewLabel: 'EWUECC & Banglay IELTS Posters',
      thumbnail: '/images/projects/designs/Feb21_ECC.png',
      count: projects.filter((p) => p.category === 'graphic').length,
    },
    {
      id: 'sqa',
      title: 'SQA & Others',
      desc: 'Automated testing suites, API testing via Postman/Newman, Selenium browser regression, and defect reports.',
      previewLabel: 'OSTAD Automation & CS423 Query',
      thumbnail: '',
      count: projects.filter((p) => p.category === 'sqa').length,
    },
  ];

  const categoryOrder = ['software', 'uiux', 'graphic', 'sqa'];
  const activeIdx = categoryOrder.indexOf(activeId);

  const getSlot = (id) => {
    const currentIdx = categoryOrder.indexOf(id);
    const diff = (currentIdx - activeIdx + 4) % 4;
    if (diff === 0) return 'front';
    if (diff === 1) return 'right';
    if (diff === 2) return 'top';
    return 'left'; // diff === 3
  };

  return (
    <div className="cat-deck-wrapper" role="region" aria-label="Four Core Project Categories">
      {/* Category Navigation Pills */}
      <div className="cat-deck-tabs" role="tablist" aria-label="Project Category Selection">
        {fourCategories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`cat-deck-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveId(cat.id)}
            >
              <span>{cat.title}</span>
              <span className="cat-deck-tab-badge">{cat.count}</span>
            </button>
          );
        })}
      </div>

      {/* 4-Card Layered Crest / T-Deck Stage */}
      <div className="cat-deck-stage">
        {fourCategories.map((cat, idx) => {
          const slot = getSlot(cat.id);
          const isFront = slot === 'front';

          return (
            <article
              key={cat.id}
              className={`category-deck-card category-glass-card is-slot-${slot}`}
              onClick={() => {
                if (isFront) {
                  onSelectCategory(cat.id);
                } else {
                  setActiveId(cat.id);
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (isFront) {
                    onSelectCategory(cat.id);
                  } else {
                    setActiveId(cat.id);
                  }
                }
              }}
              aria-label={`${cat.title} (${cat.count} projects)${isFront ? ' — Active front card, click to open collection' : ' — Click to bring to front'}`}
            >
              <div className="cat-card-preview-frame">
                {cat.thumbnail ? (
                  <img
                    src={cat.thumbnail}
                    alt={`${cat.title} preview`}
                    className="cat-card-preview-img"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <ArchitecturalPlaceholder category={cat.id} label={cat.previewLabel} ratio="16/9" />
                )}
                <div className="cat-card-overlay" aria-hidden="true" />

                {!isFront && (
                  <div className="cat-deck-slot-hint" aria-hidden="true">
                    <span>Click to bring forward</span>
                  </div>
                )}
              </div>

              <div className="cat-card-content">
                <div className="cat-card-meta">
                  <span className="cat-card-num">0{idx + 1}</span>
                  <span className="cat-card-count">{cat.count} Projects</span>
                </div>
                <h3 className="cat-card-title">{cat.title}</h3>
                <p className="cat-card-desc">{cat.desc}</p>
                <div
                  className="cat-card-cta"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory(cat.id);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelectCategory(cat.id);
                    }
                  }}
                >
                  <span>Explore Collection</span>
                  <span className="cat-cta-arrow" aria-hidden="true"> ↗</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// LAYERED 3D SKILL STACK
// Distinct, overlapping 3D glass cards floating above the dark navy surface.
// -------------------------------------------------------------
// LAYERED GLASS STACK — SKILLS SECTION
// Editorial dark navy glass panels stacked with physical depth.
// Front card sits in front, fully readable; background cards peek
// out with stepped horizontal and vertical offsets.
// Single source of truth: src/data/skills.js (no serial numbers, no invented skills).
// -------------------------------------------------------------
export function SkillsCapsules() {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0]?.id || 'uiux');
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const activeGroup =
    skillCategories.find((c) => c.id === activeCategory) || skillCategories[0];
  const backgroundCategories = skillCategories.filter((c) => c.id !== activeCategory);

  return (
    <div
      className="skills-glass-stack-container"
      role="region"
      aria-label="Layered Glass Stack of Skills"
    >
      {/* Stack Navigation & View Mode Controls */}
      <div className="skills-glass-toolbar">
        <div className="skills-layer-tabs" role="tablist" aria-label="Skill Category Layers">
          {skillCategories.map((grp) => {
            const isActive = !isAllExpanded && activeCategory === grp.id;
            return (
              <button
                key={grp.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`skills-layer-${grp.id}`}
                className={`skills-layer-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveCategory(grp.id);
                  if (isAllExpanded) setIsAllExpanded(false);
                }}
              >
                <span className="skills-tab-indicator" aria-hidden="true" />
                <span className="skills-tab-label">{grp.title}</span>
                <span className="skills-tab-pill">{grp.skills.length}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="skills-stack-toggle-btn"
          onClick={() => setIsAllExpanded((prev) => !prev)}
          aria-label={isAllExpanded ? 'Switch to Layered Glass Stack view' : 'View all categories expanded'}
        >
          <span className="skills-toggle-icon" aria-hidden="true">
            {isAllExpanded ? '⊞' : '☰'}
          </span>
          <span>{isAllExpanded ? 'Layered Stack' : 'View All (4)'}</span>
        </button>
      </div>

      {/* Presentation Mode: All Expanded vs Layered Glass Stack */}
      {isAllExpanded ? (
        <div className="skills-expanded-deck">
          {skillCategories.map((grp) => (
            <article
              key={grp.id}
              id={`skills-layer-${grp.id}`}
              className="skills-glass-card skills-glass-card--standalone"
            >
              <header className="skills-glass-header">
                <div className="skills-glass-header-text">
                  <div className="skills-glass-title-row">
                    <h3 className="skills-glass-title">{grp.title}</h3>
                    <span className="skills-glass-badge">{grp.skills.length} Skills</span>
                  </div>
                  {grp.blurb && <p className="skills-glass-blurb">{grp.blurb}</p>}
                </div>
              </header>

              <div
                className="skills-glass-capsules-grid"
                role="list"
                aria-label={`${grp.title} competencies`}
              >
                {grp.skills.map((skill, sIdx) => {
                  const skillName = typeof skill === 'string' ? skill : skill.name;
                  return (
                    <span key={sIdx} className="skills-glass-capsule" role="listitem">
                      {skillName}
                    </span>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="skills-glass-stack-stage">
          {/* Partially Visible Background Glass Layers */}
          <div className="skills-background-layers-wrap" aria-hidden="true">
            {backgroundCategories.map((grp, bgIdx) => {
              const depthRank = backgroundCategories.length - bgIdx; // 3, 2, 1
              return (
                <div
                  key={grp.id}
                  className={`skills-glass-bg-layer skills-bg-depth-${depthRank}`}
                  onClick={() => setActiveCategory(grp.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Bring ${grp.title} layer to front`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveCategory(grp.id);
                    }
                  }}
                >
                  <div className="skills-bg-layer-header">
                    <span className="skills-bg-layer-title">{grp.title}</span>
                    <span className="skills-bg-layer-badge">{grp.skills.length} skills</span>
                    <span className="skills-bg-layer-action">Bring to front ↗</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Foreground Active Card: Fully Readable, Crisp, Front of Stack */}
          <article
            id={`skills-layer-${activeGroup.id}`}
            className="skills-glass-card skills-foreground-card"
            tabIndex={0}
            aria-label={`${activeGroup.title} active skill layer`}
          >
            <header className="skills-glass-header">
              <div className="skills-glass-header-text">
                <div className="skills-glass-title-row">
                  <h3 className="skills-glass-title">{activeGroup.title}</h3>
                  <span className="skills-glass-badge">
                    {activeGroup.skills.length} Verified Skills
                  </span>
                </div>
                {activeGroup.blurb && (
                  <p className="skills-glass-blurb">{activeGroup.blurb}</p>
                )}
              </div>
            </header>

            <div
              className="skills-glass-capsules-grid"
              role="list"
              aria-label={`${activeGroup.title} competencies`}
            >
              {activeGroup.skills.map((skill, sIdx) => {
                const skillName = typeof skill === 'string' ? skill : skill.name;
                return (
                  <span key={sIdx} className="skills-glass-capsule" role="listitem">
                    {skillName}
                  </span>
                );
              })}
            </div>

            <footer className="skills-card-footer">
              <span className="skills-card-footer-indicator">
                Layer {skillCategories.findIndex((c) => c.id === activeCategory) + 1} of {skillCategories.length} &bull; Click any background layer or tab to switch
              </span>
            </footer>
          </article>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// REVIEWS & TESTIMONIALS SECTION
// Functional carousel if genuine reviews exist; elegant empty state if empty
// -------------------------------------------------------------
export function getReviewImageSrc(src) {
  if (!src) return '';
  if (src.startsWith('public/')) return '/' + src.slice('public/'.length);
  if (src.startsWith('/public/')) return src.slice('/public'.length);
  return src.startsWith('/') ? src : '/' + src;
}

export function ReviewsSection({ items = [] }) {
  const [isPaused, setIsPaused] = useState(false);
  const total = items.length;

  // Single-card infinite sliding carousel state
  // Virtual index runs from 1 to total for original items, 0 for clone-last, total + 1 for clone-first
  const [virtualIndex, setVirtualIndex] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  // Active index for dots and current indicator: 0 to total - 1
  const activeIndex = total > 0 ? (virtualIndex - 1 + total) % total : 0;

  // Auto-rotation effect: 6000ms gentle interval, paused on hover/touch/focus
  useEffect(() => {
    if (isPaused || total <= 1) return;

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery && mediaQuery.matches) return;
    }

    const interval = setInterval(() => {
      setEnableTransition(true);
      setVirtualIndex((prev) => prev + 1);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, total]);

  // Handle seamless infinite looping at boundaries
  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return;

    setIsTransitioning(false);
    if (virtualIndex === total + 1) {
      // Reached the trailing clone of the first item, snap seamlessly to real first item (index 1)
      setEnableTransition(false);
      setVirtualIndex(1);
    } else if (virtualIndex === 0) {
      // Reached the leading clone of the last item, snap seamlessly to real last item (index total)
      setEnableTransition(false);
      setVirtualIndex(total);
    }
  };

  // Re-enable CSS transition after seamless snap
  useEffect(() => {
    if (!enableTransition) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
        });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [enableTransition]);

  // Navigation handlers
  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setEnableTransition(true);
    setVirtualIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setEnableTransition(true);
    setVirtualIndex((prev) => prev + 1);
  };

  const goToSlide = (targetIndex) => {
    if (isTransitioning || targetIndex === activeIndex) return;
    setIsTransitioning(true);
    setEnableTransition(true);
    setVirtualIndex(targetIndex + 1);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 40) {
      handlePrev();
    } else if (deltaX < -40) {
      handleNext();
    }
    setTouchStartX(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  if (!items || total === 0) {
    return (
      <div className="reviews-placeholder-box">
        <div className="reviews-placeholder-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h3 className="reviews-placeholder-title">Endorsements &amp; Recommendations</h3>
        <p className="reviews-placeholder-text">
          Currently gathering peer reviews and mentor testimonials from academic coursework, Ostad cohorts, and university leadership roles. Space reserved for verified feedback.
        </p>
        <span className="reviews-placeholder-status">Authentic Feedback Only · No Fabricated Endorsements</span>
      </div>
    );
  }

  // Construct extended slides array for seamless infinite looping:
  // [lastItem (clone), ...items, firstItem (clone)]
  const slides = total > 1
    ? [
        { ...items[total - 1], _isClone: true, _key: 'clone-last' },
        ...items.map((item, idx) => ({ ...item, _isClone: false, _key: `real-${idx}` })),
        { ...items[0], _isClone: true, _key: 'clone-first' },
      ]
    : items.map((item, idx) => ({ ...item, _isClone: false, _key: `single-${idx}` }));

  const renderCard = (item, slideIndex) => {
    const isClone = item._isClone;
    const reviewerName = item.author || item.name;
    const imgSrc = getReviewImageSrc(item.image);
    const isCurrent = !isClone && activeIndex === (slideIndex - 1);

    return (
      <div
        key={`${item._key}-${slideIndex}`}
        className="reviews-carousel-slide"
        role="group"
        aria-roledescription="slide"
        aria-label={isClone ? undefined : `${reviewerName} testimonial (${activeIndex + 1} of ${total})`}
        aria-hidden={isClone || !isCurrent ? 'true' : 'false'}
      >
        <article className="review-glass-card">
          <div className="review-quote-mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          <blockquote className="review-quote-text">
            {item.quote || item.testimonial}
          </blockquote>

          <div className="review-author-row">
            <div className="review-author-profile">
              {item.image && (
                <div className="review-avatar-frame">
                  <img
                    src={imgSrc}
                    data-src={item.image}
                    alt={isClone ? '' : reviewerName}
                    className="review-avatar-img"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      if (item.image && e.currentTarget.getAttribute('src') !== item.image) {
                        e.currentTarget.src = item.image;
                      }
                    }}
                  />
                </div>
              )}
              <div className="review-author-info">
                <span className="review-author-name">{reviewerName}</span>
                {item.role && (
                  <span className="review-author-role">
                    {item.role}{item.organization ? ` · ${item.organization}` : ''}
                  </span>
                )}
              </div>
            </div>
            {item.date && <span className="review-date">{item.date}</span>}
          </div>
        </article>
      </div>
    );
  };

  return (
    <div
      className={`reviews-carousel-outer reviews-marquee-wrapper ${isPaused ? 'is-paused' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Peer Endorsements and Testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="reviews-carousel-viewport reviews-marquee-viewport">
        <div
          className="reviews-carousel-track reviews-marquee-track"
          style={{
            transform: `translateX(-${virtualIndex * 100}%)`,
            transition: enableTransition
              ? 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
              : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((item, idx) => renderCard(item, idx))}
        </div>
      </div>

      {total > 1 && (
        <div className="reviews-carousel-controls" aria-label="Testimonial controls">
          <button
            type="button"
            className="reviews-nav-arrow reviews-arrow-prev"
            aria-label="Previous testimonial"
            onClick={handlePrev}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="reviews-dots" role="tablist" aria-label="Testimonial slides">
            {items.map((item, idx) => {
              const name = item.author || item.name;
              const isActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to testimonial ${idx + 1} of ${total}: ${name}`}
                  className={`reviews-dot ${isActive ? 'is-active' : ''}`}
                  onClick={() => goToSlide(idx)}
                />
              );
            })}
          </div>

          <button
            type="button"
            className="reviews-nav-arrow reviews-arrow-next"
            aria-label="Next testimonial"
            onClick={handleNext}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// GET TO KNOW SUMAIYA (FAQ ACCORDION)
// Single-open accessible accordion with smooth expand/collapse
// -------------------------------------------------------------
export function FAQSection({ items = faqData }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="faq-accordion-container">
      <div className="faq-accordion-list" role="presentation">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `faq-trigger-${index}`;
          const contentId = `faq-content-${index}`;

          return (
            <div
              key={item.id || index}
              className={`faq-accordion-item ${isOpen ? 'is-open' : ''}`}
            >
              <h3 className="faq-item-heading">
                <button
                  type="button"
                  id={buttonId}
                  className="faq-trigger-btn"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleItem(index)}
                >
                  <span className="faq-trigger-left">
                    <span className="faq-question-num">0{index + 1}.</span>
                    <span className="faq-question-text">{item.question}</span>
                  </span>
                  <span className={`faq-chevron-box ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
              </h3>

              <div
                id={contentId}
                role="region"
                aria-labelledby={buttonId}
                className={`faq-collapse-body ${isOpen ? 'is-open' : ''}`}
              >
                <div className="faq-answer-inner">
                  <p className="faq-answer-text">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// -------------------------------------------------------------
// LIVE GITHUB REPOSITORIES (ADDITIONAL / OPEN-SOURCE FEED)
// Automatically fetches public repositories via GitHub REST API.
// Safely deduplicates against manually curated portfolio projects.
// Only renders when there are additional repositories to display.
// -------------------------------------------------------------
export function AdditionalGitHubRepos({ className = '' }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadRepos() {
      try {
        setLoading(true);
        const result = await fetchAdditionalRepos(projects);
        if (isMounted) {
          setRepos(result.repos || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRepos();

    return () => {
      isMounted = false;
    };
  }, []);

  // Return nothing when loading or when no additional repositories exist
  if (loading || repos.length === 0) {
    return null;
  }

  return (
    <div className={`additional-github-section ${className}`} aria-label="Additional GitHub Repositories">
      <div className="additional-github-header">
        <div className="additional-github-title-wrap">
          <span className="sec-tag">LATEST REPOSITORIES // GITHUB</span>
          <h3 className="additional-github-title">Additional Code Repositories</h3>
          <p className="additional-github-lead">
            Public projects automatically synchronized from GitHub.
          </p>
        </div>

        <a
          href={`https://github.com/${githubConfig.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="github-profile-pill"
          aria-label={`Visit GitHub profile @${githubConfig.username}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>github.com/{githubConfig.username} ↗</span>
        </a>
      </div>

      <div className="additional-github-grid">
        {repos.map((repo) => (
          <article key={repo.id} className="github-repo-card">
            <div className="github-repo-card-top">
              <div className="github-repo-name-group">
                <svg className="github-repo-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-repo-link"
                  title={`View ${repo.name} on GitHub`}
                >
                  <span>{repo.name}</span>
                  <span className="github-repo-arrow" aria-hidden="true"> ↗</span>
                </a>
              </div>
              {repo.stargazers_count > 0 && (
                <span className="github-repo-stars" title={`${repo.stargazers_count} stars`}>
                  ★ {repo.stargazers_count}
                </span>
              )}
            </div>

            <p className="github-repo-desc">
              {repo.description || 'Public repository on GitHub.'}
            </p>

            <div className="github-repo-meta">
              {repo.language && (
                <span className="github-repo-lang">
                  <span
                    className="lang-color-dot"
                    style={{ backgroundColor: languageColors[repo.language] || '#2DD4BF' }}
                    aria-hidden="true"
                  />
                  <span>{repo.language}</span>
                </span>
              )}
              <span className="github-repo-updated">
                {formatRelativeDate(repo.updated_at)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN LAYOUT
// Minimal glassmorphic navbar with circular profile avatar brand,
// exactly 5 navigation items (About, Skills, Projects, Reviews, Contact),
// Theme Toggle, CV download, and two-column contact/socials footer.
// -------------------------------------------------------------
export function Layout({ children }) {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && navOpen) setNavOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navOpen]);

  const handleAvatarClick = (e) => {
    e.preventDefault();
    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (e, to) => {
    if (to.startsWith('#')) {
      e.preventDefault();
      setNavOpen(false);
      const targetId = to.slice(1);
      const scrollToTarget = () => {
        const el = document.getElementById(targetId);
        if (el) {
          const navOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      };

      if (pathname !== '/') {
        navigate('/' + to);
        setTimeout(scrollToTarget, 100);
      } else {
        scrollToTarget();
      }
    }
  };

  // Recognizable social links for footer
  const footerSocials = [
    { id: 'github', label: 'GitHub', url: 'https://github.com/jsumaiyarpa', unconfigured: false },
    { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/sumaiya-jannat-arpa/', unconfigured: false },
    { id: 'behance', label: 'Behance', url: 'https://www.behance.net/sumaiyarpa2', unconfigured: false },
  ];

  return (
    <div className="site-canvas">
      <a className="skip-link" href="#main-content">Skip to primary content</a>

      {/* Primary Sticky Bar — Translucent Glass Surface */}
      <header className="primary-bar">
        <div className="site-wrapper bar-inner">
          {/* Left Side: Circular Profile Picture ONLY (No text logo, no monogram) */}
          <NavAvatar src={site.portrait || '/images/portrait.jpg'} onClick={handleAvatarClick} />

          {/* Desktop Navigation: Exactly 5 items */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            {site.nav.map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="nav-link"
                onClick={(e) => handleNavClick(e, item.to)}
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Side: Working Light/Dark Theme Toggle & Mobile Trigger */}
          <div className="bar-actions-cluster">
            <ThemeToggle />

            {/* Mobile Menu Trigger */}
            <button
              className={`mobile-menu-trigger ${navOpen ? 'open' : ''}`}
              aria-expanded={navOpen}
              aria-controls="mobile-navigation"
              aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setNavOpen(!navOpen)}
            >
              <span className="burger-line line-1" />
              <span className="burger-line line-2" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        id="mobile-navigation"
        className={`mobile-drawer ${navOpen ? 'open' : ''}`}
        aria-hidden={!navOpen}
      >
        <div className="mobile-drawer-inner">
          <div className="mobile-drawer-meta">
            <span className="drawer-title">Navigation</span>
            <ThemeToggle />
          </div>

          <nav className="mobile-nav-links" aria-label="Mobile Navigation">
            {site.nav.map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="mobile-nav-link"
                onClick={(e) => handleNavClick(e, item.to)}
              >
                <span className="mob-label">{item.label}</span>
                <span className="mob-arrow">↗</span>
              </a>
            ))}
          </nav>

          <div className="mobile-drawer-footer">
            <a
              href={site.cvUrl}
              download="Sumaiya_Jannat_Arpa_Resume.pdf"
              className="btn solid w-full text-center"
              onClick={() => setNavOpen(false)}
            >
              Download CV ↓
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="main-viewport">
        {children}
      </main>

      {/* Refined Footer: Two Clear Columns on Desktop */}
      <footer id="contact" className="editorial-footer">
        <div className="site-wrapper footer-inner">
          <div className="footer-columns-grid">
            {/* Left column: Connect & Follow */}
            <div className="footer-col footer-socials-col">
              <h3 className="footer-col-title">Connect &amp; <span className="ref-about-heading-bold">Follow</span></h3>
              <span className="footer-col-eyebrow">Social Presence</span>

              <div className="footer-social-icons-cluster" role="list" aria-label="Social profiles">
                {footerSocials.map((s) => (
                  s.unconfigured ? (
                    <span
                      key={s.id}
                      className="footer-social-icon-btn disabled"
                      title={`${s.label} (Not configured)`}
                      aria-label={`${s.label} profile (currently unconfigured)`}
                    >
                      <SocialIcon name={s.id} />
                      <span className="social-icon-tooltip">{s.label}</span>
                    </span>
                  ) : (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-icon-btn"
                      title={s.label}
                      aria-label={`Visit ${s.label} profile`}
                    >
                      <SocialIcon name={s.id} />
                      <span className="social-icon-tooltip">{s.label}</span>
                    </a>
                  )
                ))}
              </div>

              <div className="footer-badge-pill">
                <span className="footer-badge-dot" aria-hidden="true" />
                <span>Open for Opportunities &amp; Collaboration</span>
              </div>
            </div>

            {/* Right column: Promo Card & Get in Touch */}
            <div className="footer-col footer-right-col">
              {/* Promotional Callout Card Matching Visual Reference */}
              <div className="footer-promo-card">
                <div className="footer-promo-text">
                  <span className="footer-promo-lead">Before you go,</span>
                  <span className="footer-promo-sub">check out these links</span>
                </div>
                <a
                  href="#projects"
                  onClick={(e) => handleNavClick(e, '#projects')}
                  className="footer-promo-btn"
                  aria-label="Explore selected work"
                >
                  <span>Explore!</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>

              <div className="footer-contact-block">
                <h3 className="footer-col-title">Get in <span className="ref-about-heading-bold">Touch</span></h3>
                <div className="footer-contact-items">
                  <div className="footer-contact-row">
                    <span className="contact-row-label">Email:</span>
                    <a href={`mailto:${site.email}`} className="footer-contact-action">
                      {site.email}
                    </a>
                  </div>
                  <div className="footer-contact-row">
                    <span className="contact-row-label">Location:</span>
                    <span className="footer-contact-text">
                      {site.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer bottom row */}
          <div className="footer-bottom-row">
            <div className="footer-copy">
              PORTFOLIO {new Date().getFullYear()}
            </div>
            <div className="footer-bottom-actions">
              <span className="footer-rights">&copy; All rights reserved.</span>
              <a
                href={site.cvUrl}
                download="Sumaiya_Jannat_Arpa_Resume.pdf"
                className="footer-cv-btn"
                aria-label="Download Curriculum Vitae (PDF)"
              >
                <span>Download CV</span>
                <span aria-hidden="true"> ↓</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
