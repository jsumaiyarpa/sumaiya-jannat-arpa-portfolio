import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { site } from './data/site.js';
import { categories, projects } from './data/projects.js';
import { useProjects } from './context/ProjectsContext.jsx';
import { skillCategories } from './data/skills.js';
import { useSkills } from './context/PortfolioDataContext.jsx';
import { githubConfig, languageColors, formatRelativeDate, fetchAdditionalRepos } from './data/github.js';
import { faqData } from './data/faq.js';
import { reviews as fallbackReviews } from './data/reviews.js';

export function usePageTitle(t) {
  useEffect(() => {
    document.title = t ? `${t} — ${site.name}` : `${site.name} — Portfolio`;
  }, [t]);
}

// -------------------------------------------------------------
// DESIGN SYSTEM LUCIDE ICON COMPONENT
// Consistent stroke, sizing, and vector aesthetics across the portfolio.
// -------------------------------------------------------------
const ICON_REGISTRY = {
  'arrow-up-right': (
    <>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  'arrow-left': (
    <>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </>
  ),
  'arrow-down': (
    <>
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </>
  ),
  'arrow-up': (
    <>
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </>
  ),
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  star: (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>
  ),
  'external-link': (
    <>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  printer: (
    <>
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect width="12" height="8" x="6" y="14" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </>
  ),
  'graduation-cap': (
    <>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </>
  ),
  briefcase: (
    <>
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
  'file-text': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </>
  ),
  sparkles: (
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  ),
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-up': <path d="m18 15-6-6-6 6" />,
  'chevron-right': <path d="m9 18 6-6-6-6" />,
  'chevron-left': <path d="m15 18-6-6 6-6" />,
  github: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </>
  ),
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </>
  ),
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  'message-square': (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  ),
  folder: (
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  ),
  layers: (
    <>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </>
  ),
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  plus: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
  slides: (
    <>
      <rect width="18" height="14" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="m10 21 2-4 2 4" />
    </>
  ),
  palette: (
    <>
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </>
  ),
  'help-circle': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  copy: (
    <>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  'check-circle': (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </>
  ),
};

export function Icon({
  name,
  size = 16,
  strokeWidth = 1.8,
  className = '',
  style = {},
  ariaHidden = true,
  title,
}) {
  const content = ICON_REGISTRY[name] || ICON_REGISTRY['arrow-up-right'];
  return (
    <svg
      className={`lucide-icon lucide-${name} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaHidden ? 'true' : undefined}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {title && <title>{title}</title>}
      {content}
    </svg>
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
                <circle cx="10" cy="50" r="3" fill="#8EA5C8" />
                <circle cx="40" cy="10" r="2.5" fill="currentColor" />
                <circle cx="80" cy="10" r="2.5" fill="currentColor" />
                <circle cx="110" cy="50" r="3" fill="#8EA5C8" />
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
  const isGraphic = category === 'graphic';

  if (src && src.trim() !== '') {
    if (isGraphic) {
      return (
        <div className={`img-wrapper img-wrapper-graphic ${className}`}>
          <img
            className="img img-graphic"
            src={src}
            alt={alt || label}
            loading="lazy"
            decoding="async"
          />
        </div>
      );
    }

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
    <div className={`img-wrapper ${isGraphic ? 'img-wrapper-graphic' : ''} ${className}`}>
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
                      <span className="glass-bullet" aria-hidden="true"><Icon name="arrow-up-right" size={12} /></span>
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
  const { categories: ctxCategories } = useProjects();
  const allCategories = (ctxCategories && Object.keys(ctxCategories).length > 0) ? ctxCategories : categories;
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

            const cat = allCategories[proj.category] || { label: proj.category, tag: 'WORK' };

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
                    aria-label={`Open project details: ${proj.title}`}
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
                        <span className="carousel-arrow" aria-hidden="true">
                          <Icon name="arrow-up-right" size={15} />
                        </span>
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
                            <span>GitHub</span>
                            <Icon name="arrow-up-right" size={13} />
                          </a>
                        )}
                        <Link
                          to={`/work/${proj.slug}`}
                          className="btn solid carousel-btn-sm"
                          tabIndex={isCurrent ? 0 : -1}
                        >
                          <span>View Project</span>
                          <Icon name="arrow-up-right" size={13} />
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
          <Icon name="arrow-left" size={16} />
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
          <Icon name="arrow-right" size={16} />
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
  const { skills: liveSkills, hasLoaded, error } = useSkills();
  const categories = hasLoaded
    ? (Array.isArray(liveSkills) ? liveSkills : [])
    : (error ? skillCategories : (Array.isArray(liveSkills) && liveSkills.length > 0 ? liveSkills : skillCategories));

  return (
    <div className="skills-editorial-grid">
      {categories.length === 0 ? (
        <div className="empty-catalog-state" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', gridColumn: '1 / -1' }}>
          <p>No skills recorded yet.</p>
        </div>
      ) : (
        categories.map((cat) => (
          <article key={cat.id} className="skill-editorial-col">
            <div className="skill-cat-header">
              <span className="skill-cat-tag">0{cat.code || 1} · {cat.id.toUpperCase()}</span>
              <h3 className="skill-cat-title">{cat.title}</h3>
            </div>
            <p className="skill-cat-blurb">{cat.blurb}</p>
            <ul className="skill-competency-list">
              {(cat.skills || []).map((skill, sIdx) => {
                const name = typeof skill === 'string' ? skill : skill.name;
                const level = (typeof skill === 'object' && skill.level) ? skill.level : 'Core Competency';
                return (
                  <li key={sIdx} className="skill-competency-item">
                    <span className="skill-name">{name}</span>
                    <span className="skill-desc">{level}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))
      )}
    </div>
  );
}

// -------------------------------------------------------------
// CURATED EDITORIAL PROJECT CARD
// Minimal, typography-first card designed for a 2-column showcase
// -------------------------------------------------------------
export function ProjectCard({ project, index = 0, variant = 'default' }) {
  const p = project;
  const { categories: ctxCategories } = useProjects();
  const allCategories = (ctxCategories && Object.keys(ctxCategories).length > 0) ? ctxCategories : categories;
  const cat = allCategories[p.category] || { label: p.category };
  const isGraphic = p.category === 'graphic';

  return (
    <article className={`project-card ${isGraphic ? 'project-card-graphic' : ''} ${p.layoutSpan || ''}`}>
      <Link
        to={`/work/${p.slug}`}
        className={`project-media-wrap ${isGraphic ? 'project-media-wrap-graphic' : ''}`}
        aria-label={`View ${p.title} project details`}
      >
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
            <span className="project-arrow" aria-hidden="true"><Icon name="arrow-up-right" size={14} /></span>
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
            <span className="link-arrow" aria-hidden="true"><Icon name="arrow-up-right" size={13} /></span>
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
      <Icon name="arrow-down" size={14} />
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
    <a
      href="#hero"
      className="brand-avatar-btn"
      onClick={onClick}
      aria-label="Home — Return to top of page"
      title="Home"
    >
      <div className="brand-avatar-circle">
        {hasImg ? (
          <img src={src} alt="Sumaiya Jannat Arpa — Home" className="brand-avatar-img" />
        ) : (
          <div className="brand-avatar-fallback" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
      </div>
    </a>
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
      <path d="M7.785 14.502h-3.41v-1.748h3.364c.594 0 1.04.103 1.337.311.297.208.446.526.446.953 0 .426-.149.744-.446.952-.297.208-.743.312-1.337.312zm-.31-3.238H4.375V9.69h3.048c.531 0 .937.094 1.218.281.281.188.422.469.422.844 0 .375-.141.656-.422.844-.281.187-.687.281-1.218.281zm5.176 1.637c-.015-1.24.281-2.229.89-2.969.609-.739 1.484-1.109 2.625-1.109 1.094 0 1.943.359 2.547 1.078.604.719.906 1.693.906 2.922 0 .094 0 .219-.015.375h-5.063c.031.781.286 1.375.766 1.781.479.406 1.094.609 1.844.609.672 0 1.25-.156 1.734-.469.484-.312.828-.75 1.031-1.312l1.641.656c-.344.891-.906 1.602-1.688 2.133-.781.531-1.703.797-2.766.797-1.328 0-2.391-.422-3.188-1.266-.796-.844-1.203-1.922-1.22-3.234l-.008.007zm3.484-2.5c-.562 0-1.026.167-1.391.5-.365.333-.578.802-.641 1.406h3.984c-.031-.609-.234-1.083-.609-1.422-.375-.338-.828-.484-1.344-.484zM2.438 7.375h5.531c1.234 0 2.219.297 2.953.891.734.594 1.102 1.406 1.102 2.438 0 .688-.172 1.281-.516 1.781-.344.5-.828.875-1.453 1.125.828.25 1.453.688 1.875 1.312.422.625.633 1.375.633 2.25 0 1.156-.406 2.078-1.219 2.766-.812.688-1.891 1.031-3.234 1.031H2.438V7.375zm12.469-.938h5.344v1.312h-5.344V6.437z" />
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
  const { projects: liveProjects, categories: liveCategories } = useProjects();
  const activeCategories = (liveCategories && Object.keys(liveCategories).length > 0) ? liveCategories : categories;
  const activeProjects = (liveProjects && liveProjects.length > 0) ? liveProjects : projects;

  useEffect(() => {
    if (categoryId) setActiveCat(categoryId);
  }, [categoryId]);

  const catInfo = activeCategories[activeCat] || activeCategories['software'] || categories['software'];
  const catProjects = activeProjects.filter((p) => p.category === activeCat);

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
            <Icon name="arrow-left" size={16} />
            <span>Return to Categories</span>
          </button>

          <div className="cat-modal-category-pills" role="tablist" aria-label="Switch project collection">
            {Object.values(activeCategories).map((c) => {
              const count = activeProjects.filter((p) => p.category === c.id).length;
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
            <Icon name="x" size={18} />
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
            /* Canva Designs: 8 image-focused cards with natural aspect ratios & full visibility */
            <div className="cat-modal-designs-grid">
              {catProjects.map((p, idx) => (
                <article key={p.slug || idx} className="cat-design-card">
                  <Link
                    to={`/work/${p.slug}`}
                    className="cat-design-card-link"
                    onClick={onClose}
                    aria-label={`View ${p.title} project details`}
                  >
                    <div className="cat-design-media">
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
                      <span className="cat-design-view-hint" aria-hidden="true">
                        <span>View</span>
                        <Icon name="arrow-up-right" size={13} />
                      </span>
                    </div>
                  </Link>
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
                        <span className="cat-ext-arrow" aria-hidden="true">
                          <Icon name="arrow-up-right" size={14} />
                        </span>
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
                        <Icon name="arrow-up-right" size={13} />
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
                          <Icon name="arrow-up-right" size={13} />
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
                          <Icon name="arrow-up-right" size={13} />
                        </a>
                      )}
                      <Link
                        to={`/work/${p.slug}`}
                        className="btn solid btn-sm"
                        onClick={onClose}
                        aria-label={`View ${p.title} project details`}
                      >
                        <span>View Project</span>
                        <Icon name="arrow-up-right" size={13} />
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
            <Icon name="arrow-left" size={14} />
            <span>Return to Categories</span>
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
  const { projects: liveProjects } = useProjects();
  const activeProjects = (liveProjects && liveProjects.length > 0) ? liveProjects : projects;

  const fourCategories = [
    {
      id: 'software',
      title: 'Website Projects',
      desc: 'Full-stack web applications and software systems built with React, Node.js, Express, and clean architecture.',
      previewLabel: 'Personal Portfolio Website',
      thumbnail: '/images/projects/website/arpa-portfolio.png',
      count: activeProjects.filter((p) => p.category === 'software').length,
    },
    {
      id: 'uiux',
      title: 'UI/UX Projects',
      desc: 'Research-led digital product concepts, interactive Figma prototypes, user personas, and design systems.',
      previewLabel: 'OneCitizen, MediLink & ResumeXi',
      thumbnail: '/images/projects/uiux/onecitizen.png',
      count: activeProjects.filter((p) => p.category === 'uiux').length,
    },
    {
      id: 'graphic',
      title: 'Canva Designs',
      desc: 'Dedicated visual designs, promotional event posters, and digital campaign collateral for campus initiatives.',
      previewLabel: 'EWUECC & Banglay IELTS Posters',
      thumbnail: '/images/projects/designs/Feb21_ECC.png',
      count: activeProjects.filter((p) => p.category === 'graphic').length,
    },
    {
      id: 'sqa',
      title: 'SQA & Others',
      desc: 'Automated testing suites, API testing via Postman/Newman, Selenium browser regression, and defect reports.',
      previewLabel: 'OSTAD Automation & CS423 Query',
      thumbnail: '',
      count: activeProjects.filter((p) => p.category === 'sqa').length,
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
      <div className="skills-tabs-container">
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
                  <span className="cat-cta-arrow" aria-hidden="true">
                    <Icon name="arrow-up-right" size={14} />
                  </span>
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
  const { skills: liveSkills, hasLoaded, error } = useSkills();
  const rawCategories = hasLoaded
    ? (Array.isArray(liveSkills) && liveSkills.length > 0 ? liveSkills : skillCategories)
    : (error ? skillCategories : (Array.isArray(liveSkills) && liveSkills.length > 0 ? liveSkills : skillCategories));
  const categories = (Array.isArray(rawCategories) && rawCategories.length > 0) ? rawCategories : skillCategories;

  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 'uiux');

  // Keep activeCategory valid when categories change
  useEffect(() => {
    if (categories.length > 0 && !categories.some((c) => c.id === activeCategory)) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  if (categories.length === 0) {
    return (
      <div
        className="skills-glass-stack-container"
        role="region"
        aria-label="Layered Glass Stack of Skills"
      >
        <div className="empty-catalog-state" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)' }}>
          <p>No skills recorded yet.</p>
        </div>
      </div>
    );
  }

  const activeGroup =
    categories.find((c) => c.id === activeCategory) || categories[0] || { id: 'default', title: 'Skills', skills: [] };
  const backgroundCategories = categories.filter((c) => c.id !== activeCategory);

  return (
    <div
      className="skills-glass-stack-container"
      role="region"
      aria-label="Layered Glass Stack of Skills"
    >
      {/* Category Navigation Pills (Matching Projects Category Tabs) */}
      <div className="skills-tabs-container">
        <div className="cat-deck-tabs skills-deck-tabs" role="tablist" aria-label="Skills Category Selection">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = (cat.skills || []).length;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`skills-layer-${cat.id}`}
                className={`cat-deck-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.title}</span>
                <span className="cat-deck-tab-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Signature Layered Glass Stack Stage */}
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
                  <span className="skills-bg-layer-badge">{(grp.skills || []).length} skills</span>
                  <span className="skills-bg-layer-action">
                    <span>Bring to front</span>
                    <Icon name="arrow-up-right" size={13} />
                  </span>
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
                  {(activeGroup.skills || []).length} Skills
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
            {(activeGroup.skills || []).map((skill, sIdx) => {
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
              Layer {categories.findIndex((c) => c.id === activeCategory) + 1} of {categories.length}
            </span>
          </footer>
        </article>
      </div>
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

// Curated editorial headlines, verified roles, and fluid art themes matching the reference layout
const REVIEW_METADATA = {
  'rafid-hasan': {
    headline: 'One of the most driven, forward-thinking people I know.',
    role: 'VP of IT · Ostad Cohort Lead',
    theme: 'crimson',
  },
  'sumaya-rahman': {
    headline: 'Dedicated and enthusiastic, with an inspiring passion to grow.',
    role: 'UI/UX Partner & Project Collaborator',
    theme: 'gold',
  },
  'rawan': {
    headline: 'Outstanding, inspiring and deeply hardworking teammate.',
    role: 'Peer Collaborator · Full-Stack Projects',
    theme: 'cyan',
  },
  'mashiur-rahaman': {
    headline: 'Brings creativity, kindness and passion to every project.',
    role: 'Mentor & Senior Engineer',
    theme: 'violet',
  },
};

const ART_THEMES_CYCLE = ['crimson', 'gold', 'cyan', 'violet', 'emerald'];

function getReviewMeta(item) {
  if (!item) return {};
  const id = item.id || '';
  const author = (item.author || item.name || item.reviewer_name || item.reviewerName || '').toLowerCase().trim();

  if (REVIEW_METADATA[id]) return REVIEW_METADATA[id];
  if (author.includes('rafid')) return REVIEW_METADATA['rafid-hasan'];
  if (author.includes('sumaya')) return REVIEW_METADATA['sumaya-rahman'];
  if (author.includes('rawan')) return REVIEW_METADATA['rawan'];
  if (author.includes('mashiur')) return REVIEW_METADATA['mashiur-rahaman'];

  return {};
}

function extractHeadline(text) {
  if (!text) return 'Inspiring Collaboration';
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences[0] && sentences[0].trim().length <= 65) {
    return sentences[0].trim().replace(/[.!?]+$/, '');
  }
  const words = text.split(/\s+/);
  if (words.length <= 8) return text;
  return words.slice(0, 8).join(' ').replace(/[,;:.!?]+$/, '') + '…';
}

export function ReviewsSection({ items }) {
  // If items is explicitly an empty array (meaning live database returned 0 published reviews), do not restore fallbackReviews
  if (Array.isArray(items) && items.length === 0) {
    return (
      <div className="reviews-empty-state" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted, #94a3b8)' }}>
        <p style={{ fontSize: '1rem', margin: 0 }}>No endorsements currently published.</p>
      </div>
    );
  }

  // Always ensure we have safe items (prevents disappearing reviews on any race condition or uninitialized state)
  const safeItems = Array.isArray(items) && items.length > 0 ? items : fallbackReviews;
  const N = safeItems.length;

  const [isPaused, setIsPaused] = useState(false);
  // Virtual index starts at 100 * N so user can navigate backward and forward freely
  const [activeVirtualIndex, setActiveVirtualIndex] = useState(() => 100 * Math.max(1, N));
  const [touchStartX, setTouchStartX] = useState(null);

  // Active real index for dots and current indicator
  const activeRealIndex = N > 0 ? ((activeVirtualIndex % N) + N) % N : 0;

  // Auto-rotation effect: 6.5s interval, paused on hover/touch/focus or reduced-motion
  useEffect(() => {
    if (isPaused || N <= 1) return;

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery && mediaQuery.matches) return;
    }

    const interval = setInterval(() => {
      setActiveVirtualIndex((prev) => prev + 1);
    }, 6500);

    return () => clearInterval(interval);
  }, [isPaused, N]);

  const stageRef = useRef(null);
  const [stageMinHeight, setStageMinHeight] = useState(420);

  // Dynamically measure cards so that parent stage expands naturally to the full review content
  useEffect(() => {
    const updateStageHeight = () => {
      if (!stageRef.current) return;
      const cards = stageRef.current.querySelectorAll('.review-coverflow-card');
      let maxH = 340;
      cards.forEach((card) => {
        const contentEl = card.querySelector('.card-art-content');
        const h = contentEl ? contentEl.scrollHeight : card.scrollHeight;
        if (h > maxH) maxH = h;
      });
      setStageMinHeight(Math.max(420, maxH + 36));
    };

    updateStageHeight();
    const id = requestAnimationFrame(updateStageHeight);
    window.addEventListener('resize', updateStageHeight);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', updateStageHeight);
    };
  }, [safeItems, activeVirtualIndex]);

  // Handlers
  const handlePrev = () => setActiveVirtualIndex((prev) => prev - 1);
  const handleNext = () => setActiveVirtualIndex((prev) => prev + 1);

  const handleDotClick = (targetRealIdx) => {
    let diff = targetRealIdx - activeRealIndex;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    setActiveVirtualIndex((prev) => prev + diff);
  };

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

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Visible slots range: -3 to +3 (7 virtual slots ensuring seamless 3D entrance and exit)
  const slotOffsets = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <div
      className={`reviews-coverflow-wrapper ${isPaused ? 'is-paused' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Peer Endorsements and Testimonials Coverflow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="reviews-coverflow-stage" ref={stageRef} style={{ minHeight: `${stageMinHeight}px` }}>
        {slotOffsets.map((d) => {
          const virtualIdx = activeVirtualIndex + d;
          const realIdx = ((virtualIdx % N) + N) % N;
          const item = safeItems[realIdx];
          const meta = getReviewMeta(item);
          const rawQuote = item.quote || item.testimonial || '';
          const quoteText = rawQuote.replace(/^["'“\s]+|["'”\s]+$/g, '').trim();
          const headline = item.headline || meta.headline || extractHeadline(quoteText);
          const authorRole = item.role
            ? (item.organization && !item.role.toLowerCase().includes(item.organization.toLowerCase()) ? `${item.role} · ${item.organization}` : item.role)
            : (meta.role || (item.organization ? `${item.organization}` : 'Peer Collaborator'));
          const artTheme = item.artTheme || meta.theme || ART_THEMES_CYCLE[realIdx % ART_THEMES_CYCLE.length];
          const authorName = item.author || item.name || item.reviewer_name || 'Anonymous';
          const imgSrc = getReviewImageSrc(item.image);
          const badgeNum = String(realIdx + 1).padStart(2, '0');
          const isCenter = d === 0;

          let slotClass = '';
          if (d === 0) slotClass = 'slot-center';
          else if (d === -1) slotClass = 'slot-left-1';
          else if (d === 1) slotClass = 'slot-right-1';
          else if (d === -2) slotClass = 'slot-left-2';
          else if (d === 2) slotClass = 'slot-right-2';
          else if (d <= -3) slotClass = 'slot-hidden-left';
          else if (d >= 3) slotClass = 'slot-hidden-right';

          return (
            <article
              key={virtualIdx}
              className={`review-coverflow-card ${slotClass}`}
              data-art-theme={artTheme}
              onClick={() => {
                if (d !== 0) {
                  setActiveVirtualIndex((prev) => prev + d);
                }
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${authorName} testimonial (${realIdx + 1} of ${N})`}
              aria-hidden={!isCenter}
            >
              {/* Card Foreground Content */}
              <div className="card-art-content">
                <div className="card-top-bar">
                  <span className="card-peer-badge">#{badgeNum}</span>
                  <div className="card-quote-glyph" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>

                <div className="card-bottom-block">
                  <h3 className="card-serif-headline">
                    {headline}
                  </h3>

                  <blockquote className="card-quote-body">
                    “{quoteText}”
                  </blockquote>

                  <div className="card-author-row">
                    {imgSrc && (
                      <div className="card-author-avatar-wrap">
                        <img
                          src={imgSrc}
                          alt={authorName}
                          className="card-author-avatar"
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
                    <div className="card-author-meta">
                      <div className="card-author-name">{authorName}</div>
                      <div className="card-author-role">{authorRole}</div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Navigation Controls: Previous / Next & Pagination Dots */}
      {N > 1 && (
        <div className="reviews-carousel-controls" aria-label="Testimonial controls">
          <button
            type="button"
            className="reviews-nav-arrow reviews-arrow-prev"
            aria-label="Previous testimonial"
            onClick={handlePrev}
          >
            <Icon name="arrow-left" size={18} />
          </button>

          <div className="reviews-dots" role="tablist" aria-label="Testimonial pagination">
            {safeItems.map((item, idx) => {
              const name = item.author || item.name || item.reviewer_name;
              const isActive = activeRealIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to testimonial ${idx + 1} of ${N}: ${name}`}
                  className={`reviews-dot ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleDotClick(idx)}
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
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// GET TO KNOW SUMAIYA (TWO-COLUMN EDITORIAL FAQ)
// Left: Complete FAQ questions & answers
// Right: Standalone portrait image (/images/profile_3.png) matching
// the height of the questions beside it, styled cleanly like the About section.
// -------------------------------------------------------------
export function FAQSection({ items = faqData }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="faq-editorial-grid">
      {/* Left Column: Existing FAQ Questions & Answers Accordion */}
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
                      <Icon name="chevron-down" size={16} strokeWidth={2.2} />
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

      {/* Right Column: Standalone Portrait Image (Profile 3) */}
      <div className="faq-portrait-col">
        <img
          src="/images/profile_3.png"
          alt="Sumaiya Jannat Arpa"
          className="faq-standalone-portrait-img"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURED IMAGES SLIDESHOW
// Visual automatic slideshow positioned directly above Experience & Leadership.
// Autoplays continuously with smooth, subtle cross-fade transitions.
// Preserves each image's authentic aspect ratio and uncropped dimensions.
// No manual controls, pagination, arrows, or dots.
// -------------------------------------------------------------
const BASE_FEATURED_IMAGES = [
  '/images/featured/featured_1.jpg',
  '/images/featured/featured_2.jpg',
  '/images/featured/featured_3.jpg',
  '/images/featured/featured_4.jpg',
  '/images/featured/featured_5.jpg',
];

export function FeaturedImageSlideshow() {
  const [images, setImages] = useState(BASE_FEATURED_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);

  // If featured_6.jpg exists, automatically include it in the loop
  useEffect(() => {
    const testImg = new Image();
    testImg.onload = () => {
      setImages((prev) =>
        prev.includes('/images/featured/featured_6.jpg')
          ? prev
          : [...prev, '/images/featured/featured_6.jpg']
      );
    };
    testImg.src = '/images/featured/featured_6.jpg';
  }, []);

  // Automatic continuous loop with smooth timing
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <article
      id="featured-slideshow"
      className="ref-panel-card ref-panel-card-featured visual-stack-panel"
      aria-label="Featured highlights visual slideshow"
    >
      <span id="featured" className="section-anchor-hidden" aria-hidden="true" />
      <div className="featured-slideshow-container">
        <div className="featured-viewport" role="region" aria-label="Automatic photo slideshow">
          {images.map((src, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={src}
                className={`featured-slide ${isActive ? 'is-active' : ''}`}
                aria-hidden={!isActive}
              >
                {/* Completely uncropped full image retaining natural proportions */}
                <img
                  src={src}
                  alt={`Featured milestone ${idx + 1}`}
                  className="featured-slide-img"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            );
          })}
        </div>
      </div>
    </article>
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
  const { projects: liveProjects } = useProjects();
  const activeProjects = (liveProjects && liveProjects.length > 0) ? liveProjects : projects;

  useEffect(() => {
    let isMounted = true;

    async function loadRepos() {
      try {
        setLoading(true);
        const result = await fetchAdditionalRepos(activeProjects);
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
  }, [activeProjects]);

  // Return nothing when loading or when no additional repositories exist
  if (loading || repos.length === 0) {
    return null;
  }

  return (
    <div className={`additional-github-section ${className}`} aria-label="Additional GitHub Repositories">
      <div className="additional-github-header">
        <div className="additional-github-title-wrap">
          <span className="sec-tag">Open Source Repositories</span>
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
          <Icon name="github" size={16} />
          <span>github.com/{githubConfig.username}</span>
          <Icon name="arrow-up-right" size={13} />
        </a>
      </div>

      <div className="additional-github-grid">
        {repos.map((repo) => (
          <article key={repo.id} className="github-repo-card">
            <div className="github-repo-card-top">
              <div className="github-repo-name-group">
                <Icon name="folder" size={16} className="github-repo-icon" />
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-repo-link"
                  title={`View ${repo.name} on GitHub`}
                >
                  <span>{repo.name}</span>
                  <span className="github-repo-arrow" aria-hidden="true">
                    <Icon name="arrow-up-right" size={13} />
                  </span>
                </a>
              </div>
              {repo.stargazers_count > 0 && (
                <span className="github-repo-stars" title={`${repo.stargazers_count} stars`}>
                  <Icon name="star" size={13} strokeWidth={2} style={{ fill: 'currentColor' }} />
                  <span>{repo.stargazers_count}</span>
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
                    style={{ backgroundColor: languageColors[repo.language] || '#8EA5C8' }}
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
// FOOTER SHOWCASE TRIPTYCH DECK (QUICK ACCESS NAVIGATION)
// Interactive 3-card fanned Quick Access section placed immediately
// above the footer, featuring About, Explore, and Connect sections
// with smooth scrolling to homepage anchors and staggered reveal.
// -------------------------------------------------------------
export function FooterShowcaseDeck({ onNavigate, revealKey = 0 }) {
  const handleClick = (e, target) => {
    if (onNavigate) {
      onNavigate(e, target);
    }
  };

  return (
    <section id="quick-access" className="footer-showcase-deck" aria-label="Quick Access Navigation">
      <div className="site-wrapper deck-container">
        <div className="deck-cards-row" role="region" aria-label="Quick Access Navigation Cards">
          {/* Card 1: Explore (Left, Amber / Slides theme) */}
          <div
            key={`card-explore-${revealKey}`}
            className={`deck-card deck-card-slides deck-card-explore ${revealKey > 0 ? 'is-revealing' : ''}`}
            style={{
              '--deck-stagger-delay': '0ms',
              '--deck-card-rot': 'rotate(-3deg)',
              '--deck-card-y': '4px',
            }}
          >
            <div className="deck-preview-well">
              <div className="deck-sheet-stack">
                <div className="deck-sheet deck-sheet-back-2" aria-hidden="true" />
                <div className="deck-sheet deck-sheet-back-1" aria-hidden="true" />
                <div className="deck-sheet deck-sheet-front deck-sheet-slides-front">
                  <div className="deck-slides-header">
                    <span className="deck-slides-title">Skills &amp; Projects</span>
                    <div className="deck-slides-divider" />
                  </div>
                  <div className="deck-slides-chart" aria-hidden="true">
                    <div className="deck-chart-bar bar-purple" style={{ height: '62%' }} title="Skills" />
                    <div className="deck-chart-bar bar-green" style={{ height: '78%' }} title="Projects" />
                    <div className="deck-chart-bar bar-terracotta" style={{ height: '94%' }} title="Selected Work" />
                  </div>
                </div>
              </div>
            </div>

            <div className="deck-card-body">
              <div className="deck-category-header">
                <span className="deck-icon-badge badge-amber" aria-hidden="true">
                  <Icon name="slides" size={15} strokeWidth={2.2} />
                </span>
                <h3 className="deck-category-title">Explore</h3>
              </div>
              <ul className="deck-items-list">
                <li className="deck-list-item">
                  <a
                    href="#skills"
                    onClick={(e) => handleClick(e, '#skills')}
                    className="deck-item-link"
                    aria-label="Scroll to Skills section"
                  >
                    <span className="deck-plus plus-amber" aria-hidden="true">+</span>
                    <span>Skills</span>
                  </a>
                </li>
                <li className="deck-list-item">
                  <a
                    href="#projects"
                    onClick={(e) => handleClick(e, '#projects')}
                    className="deck-item-link"
                    aria-label="Scroll to Projects section"
                  >
                    <span className="deck-plus plus-amber" aria-hidden="true">+</span>
                    <span>Projects</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: About (Center, Blue / Docs theme) */}
          <div
            key={`card-about-${revealKey}`}
            className={`deck-card deck-card-docs deck-card-about ${revealKey > 0 ? 'is-revealing' : ''}`}
            style={{
              '--deck-stagger-delay': '120ms',
              '--deck-card-rot': 'rotate(0deg)',
              '--deck-card-y': '-8px',
            }}
          >
            <div className="deck-preview-well">
              <div className="deck-sheet-stack">
                <div className="deck-sheet deck-sheet-back-2 dark-stack" aria-hidden="true" />
                <div className="deck-sheet deck-sheet-back-1 dark-stack" aria-hidden="true" />
                <div className="deck-sheet deck-sheet-front deck-sheet-docs-front">
                  <span className="deck-docs-title">About Sumaiya</span>
                  <div className="deck-docs-lines" aria-hidden="true">
                    <div className="deck-line-bar bar-wide" />
                    <div className="deck-line-bar bar-medium" />
                    <div className="deck-line-row">
                      <span className="deck-blue-bullet" />
                      <div className="deck-line-bar bar-short" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="deck-card-body">
              <div className="deck-category-header">
                <span className="deck-icon-badge badge-blue" aria-hidden="true">
                  <Icon name="file-text" size={15} strokeWidth={2.2} />
                </span>
                <h3 className="deck-category-title">About</h3>
              </div>
              <ul className="deck-items-list">
                <li className="deck-list-item">
                  <a
                    href="#education"
                    onClick={(e) => handleClick(e, '#education')}
                    className="deck-item-link"
                    aria-label="Scroll to Education section"
                  >
                    <span className="deck-plus plus-blue" aria-hidden="true">+</span>
                    <span>Education</span>
                  </a>
                </li>
                <li className="deck-list-item">
                  <a
                    href="#experience"
                    onClick={(e) => handleClick(e, '#experience')}
                    className="deck-item-link"
                    aria-label="Scroll to Experience section"
                  >
                    <span className="deck-plus plus-blue" aria-hidden="true">+</span>
                    <span>Experience</span>
                  </a>
                </li>
                <li className="deck-list-item">
                  <a
                    href="#acknowledgements"
                    onClick={(e) => handleClick(e, '#acknowledgements')}
                    className="deck-item-link"
                    aria-label="Scroll to Acknowledgements section"
                  >
                    <span className="deck-plus plus-blue" aria-hidden="true">+</span>
                    <span>Acknowledgements</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Connect (Right, Purple / Design theme) */}
          <div
            key={`card-connect-${revealKey}`}
            className={`deck-card deck-card-design deck-card-connect ${revealKey > 0 ? 'is-revealing' : ''}`}
            style={{
              '--deck-stagger-delay': '240ms',
              '--deck-card-rot': 'rotate(3deg)',
              '--deck-card-y': '4px',
            }}
          >
            <div className="deck-preview-well">
              <div className="deck-sheet-stack">
                <div className="deck-sheet deck-sheet-front deck-sheet-design-front">
                  <div className="deck-browser-chrome" aria-hidden="true">
                    <div className="deck-chrome-pill pill-red" />
                    <div className="deck-chrome-pill pill-gray" />
                    <div className="deck-chrome-pill pill-gray" />
                    <div className="deck-chrome-pill pill-black" />
                  </div>
                  <div className="deck-browser-content">
                    <div className="deck-design-text-col">
                      <span className="deck-design-title">
                        Reviews &amp;<br />Questions
                      </span>
                      <div className="deck-design-divider" />
                    </div>
                    <div className="deck-design-artwork" aria-hidden="true">
                      <div className="deck-art-sun" />
                      <div className="deck-art-dune dune-back" />
                      <div className="deck-art-dune dune-front" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="deck-card-body">
              <div className="deck-category-header">
                <span className="deck-icon-badge badge-purple" aria-hidden="true">
                  <Icon name="palette" size={15} strokeWidth={2.2} />
                </span>
                <h3 className="deck-category-title">Connect</h3>
              </div>
              <ul className="deck-items-list">
                <li className="deck-list-item">
                  <a
                    href="#reviews"
                    onClick={(e) => handleClick(e, '#reviews')}
                    className="deck-item-link"
                    aria-label="Scroll to Reviews section"
                  >
                    <span className="deck-plus plus-purple" aria-hidden="true">+</span>
                    <span>Reviews</span>
                  </a>
                </li>
                <li className="deck-list-item">
                  <a
                    href="#faq"
                    onClick={(e) => handleClick(e, '#faq')}
                    className="deck-item-link"
                    aria-label="Scroll to Questions and FAQ section"
                  >
                    <span className="deck-plus plus-purple" aria-hidden="true">+</span>
                    <span>Questions (FAQ)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
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
  const [revealKey, setRevealKey] = useState(0);
  const { pathname, hash, state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  // Automatically scroll to target section when redirected to Home with a hash or state
  useEffect(() => {
    if (pathname !== '/') return;

    const rawTarget = state?.scrollTo || (hash ? hash.replace(/^#+/, '') : null);
    if (!rawTarget) return;

    // Normalize any legacy route names to section IDs
    const targetId = rawTarget === 'achievements' ? 'education' : rawTarget;

    let attempts = 0;
    const maxAttempts = 25; // 25 * 50ms = 1.25s max polling while Home renders

    const attemptScroll = () => {
      let el = document.getElementById(targetId);
      // Special target aliases
      if (targetId === 'hero' && !el) {
        el = document.querySelector('.hero-cover-section') || document.getElementById('main-content');
      } else if (targetId === 'contact' && !el) {
        el = document.getElementById('contact') || document.getElementById('get-in-touch') || document.querySelector('.footer-top-grid') || document.querySelector('.footer-touch-col');
      } else if (targetId === 'connect' && !el) {
        el = document.querySelector('.footer-connect-tier');
      }

      if (el) {
        const navOffset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(attemptScroll, 50);
      }
    };

    const timer = setTimeout(attemptScroll, 80);
    return () => clearTimeout(timer);
  }, [pathname, hash, state]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && navOpen) setNavOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navOpen]);

  // Lock background scroll when mobile navigation drawer is open
  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  const handleAvatarClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setNavOpen(false);
    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    } else {
      const heroEl = document.getElementById('hero') || document.querySelector('.hero-cover-section');
      if (heroEl) {
        const navOffset = 80;
        const elementPosition = heroEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({ top: Math.max(0, offsetPosition), behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleNavClick = (e, to) => {
    if (to.startsWith('#')) {
      if (e && e.preventDefault) e.preventDefault();
      setNavOpen(false);
      const targetId = to.slice(1);
      const scrollToTarget = () => {
        let el = document.getElementById(targetId);
        // Special target aliases
        if (targetId === 'hero' && !el) {
          el = document.querySelector('.hero-cover-section') || document.getElementById('main-content');
        } else if (targetId === 'contact' && !el) {
          el = document.getElementById('get-in-touch') || document.querySelector('.footer-top-grid') || document.querySelector('.footer-touch-col');
        } else if (targetId === 'connect' && !el) {
          el = document.querySelector('.footer-connect-tier');
        }

        if (el) {
          const navOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
        } else if (targetId === 'hero' || targetId === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };

      if (pathname !== '/') {
        navigate('/');
        setTimeout(scrollToTarget, 120);
      } else {
        scrollToTarget();
      }
    }
  };

  // Direct Inquiry Form state & handler for footer
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    inquiryFocus: 'Software Engineering',
    message: '',
  });
  const [inquiryStatus, setInquiryStatus] = useState('idle'); // 'idle' | 'opened' | 'error'
  const [inquiryError, setInquiryError] = useState('');
  const [inquiryNotice, setInquiryNotice] = useState('');
  const [gmailComposeUrl, setGmailComposeUrl] = useState('');

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryData((prev) => ({ ...prev, [name]: value }));
    if (inquiryStatus === 'error') {
      setInquiryStatus('idle');
      setInquiryError('');
    }
  };

  const handleInquirySubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const trimmedName = (inquiryData.name || '').trim();
    const trimmedEmail = (inquiryData.email || '').trim();
    const trimmedMessage = (inquiryData.message || '').trim();
    const focus = inquiryData.inquiryFocus || 'General Inquiry';

    if (!trimmedName || trimmedName.length < 2) {
      setInquiryStatus('error');
      setInquiryError('Please enter your full name (minimum 2 characters).');
      setInquiryNotice('');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setInquiryStatus('error');
      setInquiryError('Please enter a valid email address.');
      setInquiryNotice('');
      return;
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      setInquiryStatus('error');
      setInquiryError('Please enter a message (minimum 10 characters).');
      setInquiryNotice('');
      return;
    }

    const recipient = 'jannat.sumiyarpa@gmail.com';
    const subject = `[Portfolio Inquiry: ${focus}] From ${trimmedName}`;
    const emailBody = `Hello Sumaiya,\n\nName: ${trimmedName}\nEmail: ${trimmedEmail}\nInquiry Focus: ${focus}\n\nMessage:\n${trimmedMessage}`;

    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: recipient,
      su: subject,
      body: emailBody,
    });
    const gmailUrl = `https://mail.google.com/mail/?${params.toString()}`;

    setInquiryStatus('opened');
    setInquiryError('');
    setGmailComposeUrl(gmailUrl);

    // Open Gmail Compose in a new browser tab
    let popupBlocked = false;
    try {
      const newTab = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        popupBlocked = true;
      }
    } catch (err) {
      popupBlocked = true;
    }

    if (popupBlocked) {
      setInquiryNotice(
        'Your browser prevented Gmail Compose from opening automatically. Please click the link below to open Gmail Compose and complete sending your message:'
      );
    } else {
      setInquiryNotice(
        'Gmail Compose has opened in a new tab with your message pre-filled. Please press Send in Gmail to complete the process.'
      );
    }
  };

  const handleExploreClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setRevealKey((prev) => prev + 1);

    const scrollToQuickAccess = () => {
      const el = document.getElementById('quick-access');
      if (el) {
        const navOffset = 70;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    if (pathname !== '/') {
      navigate('/');
      setTimeout(scrollToQuickAccess, 120);
    } else {
      scrollToQuickAccess();
    }
  };

  // Essential social & creative links for footer
  const footerSocials = [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: '@sumaiya-jannat-arpa',
      url: 'https://www.linkedin.com/in/sumaiya-jannat-arpa/',
    },
    {
      id: 'behance',
      label: 'Behance',
      handle: '@sumaiyarpa2',
      url: 'https://www.behance.net/sumaiyaarpa2',
    },
    {
      id: 'github',
      label: 'GitHub',
      handle: '@jsumaiyarpa',
      url: 'https://github.com/jsumaiyarpa',
    },
  ];

  // Mobile navigation items
  const mobileNavItems = [
    { to: '#hero', label: 'Home' },
    { to: '#about', label: 'About' },
    { to: '#skills', label: 'Skills' },
    { to: '#projects', label: 'Projects' },
    { to: '#reviews', label: 'Reviews' },
    { to: '#contact', label: 'Contact' },
    { to: '#connect', label: 'Connect' },
  ];

  return (
    <div className="site-canvas">
      <a className="skip-link" href="#main-content">Skip to primary content</a>

      {/* Primary Sticky Bar — Translucent Glass Surface */}
      <header className="primary-bar">
        <div className="site-wrapper bar-inner">
          {/* Left Side: Home (Brand Avatar Link) */}
          <NavAvatar src={site.portrait || '/images/portrait.jpg'} onClick={handleAvatarClick} />

          {/* Center: Exactly 5 items (About | Skills | Projects | Reviews | Contact) */}
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

          {/* Right Side: Connect CTA & Mobile Trigger */}
          <div className="bar-actions-cluster">
            {/* Desktop Connect button */}
            <a
              href="#connect"
              className="nav-connect-pill"
              onClick={(e) => handleNavClick(e, '#connect')}
              aria-label="Connect — Navigate to Connect & Follow"
            >
              <span>Connect</span>
            </a>

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
          </div>

          <nav className="mobile-nav-links" aria-label="Mobile Navigation">
            {mobileNavItems.map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="mobile-nav-link"
                onClick={(e) => handleNavClick(e, item.to)}
              >
                <span className="mob-label">{item.label}</span>
                <span className="mob-arrow">
                  <Icon name="arrow-up-right" size={14} />
                </span>
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
              <span>Download CV</span>
              <Icon name="arrow-down" size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="main-viewport">
        {children}
      </main>

      {/* Illustrated Artwork Footer */}
      {/* Recreated Wireframe Footer (Exact Match to User Reference Drawing) */}
      <footer className="site-footer-reference" role="contentinfo">
        <div className="site-wrapper footer-reference-inner">

          {/* ========================================================
              TIER 1: TOP AREA (Get in Touch + Inquiry Form & Contact Info / Quick Links)
             ======================================================== */}
          <div id="contact" className="footer-top-grid">

            {/* Left Column: Get in Touch & Direct Inquiry Form */}
            <div className="footer-touch-col">
              <h2 className="sec-title footer-touch-heading">
                Get in <span className="ref-about-heading-bold">Touch</span>
              </h2>

              <form className="inquiry-form-sketch" onSubmit={handleInquirySubmit} noValidate>
                {inquiryStatus === 'error' && inquiryError && (
                  <div className="inquiry-error-banner" role="alert">
                    <Icon name="help-circle" size={14} />
                    <span>{inquiryError}</span>
                  </div>
                )}

                {inquiryNotice && (
                  <div className="inquiry-notice-banner" role="status" aria-live="polite">
                    <span className="inquiry-notice-icon" aria-hidden="true">
                      <Icon name="mail" size={15} />
                    </span>
                    <div className="inquiry-notice-text">
                      <span>{inquiryNotice}</span>
                      {gmailComposeUrl && (
                        <div className="inquiry-notice-link-wrap">
                          <a
                            href={gmailComposeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inquiry-notice-link"
                          >
                            <span>Click here if Gmail Compose didn't open in a new tab</span>
                            <Icon name="arrow-up-right" size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Row 1: Full Name * & Email * (Two fields side by side) */}
                <div className="inquiry-row-two">
                  <div className="inquiry-field-group">
                    <label htmlFor="inquiry-name" className="inquiry-label">
                      Full Name <span className="inquiry-req">*</span>
                    </label>
                    <input
                      type="text"
                      id="inquiry-name"
                      name="name"
                      value={inquiryData.name}
                      onChange={handleInquiryChange}
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                      className="inquiry-input"
                    />
                  </div>

                  <div className="inquiry-field-group">
                    <label htmlFor="inquiry-email" className="inquiry-label">
                      Email <span className="inquiry-req">*</span>
                    </label>
                    <input
                      type="email"
                      id="inquiry-email"
                      name="email"
                      value={inquiryData.email}
                      onChange={handleInquiryChange}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                      required
                      className="inquiry-input"
                    />
                  </div>
                </div>

                {/* Row 2: Message * (Underneath, spanning full width) */}
                <div className="inquiry-field-group full-width">
                  <label htmlFor="inquiry-message" className="inquiry-label">
                    Message <span className="inquiry-req">*</span>
                  </label>
                  <textarea
                    id="inquiry-message"
                    name="message"
                    rows={4}
                    value={inquiryData.message}
                    onChange={handleInquiryChange}
                    placeholder="Write your message here..."
                    required
                    className="inquiry-textarea"
                  />
                </div>

                {/* Row 3: Inquiry Focus (left) and Send Email (right) */}
                <div className="inquiry-row-controls">
                  <div className="inquiry-field-group inquiry-select-group">
                    <label htmlFor="inquiry-focus" className="inquiry-label">
                      Inquiry Focus
                    </label>
                    <div className="inquiry-select-wrapper">
                      <select
                        id="inquiry-focus"
                        name="inquiryFocus"
                        value={inquiryData.inquiryFocus}
                        onChange={handleInquiryChange}
                        className="inquiry-select"
                      >
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="SQA & Testing">SQA &amp; Testing</option>
                        <option value="Other / Collaboration">Other / Collaboration</option>
                      </select>
                      <span className="inquiry-select-chevron" aria-hidden="true">
                        <Icon name="chevron-down" size={13} />
                      </span>
                    </div>
                  </div>

                  <div className="inquiry-submit-group">
                    <button
                      type="submit"
                      className="inquiry-send-btn"
                      onClick={handleInquirySubmit}
                    >
                      <span>Send Email</span>
                      <Icon name="send" size={13} />
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column: Direct Contact Details & Quick Links Card */}
            <div className="footer-side-col">
              {/* Direct Contact Items: Email & Location */}
              <div className="footer-direct-contact">
                <div className="footer-contact-row">
                  <span className="footer-contact-icon" aria-hidden="true">
                    <Icon name="mail" size={16} />
                  </span>
                  <a href={`mailto:${site.email}`} className="footer-contact-link">
                    {site.email}
                  </a>
                </div>
                <div className="footer-contact-row">
                  <span className="footer-contact-icon" aria-hidden="true">
                    <Icon name="map-pin" size={16} />
                  </span>
                  <span className="footer-contact-text">
                    {site.location}
                  </span>
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="footer-quick-card">
                <div className="footer-quick-content">
                  <h4 className="footer-quick-heading">
                    Before you go,
                    <span className="footer-quick-subheading">check out the quick links</span>
                  </h4>
                </div>
                <div className="footer-quick-action">
                  <a
                    href="#quick-access"
                    onClick={handleExploreClick}
                    className="footer-explore-pill"
                    aria-label="Explore quick access links"
                  >
                    <span>Explore</span>
                    <Icon name="arrow-up-right" size={14} strokeWidth={2.4} />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================
              DIVIDER 1: Horizontal line between Get in Touch and Quick Link Cards
             ======================================================== */}
          <div className="footer-section-divider" aria-hidden="true" />

          {/* ========================================================
              TIER 2: QUICK LINK CARDS (3-Card Fanned Showcase Deck)
             ======================================================== */}
          <FooterShowcaseDeck onNavigate={handleNavClick} revealKey={revealKey} />

          {/* ========================================================
              DIVIDER 2: Horizontal line between Quick Link Cards and Connect & Follow
             ======================================================== */}
          <div className="footer-section-divider" aria-hidden="true" />

          {/* ========================================================
              TIER 3: CONNECT & FOLLOW (Clean Social Channels)
             ======================================================== */}
          <div id="connect" className="footer-connect-tier">
            <h2 className="sec-title footer-connect-heading">
              Connect &amp; <span className="ref-about-heading-bold">Follow</span>
            </h2>

            <div className="footer-channels-grid" role="list" aria-label="Social and Creative Channels">
              {footerSocials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`footer-channel-card footer-channel-${s.id}`}
                  title={`Visit ${s.label} profile (${s.handle})`}
                  aria-label={`Visit ${s.label} profile at ${s.handle}`}
                >
                  <div className="footer-channel-main">
                    <span className="footer-channel-icon-box" aria-hidden="true">
                      <SocialIcon name={s.id} />
                    </span>
                    <div className="footer-channel-info">
                      <h3 className="footer-channel-title">{s.label}</h3>
                      <span className="footer-channel-handle">{s.handle}</span>
                    </div>
                  </div>

                  <span className="footer-channel-action" aria-hidden="true">
                    <Icon name="arrow-up-right" size={14} />
                  </span>

                  <span className="footer-channel-accent-rail" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* ========================================================
              DIVIDER 3: Horizontal line between Connect & Follow and Copyright Bar
             ======================================================== */}
          <div className="footer-section-divider" aria-hidden="true" />

          {/* ========================================================
              TIER 4: BOTTOM COPYRIGHT BAR
             ======================================================== */}
          <div className="footer-bottom-tier">
            <div className="footer-bottom-left">
              <span className="footer-brand-monogram" aria-hidden="true">
                <span className="footer-monogram-square" />
              </span>
              <span className="footer-colophon-brand">PORTFOLIO {new Date().getFullYear()}</span>
              <span className="footer-colophon-sep">|</span>
              <span className="footer-colophon-author">Sumaiya Jannat Arpa</span>
            </div>

            <div className="footer-bottom-right">
              <span className="footer-rights-label">&copy; All rights reserved</span>
              <a
                href={site.cvUrl}
                download="Sumaiya_Jannat_Arpa_Resume.pdf"
                className="footer-cv-btn"
                aria-label="Download Curriculum Vitae (PDF)"
              >
                <span>Download CV</span>
                <Icon name="arrow-down" size={13} />
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
