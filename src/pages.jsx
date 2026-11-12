import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { site } from './data/site.js';
import { projects, categories } from './data/projects.js';
import { useProjects } from './context/ProjectsContext.jsx';
import { usePortfolioData, useExperience, useEducation, useCertificates, useReviews } from './context/PortfolioDataContext.jsx';
import { experience } from './data/experience.js';
import { about } from './data/about.js';
import { gallery } from './data/gallery.js';
import { reviews } from './data/reviews.js';
import {
  Icon,
  Img,
  SectionHeader,
  HeroPortrait,
  ProjectCarousel,
  KeywordMarquee,
  FourCategoryCards,
  CategoryProjectModal,
  SkillsCapsules,
  SkillsOverview,
  ReviewsSection,
  FAQSection,
  FeaturedImageSlideshow,
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
            <button className="lightbox-close-btn" onClick={onClose} aria-label="Close dialog">
              <Icon name="x" size={18} />
            </button>
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
              <Icon name="arrow-left" size={14} />
              <span>PREV</span>
            </button>
            <span className="lightbox-counter">{index + 1} / {total}</span>
            <button className="btn outline" onClick={onNext} aria-label="Next image">
              <span>NEXT</span>
              <Icon name="arrow-right" size={14} />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

// -------------------------------------------------------------
// 01. HOMEPAGE STATIC FALLBACK DATA & ASSET RESOLVERS
// -------------------------------------------------------------
const ORG_LOGO_MAP = {
  ewuecc: '/images/orgs/ewuecc.png',
  conversation: '/images/orgs/ewuecc.png',
  'east west university english conversation club': '/images/orgs/ewuecc.png',
  biic: '/images/orgs/biic.png',
  ielts: '/images/orgs/biic.png',
  immigration: '/images/orgs/biic.png',
  'banglay ielts': '/images/orgs/biic.png',
  ahoban: '/images/orgs/ahoban.png',
  olympiad: '/images/orgs/eo.png',
  'english olympiad': '/images/orgs/eo.png',
  istarc: '/images/orgs/istarc.png',
  'science and technology': '/images/orgs/istarc.png',
};

function resolveOrgLogo(orgName = '', explicitLogo = '') {
  if (explicitLogo && typeof explicitLogo === 'string' && explicitLogo.trim()) {
    return explicitLogo.trim();
  }
  const clean = String(orgName).toLowerCase();
  for (const [key, path] of Object.entries(ORG_LOGO_MAP)) {
    if (clean.includes(key)) return path;
  }
  return '';
}

const KNOWN_POST_URLS = {
  ewuecc: 'https://www.facebook.com/photo.php?fbid=1224625912453564&id=100047185015473&set=a.748099713439522',
  conversation: 'https://www.facebook.com/photo.php?fbid=1224625912453564&id=100047185015473&set=a.748099713439522',
  biic: 'https://www.facebook.com/photo.php?fbid=571666945933995&id=100092720820391&set=a.175838728850154',
  ielts: 'https://www.facebook.com/photo.php?fbid=571666945933995&id=100092720820391&set=a.175838728850154',
  ahoban: 'https://www.facebook.com/photo.php?fbid=4682576128447326&id=224123104292673&set=a.231530316885285',
  olympiad: 'https://www.facebook.com/EnglishOlympiad/posts/sumaiya-jannat-arpa-campus-ambassador-english-olympiadideal-school-and-college-e/2078778598931050/',
};

function resolvePostUrl(orgName = '', explicitPost = '') {
  if (explicitPost && typeof explicitPost === 'string' && explicitPost.trim()) {
    return explicitPost.trim();
  }
  const clean = String(orgName).toLowerCase();
  for (const [key, url] of Object.entries(KNOWN_POST_URLS)) {
    if (clean.includes(key)) return url;
  }
  return '';
}

function normalizeExperienceItem(exp, idx = 0) {
  if (!exp) return null;
  const orgName = String(exp.organization || exp.fullName || exp.org || exp.company || 'Experience');
  const explicitLogo = typeof exp.logoUrl === 'string' && exp.logoUrl.trim()
    ? exp.logoUrl.trim()
    : (typeof exp.imageUrl === 'string' && exp.imageUrl.trim()
      ? exp.imageUrl.trim()
      : (typeof exp.image === 'string' && exp.image.trim() ? exp.image.trim() : ''));

  const logo = exp.image || resolveOrgLogo(orgName, explicitLogo);
  const primaryRole = (Array.isArray(exp.roles) && exp.roles.length > 0) ? exp.roles[0] : null;
  const postUrl = exp.postUrl || primaryRole?.postUrl || resolvePostUrl(orgName);

  return {
    id: exp.id || `exp-${idx}`,
    category: String(exp.category || exp.orgType || exp.type || 'EXPERIENCE').toUpperCase(),
    title: String(exp.title || primaryRole?.title || orgName),
    organization: orgName,
    date: String(exp.date || primaryRole?.dates || exp.location || ''),
    description: String(exp.description || primaryRole?.description || ''),
    image: logo || '',
    imageAlt: exp.imageAlt || `${orgName} logo`,
    tags: Array.isArray(exp.tags)
      ? exp.tags
      : (primaryRole && Array.isArray(primaryRole.highlights) && primaryRole.highlights.length > 0
        ? primaryRole.highlights.slice(0, 3)
        : []),
    postUrl: postUrl || '',
  };
}

const STATIC_EXPERIENCE_ITEMS = [
  {
    key: 'ewuecc',
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
    key: 'biic',
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
    key: 'ahoban',
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
    key: 'eo',
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
    key: 'istarc',
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

const STATIC_CREDENTIAL_ITEMS = [
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

  const {
    experience: liveExperience,
    education: liveEducation,
    certificates: liveCertificates,
    reviews: liveReviews,
    hasLoaded: portfolioHasLoaded,
    error: portfolioError,
  } = usePortfolioData();

  const reviewItems = useMemo(() => {
    if (portfolioHasLoaded) {
      return Array.isArray(liveReviews) ? liveReviews.filter((r) => r && r.isPublished !== false) : [];
    }
    if (portfolioError) {
      return reviews;
    }
    return Array.isArray(liveReviews) ? liveReviews : reviews;
  }, [liveReviews, portfolioHasLoaded, portfolioError]);

  const educationList = useMemo(() => {
    if (portfolioHasLoaded) {
      return Array.isArray(liveEducation) ? liveEducation : [];
    }
    if (portfolioError) {
      return about.education || [];
    }
    return Array.isArray(liveEducation) ? liveEducation : (about.education || []);
  }, [liveEducation, portfolioHasLoaded, portfolioError]);

  const experienceItems = useMemo(() => {
    if (portfolioHasLoaded) {
      if (!liveExperience || !Array.isArray(liveExperience) || liveExperience.length === 0) {
        return [];
      }
      return liveExperience
        .filter((exp) => exp && exp.isPublished !== false)
        .map((exp, idx) => normalizeExperienceItem(exp, idx))
        .filter(Boolean);
    }

    if (portfolioError) {
      return STATIC_EXPERIENCE_ITEMS.map((exp, idx) => normalizeExperienceItem(exp, idx));
    }

    return STATIC_EXPERIENCE_ITEMS.map((exp, idx) => normalizeExperienceItem(exp, idx));
  }, [liveExperience, portfolioHasLoaded, portfolioError]);

  const displayedExperience = useMemo(() => {
    return expSortAscending ? [...experienceItems].reverse() : experienceItems;
  }, [expSortAscending, experienceItems]);

  const credentialItems = useMemo(() => {
    if (liveCertificates && liveCertificates.length > 0) {
      return liveCertificates.map((cert) => ({
        category: (cert.category || 'CREDENTIAL').toUpperCase(),
        title: cert.title,
        organization: cert.organization || cert.issuer,
        date: cert.dateIssued || cert.date || '',
        certificateType: cert.certificateType || '',
        image: cert.imageUrl || cert.image,
        url: cert.url || '',
        description: cert.description || '',
        tags: cert.tags || [],
      }));
    }
    return STATIC_CREDENTIAL_ITEMS;
  }, [liveCertificates]);

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
      <section id="hero" className="hero-wireframe-section hero-cover-section" aria-label="Introduction">
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
              <span>Explore My Work</span>
              <Icon name="arrow-up-right" size={15} />
            </a>

            <a href="#contact" className="btn-cover-pill btn-cover-pill-dark">
              <span>Get in Touch</span>
              <Icon name="arrow-up-right" size={15} />
            </a>

            <a
              href={site.cvUrl}
              download="Sumaiya_Jannat_Arpa_Resume.pdf"
              className="btn-cover-pill btn-cover-pill-primary"
              aria-label="Download Curriculum Vitae (PDF)"
            >
              <span>Download CV</span>
              <Icon name="download" size={15} />
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
                src="/images/profile_2.png"
                alt="Sumaiya Jannat Arpa"
                className="ref-about-portrait-img"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="ref-about-bio-col">
              <div className="ref-about-heading-row">
                <h2 className="ref-about-heading">
                  About <span className="ref-about-heading-bold">Sumaiya</span>
                </h2>
              </div>

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
              id="education"
              className="ref-panel-card ref-panel-card-education"
              aria-labelledby="panel-heading-education"
            >
              <div className="ref-panel-heading-row">
                <div>
                  <h3 id="panel-heading-education" className="ref-panel-title">
                    Education
                  </h3>
                </div>
              </div>

              <div className="education-bent-stack" role="list" aria-label="Education milestones">
                {educationList.length > 0 ? (
                  educationList.map((edu, idx) => {
                    const cardNum = idx + 1;
                    const cardId = edu.id || cardNum;
                    const isExpanded = activeEduCard === cardId;
                    const bentClass = `edu-bent-card-${(idx % 3) + 1}`;
                    const rawStageTag = edu.stageTag || edu.stage_tag;
                    const stageTag = rawStageTag
                      ? rawStageTag.replace(/\s*\/\/\s*/g, ' · ')
                      : (idx === 0 ? 'B.Sc. · Undergraduate' : (idx === 1 ? 'HSC · Higher Secondary' : 'SSC · Secondary'));
                    const isMerit = (Array.isArray(edu.highlights) && edu.highlights.some((h) => typeof h === 'string' && h.toLowerCase().includes('merit'))) ||
                      (typeof edu.details === 'string' && edu.details.toLowerCase().includes('merit'));

                    const institutionName = edu.institution || edu.school || 'Academic Institution';
                    const dateText = edu.dates || edu.timeline || '';
                    const degreeText = edu.degree || 'Degree Program';
                    const majorText = typeof edu.major === 'string' && edu.major.trim() ? edu.major.trim() : '';
                    const gpaText = edu.gpa != null && String(edu.gpa).trim() !== '' ? String(edu.gpa).trim() : '';
                    const locationText = typeof edu.location === 'string' && edu.location.trim() ? edu.location.trim() : '';
                    const statusText = typeof edu.status === 'string' && edu.status.trim() ? edu.status.trim() : '';
                    const detailsText = typeof edu.details === 'string' && edu.details.trim() ? edu.details.trim() : '';
                    const courseworkList = Array.isArray(edu.coursework) ? edu.coursework : [];

                    return (
                      <div
                        key={edu.id || idx}
                        className={`education-bent-card ${bentClass} ${isExpanded ? 'is-expanded is-active' : ''}`}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isExpanded}
                        aria-label={`${institutionName} education details. Tap or click to expand or collapse`}
                        onClick={() => setActiveEduCard((prev) => (prev === cardId ? null : cardId))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveEduCard((prev) => (prev === cardId ? null : cardId));
                          }
                        }}
                      >
                        <div className="edu-card-inner">
                          <div className="edu-card-topbar">
                            <div className="edu-institution-cluster">
                              {stageTag && <span className="edu-stage-tag">{stageTag}</span>}
                              <h4 className="edu-institution-name">{institutionName}</h4>
                            </div>
                            {dateText && (
                              <span className="edu-date-badge">{dateText}</span>
                            )}
                          </div>

                          <p className="edu-qualification">
                            {degreeText}
                            {majorText ? (
                              <> · <span className="edu-major-emphasis">{majorText.toLowerCase().startsWith('major:') ? majorText : `Major: ${majorText}`}</span></>
                            ) : null}
                          </p>

                          <div className="edu-highlights-pills">
                            {isMerit && (
                              <span className="edu-pill edu-pill-merit">
                                <span className="edu-pill-icon"><Icon name="star" size={12} strokeWidth={2} style={{ fill: 'currentColor' }} /></span>
                                <span>100% Merit Scholarship Awardee</span>
                              </span>
                            )}
                            {gpaText && (
                              <span className="edu-pill edu-pill-cgpa">
                                {gpaText.toLowerCase().includes('gpa') ? gpaText : `CGPA: ${gpaText}`}
                              </span>
                            )}
                            {locationText && <span className="edu-pill">{locationText}</span>}
                            {statusText && !gpaText && <span className="edu-pill">{statusText}</span>}
                          </div>

                          {isExpanded && detailsText && (
                            <p className="edu-expanded-details" style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary, #94a3b8)', lineHeight: 1.6 }}>
                              {detailsText}
                            </p>
                          )}

                          {isExpanded && courseworkList.length > 0 && (
                            <div className="coursework-tags mt-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                              {courseworkList.map((c, cIdx) => (
                                <span key={cIdx} className="tool-pill" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(148, 163, 184, 0.1)', borderRadius: '4px' }}>
                                  {typeof c === 'string' ? c : (c?.name || String(c))}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-catalog-state" style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)' }}>
                    <p>No education milestones recorded yet.</p>
                  </div>
                )}
              </div>
            </article>

            {/* Featured Images Slideshow — Directly above Experience & Leadership */}
            <FeaturedImageSlideshow />

            {/* 02. Experience & Volunteering — Ascending Staircase Experience Layout */}
            <article
              id="experience"
              className="ref-panel-card ref-panel-card-experience visual-stack-panel staircase-experience-panel"
              aria-labelledby="panel-heading-experience"
            >
              <div className="ref-panel-heading-row">
                <div className="experience-heading-group">
                  <h3 id="panel-heading-experience" className="ref-panel-title">
                    Experience &amp; Leadership
                  </h3>
                </div>

                <div className="staircase-sort-toggle" role="group" aria-label="Staircase order">
                  <button
                    type="button"
                    className={`staircase-sort-btn ${expSortAscending ? 'is-active' : ''}`}
                    onClick={() => setExpSortAscending(true)}
                    aria-label="View career progression from early foundations to leadership"
                  >
                    <span>Progression (2018–2025)</span>
                    <Icon name="arrow-up" size={13} />
                  </button>
                  <button
                    type="button"
                    className={`staircase-sort-btn ${!expSortAscending ? 'is-active' : ''}`}
                    onClick={() => setExpSortAscending(false)}
                    aria-label="View recent experience first"
                  >
                    <span>Recent First</span>
                    <Icon name="arrow-down" size={13} />
                  </button>
                </div>
              </div>

              <div
                className="experience-staircase-track"
                role="list"
                aria-label="Ascending Experience career staircase"
              >
                {displayedExperience.length === 0 ? (
                  <div className="empty-catalog-state" style={{ width: '100%', textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary, #94a3b8)' }}>
                    <p>No experience milestones recorded yet.</p>
                  </div>
                ) : (
                  displayedExperience.map((item, idx) => {
                    const stepNumber = (idx % 5) + 1;
                    const isExpanded = activeExpCardId === item.title;
                    return (
                      <div
                        className={`staircase-step-card staircase-step-${stepNumber} ${isExpanded ? 'is-expanded is-active' : ''}`}
                        key={`${item.title}-${idx}`}
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
                              {String(item.organization || item.org || item.title || 'EX').slice(0, 2).toUpperCase()}
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
                                <span>Official post announcement</span>
                                <Icon name="arrow-up-right" size={13} />
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
                              <Icon name={isExpanded ? 'x' : 'arrow-up-right'} size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </article>

            {/* 03. Awards & Certifications — Refined Slideshow */}
            <article
              id="acknowledgements"
              className="ref-panel-card ref-panel-card-awards visual-stack-panel"
              aria-labelledby="panel-heading-awards"
            >
              <span id="awards" className="section-anchor-hidden" aria-hidden="true" />
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
                                    <span>Click to enlarge</span>
                                    <Icon name="arrow-up-right" size={12} />
                                  </span>
                                </div>
                              ) : (
                                <div className="credential-thumbnail-placeholder">
                                  <span className="ph-icon" aria-hidden="true">
                                    <Icon name="file-text" size={32} />
                                  </span>
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
                                  <span>View Details &amp; Verify</span>
                                  <Icon name="arrow-up-right" size={13} />
                                </button>
                                {item.url && (
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="credential-external-link"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span>External Link</span>
                                    <Icon name="arrow-up-right" size={13} />
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
              <Icon name="x" size={18} />
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
                <span>View post</span>
                <Icon name="arrow-up-right" size={13} />
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
              <Icon name="x" size={18} />
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
                  <span>Certificate</span>
                  <Icon name="arrow-up-right" size={13} />
                </a>
              </div>
            )}
          </section>
        </div>
      )}


      {/* 04. SKILLS SECTION */}
      <section id="skills" className="page-section section-skills-clean">
        <div className="site-wrapper">
          <SectionHeader
            title={<>Curated Skills &amp; <span className="ref-about-heading-bold">Capabilities</span></>}
          />

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

          <ReviewsSection items={reviewItems} />
        </div>
      </section>

      {/* 07. GET TO KNOW SUMAIYA (FAQ SECTION) */}
      <section id="faq" className="page-section section-faq">
        <span id="questions" className="section-anchor-hidden" aria-hidden="true" />
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
  const { projects: liveProjects, categories: liveCategories } = useProjects();
  const allProjects = (liveProjects && liveProjects.length > 0) ? liveProjects : projects;
  const allCategories = (liveCategories && Object.keys(liveCategories).length > 0) ? liveCategories : categories;

  const filtered = allProjects.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  return (
    <div className="work-catalog-page">
      <header className="page-hero-header">
        <div className="site-wrapper">
          <span className="sec-tag">Project Archive</span>
          <h1 className="page-hero-title">Selected Work &amp; <em>Featured Projects.</em></h1>
          <p className="page-hero-lead">
            Curated engineering projects, user-centered interaction designs, quality assurance matrices, and visual communications.
          </p>

          <div className="category-filters-strip" role="group" aria-label="Filter projects by category">
            <button
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              aria-pressed={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            >
              All Projects ({allProjects.length})
            </button>
            {Object.values(allCategories).map((c) => {
              const count = allProjects.filter((p) => p.category === c.id).length;
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
// 03. PROJECT OVERVIEW VIEW (/work/:slug)
// Clean, elegant project presentation with metadata, cover, and links
// -------------------------------------------------------------
export function Project() {
  const { slug } = useParams();
  const { projects: liveProjects, categories: liveCategories, loading } = useProjects();
  const allProjects = (liveProjects && liveProjects.length > 0) ? liveProjects : projects;
  const allCategories = (liveCategories && Object.keys(liveCategories).length > 0) ? liveCategories : categories;

  const p = allProjects.find((x) => x.slug === slug);
  usePageTitle(p ? p.title : 'Project');

  if (!p) {
    if (loading) {
      return (
        <div className="site-wrapper page-section">
          <div className="not-found-box" style={{ opacity: 0.75 }}>
            <span className="sec-tag">RETRIEVING ARCHIVE</span>
            <h2>Loading Project...</h2>
            <p>Fetching project details from portfolio archive.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="site-wrapper page-section">
        <div className="not-found-box">
          <span className="sec-tag">ERROR 404</span>
          <h2>PROJECT NOT FOUND</h2>
          <p>The requested project slug does not exist in the catalog.</p>
          <Link to="/work" className="btn solid">
            <span>RETURN TO WORK DIRECTORY</span>
            <Icon name="arrow-up-right" size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const cat = allCategories[p.category] || { label: p.category, code: '00' };

  const hasRole = Boolean(p.role && p.role.trim());
  const hasTimeline = Boolean(p.timeline && p.timeline.trim());
  const hasStatus = Boolean(p.status && p.status.trim());
  const hasTools = Array.isArray(p.tools) && p.tools.length > 0;
  const hasLink = Boolean(p.link && p.link.trim());
  const hasRepo = Boolean(p.repo && p.repo.trim());
  const hasCover = Boolean(p.cover && p.cover.trim());

  return (
    <article className="case-study-page">
      {/* TOP NAVIGATION BAR */}
      <div className="cs-top-bar">
        <div className="site-wrapper cs-top-inner">
          <Link to="/work" className="cs-back-link">
            <Icon name="arrow-left" size={14} />
            <span>Back to Selected Work</span>
          </Link>
          <span className="cs-category-badge">{cat.label}</span>
          {p.orderNum ? (
            <span className="cs-index-counter">PROJECT [#{p.orderNum}]</span>
          ) : null}
        </div>
      </div>

      {/* PROJECT HERO & DETAILS */}
      <header className="cs-hero-section">
        <div className="site-wrapper">
          <div className="cs-hero-grid">
            <div className="cs-hero-main">
              <span className="sec-tag">
                {cat.label || 'Project'} {hasStatus ? `· ${p.status}` : ''}
              </span>
              <h1 className="cs-main-title">{p.title}</h1>
              {p.summary ? <p className="cs-summary-lead">{p.summary}</p> : null}
            </div>

            <aside className="cs-meta-sidebar">
              <div className="cs-meta-box">
                <div className="cs-meta-field">
                  <span className="cs-meta-label">Category</span>
                  <span className="cs-meta-value">{cat.label}</span>
                </div>

                {hasRole ? (
                  <div className="cs-meta-field">
                    <span className="cs-meta-label">Role</span>
                    <span className="cs-meta-value">{p.role}</span>
                  </div>
                ) : null}

                {hasTimeline ? (
                  <div className="cs-meta-field">
                    <span className="cs-meta-label">Timeline</span>
                    <span className="cs-meta-value">{p.timeline}</span>
                  </div>
                ) : null}

                {hasStatus ? (
                  <div className="cs-meta-field">
                    <span className="cs-meta-label">Status</span>
                    <span className="cs-meta-value">{p.status}</span>
                  </div>
                ) : null}

                {hasTools ? (
                  <div className="cs-meta-field">
                    <span className="cs-meta-label">Tools &amp; Stack</span>
                    <div className="cs-tools-wrap">
                      {p.tools.map((t, idx) => (
                        <span key={idx} className="tool-pill">{t}</span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {(hasLink || hasRepo) ? (
                  <div className="cs-meta-field cs-links-field">
                    {hasLink ? (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn solid w-full text-center"
                      >
                        <span>{p.category === 'uiux' ? 'View Prototype / Design' : 'Live Project'}</span>
                        <Icon name="arrow-up-right" size={14} />
                      </a>
                    ) : null}
                    {hasRepo ? (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn outline w-full text-center"
                      >
                        <span>Source Code</span>
                        <Icon name="arrow-up-right" size={14} />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </header>

      {/* COVER IMAGE */}
      {hasCover ? (
        <div className={`cs-cover-wrapper ${p.category === 'graphic' ? 'cs-cover-graphic' : ''}`}>
          <div className="site-wrapper">
            <Img
              src={p.cover}
              alt={p.coverAlt || `${p.title} preview`}
              ratio={p.aspectRatio || '16/10'}
              category={p.category}
              label={p.title}
            />
          </div>
        </div>
      ) : null}

      {/* FOOTER DIRECTORY LINK */}
      <div className="site-wrapper" style={{ paddingTop: '1rem', paddingBottom: '4.5rem', textAlign: 'center' }}>
        <Link to="/work" className="btn outline">
          <Icon name="arrow-left" size={14} />
          <span>Return to All Projects</span>
        </Link>
      </div>
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
                      <span className="archive-expand-pill">
                        <span>Inspect</span>
                        <Icon name="arrow-up-right" size={12} />
                      </span>
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
  const { education: liveEducation, hasLoaded: eduLoaded, error: eduError } = useEducation();
  const educationList = eduLoaded
    ? (Array.isArray(liveEducation) ? liveEducation : [])
    : (eduError ? (about.education || []) : (Array.isArray(liveEducation) ? liveEducation : (about.education || [])));

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
              {educationList.length === 0 ? (
                <div className="empty-catalog-state" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)' }}>
                  <p>No formal education records listed.</p>
                </div>
              ) : (
                educationList.map((edu, idx) => (
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
                ))
              )}
            </div>

            {/* ACTIONS */}
            <div className="about-actions-row">
              <Link to="/experience" className="btn solid">
                <span>Explore Leadership &amp; Experience</span>
                <Icon name="arrow-up-right" size={14} />
              </Link>
              <Link to="/resume" className="btn outline">
                <span>Download Curriculum Vitae</span>
                <Icon name="arrow-down" size={14} />
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
  const { experience: liveExperience, hasLoaded, error } = useExperience();
  const expList = hasLoaded
    ? (Array.isArray(liveExperience) ? liveExperience : [])
    : (error ? experience : (Array.isArray(liveExperience) ? liveExperience : experience));

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
          {expList.length === 0 ? (
            <div className="empty-catalog-state" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)' }}>
              <p>No experience milestones recorded yet.</p>
            </div>
          ) : (
            <Timeline entries={expList} />
          )}
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
  const { education: liveEducation, hasLoaded: eduLoaded, error: eduError } = useEducation();
  const { certificates: liveCertificates, hasLoaded: certLoaded, error: certError } = useCertificates();

  const eduList = eduLoaded
    ? (Array.isArray(liveEducation) ? liveEducation : [])
    : (eduError ? (about.education || []) : (Array.isArray(liveEducation) ? liveEducation : (about.education || [])));
  const certList = certLoaded
    ? (Array.isArray(liveCertificates) ? liveCertificates : [])
    : (certError ? (about.certificates || []) : (Array.isArray(liveCertificates) ? liveCertificates : (about.certificates || [])));

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
            {eduList.length === 0 ? (
              <div className="empty-catalog-state" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)' }}>
                <p>No formal education records listed.</p>
              </div>
            ) : (
              eduList.map((edu, idx) => (
                <article key={idx} className="cred-card">
                  <span className="cred-date">{edu.dates || edu.timeline}</span>
                  <h3 className="cred-title">{edu.degree}</h3>
                  <p className="cred-issuer">{edu.school || edu.institution} {edu.location ? `(${edu.location})` : ''}</p>
                  <p className="cred-desc">{edu.details}</p>
                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="coursework-tags mt-2">
                      {edu.coursework.map((c, cIdx) => (
                        <span key={cIdx} className="tool-pill">{c}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))
            )}
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
            {certList.length === 0 ? (
              <div className="empty-catalog-state" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)' }}>
                <p>No verified credentials listed.</p>
              </div>
            ) : (
              certList.map((cert, idx) => (
                <article key={idx} className="cred-card">
                  <span className="cred-date">{cert.dateIssued || cert.date || cert.dates}</span>
                  <h3 className="cred-title">{cert.title}</h3>
                  <p className="cred-issuer">{cert.organization || cert.issuer}</p>
                  <p className="cred-desc">{cert.description || cert.certificateType || cert.credentialId}</p>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="editorial-link mt-2">
                      <span>Verify Credential</span>
                      <Icon name="arrow-up-right" size={13} />
                    </a>
                  )}
                </article>
              ))
            )}
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
                    <span>Download PDF Resume</span>
                    <Icon name="download" size={14} />
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn outline w-full text-center mt-2"
                >
                  <span>Print / Export to PDF</span>
                  <Icon name="printer" size={14} />
                </button>
              </div>

              <div className="resume-placeholder-box mt-3">
                <p className="placeholder-note">
                  <Icon name="lightbulb" size={14} style={{ marginRight: '0.4rem', verticalAlign: '-2px' }} />
                  <strong>PDF Placement:</strong> To link your official PDF document, place your file at <code>public/resume/Sumaiya_Jannat_Arpa_Resume.pdf</code>.
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
