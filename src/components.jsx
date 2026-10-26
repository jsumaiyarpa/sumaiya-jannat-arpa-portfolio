import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { site } from './data/site.js';
import { categories, projects } from './data/projects.js';
import { skillCategories } from './data/skills.js';
import { githubConfig, languageColors, formatRelativeDate, fetchAdditionalRepos } from './data/github.js';

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
  return (
    <div className={`sec-header ${className}`}>
      <div className="sec-header-top">
        {tag && <span className="sec-tag">{tag}</span>}
        {action && <div className="sec-action-top">{action}</div>}
      </div>
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
// Real, working links to GitHub, LinkedIn, Behance, Email, and Phone
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

// -------------------------------------------------------------
// CATEGORY PROJECTS MODAL
// Interactive modal to explore real projects for the selected category.
// Accessible with keyboard trap, Escape dismissal, and full links.
// -------------------------------------------------------------
export function CategoryProjectModal({ categoryId, onClose }) {
  const catInfo = categories[categoryId] || { label: 'Projects', blurb: '' };
  const catProjects = projects.filter((p) => p.category === categoryId);

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
        <div className="cat-modal-header">
          <div className="cat-modal-title-lockup">
            <span className="cat-modal-tag">{catInfo.tag || 'WORK COLLECTION'}</span>
            <h3 id="cat-modal-title" className="cat-modal-title">{catInfo.label}</h3>
            <p className="cat-modal-blurb">{catInfo.blurb}</p>
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

        <div className="cat-modal-body">
          <div className="cat-modal-projects-grid">
            {catProjects.map((p) => (
              <article key={p.slug} className="cat-project-item">
                <div className="cat-project-media">
                  <Img
                    src={p.cover}
                    alt={p.coverAlt || p.title}
                    ratio="16/10"
                    category={p.category}
                    label={p.title}
                    className="cat-project-img"
                  />
                </div>
                <div className="cat-project-info">
                  <div className="cat-project-meta">
                    <span className="cat-project-timeline">{p.timeline}</span>
                    {p.status && <span className="cat-project-status">{p.status}</span>}
                  </div>
                  <h4 className="cat-project-title">{p.title}</h4>
                  <p className="cat-project-desc">{p.summary}</p>
                  {p.tools && (
                    <div className="cat-project-tools">
                      {p.tools.slice(0, 4).map((t, i) => (
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
                        className="btn outline btn-sm"
                        aria-label={`View ${p.title} code repository on GitHub`}
                      >
                        GitHub ↗
                      </a>
                    )}
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn outline btn-sm"
                        aria-label={`View ${p.title} live link`}
                      >
                        Live / Behance ↗
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
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FOUR PRIMARY CATEGORY CARDS
// Card 1: Website Projects (PortfolioBanao, CareShelf, Noor-e-verse)
// Card 2: UI/UX Projects (MediLink, OneCitizen, ResumeXi, FinAlert)
// Card 3: Canva Designs (EWUECC Posters, Stage Backdrops)
// Card 4: Software Quality Assurance (OSTAD Assessment, Selenium CSE430)
// -------------------------------------------------------------
export function FourCategoryCards({ onSelectCategory }) {
  const fourCategories = [
    {
      id: 'software',
      title: 'Website Projects',
      desc: 'Full-stack web applications and software systems built with React, Node.js, Express, and clean architecture.',
      previewLabel: 'PortfolioBanao Platform',
      thumbnail: '/images/projects/website/portfoliobanao.png',
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
      title: 'Software Quality Assurance',
      desc: 'Automated testing suites, API testing via Postman/Newman, Selenium browser regression, and defect reports.',
      previewLabel: 'OSTAD Automation & CSE430 Suite',
      thumbnail: '',
      count: projects.filter((p) => p.category === 'sqa').length,
    },
  ];

  return (
    <div className="four-categories-grid" role="region" aria-label="Four Project Categories">
      {fourCategories.map((cat, idx) => (
        <article
          key={cat.id}
          className="category-glass-card"
          onClick={() => onSelectCategory(cat.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectCategory(cat.id);
            }
          }}
          aria-label={`Open ${cat.title} collection (${cat.count} projects)`}
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
          </div>

          <div className="cat-card-content">
            <div className="cat-card-meta">
              <span className="cat-card-num">0{idx + 1}</span>
              <span className="cat-card-count">{cat.count} Projects</span>
            </div>
            <h3 className="cat-card-title">{cat.title}</h3>
            <p className="cat-card-desc">{cat.desc}</p>
            <div className="cat-card-cta">
              <span>Explore Collection</span>
              <span className="cat-cta-arrow" aria-hidden="true"> ↗</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// LAYERED 3D SKILL STACK
// Distinct, overlapping 3D glass cards floating above the dark navy surface.
// UI/UX Design, Development, SQA, Tools & Design Platforms.
// Single source of truth: src/data/skills.js (no serial numbers, no invented skills).
// -------------------------------------------------------------
export function SkillsCapsules() {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (catId) => {
    setExpandedCategory((prev) => (prev === catId ? null : catId));
  };

  return (
    <div
      className="skills-capsules-container skills-3d-stack-stage"
      role="region"
      aria-label="Layered 3D Skill Stack"
    >
      <div className="skills-stack-toolbar" aria-hidden="true">
        <div className="skills-stack-status">
          <span className="skills-stack-dot" />
          <span className="skills-stack-status-label">Layered 3D Dimensional Stack</span>
          <span className="skills-stack-divider">&bull;</span>
          <span className="skills-stack-sublabel">4 Core Competency Domains</span>
        </div>
        <button
          type="button"
          className="skills-stack-view-toggle"
          onClick={() => setExpandedCategory((prev) => (prev === 'all' ? null : 'all'))}
          aria-label={expandedCategory === 'all' ? 'Return to layered 3D stack view' : 'Expand all skill categories'}
        >
          <span className="skills-view-icon" aria-hidden="true">
            {expandedCategory === 'all' ? '✕' : '⊞'}
          </span>
          <span>{expandedCategory === 'all' ? 'Stack View' : 'Expand All'}</span>
        </button>
      </div>

      <div className="skills-3d-cards-deck">
        {skillCategories.map((grp, gIdx) => {
          const isExpanded = expandedCategory === 'all' || expandedCategory === grp.id;
          const previewCount = grp.id === 'development' ? 6 : 5;
          const visibleSkills = isExpanded ? grp.skills : grp.skills.slice(0, previewCount);
          const hiddenCount = Math.max(0, grp.skills.length - previewCount);
          const layerClass = `stack-layer-${gIdx + 1}`;

          return (
            <article
              key={grp.id || gIdx}
              id={`skill-card-${grp.id}`}
              className={`skills-category-block ${layerClass} ${isExpanded ? 'is-expanded' : ''}`}
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-controls={`skills-capsules-${grp.id}`}
              onClick={(e) => {
                // Ignore if clicked on a button or capsule link
                if (e.target.closest('button')) return;
                toggleCategory(grp.id);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (e.target.tagName !== 'BUTTON') {
                    e.preventDefault();
                    toggleCategory(grp.id);
                  }
                }
              }}
            >
              <div className="skills-card-sheen" aria-hidden="true" />

              <header className="skills-group-header">
                <div className="skills-header-main">
                  <div className="skills-title-row">
                    <h3 className="skills-group-title">{grp.title}</h3>
                    <span className="skills-count-pill" title={`${grp.skills.length} verified competencies`}>
                      {grp.skills.length} Skills
                    </span>
                  </div>
                  {grp.blurb && <p className="skills-group-blurb">{grp.blurb}</p>}
                </div>

                <button
                  type="button"
                  className="skills-expand-trigger"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(grp.id);
                  }}
                  aria-label={isExpanded ? `Show preview for ${grp.title}` : `Explore all ${grp.skills.length} skills in ${grp.title}`}
                >
                  <span className="skills-trigger-text">
                    {isExpanded ? 'Show preview' : `Explore all ${grp.skills.length}`}
                  </span>
                  <span className="skills-trigger-arrow" aria-hidden="true">
                    {isExpanded ? '✕' : '↗'}
                  </span>
                </button>
              </header>

              <div
                id={`skills-capsules-${grp.id}`}
                className="skills-capsules-wrap"
                role="list"
                aria-label={`${grp.title} competencies`}
              >
                {visibleSkills.map((skill, sIdx) => {
                  const skillName = typeof skill === 'string' ? skill : skill.name;
                  return (
                    <span
                      key={sIdx}
                      className="skill-capsule"
                      role="listitem"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {skillName}
                    </span>
                  );
                })}

                {!isExpanded && hiddenCount > 0 && (
                  <span
                    className="skill-capsule skill-capsule-more"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(grp.id);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Expand ${hiddenCount} more skills in ${grp.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCategory(grp.id);
                      }
                    }}
                  >
                    +{hiddenCount} more ↗
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// REVIEWS & TESTIMONIALS SECTION
// Functional carousel if genuine reviews exist; elegant empty state if empty
// -------------------------------------------------------------
export function ReviewsSection({ items = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const total = items.length;

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

  const next = () => setCurrentIndex((prev) => (prev + 1) % total);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + total) % total);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };

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
    if (distance > 50) next();
    else if (distance < -50) prev();
  };

  const current = items[currentIndex];

  return (
    <div
      className="reviews-carousel-wrapper"
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <article className="review-glass-card" aria-roledescription="slide" aria-label={`Review ${currentIndex + 1} of ${total}`}>
        <div className="review-quote-mark" aria-hidden="true">“</div>
        <blockquote className="review-quote-text">
          {current.quote}
        </blockquote>
        <div className="review-author-row">
          <div className="review-author-info">
            <span className="review-author-name">{current.author}</span>
            {current.role && (
              <span className="review-author-role">
                {current.role}{current.organization ? ` · ${current.organization}` : ''}
              </span>
            )}
          </div>
          {current.date && <span className="review-date">{current.date}</span>}
        </div>
      </article>

      <div className="reviews-controls-bar">
        <button
          type="button"
          className="carousel-arrow-btn"
          onClick={prev}
          aria-label="Previous Review"
        >
          <span aria-hidden="true">←</span>
        </button>
        <div className="reviews-progress-dots" role="tablist" aria-label="Review selector">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              className={`review-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to review ${idx + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          className="carousel-arrow-btn"
          onClick={next}
          aria-label="Next Review"
        >
          <span aria-hidden="true">→</span>
        </button>
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
    { id: 'facebook', label: 'Facebook', url: '', unconfigured: true },
    { id: 'instagram', label: 'Instagram', url: '', unconfigured: true },
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
              <h3 className="footer-col-title">Connect &amp; Follow</h3>
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
                <h3 className="footer-col-title">Get in Touch</h3>
                <div className="footer-contact-items">
                  <div className="footer-contact-row">
                    <span className="contact-row-label">Email:</span>
                    <a href={`mailto:${site.email}`} className="footer-contact-action">
                      {site.email}
                    </a>
                  </div>
                  <div className="footer-contact-row">
                    <span className="contact-row-label">Phone:</span>
                    <a href={`tel:${site.phone.replace(/\s+/g, '')}`} className="footer-contact-action">
                      {site.phone}
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
