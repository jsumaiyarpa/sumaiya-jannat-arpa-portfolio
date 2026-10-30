import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { site } from './data/site.js';
import { projects, categories } from './data/projects.js';
import { experience } from './data/experience.js';
import { about } from './data/about.js';
import { gallery } from './data/gallery.js';
import { reviews } from './data/reviews.js';
import {
  Img,
  SectionHeader,
  HeroPortrait,
  ProjectCarousel,
  KeywordMarquee,
  FourCategoryCards,
  CategoryProjectModal,
  SkillsCapsules,
  ReviewsSection,
  FAQSection,
  ProjectCard,
  Timeline,
  Socials,
  usePageTitle,
  AdditionalGitHubRepos,
} from './components.jsx';

// -------------------------------------------------------------
// LIGHTBOX MODAL COMPONENT
// -------------------------------------------------------------
function LightboxModal({ item, index, total, onNext, onPrev, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onClose]);

  if (!item) return null;

  return (
    <dialog
      ref={dialogRef}
      className="editorial-lightbox"
      aria-label={`Visual preview: ${item.title}`}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
    >
      <div className="lightbox-inner">
        <div className="lightbox-media-col">
          <Img
            src={item.src}
            alt={item.title}
            ratio={item.ratio || '4/5'}
            category="graphic"
            label={item.title}
            className="lightbox-img"
          />
        </div>

        <div className="lightbox-info-col">
          <div className="lightbox-header">
            <span className="sec-tag">{item.category} // {item.year}</span>
            <button className="lightbox-close-btn" onClick={onClose} aria-label="Close dialog">✕</button>
          </div>

          <h3 className="lightbox-title">{item.title}</h3>
          <p className="lightbox-org"><strong>Organization:</strong> {item.organization}</p>
          <p className="lightbox-desc">{item.desc}</p>

          <div className="lightbox-spec-box">
            <div className="spec-row">
              <span className="spec-label">DIMENSIONS:</span>
              <span className="spec-val">{item.dimensions}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">TOOLS:</span>
              <span className="spec-val">{item.tools}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">CONTRIBUTION:</span>
              <span className="spec-val">{item.contribution}</span>
            </div>
          </div>

          <div className="lightbox-nav-actions">
            <button className="btn outline" onClick={onPrev} aria-label="Previous image">
              ← PREV
            </button>
            <span className="lightbox-counter">{index + 1} / {total}</span>
            <button className="btn outline" onClick={onNext} aria-label="Next image">
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

// -------------------------------------------------------------
// 01. HOMEPAGE
// -------------------------------------------------------------
export function Home() {
  usePageTitle();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeExperienceItem, setActiveExperienceItem] = useState(null);
  const [activeCredentialItem, setActiveCredentialItem] = useState(null);
  const [activeCredentialIndex, setActiveCredentialIndex] = useState(0);
  const [isCredentialHovered, setIsCredentialHovered] = useState(false);
  const [activeEduCard, setActiveEduCard] = useState(null);
  const [expSortAscending, setExpSortAscending] = useState(true);
  const [activeExpCardId, setActiveExpCardId] = useState(null);

  const experienceItems = [
    {
      category: 'TEAM LEADERSHIP',
      title: 'Head of Sub-Executives & Volunteers',
      organization: 'East West University English Conversation Club (EWUECC)',
      date: '2024 - 2025',
      description:
        'Progressed from volunteer to Sub-Executive of Arts & Crafts, then Head. Led event and workshop coordination and designed promotional posters in Canva.',
      image: '/images/orgs/ewuecc.png',
      imageAlt: 'EWUECC organization logo',
      postUrl: 'https://www.facebook.com/photo.php?fbid=1224625912453564&id=100047185015473&set=a.748099713439522',
      tags: ['Leadership', 'Events', 'Canva'],
    },
    {
      category: 'CAMPUS OUTREACH',
      title: 'Campus Crew',
      organization: 'Banglay IELTS & Immigration Center',
      date: 'Feb 2025 - Sep 2025',
      description:
        'Represented the organization on campus, promoted events through social media campaigns and supported local outreach.',
      image: '/images/orgs/biic.png',
      imageAlt: 'BIIC organization logo',
      postUrl: 'https://www.facebook.com/photo.php?fbid=571666945933995&id=100092720820391&set=a.175838728850154',
      tags: ['Outreach', 'Promotion', 'Communication'],
    },
    {
      category: 'COMMUNITY INITIATIVES',
      title: 'Sub-Executive',
      organization: 'AHOBAN Foundation',
      date: '2021 - 2024',
      description:
        'Progressed from Campus Ambassador to Sub-Executive, supporting social welfare, fundraising and community initiatives including Winter Warmers and Feast with Families.',
      image: '/images/orgs/ahoban.png',
      imageAlt: 'AHOBAN Foundation logo',
      postUrl: 'https://www.facebook.com/photo.php?fbid=4682576128447326&id=224123104292673&set=a.231530316885285',
      tags: ['Social Welfare', 'Fundraising', 'Teamwork'],
    },
    {
      category: 'CAMPUS ENGAGEMENT',
      title: 'Campus Ambassador',
      organization: 'English Olympiad',
      date: '2020 - 2022',
      description:
        'Supported event promotion, coordination and social media engagement for campus initiatives.',
      image: '/images/orgs/eo.png',
      imageAlt: 'English Olympiad organization logo',
      postUrl: 'https://www.facebook.com/EnglishOlympiad/posts/sumaiya-jannat-arpa-campus-ambassador-english-olympiadideal-school-and-college-e/2078778598931050/',
      tags: ['Event Promotion', 'Coordination'],
    },
    {
      category: 'TECHNOLOGY & TEAMWORK',
      title: 'Coordinator',
      organization:
        'ISTARC - Ideal Science and Technology Aiming Research Council',
      date: '2018 - 2019',
      description:
        'Progressed from volunteer to Coordinator, supporting technology-related events, volunteer activities and event planning.',
      image: '/images/orgs/istarc.png',
      imageAlt: 'ISTARC organization logo',
      tags: ['Technology', 'Volunteering', 'Planning'],
    },
  ];

  const displayedExperience = useMemo(() => {
    return expSortAscending ? [...experienceItems].reverse() : experienceItems;
  }, [expSortAscending, experienceItems]);

  const credentialItems = [
    {
      category: 'UI/UX DESIGN',
      title: 'UI/UX Design Career Track Program',
      organization: 'OSTAD',
      date: 'Issued August 2026',
      certificateType: 'Certificate of Completion',
      image: '/images/certificates/ostad_marks_uiux.png',
      url: 'https://ostad.app/share/certificate/c47328-sumaiya-jannat-arpa',
    },
    {
      category: 'UI/UX DESIGN',
      title: 'UI/UX Design Career Track Program',
      organization: 'OSTAD',
      date: 'Issued August 2026',
      certificateType: 'Certificate of Assessment',
      image: '/images/certificates/ostad_certificate_uiux.png',
      url: 'https://ostad.app/share/certificate/c47329-sumaiya-jannat-arpa',
    },
    {
      category: 'ACADEMIC HONOR',
      title: '100% Merit Scholarship',
      organization: 'East West University',
      date: 'March 2023',
      description:
        'Awarded for four years, from Fall 2022 to Summer 2026, on the basis of SSC and HSC results.',
      image: '/images/certificates/meritEWU.png',
      url: 'https://www.ewubd.edu/storage/app/uploads/public/633/955/5d0/6339555d01897026666955.pdf',
    },
    {
      category: 'SCHOLARSHIP',
      title: 'Medha Lalon Fund Scholarship',
      organization: 'East West University',
      date: 'September 2025',
      description:
        'Scholarship of BDT 45,000 covering Fall 2025, Spring 2026 and Summer 2026.',
    },
    {
      category: 'AI & DATA',
      title: 'Data Analytics in the AI Era',
      organization: 'Grameenphone Ltd.',
      date: 'October 2026',
      certificateType: 'Certificate of Completion',
      image: '/images/certificates/dataAnalytics_gp.png',
      url: 'https://www.grameenphone.academy/cert/4d0d76a94ed7',
    },
    {
      category: 'AI & DATA',
      title: 'Data Foundations with AI',
      organization: 'Grameenphone Ltd.',
      date: 'September 2026',
      certificateType: 'Certificate of Completion',
      image: '/images/certificates/dataFoundations_gp.png',
      url: 'https://www.grameenphone.academy/cert/8967ba193ae6',
    },
    {
      category: 'AI & DATA',
      title: 'AI-Powered Analytics',
      organization: 'Grameenphone Ltd.',
      date: 'September 2026',
      certificateType: 'Certificate of Completion',
      image: '/images/certificates/aiAnalytics_gp.png',
      url: 'https://www.grameenphone.academy/cert/328de029d7fb',
    },
    {
      category: 'AI & DATA',
      title: 'From Insights to Influence',
      organization: 'Grameenphone Ltd.',
      date: 'September 2026',
      certificateType: 'Certificate of Completion',
      image: '/images/certificates/insights2influence_gp.png',
      url: 'https://www.grameenphone.academy/cert/7acbf531d985',
    },
    {
      category: 'PROFESSIONAL DEVELOPMENT',
      title: 'Unlock Career Opportunities – ERP Decoded',
      organization: 'Dot BD Solutions Limited',
      date: 'December 2025',
      certificateType: 'Certificate of Participation',
      image: '/images/certificates/dotBD_career.png',
    },
    {
      category: 'COMPETITION',
      title: '1st IELC National English Language Carnival',
      organization: 'Ideal English Language Club (IELC)',
      date: 'January 2017',
      description:
        'Wall Magazine Competition. Associated with Ideal School and College.',
      certificateType: 'Participation Certificate',
      image: '/images/certificates/ielcPrize.png',
    },
    {
      category: 'CERTIFICATE ARCHIVE',
      title: 'Other Certificates and Crests',
      organization: 'School achievements',
      image: '/images/certificates/otherCertficates.png',
      description:
        'A collection of certificates and crests from school days.',
    },
    {
      category: 'NATIONAL RECOGNITION',
      title: "Children's Gathering with the Honorable President",
      organization: 'Bangladesh Shishu Academy',
      date: '2015',
      certificateType: 'Official Participant Pass',
      image: '/images/certificates/shishuAcademy.png',
      description:
        'Selected as a trainee of Bangladesh Shishu Academy to participate in the special children’s gathering with the Honorable President at Bangabhaban (2015).',
    },
    {
      category: 'PERFORMING ARTS',
      title: 'Classical Dance',
      organization: 'Bangladesh Shishu Academy, Dhaka, Bangladesh',
      date: 'July 2013 – June 2016',
      certificateType: 'Completion Certificate',
      image: '/images/certificates/dance_shishuAcademy.png',
      description:
        'Completed a three-year certificate course in Nrittyakala (Classical Dance), gaining experience in classical and contemporary dance forms. Performed in cultural programs and annual dance showcases, including events on BTV and Ittadi. Collaborated in choreography and group performances, strengthening teamwork, coordination and confidence.',
    },
    {
      category: 'VISUAL ARTS',
      title: 'Drawing and Painting',
      organization: 'Bangladesh Shishu Academy, Dhaka, Bangladesh',
      date: 'July 2010 – June 2013',
      certificateType: 'Completion Certificate',
      image: '/images/certificates/art_shishuAcademy.png',
      description:
        'Completed a three-year certificate course in drawing and painting, focusing on visual composition, creativity and fine arts fundamentals. Participated in art exhibitions and creative workshops, including activities associated with Channel i.',
    },
  ];

  useEffect(() => {
    if (
      isCredentialHovered ||
      activeCredentialItem ||
      credentialItems.length < 2
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveCredentialIndex((current) =>
        (current + 1) % credentialItems.length
      );
    }, 4500);

    return () => window.clearInterval(timer);
  }, [
    isCredentialHovered,
    activeCredentialItem,
    credentialItems.length,
  ]);

  return (
    <>
      {/* 01. HERO / HOME SECTION — Faithfully Recreated from User's Designed Cover Image Reference */}
      <section className="hero-wireframe-section hero-cover-section" aria-label="Introduction">
        <div className="site-wrapper hero-wireframe-inner hero-cover-inner">

          {/* Layered Composition: Name "Sumaiya" in large bold solid typography behind center portrait */}
          <div className="hero-cover-composition">
            <div className="hero-cover-name" aria-hidden="true">
              <span>Sumaiya</span>
            </div>

            {/* Authentic cutout portrait layered in front of the name */}
            <div className="hero-cover-portrait">
              <HeroPortrait src={site.portrait || '/images/portrait.jpg'} />
            </div>
          </div>

          <h1 className="sr-only">Sumaiya Jannat Arpa - Portfolio</h1>

          {/* Floating Rounded Introduction Card overlapping the lower portrait bust */}
          <div className="hero-cover-card">
            <p className="hero-cover-card-text">
              “Hello, this is Sumaiya Jannat Arpa, a Software Engineering student passionate about UI/UX design, web development and software quality assurance, focused on building intuitive and functional digital experiences.”
            </p>
          </div>


          {/* Three Pill Action Buttons matching cover reference */}
          <div className="hero-cover-actions" role="group" aria-label="Hero actions">
            <a href="#projects" className="btn-cover-pill btn-cover-pill-secondary">
              <span>Explore My Works</span>
              <svg
                className="btn-cover-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>


            <a href="#contact" className="btn-cover-pill btn-cover-pill-dark">
              <span>Get in Touch</span>
              <svg
                className="btn-cover-icon"
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>

            <a
              href={site.cvUrl}
              download="Sumaiya_Jannat_Arpa_Resume.pdf"
              className="btn-cover-pill btn-cover-pill-primary"
              aria-label="Download Curriculum Vitae (PDF)"
            >
              <span>Download CV</span>
              <svg
                className="btn-cover-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
                <path d="M12 15V3" />
              </svg>
            </a>
          </div>

        </div>
      </section>

      {/* 02. AUTOMATICALLY MOVING KEYWORD CAROUSEL / MARQUEE */}
      <KeywordMarquee />

      {/* 03. ABOUT SECTION — Faithfully Redesigned to Match Visual Reference */}
      <section id="about" className="page-section ref-about-section">
        <div className="site-wrapper">
          {/* Top Intro: Cutout Portrait on Left, Heading & Editorial Blockquote on Right */}
          <div className="ref-about-intro-grid">
            <div className="ref-about-portrait-wrap">
              <img
                src={site.portrait || '/images/portrait.jpg'}
                alt="Sumaiya Jannat Arpa"
                className="ref-about-portrait-img"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="ref-about-bio-col">
              <h2 className="ref-about-heading">
                About <span className="ref-about-heading-bold">Sumaiya</span>
              </h2>

              <blockquote className="ref-about-quote">
                <span className="ref-about-quote-mark" aria-hidden="true">“</span>
                <p>
                  CSE undergraduate majoring in Software Engineering at East West University, with an outstanding academic record and merit scholarships. Skilled in design fundamentals of UI/UX, with growing knowledge of software development and Software Quality Assurance (SQA). Experienced in academic projects, UX research, prototyping, and team collaboration. Currently expanding my skills to build user-centered, reliable, and practical software solutions.
                </p>
              </blockquote>
            </div>
          </div>

          {/* Three Stacked Full-Width Panels Matching Reference Mockup */}

          <div className="ref-panels-stack">
            {/* 01. Education — Three Bent Vertical Stacked Cards */}
            <article
              className="ref-panel-card ref-panel-card-education"
              aria-labelledby="panel-heading-education"
            >
              <div className="ref-panel-heading-row">
                <div>
                  <h3 id="panel-heading-education" className="ref-panel-title">
                    Education
                  </h3>
                  <p className="ref-panel-kicker">Academic journey &amp; formal foundations</p>
                </div>
              </div>

              <div className="education-bent-stack" role="list" aria-label="Education milestones">
                {/* 01. East West University */}
                <div
                  className={`education-bent-card edu-bent-card-1 ${activeEduCard === 1 ? 'is-expanded is-active' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-expanded={activeEduCard === 1}
                  aria-label="East West University education details. Tap or click to expand or collapse"
                  onClick={() => setActiveEduCard((prev) => (prev === 1 ? null : 1))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveEduCard((prev) => (prev === 1 ? null : 1));
                    }
                  }}
                >
                  <div className="edu-card-glass-sheen" aria-hidden="true" />
                  <div className="edu-card-inner">
                    <div className="edu-card-topbar">
                      <div className="edu-institution-cluster">
                        <span className="edu-stage-tag">UNDERGRADUATE // B.SC.</span>
                        <h4 className="edu-institution-name">East West University</h4>
                      </div>
                      <span className="edu-date-badge">Fall 2022 — Summer 2026</span>
                    </div>

                    <p className="edu-qualification">
                      B.Sc. in Computer Science &amp; Engineering · <span className="edu-major-emphasis">Major: Software Engineering</span>
                    </p>

                    <div className="edu-highlights-pills">
                      <span className="edu-pill edu-pill-merit">
                        <span className="edu-pill-icon">★</span> 100% Merit Scholarship Awardee
                      </span>
                      <span className="edu-pill edu-pill-cgpa">CGPA: 3.48 / 4.00</span>
                      <span className="edu-pill">Dhaka, Bangladesh</span>
                    </div>
                  </div>
                </div>

                {/* 02. Ideal School and College - HSC */}
                <div
                  className={`education-bent-card edu-bent-card-2 ${activeEduCard === 2 ? 'is-expanded is-active' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-expanded={activeEduCard === 2}
                  aria-label="Ideal School and College HSC education details. Tap or click to expand or collapse"
                  onClick={() => setActiveEduCard((prev) => (prev === 2 ? null : 2))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveEduCard((prev) => (prev === 2 ? null : 2));
                    }
                  }}
                >
                  <div className="edu-card-glass-sheen" aria-hidden="true" />
                  <div className="edu-card-inner">
                    <div className="edu-card-topbar">
                      <div className="edu-institution-cluster">
                        <span className="edu-stage-tag">HIGHER SECONDARY // HSC</span>
                        <h4 className="edu-institution-name">Ideal School and College</h4>
                      </div>
                      <span className="edu-date-badge">Passing Year: 2021</span>
                    </div>

                    <p className="edu-qualification">
                      Higher Secondary Certificate (HSC) · <span className="edu-major-emphasis">Science Group</span>
                    </p>

                    <div className="edu-highlights-pills">
                      <span className="edu-pill edu-pill-merit">GPA: 5.00 / 5.00</span>
                      <span className="edu-pill">Motijheel, Dhaka</span>
                    </div>
                  </div>
                </div>

                {/* 03. Ideal School and College - SSC */}
                <div
                  className={`education-bent-card edu-bent-card-3 ${activeEduCard === 3 ? 'is-expanded is-active' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-expanded={activeEduCard === 3}
                  aria-label="Ideal School and College SSC education details. Tap or click to expand or collapse"
                  onClick={() => setActiveEduCard((prev) => (prev === 3 ? null : 3))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveEduCard((prev) => (prev === 3 ? null : 3));
                    }
                  }}
                >
                  <div className="edu-card-glass-sheen" aria-hidden="true" />
                  <div className="edu-card-inner">
                    <div className="edu-card-topbar">
                      <div className="edu-institution-cluster">
                        <span className="edu-stage-tag">SECONDARY // SSC</span>
                        <h4 className="edu-institution-name">Ideal School and College</h4>
                      </div>
                      <span className="edu-date-badge">Passing Year: 2019</span>
                    </div>

                    <p className="edu-qualification">
                      Secondary School Certificate (SSC) · <span className="edu-major-emphasis">Science Group</span>
                    </p>

                    <div className="edu-highlights-pills">
                      <span className="edu-pill edu-pill-merit">GPA: 5.00 / 5.00</span>
                      <span className="edu-pill">Motijheel, Dhaka</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 02. Experience & Volunteering — Ascending Staircase Experience Layout */}
            <article
              className="ref-panel-card ref-panel-card-experience visual-stack-panel staircase-experience-panel"
              aria-labelledby="panel-heading-experience"
            >
              <div className="ref-panel-heading-row">
                <div className="experience-heading-group">
                  <h3 id="panel-heading-experience" className="ref-panel-title">
                    Experience &amp; Leadership
                  </h3>
                  <p className="ref-panel-kicker">
                    Community leadership, outreach &amp; initiative progression
                  </p>
                </div>

                <div className="staircase-sort-toggle" role="group" aria-label="Staircase order">
                  <button
                    type="button"
                    className={`staircase-sort-btn ${expSortAscending ? 'is-active' : ''}`}
                    onClick={() => setExpSortAscending(true)}
                    aria-label="View career progression from early foundations to leadership"
                  >
                    Progression (2018 → 2025) ↑
                  </button>
                  <button
                    type="button"
                    className={`staircase-sort-btn ${!expSortAscending ? 'is-active' : ''}`}
                    onClick={() => setExpSortAscending(false)}
                    aria-label="View recent experience first"
                  >
                    Recent First ↓
                  </button>
                </div>
              </div>

              <div
                className="experience-staircase-track"
                role="list"
                aria-label="Ascending Experience career staircase"
              >
                {displayedExperience.map((item, idx) => {
                  const stepNumber = idx + 1;
                  const isExpanded = activeExpCardId === item.title;
                  return (
                    <div
                      className={`staircase-step-card staircase-step-${stepNumber} ${isExpanded ? 'is-expanded is-active' : ''}`}
                      key={item.title}
                      role="listitem"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-label={`${item.title} at ${item.organization}. Click or tap to expand`}
                      onClick={() => setActiveExpCardId((prev) => (prev === item.title ? null : item.title))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveExpCardId((prev) => (prev === item.title ? null : item.title));
                        }
                      }}
                    >
                      <div className="staircase-step-tread-accent" aria-hidden="true" />
                      <div className="exp-card-media-side" aria-hidden="true">
                        {item.image ? (
                          <img
                            className="exp-card-media-img exp-org-logo"
                            src={item.image}
                            alt={item.imageAlt || item.organization}
                            loading="lazy"
                          />
                        ) : (
                          <div className="exp-card-media-ph exp-org-logo-ph" aria-hidden="true">
                            {item.organization.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="exp-layered-card-inner">
                        <div className="exp-layered-top">
                          <div className="exp-org-brand">
                            <div className="exp-org-meta">
                              <div className="staircase-step-meta-row">
                                <span className="exp-category-tag">{item.category}</span>
                              </div>
                              <span className="exp-org-name">{item.organization}</span>
                            </div>
                          </div>

                          {item.date && (
                            <span className="exp-date-pill">{item.date}</span>
                          )}
                        </div>

                        <div className="exp-layered-body">
                          <h4 className="exp-role-title">{item.title}</h4>
                          {isExpanded && item.description && (
                            <p className="exp-description">{item.description}</p>
                          )}
                        </div>

                        {/* Inline expanded details when active */}
                        {isExpanded && item.postUrl && (
                          <div className="staircase-expanded-details">
                            <a
                              href={item.postUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="staircase-announcement-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Official post announcement ↗
                            </a>
                          </div>
                        )}

                        <div className="exp-layered-footer">
                          {item.tags?.length > 0 && (
                            <div className="exp-tags-cluster">
                              {item.tags.map((tag) => (
                                <span className="exp-tag-chip" key={tag}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <button
                            type="button"
                            className="exp-detail-trigger"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveExpCardId((prev) => (prev === item.title ? null : item.title));
                            }}
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? `Hide details for ${item.title}` : `View details for ${item.title}`}
                          >
                            <span>{isExpanded ? 'View less' : 'View details'}</span>
                            <span aria-hidden="true">{isExpanded ? ' ✕' : ' ↗'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            {/* 03. Awards & Certifications — Refined Slideshow */}
            <article
              className="ref-panel-card ref-panel-card-awards visual-stack-panel"
              aria-labelledby="panel-heading-awards"
            >
              <div className="ref-panel-heading-row">
                <div>
                  <h3 id="panel-heading-awards" className="ref-panel-title">
                    Awards &amp; Certifications
                  </h3>
                </div>
              </div>

              <div
                className="credential-showcase"
                onMouseEnter={() => setIsCredentialHovered(true)}
                onMouseLeave={() => setIsCredentialHovered(false)}
                aria-label="Awards and certifications slideshow"
              >
                {credentialItems.length > 0 && (
                  <>
                    <div className="credential-cards-row" key={activeCredentialIndex}>
                      {[0, 1, 2].map((offset) => {
                        const item =
                          credentialItems[
                            (activeCredentialIndex + offset) % credentialItems.length
                          ];
                        return (
                          <article
                            className="credential-card"
                            key={`${item.title}-${offset}`}
                            style={{ '--card-stagger': offset }}
                          >
                            <div
                              className="credential-card-media"
                              onClick={() => setActiveCredentialItem(item)}
                              title="Click to view full certificate"
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setActiveCredentialItem(item);
                                }
                              }}
                            >
                              {item.image ? (
                                <div className="credential-image-frame">
                                  <img
                                    src={item.image}
                                    alt={`${item.title} certificate`}
                                    className="credential-slide-img"
                                    loading="lazy"
                                  />
                                  <span className="credential-zoom-hint" aria-hidden="true">
                                    Click to enlarge ⤢
                                  </span>
                                </div>
                              ) : (
                                <div className="credential-thumbnail-placeholder">
                                  <span className="ph-icon" aria-hidden="true">📜</span>
                                  <strong>{item.organization}</strong>
                                  <span className="ph-hint">Official Academic Record</span>
                                </div>
                              )}
                            </div>

                            <div className="credential-card-body">
                              <div className="credential-slide-tags">
                                <span className="visual-stack-eyebrow">
                                  {item.category}
                                </span>
                                {item.certificateType && (
                                  <span className="credential-type-pill">
                                    {item.certificateType}
                                  </span>
                                )}
                              </div>

                              <h4 className="credential-card-title">{item.title}</h4>

                              <p className="credential-card-org">
                                <span className="cred-org-label">{item.organization}</span>
                                {item.date ? (
                                  <span className="cred-date-label"> · {item.date}</span>
                                ) : null}
                              </p>

                              <div className="credential-actions-strip">
                                <button
                                  type="button"
                                  className="ref-panel-cert-link"
                                  onClick={() => setActiveCredentialItem(item)}
                                >
                                  View Details &amp; Verify ↗
                                </button>
                                {item.url && (
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="credential-external-link"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    External Link ↗
                                  </a>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    <div className="credential-slide-controls">
                      <button
                        type="button"
                        className="credential-arrow"
                        aria-label="Previous certificate"
                        onClick={() =>
                          setActiveCredentialIndex(
                            (current) =>
                              (current - 1 + credentialItems.length) %
                              credentialItems.length
                          )
                        }
                        disabled={credentialItems.length < 2}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                      </button>

                      <div className="credential-dots-cluster">
                        <div className="credential-counter-badge" aria-live="polite">
                          <span className="counter-curr">{String(activeCredentialIndex + 1).padStart(2, '0')}</span>
                          <span className="counter-div">/</span>
                          <span className="counter-total">{String(credentialItems.length).padStart(2, '0')}</span>
                        </div>

                        <div
                          className="credential-dots"
                          aria-label="Choose a certificate"
                        >
                          {credentialItems.map((item, index) => (
                            <button
                              key={`credential-dot-${index}`}
                              type="button"
                              className={`credential-dot ${index === activeCredentialIndex
                                  ? "is-active"
                                  : ""
                                }`}
                              aria-label={`Show certificate ${index + 1}: ${item.title}`}
                              aria-current={
                                index === activeCredentialIndex ? "true" : undefined
                              }
                              onClick={() => setActiveCredentialIndex(index)}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="credential-arrow"
                        aria-label="Next certificate"
                        onClick={() =>
                          setActiveCredentialIndex(
                            (current) => (current + 1) % credentialItems.length
                          )
                        }
                        disabled={credentialItems.length < 2}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </article>

          </div>

        </div>
      </section>


      {/* Experience Details Modal */}
      {activeExperienceItem && (
        <div
          className="detail-modal-backdrop"
          onClick={() => setActiveExperienceItem(null)}
        >
          <section
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="experience-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="detail-modal-close"
              onClick={() => setActiveExperienceItem(null)}
              aria-label="Close experience details"
            >
              ×
            </button>

            <span className="visual-stack-eyebrow">
              {activeExperienceItem.category}
            </span>

            <h3 id="experience-modal-title">
              {activeExperienceItem.title}
            </h3>

            <p className="visual-stack-organization">
              {activeExperienceItem.organization}
            </p>

            {activeExperienceItem.date && (
              <p className="visual-stack-date">
                {activeExperienceItem.date}
              </p>
            )}

            <p className="detail-modal-description">
              {activeExperienceItem.description}
            </p>

            {activeExperienceItem.tags?.length > 0 && (
              <div className="ref-panel-chips">
                {activeExperienceItem.tags.map((tag) => (
                  <span className="ref-panel-chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {activeExperienceItem.postUrl && (
              <a
                href={activeExperienceItem.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ref-panel-cert-link"
              >
                View post ↗
              </a>
            )}
          </section>
        </div>
      )}

      {/* Credential Details Modal */}
      {activeCredentialItem && (
        <div
          className="credential-preview-backdrop"
          onClick={() => setActiveCredentialItem(null)}
        >
          <section
            className="credential-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="credential-preview-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="credential-preview-close"
              onClick={() => setActiveCredentialItem(null)}
              aria-label="Close credential details"
            >
              ×
            </button>

            <span className="visual-stack-eyebrow">
              {activeCredentialItem.category}
            </span>

            <h3 id="credential-preview-title">
              {activeCredentialItem.title}
            </h3>

            <p>{activeCredentialItem.organization}</p>

            {activeCredentialItem.date && (
              <p>{activeCredentialItem.date}</p>
            )}

            {activeCredentialItem.certificateType && (
              <p>{activeCredentialItem.certificateType}</p>
            )}

            {activeCredentialItem.description && (
              <p className="credential-preview-description">
                {activeCredentialItem.description}
              </p>
            )}

            {activeCredentialItem.image && (
              <img
                className="credential-preview-image"
                src={activeCredentialItem.image}
                alt={`${activeCredentialItem.title} certificate`}
                loading="lazy"
              />
            )}

            {activeCredentialItem.url && (
              <div className="credential-modal-links">
                <a
                  href={activeCredentialItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ref-panel-cert-link"
                >
                  Certificate ↗
                </a>
              </div>
            )}
          </section>
        </div>
      )}


      {/* 04. SKILLS SECTION */}
      <section id="skills" className="page-section section-skills-clean">
        <div className="site-wrapper">
          <div className="skills-section-header-wrap">
            <h2 className="ref-about-heading skills-section-heading">
              Curated Skills &amp; <span className="ref-about-heading-bold">Capabilities</span>
            </h2>
          </div>

          <SkillsCapsules />
        </div>
      </section>

      {/* 05. PROJECTS / WORKS SECTION — EXACTLY FOUR MAIN CATEGORIES */}
      <section id="projects" className="page-section section-categories-clean">
        <span id="works" style={{ position: 'absolute', top: '-5.5rem' }} aria-hidden="true" />
        <div className="site-wrapper">
          <SectionHeader
            title={<>Four Core <span className="ref-about-heading-bold">Project Categories</span></>}
          />

          <FourCategoryCards onSelectCategory={(catId) => setActiveCategory(catId)} />

          {/* Additional GitHub Repositories (Live REST API integration) */}
          <AdditionalGitHubRepos />

          {/* Accessible Project Modal revealing category work */}
          {activeCategory && (
            <CategoryProjectModal
              categoryId={activeCategory}
              onClose={() => setActiveCategory(null)}
            />
          )}
        </div>
      </section>

      {/* 06. REVIEWS SECTION */}
      <section id="reviews" className="page-section section-reviews-clean">
        <div className="site-wrapper">
          <SectionHeader
            title={<>Peer Endorsements &amp; <span className="ref-about-heading-bold">Recommendations</span></>}
          />

          <ReviewsSection items={reviews} />
        </div>
      </section>

      {/* 07. GET TO KNOW SUMAIYA (FAQ SECTION) */}
      <section id="faq" className="page-section section-faq">
        <div className="site-wrapper">
          <SectionHeader
            title={<>Get to Know <span className="ref-about-heading-bold">Sumaiya</span></>}
          />

          <FAQSection />
        </div>
      </section>
    </>
  );
}
// -------------------------------------------------------------
// 02. WORK CATALOG PAGE
// -------------------------------------------------------------
export function Work() {
  usePageTitle('Selected Work');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = projects.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  return (
    <div className="work-catalog-page">
      <header className="page-hero-header">
        <div className="site-wrapper">
          <span className="sec-tag">Project Archive</span>
          <h1 className="page-hero-title">Selected Work &amp; <em>Case Studies.</em></h1>
          <p className="page-hero-lead">
            Curated engineering projects, user-centered interaction designs, quality assurance matrices, and visual communications.
          </p>

          <div className="category-filters-strip" role="group" aria-label="Filter projects by category">
            <button
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              aria-pressed={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            >
              All Projects ({projects.length})
            </button>
            {Object.values(categories).map((c) => {
              const count = projects.filter((p) => p.category === c.id).length;
              return (
                <button
                  key={c.id}
                  className={`filter-btn ${selectedCategory === c.id ? 'active' : ''}`}
                  aria-pressed={selectedCategory === c.id}
                  onClick={() => setSelectedCategory(c.id)}
                >
                  {c.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <section className="page-section">
        <div className="site-wrapper">
          <div className="projects-editorial-grid">
            {filtered.map((p, idx) => (
              <ProjectCard key={p.slug} project={p} index={idx} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-catalog-state">
              <p>No projects recorded in this category yet.</p>
            </div>
          )}

          {/* Additional GitHub Repositories (Live REST API integration) */}
          <AdditionalGitHubRepos className="additional-github-in-work" />
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 03. CASE STUDY DETAIL VIEW (/work/:slug)
// Specialized templates for Software, UI/UX, SQA, and Graphic Design
// -------------------------------------------------------------
export function Project() {
  const { slug } = useParams();
  const p = projects.find((x) => x.slug === slug);
  usePageTitle(p ? p.title : 'Project');

  if (!p) {
    return (
      <div className="site-wrapper page-section">
        <div className="not-found-box">
          <span className="sec-tag">ERROR 404</span>
          <h2>PROJECT NOT FOUND</h2>
          <p>The requested project slug does not exist in the catalog.</p>
          <Link to="/work" className="btn solid">RETURN TO WORK DIRECTORY ↗</Link>
        </div>
      </div>
    );
  }

  const cat = categories[p.category] || { label: p.category, code: '00' };

  // Category-specific section mapping
  const categoryTemplates = {
    software: [
      { key: 'overview', title: '01. Overview' },
      { key: 'problem', title: '02. Problem Definition' },
      { key: 'features', title: '03. Core Features' },
      { key: 'architecture', title: '04. System Architecture' },
      { key: 'stack', title: '05. Technology Stack' },
      { key: 'implementation', title: '06. Engineering Implementation' },
      { key: 'testing', title: '07. Verification & Testing' },
      { key: 'challenges', title: '08. Technical Challenges & Solutions' },
      { key: 'futureImprovements', title: '09. Roadmap & Future Work' },
    ],
    uiux: [
      { key: 'challenge', title: '01. Design Challenge' },
      { key: 'research', title: '02. User Research & Methodology' },
      { key: 'findings', title: '03. Key Insights & Opportunities' },
      { key: 'personas', title: '04. User Personas' },
      { key: 'journeyMaps', title: '05. Journey Mapping' },
      { key: 'userFlows', title: '06. User Flows & IA' },
      { key: 'wireframes', title: '07. Wireframes & Spatial Layout' },
      { key: 'iterations', title: '08. Usability Testing & Iterations' },
      { key: 'finalScreens', title: '09. High-Fidelity Design System' },
      { key: 'prototype', title: '10. Interactive Prototype' },
      { key: 'individualContribution', title: '11. Individual Contribution' },
    ],
    sqa: [
      { key: 'scope', title: '01. Testing Scope & Boundaries' },
      { key: 'testScenarios', title: '02. Test Scenarios' },
      { key: 'testCases', title: '03. Test Cases Specification' },
      { key: 'apiRequests', title: '04. API Verification Suite' },
      { key: 'assertions', title: '05. Automated Assertions' },
      { key: 'executionResults', title: '06. Execution Results & Pass Rate' },
      { key: 'bugInvestigation', title: '07. Defect Investigation & Root Cause' },
      { key: 'testReports', title: '08. Test Summary Report' },
    ],
    graphic: [
      { key: 'brief', title: '01. Creative Brief' },
      { key: 'targetAudience', title: '02. Target Audience' },
      { key: 'creativeDirection', title: '03. Creative Direction & Theme' },
      { key: 'visualDecisions', title: '04. Typographic & Color Decisions' },
      { key: 'finalArtwork', title: '05. Final Deliverables' },
      { key: 'toolsAndTechniques', title: '06. Tools & Production Prep' },
      { key: 'contribution', title: '07. Designer Contribution' },
    ],
  };

  const sectionsToRender = categoryTemplates[p.category] || [];

  // Find next and previous projects for navigation
  const currentIndex = projects.findIndex((x) => x.slug === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <article className="case-study-page">
      {/* CASE STUDY TOP BAR */}
      <div className="cs-top-bar">
        <div className="site-wrapper cs-top-inner">
          <Link to="/work" className="cs-back-link">
            ← Back to Selected Work
          </Link>
          <span className="cs-category-badge">{cat.label}</span>
          <span className="cs-index-counter">PROJECT [{p.orderNum || String(currentIndex + 1).padStart(2, '0')}]</span>
        </div>
      </div>

      {/* CASE STUDY HERO */}
      <header className="cs-hero-section">
        <div className="site-wrapper">
          <div className="cs-hero-grid">
            <div className="cs-hero-main">
              <span className="sec-tag">{cat.tag || 'SPECIFICATION'} // {p.status}</span>
              <h1 className="cs-main-title">{p.title}</h1>
              <p className="cs-summary-lead">{p.summary}</p>
            </div>

            <aside className="cs-meta-sidebar">
              <div className="cs-meta-box">
                <div className="cs-meta-field">
                  <span className="cs-meta-label">ROLE:</span>
                  <span className="cs-meta-value">{p.role}</span>
                </div>
                {p.timeline && (
                  <div className="cs-meta-field">
                    <span className="cs-meta-label">TIMELINE:</span>
                    <span className="cs-meta-value">{p.timeline}</span>
                  </div>
                )}
                <div className="cs-meta-field">
                  <span className="cs-meta-label">CATEGORY:</span>
                  <span className="cs-meta-value">{cat.label}</span>
                </div>
                <div className="cs-meta-field">
                  <span className="cs-meta-label">STATUS:</span>
                  <span className="cs-meta-value">{p.status}</span>
                </div>
                {p.tools && p.tools.length > 0 && (
                  <div className="cs-meta-field">
                    <span className="cs-meta-label">TOOLS &amp; STACK:</span>
                    <div className="cs-tools-wrap">
                      {p.tools.map((t, idx) => (
                        <span key={idx} className="tool-pill">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(p.link || p.repo) && (
                  <div className="cs-meta-field cs-links-field">
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn solid w-full text-center">
                        {p.category === 'uiux' ? 'Behance Case Study ↗' : 'Live Application ↗'}
                      </a>
                    )}
                    {p.repo && (
                      <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn outline w-full text-center">
                        Source Code ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </header>

      {/* COVER IMAGE */}
      <div className="cs-cover-wrapper">
        <div className="site-wrapper">
          <Img
            src={p.cover}
            alt={p.coverAlt || `${p.title} featured preview`}
            ratio={p.aspectRatio || '16/10'}
            category={p.category}
            label={p.title}
          />
        </div>
      </div>

      {/* EDITORIAL NARRATIVE SECTIONS */}
      <section className="cs-content-section">
        <div className="site-wrapper cs-content-grid">
          <div className="cs-narrative-col">
            {sectionsToRender.map((sec) => {
              const content = p.sections?.[sec.key];
              if (!content || content.trim() === '') return null;

              return (
                <section key={sec.key} className="cs-section-block">
                  <h2 className="cs-section-heading">{sec.title}</h2>
                  <p className="cs-section-body">{content}</p>
                </section>
              );
            })}

            {/* STRUCTURED EVIDENCE GALLERY */}
            {p.evidence && p.evidence.length > 0 && (
              <section className="cs-section-block cs-evidence-block">
                <h2 className="cs-section-heading">Visual Evidence &amp; Artifacts</h2>
                <div className="cs-evidence-grid">
                  {p.evidence.map((ev, eIdx) => (
                    <figure key={eIdx} className="cs-evidence-figure">
                      <Img
                        src={ev.src}
                        alt={ev.alt || `Evidence ${eIdx + 1}`}
                        ratio={ev.ratio || '16/10'}
                        category={p.category}
                        label={ev.alt}
                      />
                      {ev.caption && <figcaption className="cs-evidence-caption">{ev.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="cs-contents-toc">
            <div className="toc-sticky-box">
              <span className="toc-title">Contents</span>
              <ul className="toc-list">
                {sectionsToRender.map((sec) => {
                  if (!p.sections?.[sec.key]) return null;
                  return (
                    <li key={sec.key}>
                      <span className="toc-bullet">▪</span>
                      <span>{sec.title}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* NEXT / PREV PROJECT FOOTER */}
      <nav className="cs-project-nav" aria-label="Project Navigation">
        <div className="site-wrapper cs-nav-grid">
          {prevProject ? (
            <Link to={`/work/${prevProject.slug}`} className="cs-nav-item cs-nav-prev">
              <span className="cs-nav-direction">← PREVIOUS PROJECT</span>
              <span className="cs-nav-title">{prevProject.title}</span>
              <span className="cs-nav-cat">{categories[prevProject.category]?.label}</span>
            </Link>
          ) : (
            <div className="cs-nav-empty" />
          )}

          <Link to="/work" className="cs-nav-index-link">
            All Projects Directory ↗
          </Link>

          {nextProject ? (
            <Link to={`/work/${nextProject.slug}`} className="cs-nav-item cs-nav-next">
              <span className="cs-nav-direction">NEXT PROJECT →</span>
              <span className="cs-nav-title">{nextProject.title}</span>
              <span className="cs-nav-cat">{categories[nextProject.category]?.label}</span>
            </Link>
          ) : (
            <div className="cs-nav-empty" />
          )}
        </div>
      </nav>
    </article>
  );
}

// -------------------------------------------------------------
// 04. GRAPHIC DESIGN & VISUAL ARCHIVE PAGE
// -------------------------------------------------------------
export function Gallery() {
  usePageTitle('Visual Experiments & Graphic Design');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const categoriesList = ['all', 'Event Poster', 'Campaign Graphic', 'Promotional Banner', 'Social Media Visual'];

  const filteredItems = gallery.filter(
    (item) => activeFilter === 'all' || item.category === activeFilter
  );

  return (
    <div className="gallery-page">
      <header className="page-hero-header">
        <div className="site-wrapper">
          <span className="sec-tag">Visual Archive</span>
          <h1 className="page-hero-title">Visual Experiments &amp; <em>Graphic Design.</em></h1>
          <p className="page-hero-lead">
            An editorial archive of Canva event posters, promotional banners, social media collateral, and educational campaign designs.
          </p>

          <div className="category-filters-strip" role="group" aria-label="Filter visual archive">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                aria-pressed={activeFilter === cat}
                onClick={() => setActiveFilter(cat)}
              >
                {cat.toUpperCase()} {cat === 'all' ? `(${gallery.length})` : ''}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="page-section">
        <div className="site-wrapper">
          <div className="archive-collage-grid archive-full-grid">
            {filteredItems.map((item, idx) => {
              const originalIndex = gallery.findIndex((g) => g.id === item.id);
              return (
                <article
                  key={item.id}
                  className={`archive-item item-ratio-${item.ratio.replace('/', '-')}`}
                  onClick={() => setActiveLightboxIndex(originalIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveLightboxIndex(originalIndex);
                    }
                  }}
                  aria-label={`Open visual: ${item.title}`}
                >
                  <div className="archive-media-wrapper">
                    <Img
                      src={item.src}
                      alt={item.title}
                      ratio={item.ratio}
                      category="graphic"
                      label={item.title}
                    />
                    <div className="archive-item-hover">
                      <span className="archive-hover-title">{item.title}</span>
                      <span className="archive-hover-org">{item.organization}</span>
                      <span className="archive-expand-pill">Inspect ↗</span>
                    </div>
                  </div>
                  <div className="archive-caption-line">
                    <span className="archive-tag">{item.category}</span>
                    <span className="archive-year">{item.year}</span>
                  </div>
                </article>
              );
            })}
          </div>

          {activeLightboxIndex !== null && (
            <LightboxModal
              item={gallery[activeLightboxIndex]}
              index={activeLightboxIndex}
              total={gallery.length}
              onNext={() => setActiveLightboxIndex((activeLightboxIndex + 1) % gallery.length)}
              onPrev={() => setActiveLightboxIndex((activeLightboxIndex - 1 + gallery.length) % gallery.length)}
              onClose={() => setActiveLightboxIndex(null)}
            />
          )}
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 05. ABOUT PAGE
// -------------------------------------------------------------
export function About() {
  usePageTitle('About');

  return (
    <div className="about-page">
      <header className="page-hero-header">
        <div className="site-wrapper">
          <span className="sec-tag">Background &amp; Identity</span>
          <h1 className="page-hero-title">Building thoughtful experiences through <em>code, design &amp; quality.</em></h1>
          <p className="page-hero-lead">{about.subheading}</p>
        </div>
      </header>

      <section className="page-section">
        <div className="site-wrapper about-split-layout">
          <div className="about-portrait-col">
            <Img
              src={site.portrait}
              ratio="4/5"
              category="portrait"
              label={`Portrait of ${site.name}`}
            />
            <div className="portrait-caption">
              <span className="caption-name">{site.name}</span>
              <span className="caption-sub">East West University · CSE Undergraduate</span>
            </div>

            <div className="portrait-meta-card">
              <span className="sec-tag">Academic Profile</span>
              <div className="spec-row">
                <span className="spec-label">DEGREE:</span>
                <span className="spec-val">B.Sc. in CSE</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">CAMPUS:</span>
                <span className="spec-val">{site.institution}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">LOCATION:</span>
                <span className="spec-val">{site.location}</span>
              </div>
            </div>
          </div>

          <div className="about-content-col">
            <h2 className="editorial-lead-title">The Intersection of <em>Logic</em> &amp; <em>Visual Expression</em></h2>
            <div className="about-bio-paragraphs">
              {about.bio.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="disciplines-detail-stack">
              <h3 className="section-subheading">Core Areas of Practice</h3>
              <div className="disciplines-grid">
                {(about.disciplines || about.pillars || []).map((d, idx) => (
                  <article key={idx} className="discipline-card">
                    <div className="disc-header">
                      <span className="disc-num">0{idx + 1}</span>
                      <span className="disc-code">{d.code}</span>
                    </div>
                    <h4 className="disc-title">{d.title}</h4>
                    <p className="disc-desc">{d.description}</p>
                    <div className="disc-skills">
                      {(d.skills || d.focus || []).map((skill, sIdx) => (
                        <span key={sIdx} className="disc-skill-chip">{skill}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* EDUCATION */}
            <div className="education-detail-section">
              <h3 className="section-subheading">Formal Education</h3>
              {(about.education || []).map((edu, idx) => (
                <div key={idx} className="education-card">
                  <div className="edu-header">
                    <div>
                      <h4 className="edu-degree">{edu.degree}</h4>
                      <p className="edu-school">{edu.school || edu.institution} — {edu.location}</p>
                    </div>
                    <span className="edu-status">{edu.status || edu.timeline}</span>
                  </div>
                  <p className="edu-details">{edu.details}</p>

                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="edu-coursework-box">
                      <span className="coursework-title">RELEVANT COURSEWORK:</span>
                      <div className="coursework-tags">
                        {edu.coursework.map((course, cIdx) => (
                          <span key={cIdx} className="tool-pill">{course}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="about-actions-row">
              <Link to="/experience" className="btn solid">
                Explore Leadership &amp; Experience ↗
              </Link>
              <Link to="/resume" className="btn outline">
                Download Curriculum Vitae ↘
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 06. EXPERIENCE & LEADERSHIP PAGE
// -------------------------------------------------------------
export function Experience() {
  usePageTitle('Experience & Leadership');

  return (
    <div className="experience-page">
      <header className="page-hero-header">
        <div className="site-wrapper">
          <span className="sec-tag">Leadership &amp; Service</span>
          <h1 className="page-hero-title">Experience &amp; <em>Leadership.</em></h1>
          <p className="page-hero-lead">
            Documented timeline of student leadership, extracurricular coordination, and organizational contributions across campus and community platforms.
          </p>
        </div>
      </header>

      <section className="page-section">
        <div className="site-wrapper">
          <Timeline entries={experience} />
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 07. EDUCATION & ACHIEVEMENTS PAGE
// -------------------------------------------------------------
export function Education() {
  usePageTitle('Education & Achievements');

  return (
    <div className="achievements-page">
      <header className="page-hero-header">
        <div className="site-wrapper">
          <span className="sec-tag">Academic Standing</span>
          <h1 className="page-hero-title">Education &amp; <em>Achievements.</em></h1>
          <p className="page-hero-lead">
            Formal academic coursework at East West University, merit scholarships, verified Ostad certifications, and competition recognitions.
          </p>
        </div>
      </header>

      <section className="page-section">
        <div className="site-wrapper credentials-grid">
          {/* EDUCATION */}
          <div className="cred-col">
            <h2 className="cred-col-title">01. Formal Education</h2>
            {(about.education || []).map((edu, idx) => (
              <article key={idx} className="cred-card">
                <span className="cred-date">{edu.dates || edu.timeline}</span>
                <h3 className="cred-title">{edu.degree}</h3>
                <p className="cred-issuer">{edu.school || edu.institution} ({edu.location})</p>
                <p className="cred-desc">{edu.details}</p>
                {edu.coursework && edu.coursework.length > 0 && (
                  <div className="coursework-tags mt-2">
                    {edu.coursework.map((c, cIdx) => (
                      <span key={cIdx} className="tool-pill">{c}</span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* SCHOLARSHIPS & HONORS */}
          <div className="cred-col">
            <h2 className="cred-col-title">02. Scholarships &amp; Honors</h2>
            {(about.scholarships || []).map((sch, idx) => (
              <article key={idx} className="cred-card">
                <span className="cred-date">{sch.dates}</span>
                <h3 className="cred-title">{sch.title}</h3>
                <p className="cred-issuer">{sch.issuer}</p>
                <p className="cred-desc">{sch.description}</p>
              </article>
            ))}

            {(about.achievements || about.earlierAchievements || []).map((ach, idx) => (
              <article key={idx} className="cred-card mt-3">
                <span className="cred-date">{ach.date || ach.context}</span>
                <h3 className="cred-title">{ach.title}</h3>
                <p className="cred-issuer">{ach.issuer || ach.context}</p>
                <p className="cred-desc">{ach.note || ach.description}</p>
              </article>
            ))}
          </div>

          {/* CERTIFICATIONS */}
          <div className="cred-col">
            <h2 className="cred-col-title">03. Verified Credentials</h2>
            {(about.certificates || []).map((cert, idx) => (
              <article key={idx} className="cred-card">
                <span className="cred-date">{cert.date || cert.dates}</span>
                <h3 className="cred-title">{cert.title}</h3>
                <p className="cred-issuer">{cert.issuer}</p>
                <p className="cred-desc">{cert.credentialId}</p>
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="editorial-link mt-2">
                    Verify Credential ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export const Achievements = Education;

// -------------------------------------------------------------
// 08. RESUME PAGE
// -------------------------------------------------------------
export function Resume() {
  usePageTitle('Curriculum Vitae');

  return (
    <div className="resume-page">
      <header className="page-hero-header">
        <div className="site-wrapper">
          <span className="sec-tag">Curriculum Vitae</span>
          <h1 className="page-hero-title">Curriculum <em>Vitae.</em></h1>
          <p className="page-hero-lead">
            A verified record of my academic standing, technical competencies, software projects, UI/UX research, and campus leadership.
          </p>
        </div>
      </header>

      <section className="page-section">
        <div className="site-wrapper resume-split-layout">
          <div className="resume-preview-col">
            <div className="resume-sheet-frame" id="printable-resume">
              <div className="resume-sheet-header">
                <h2>{site.name.toUpperCase()}</h2>
                <span className="resume-sheet-sub">CSE Undergraduate · Software Engineering Major</span>
                <span className="resume-sheet-loc">{site.location} — {site.institution} | {site.email}</span>
              </div>
              <div className="resume-sheet-body">
                <div className="sheet-sec">
                  <span className="sheet-sec-title">01. EDUCATION</span>
                  <div className="sheet-item">
                    <div className="sheet-item-row">
                      <strong>East West University</strong>
                      <span className="sheet-dates">Fall 2022 – Present</span>
                    </div>
                    <p>Bachelor of Science in Computer Science and Engineering (Major in Software Engineering)</p>
                  </div>
                  <div className="sheet-item mt-2">
                    <div className="sheet-item-row">
                      <strong>Ideal School and College</strong>
                      <span className="sheet-dates">2019 (SSC) | 2021 (HSC)</span>
                    </div>
                    <p>Secondary &amp; Higher Secondary Certificate in Science</p>
                  </div>
                </div>

                <div className="sheet-sec">
                  <span className="sheet-sec-title">02. SCHOLARSHIPS &amp; RECOGNITION</span>
                  <ul className="sheet-list">
                    <li><strong>100% Merit Scholarship at East West University:</strong> Awarded across semesters for academic excellence.</li>
                    <li><strong>Medha Lalon Fund Scholarship:</strong> Academic scholarship grant worth BDT 45,000.</li>
                  </ul>
                </div>

                <div className="sheet-sec">
                  <span className="sheet-sec-title">03. TECHNICAL &amp; DESIGN COMPETENCIES</span>
                  <p><strong>Development:</strong> JavaScript (ES6+), React, HTML5, CSS3, TypeScript, Python, Java, Node.js, Express, MongoDB, Git &amp; GitHub, REST APIs</p>
                  <p className="mt-2"><strong>UI/UX &amp; Research:</strong> Figma, UX Research, User Personas, Journey Mapping, User Flows, Wireframing, Prototyping, Design Systems</p>
                  <p className="mt-2"><strong>Quality Assurance:</strong> Manual Testing, Test Cases &amp; Scenarios, API Testing (Postman), Newman CLI, Selenium WebDriver, Bug Triage</p>
                  <p className="mt-2"><strong>Creative:</strong> Canva Pro, Event Posters, Promotional Collateral, Bilingual Typography</p>
                </div>

                <div className="sheet-sec">
                  <span className="sheet-sec-title">04. FEATURED PROJECTS</span>
                  <div className="sheet-item">
                    <strong>PortfolioBanao</strong> — Full-stack portfolio creation platform (React, Vite, Node.js, Express, MongoDB)
                  </div>
                  <div className="sheet-item mt-2">
                    <strong>OneCitizen (Super-App Case Study)</strong> — Government services portal (Ostad UI/UX, User Research, Wireframing, Figma Design System)
                  </div>
                  <div className="sheet-item mt-2">
                    <strong>SQA Automation Suite</strong> — Automated API test collections and UI test execution (Postman, Newman, Selenium, HTML Test Reports)
                  </div>
                </div>

                <div className="sheet-sec">
                  <span className="sheet-sec-title">05. LEADERSHIP &amp; ORGANIZATIONAL CONTRIBUTIONS</span>
                  <div className="sheet-item">
                    <strong>EWU English Conversation Club:</strong> Progressive advancement from Volunteer to Sub-Executive (Arts &amp; Crafts) to Head of Sub-Executives &amp; Volunteers. Led visual communications and event poster design.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="resume-actions-col">
            <div className="resume-card-box">
              <span className="sec-tag">Document Actions</span>
              <h3 className="resume-card-title">Download or Print CV</h3>
              <p className="resume-card-desc">
                Formatted for academic evaluation, competitive internships, and technical recruiter review.
              </p>

              <div className="resume-cta-cluster">
                {site.resume.file && site.resume.file.trim() !== '' ? (
                  <a href={site.resume.file} download="Sumaiya_Jannat_Arpa_Resume.pdf" className="btn solid w-full text-center">
                    Download PDF Resume ↘
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn outline w-full text-center mt-2"
                >
                  Print / Export to PDF 🖨️
                </button>
              </div>

              <div className="resume-placeholder-box mt-3">
                <p className="placeholder-note">
                  💡 <strong>PDF Placement:</strong> To link your official PDF document, place your file at <code>public/resume/Sumaiya_Jannat_Arpa_Resume.pdf</code>.
                </p>
              </div>

              <div className="resume-spec-details">
                <div className="spec-row">
                  <span className="spec-label">LAST UPDATED:</span>
                  <span className="spec-val">{site.resume.lastUpdated || 'Current'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">FORMAT:</span>
                  <span className="spec-val">Standard A4 / PDF</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">APPLICABILITY:</span>
                  <span className="spec-val">Software Engineering / UI/UX / SQA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 09. CONTACT PAGE
// -------------------------------------------------------------
export function Contact() {
  usePageTitle('Contact');

  return (
    <div className="contact-page">
      <header className="page-hero-header">
        <div className="site-wrapper">
          <span className="sec-tag">Communications</span>
          <h1 className="page-hero-title">Get in <em>Touch.</em></h1>
          <p className="page-hero-lead">
            Whether for software engineering projects, internship opportunities, UI/UX design dialogue, or academic networking.
          </p>
        </div>
      </header>

      <section className="page-section">
        <div className="site-wrapper contact-page-layout">
          <div className="contact-info-col">
            <h2 className="editorial-lead-title">Direct Inquiries &amp; <span className="ref-about-heading-bold">Channels</span></h2>
            <p className="contact-text-body">
              I welcome inquiries regarding software engineering internships, frontend development, UI/UX design opportunities, and SQA trainee roles. Feel free to reach out directly via email or connect through professional platforms.
            </p>

            <div className="contact-institution-card">
              <span className="sec-tag">Academic Affiliation</span>
              <h3>East West University</h3>
              <p>Department of Computer Science and Engineering (Software Engineering Major)</p>
              <p className="coord-chip mt-2">{site.coordinates} // DHAKA, BANGLADESH</p>
            </div>
          </div>

          <div className="contact-links-col">
            <Socials />
          </div>
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 10. SKILLS PAGE (/skills)
// -------------------------------------------------------------
export function Skills() {
  usePageTitle('Skills & Competencies');

  return (
    <div className="skills-page">
      <header className="page-hero-header">
        <div className="site-wrapper">
          <span className="sec-tag">Capabilities</span>
          <h1 className="page-hero-title">Technical &amp; Creative <em>Capabilities.</em></h1>
          <p className="page-hero-lead">
            Structured inventory across Software Development, UI/UX Research &amp; Design, Software Quality Assurance, and Creative Communication. Qualitative competencies grounded in real project execution and coursework.
          </p>
        </div>
      </header>

      <section className="page-section">
        <div className="site-wrapper">
          <SkillsOverview />
        </div>
      </section>
    </div>
  );
}
